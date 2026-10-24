import type { Key } from '../i18n/en';
import type { AccessAttr, Lang, Profile } from '../types';
import { factsToPatch, isPreferenceFact, understand, type Fact } from './nlu';
import { rankForUser, searchEvents, type EventBrief, type SearchArgs } from './tools';

/** A line in "How I decided". Local turns use a translatable key, live-LLM turns use plain text. */
export interface TraceStep {
  key?: Key;
  vars?: Record<string, string | number>;
  text?: string;
}

export interface ReplyPart {
  key: Key;
  vars?: Record<string, string | number>;
}

export interface TurnResult {
  source: 'local' | 'llm';
  /** Translatable reply parts (local) or finished text in the person's language (LLM). */
  parts?: ReplyPart[];
  text?: string;
  facts: Fact[];
  /** True when the facts describe the person, so they may be worth saving to the profile. */
  durable: boolean;
  events: EventBrief[];
  trace: TraceStep[];
}

export interface TurnInput {
  text: string;
  profile: Profile;
  lang: Lang;
  mode: 'onboarding' | 'assistant';
  now: Date;
}

function searchArgsFrom(facts: Fact[], words: string[]): SearchArgs {
  const args: SearchArgs = { limit: 5 };
  const cats = facts.flatMap((f) => (f.kind === 'interest' ? [f.category] : []));
  if (cats.length) args.categories = cats;
  const needs = facts.flatMap((f) => (f.kind === 'access' ? [f.attr as AccessAttr] : []));
  if (needs.length) args.accessNeeds = needs;
  const langs = facts.flatMap((f) => (f.kind === 'eventLang' ? [f.lang] : []));
  if (langs.length) args.languages = langs;
  for (const f of facts) {
    if (f.kind === 'free') args.free = true;
    if (f.kind === 'time' && f.time === 'weekend') args.weekend = true;
    if (f.kind === 'time' && f.time === 'evening') args.evening = true;
    if (f.kind === 'time' && f.time === 'morning') args.morning = true;
    if (f.kind === 'mode' && f.mode === 'transit') args.transitOnly = true;
    if (f.kind === 'max') args.maxMinutes = f.minutes;
  }
  if (words.length) args.text = words.join(' ');
  return args;
}

/**
 * Offline agent turn. Understands the message, calls the same tools a connected LLM would,
 * and returns the reply as translatable parts so Maple answers in the person's language.
 */
export function runLocalTurn(input: TurnInput): TurnResult {
  const { text, profile, mode, now } = input;
  // Onboarding treats everything as describing the person. In the assistant, only first-person statements count.
  const u = understand(text, mode === 'onboarding' ? { forceDurable: true } : {});
  const trace: TraceStep[] = [{ key: 'chat.step.understood', vars: { n: u.facts.length } }];

  if (u.intent === 'greet') {
    return { source: 'local', parts: [{ key: 'chat.greetReply' }], facts: [], durable: false, events: [], trace };
  }
  if (u.intent === 'help') {
    return { source: 'local', parts: [{ key: 'chat.help' }], facts: [], durable: false, events: [], trace };
  }
  if (u.facts.length === 0 && u.words.length === 0) {
    return { source: 'local', parts: [{ key: 'chat.noUnderstand' }], facts: [], durable: false, events: [], trace };
  }

  // In onboarding the person is describing themselves, so rank with the updated profile.
  const merged: Profile = mode === 'onboarding' ? { ...profile, ...factsToPatch(profile, u.facts) } : profile;
  const ctx = { profile: merged, now };

  let events: EventBrief[];
  let total: number;
  if (mode === 'onboarding' || (u.durable && u.facts.every(isPreferenceFact) && u.words.length === 0 && !u.facts.some((f) => f.kind === 'time'))) {
    events = rankForUser({ limit: 5 }, ctx).events;
    total = events.length;
    trace.push({ key: 'chat.step.rank', vars: { n: total } });
  } else {
    const args = searchArgsFrom(u.facts, u.words);
    const r = searchEvents(args, ctx);
    events = r.events;
    total = r.total;
    trace.push({ key: 'chat.step.search', vars: { total } });
  }

  const needs = u.facts.filter((f) => f.kind === 'access').length || Object.keys(merged.access).length;
  if (needs && events.length) {
    const unknown = events.filter((e) => e.accessChecks && Object.values(e.accessChecks).includes('unknown')).length;
    trace.push({ key: 'chat.step.access', vars: { n: events.length, unknown } });
  }

  const parts: ReplyPart[] = [];
  if (events.length === 0) {
    parts.push({ key: 'chat.none' });
  } else {
    parts.push({ key: 'chat.found', vars: { n: total } });
    parts.push({ key: 'chat.best', vars: { title: events[0].title } });
    const anyUnknown = events.some((e) => e.accessChecks && Object.values(e.accessChecks).includes('unknown'));
    if (anyUnknown) parts.push({ key: 'chat.checkHost' });
  }
  return { source: 'local', parts, facts: u.facts, durable: u.durable, events, trace };
}
