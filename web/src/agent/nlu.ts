import type { AccessAttr, Category, Importance, Lang, Profile, TravelMode } from '../types';
import {
  ACCESS_WORDS,
  AREA_WORDS,
  CAR_WORDS,
  CATEGORY_WORDS,
  EVENING_WORDS,
  FIRST_PERSON,
  FREE_WORDS,
  GREETING_WORDS,
  GROUP_WORDS,
  HELP_WORDS,
  LANGUAGE_WORDS,
  MORNING_WORDS,
  TRANSIT_WORDS,
  WALK_WORDS,
  WEEKDAY_WORDS,
  WEEKEND_WORDS,
  hasAny,
} from './lexicon';

/** One thing Maple understood from a message. Shown to the person as a removable chip. */
export type Fact =
  | { kind: 'interest'; category: Category }
  | { kind: 'free' }
  | { kind: 'time'; time: 'weekday' | 'evening' | 'weekend' | 'morning' }
  | { kind: 'group'; group: Profile['group'] }
  | { kind: 'mode'; mode: TravelMode }
  | { kind: 'area'; code: string }
  | { kind: 'max'; minutes: number }
  | { kind: 'access'; attr: AccessAttr; importance: Importance }
  | { kind: 'eventLang'; lang: Lang };

export type Intent = 'greet' | 'help' | 'find';

export interface Understanding {
  intent: Intent;
  facts: Fact[];
  /** True when the person described themselves ("I use a wheelchair") rather than asking for something. */
  durable: boolean;
  /** Latin-script keywords left over after removing known concepts, for plain text matching. */
  words: string[];
}

/** Needs where a missing feature would stop someone attending, so they are treated as essential when stated. */
const ESSENTIAL: AccessAttr[] = ['stepFree', 'noFlashing', 'interpreter', 'captions', 'largePrint'];

const STOP = new Set([
  'the', 'and', 'for', 'with', 'near', 'this', 'that', 'what', 'any', 'some', 'something', 'show', 'find', 'want', 'looking', 'look', 'please', 'can', 'you', 'got', 'are', 'there', 'events', 'event', 'things', 'thing', 'would', 'like', 'love', 'enjoy', 'prefer', 'need', 'use', 'have', 'live', 'get', 'me', 'my', 'our', 'about', 'around', 'good', 'nice', 'next', 'week', 'today', 'tomorrow', 'also', 'but', 'not', 'dont', "don't", 'drive', 'bus', 'minutes', 'min',
]);

