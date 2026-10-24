import type { Fact } from '../src/agent/nlu';
import type { TraceStep, TurnResult } from '../src/agent/engine';
import { TOOL_DECLARATIONS, runTool, type EventBrief } from '../src/agent/tools';
import type { Lang, Profile } from '../src/types';

/** Minimal Gemini message shapes used by the loop. */
export interface Part {
  text?: string;
  functionCall?: { name: string; args?: Record<string, unknown> };
  functionResponse?: { name: string; response: unknown };
}
export interface Content {
  role: 'user' | 'model';
  parts: Part[];
}
export interface GenerateRequest {
  system: string;
  contents: Content[];
  tools: typeof ALL_DECLARATIONS;
}
export interface GenerateResponse {
  candidates?: { content?: { parts?: Part[] } }[];
}
export type GenerateFn = (req: GenerateRequest) => Promise<GenerateResponse>;

const LANGUAGE_NAMES: Record<Lang, string> = {
  en: 'English',
  yue: 'Cantonese, written in Traditional Chinese characters',
  zh: 'Mandarin, written in Simplified Chinese characters',
  ta: 'Tamil',
  fa: 'Persian (Farsi)',
};

const PROPOSE = {
  name: 'propose_profile_update',
  description:
    'Call this only when the person described a lasting preference or need about themselves (not a one-off request). The app asks them to confirm before saving. Never infer a condition they did not state.',
  parameters: {
    type: 'OBJECT',
    properties: {
      interests: { type: 'ARRAY', items: { type: 'STRING', enum: ['community', 'arts', 'outdoors', 'learning', 'family', 'volunteering', 'sports', 'food', 'music'] } },
      accessNeeds: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            attr: { type: 'STRING', enum: ['stepFree', 'accessibleWashroom', 'accessibleParking', 'seating', 'largePrint', 'audioDescription', 'interpreter', 'captions', 'lowNoise', 'noFlashing', 'quietSpace', 'lowCrowd', 'plainLanguage', 'supportPerson'] },
            importance: { type: 'STRING', enum: ['essential', 'preferred'] },
          },
          required: ['attr', 'importance'],
        },
      },
      travelMode: { type: 'STRING', enum: ['car', 'transit', 'walk'] },
      freeOnly: { type: 'BOOLEAN' },
      group: { type: 'STRING', enum: ['solo', 'family', 'seniors', 'friends'] },
      maxTravelMin: { type: 'NUMBER' },
    },
  },
};

export const ALL_DECLARATIONS = [...TOOL_DECLARATIONS, PROPOSE];

export function systemPrompt(lang: Lang, profile: Profile, mode: 'onboarding' | 'assistant', now: Date): string {
  return [
    'You are Maple, a warm, concise event guide for people in Markham, Ontario. Your readers include seniors, newcomers and people with disabilities, so use plain words and short sentences.',
    `Reply only in ${LANGUAGE_NAMES[lang]}.`,
    `Today is ${now.toDateString()}.`,
    'Rules:',
    '- Use the tools for every fact about events. Never invent events, dates, prices, ratings, venues or access features. Only mention events returned by a tool.',
    '- Access evidence has three states: confirmed (the host said so), estimated (our guess), unknown (nobody has said). Unknown never means "no". If a need the person cares about is unknown, say it is not confirmed and suggest asking the host.',
    '- Platform ratings come from the source (for example Eventbrite). Community ratings come from neighbours. Keep them separate and say which is which.',
    '- Never infer or label a disability. Only use what the person tells you.',
    '- Keep every reply under 80 words. Do not list more than three events in your text, since the app shows event cards itself.',
    mode === 'onboarding'
      ? '- You are meeting this person for the first time. Learn what they enjoy, how they get around and what would help them feel comfortable. Ask at most one short follow-up question per turn.'
      : '- Answer the request. If the person describes a lasting preference, call propose_profile_update so the app can ask them to confirm.',
    `Saved profile (may be empty): ${JSON.stringify({ interests: profile.interests, freeOnly: profile.freeOnly, travelMode: profile.travelMode, maxTravelMin: profile.maxTravelMin, homeArea: profile.homeArea, access: profile.access })}`,
  ].join('\n');
}

function factsFromProposal(args: Record<string, unknown>): Fact[] {
  const facts: Fact[] = [];
  for (const c of (args.interests as string[] | undefined) ?? []) facts.push({ kind: 'interest', category: c as never });
  for (const a of (args.accessNeeds as { attr: string; importance: string }[] | undefined) ?? []) {
    facts.push({ kind: 'access', attr: a.attr as never, importance: a.importance as never });
  }
  if (args.travelMode) facts.push({ kind: 'mode', mode: args.travelMode as never });
  if (args.freeOnly) facts.push({ kind: 'free' });
  if (args.group) facts.push({ kind: 'group', group: args.group as never });
  if (typeof args.maxTravelMin === 'number') facts.push({ kind: 'max', minutes: args.maxTravelMin });
  return facts;
}

const SEARCHY = new Set(['search_events', 'rank_for_user', 'get_trending']);

export interface AgentInput {
  text: string;
  lang: Lang;
  profile: Profile;
  mode: 'onboarding' | 'assistant';
  history: { role: 'user' | 'model'; text: string }[];
  now: Date;
}

/** Runs the tool-calling loop. Every event shown to the person came from a tool result, never from model text. */
export async function runAgent(input: AgentInput, generate: GenerateFn, maxSteps = 5): Promise<TurnResult> {
  const ctx = { profile: input.profile, now: input.now };
  const contents: Content[] = [
    ...input.history.slice(-8).map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user' as const, parts: [{ text: input.text }] },
  ];
  const system = systemPrompt(input.lang, input.profile, input.mode, input.now);
  const trace: TraceStep[] = [];
  let events: EventBrief[] = [];
  let facts: Fact[] = [];
  let finalText = '';

  for (let step = 0; step < maxSteps; step++) {
    const resp = await generate({ system, contents, tools: ALL_DECLARATIONS });
    const parts = resp.candidates?.[0]?.content?.parts ?? [];
    const calls = parts.filter((p) => p.functionCall);
    if (calls.length === 0) {
      finalText = parts.map((p) => p.text ?? '').join('').trim();
      break;
    }
    contents.push({ role: 'model', parts });
    const responses: Part[] = [];
    for (const p of calls) {
      const { name, args = {} } = p.functionCall!;
      let result: unknown;
      if (name === 'propose_profile_update') {
        facts = factsFromProposal(args);
        result = { ok: true, note: 'The app will ask the person to confirm before saving.' };
        trace.push({ text: `Noted preferences to confirm (${facts.length})` });
      } else {
        result = runTool(name, args, ctx);
        const r = result as { events?: EventBrief[]; total?: number; error?: string };
        if (SEARCHY.has(name) && r.events) events = r.events;
        if (name === 'get_event_details' && !r.error) events = [result as EventBrief];
        trace.push({ text: `${name}(${JSON.stringify(args)}) → ${r.error ? r.error : r.events ? `${r.events.length} events` : 'ok'}` });
      }
      responses.push({ functionResponse: { name, response: { result } } });
    }
    contents.push({ role: 'user', parts: responses });
  }

  if (!finalText) finalText = '…';
  return { source: 'llm', text: finalText, facts, durable: facts.length > 0, events: events.slice(0, 5), trace };
}
