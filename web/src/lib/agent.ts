import type { AccessAttr, Category, EventItem, Profile, TravelMode } from '../types';
import { scoreEvent, trendScores, type Scored } from './scoring';

/**
 * Prototype "agent". The tool layer (search, score, trend) is deterministic code.
 * In the full build, Gemini calls these same tools and only writes the explanation,
 * and its output is validated against event ids returned here.
 */

export type Reason =
  | { kind: 'interest'; category: Category }
  | { kind: 'free' }
  | { kind: 'travel'; minutes: number; mode: TravelMode }
  | { kind: 'access'; attr: AccessAttr }
  | { kind: 'askHost'; attrs: AccessAttr[] }
  | { kind: 'language' };

export interface Pick extends Scored {
  reasons: Reason[];
}

export function upcoming(events: EventItem[], now: Date): EventItem[] {
  return events.filter((e) => new Date(e.end).getTime() >= now.getTime());
}

/** Reasons are built only from facts on the event, so every line can be traced to the card. */
export function explain(s: Scored, p: Profile): Reason[] {
  const e = s.event;
  const out: Reason[] = [];
  if (p.interests.includes(e.category)) out.push({ kind: 'interest', category: e.category });
  if (e.free) out.push({ kind: 'free' });
  if (Number.isFinite(s.minutes) && s.minutes <= p.maxTravelMin) {
    out.push({ kind: 'travel', minutes: s.minutes, mode: p.travelMode });
  }
  for (const attr of Object.keys(p.access) as AccessAttr[]) {
    const info = e.access[attr];
    if (info?.present && info.evidence === 'confirmed') out.push({ kind: 'access', attr });
  }
  if (s.access.unknownEssential.length > 0) out.push({ kind: 'askHost', attrs: s.access.unknownEssential });
  if (p.language !== 'en' && e.languages.includes(p.language)) out.push({ kind: 'language' });
  return out.slice(0, 4);
}

export function recommend(events: EventItem[], p: Profile, now: Date, limit = 6): Pick[] {
  const pool = upcoming(events, now).filter((e) => !p.freeOnly || e.free);
  const trend = trendScores(pool, now);
  return pool
    .map((e) => scoreEvent(e, p, trend[e.id] ?? 0))
    .filter((s) => s.access.missingEssential.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({ ...s, reasons: explain(s, p) }));
}

export function trending(events: EventItem[], now: Date, limit = 3): EventItem[] {
  const pool = upcoming(events, now);
  const t = trendScores(pool, now);
  return [...pool].sort((a, b) => t[b.id] - t[a.id]).slice(0, limit);
}

export function transitFriendly(events: EventItem[], p: Profile, now: Date, limit = 3): Scored[] {
  const transitProfile: Profile = { ...p, travelMode: 'transit' };
  return upcoming(events, now)
    .map((e) => scoreEvent(e, transitProfile, 0))
    .filter((s) => Number.isFinite(s.minutes) && s.minutes <= p.maxTravelMin && s.event.transit.walkMeters <= 500)
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, limit);
}

export interface ParsedQuery {
  free: boolean;
  weekend: boolean;
  transit: boolean;
  categories: Category[];
  access: AccessAttr[];
  words: string[];
}

const CATEGORY_WORDS: Record<Category, string[]> = {
  community: ['community', 'neighbour', 'social', 'meet', '社區', '社区'],
  arts: ['art', 'craft', 'poetry', 'clay', '藝術', '艺术'],
  outdoors: ['outdoor', 'walk', 'park', 'nature', '戶外', '户外'],
  learning: ['learn', 'class', 'workshop', 'maker', '學習', '学习'],
  family: ['family', 'kids', 'children', 'toddler', '家庭'],
  volunteering: ['volunteer', 'help', 'pantry', '義工', '义工'],
  sports: ['tai chi', 'exercise', 'yoga', 'fitness', 'movement', '運動', '运动'],
  food: ['food', 'cook', 'dinner'],
  music: ['music', 'concert', 'song', '音樂', '音乐'],
};

const ACCESS_WORDS: Record<AccessAttr, string[]> = {
  stepFree: ['step-free', 'step free', 'wheelchair', 'no stairs', 'ramp'],
  accessibleWashroom: ['washroom', 'bathroom'],
  accessibleParking: ['accessible parking'],
  seating: ['seat', 'sit', 'chairs'],
  largePrint: ['large print', 'big print'],
  audioDescription: ['audio description'],
  interpreter: ['interpreter', 'asl', 'sign language'],
  captions: ['caption', 'subtitles'],
  lowNoise: ['quiet', 'calm', 'low noise', '安靜', '安静'],
  noFlashing: ['flashing', 'strobe', 'seizure'],
  quietSpace: ['quiet room', 'quiet space'],
  lowCrowd: ['small group', 'not crowded', 'small crowd'],
  plainLanguage: ['plain language', 'simple'],
  supportPerson: ['support person', 'caregiver', 'carer'],
};

export function parseQuery(text: string): ParsedQuery {
  const q = text.toLowerCase();
  const has = (words: string[]) => words.some((w) => q.includes(w));
  const categories = (Object.keys(CATEGORY_WORDS) as Category[]).filter((c) => has(CATEGORY_WORDS[c]));
  const access = (Object.keys(ACCESS_WORDS) as AccessAttr[]).filter((a) => has(ACCESS_WORDS[a]));
  const known = new Set(
    [...Object.values(CATEGORY_WORDS).flat(), ...Object.values(ACCESS_WORDS).flat(), 'free', 'weekend', 'saturday', 'sunday', 'bus', 'transit', 'train', 'near', 'this', 'and', 'the', 'a', 'for', 'me'],
  );
  const words = q
    .split(/[^\p{L}\p{N}-]+/u)
    .filter((w) => w.length > 2 && !known.has(w));
  return {
    free: has(['free', '免費', '免费']),
    weekend: has(['weekend', 'saturday', 'sunday', '週末', '周末']),
    transit: has(['bus', 'transit', 'train', 'no car', 'without a car', '巴士', '公共交通']),
    categories,
    access,
    words,
  };
}

/** Runs a parsed request over the events and returns ranked matches. */
export function ask(events: EventItem[], text: string, p: Profile, now: Date): Pick[] {
  const pq = parseQuery(text);
  const profile: Profile = {
    ...p,
    freeOnly: p.freeOnly || pq.free,
    travelMode: pq.transit ? 'transit' : p.travelMode,
    access: { ...p.access, ...Object.fromEntries(pq.access.map((a) => [a, 'essential' as const])) },
    interests: pq.categories.length ? pq.categories : p.interests,
  };
  const results = recommend(events, profile, now, 20).filter((s) => {
    const e = s.event;
    if (pq.weekend && ![0, 6].includes(new Date(e.start).getDay())) return false;
    if (pq.transit && !(Number.isFinite(s.minutes) && e.transit.walkMeters <= 650)) return false;
    if (pq.categories.length && !pq.categories.includes(e.category)) return false;
    if (pq.words.length) {
      const hay = `${e.title} ${e.summary} ${e.venue}`.toLowerCase();
      if (!pq.words.some((w) => hay.includes(w))) return false;
    }
    return true;
  });
  return results.slice(0, 5);
}