export function understand(raw: string, opts: { forceDurable?: boolean } = {}): Understanding {
  const text = ` ${raw.toLowerCase().replace(/\s+/g, ' ').trim()} `;
  const durable = opts.forceDurable ?? hasAny(text, FIRST_PERSON);
  const facts: Fact[] = [];
  const add = (f: Fact) => {
    if (!facts.some((x) => JSON.stringify(x) === JSON.stringify(f))) facts.push(f);
  };

  for (const [cat, words] of Object.entries(CATEGORY_WORDS) as [Category, string[]][]) {
    if (hasAny(text, words)) add({ kind: 'interest', category: cat });
  }
  if (hasAny(text, FREE_WORDS)) add({ kind: 'free' });
  if (hasAny(text, WEEKEND_WORDS)) add({ kind: 'time', time: 'weekend' });
  if (hasAny(text, WEEKDAY_WORDS)) add({ kind: 'time', time: 'weekday' });
  if (hasAny(text, EVENING_WORDS)) add({ kind: 'time', time: 'evening' });
  if (hasAny(text, MORNING_WORDS)) add({ kind: 'time', time: 'morning' });

  for (const [group, words] of Object.entries(GROUP_WORDS) as [Profile['group'], string[]][]) {
    if (hasAny(text, words)) add({ kind: 'group', group });
  }

  if (hasAny(text, TRANSIT_WORDS)) add({ kind: 'mode', mode: 'transit' });
  else if (hasAny(text, CAR_WORDS)) add({ kind: 'mode', mode: 'car' });
  else if (hasAny(text, WALK_WORDS)) add({ kind: 'mode', mode: 'walk' });

  for (const [code, words] of Object.entries(AREA_WORDS)) {
    if (hasAny(text, words)) add({ kind: 'area', code });
  }
  const mins = text.match(/(\d{1,3})\s*(?:min|minutes|分钟|分鐘|分|நிமிட|دقیقه)/);
  if (mins) add({ kind: 'max', minutes: Math.min(120, Math.max(5, Number(mins[1]))) });

  for (const [attr, words] of Object.entries(ACCESS_WORDS) as [AccessAttr, string[]][]) {
    if (hasAny(text, words)) {
      add({ kind: 'access', attr, importance: !durable || ESSENTIAL.includes(attr) ? 'essential' : 'preferred' });
    }
  }
  for (const [lang, words] of Object.entries(LANGUAGE_WORDS) as [Lang, string[]][]) {
    if (hasAny(text, words)) add({ kind: 'eventLang', lang });
  }

  const known = new Set<string>();
  for (const list of [GREETING_WORDS, HELP_WORDS, FREE_WORDS, WEEKEND_WORDS, WEEKDAY_WORDS, EVENING_WORDS, MORNING_WORDS, TRANSIT_WORDS, CAR_WORDS, WALK_WORDS, ...Object.values(CATEGORY_WORDS), ...Object.values(ACCESS_WORDS), ...Object.values(GROUP_WORDS), ...Object.values(AREA_WORDS), ...Object.values(LANGUAGE_WORDS)]) {
    for (const w of list) known.add(w.trim());
  }
  const words = text
    .split(/[^a-z0-9-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !known.has(w) && !/^\d+$/.test(w))
    .filter((w) => ![...known].some((k) => k.includes(w) && k.length > w.length));

  let intent: Intent = 'find';
  if (facts.length === 0 && words.length === 0) {
    if (hasAny(text, HELP_WORDS)) intent = 'help';
    else if (hasAny(text, GREETING_WORDS)) intent = 'greet';
  }
  return { intent, facts, durable, words };
}

/** Folds understood facts into profile changes. Never removes anything the person already told us. */
export function factsToPatch(profile: Profile, facts: Fact[]): Partial<Profile> {
  const patch: Partial<Profile> = {};
  const interests = new Set(profile.interests);
  const times = new Set(profile.times);
  const access = { ...profile.access };
  for (const f of facts) {
    switch (f.kind) {
      case 'interest':
        interests.add(f.category);
        break;
      case 'free':
        patch.freeOnly = true;
        break;
      case 'time':
        if (f.time !== 'morning') times.add(f.time);
        break;
      case 'group':
        patch.group = f.group;
        break;
      case 'mode':
        patch.travelMode = f.mode;
        break;
      case 'area':
        patch.homeArea = f.code;
        break;
      case 'max':
        patch.maxTravelMin = f.minutes;
        break;
      case 'access':
        if (access[f.attr] !== 'essential') access[f.attr] = f.importance;
        break;
      case 'eventLang':
        break;
    }
  }
  if (interests.size !== profile.interests.length) patch.interests = [...interests];
  if (times.size !== profile.times.length) patch.times = [...times];
  if (JSON.stringify(access) !== JSON.stringify(profile.access)) patch.access = access;
  return patch;
}

/** Undo of a single fact, used when someone removes a chip because Maple got it wrong. */
export function removeFact(profile: Profile, f: Fact): Partial<Profile> {
  switch (f.kind) {
    case 'interest':
      return { interests: profile.interests.filter((c) => c !== f.category) };
    case 'free':
      return { freeOnly: false };
    case 'time':
      return { times: profile.times.filter((t) => t !== f.time) };
    case 'group':
      return { group: 'solo' };
    case 'mode':
      return { travelMode: 'car' };
    case 'area':
      return { homeArea: 'L3R' };
    case 'max':
      return { maxTravelMin: 30 };
    case 'access': {
      const access = { ...profile.access };
      delete access[f.attr];
      return { access };
    }
    case 'eventLang':
      return {};
  }
}

/** True when the fact is a lasting preference that should be saved to the profile. */
export function isPreferenceFact(f: Fact): boolean {
  return f.kind !== 'eventLang' && !(f.kind === 'time' && f.time === 'morning');
}
