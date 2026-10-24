import { EVENTS } from '../data/events';
import type { Key } from '../i18n/en';
import { recommend } from '../lib/agent';
import { AREAS } from '../lib/scoring';
import type { AccessAttr, Category, Profile, TravelMode } from '../types';

export type Slot = 'interests' | 'free' | 'times' | 'group' | 'travel' | 'area' | 'max' | 'access';

export interface SlotOption {
  id: string;
  labelKey?: Key;
  vars?: Record<string, string | number>;
  /** Plain text for options that are proper names, such as neighbourhoods. */
  label?: string;
  patch: (p: Profile) => Partial<Profile>;
}

const CATS: Category[] = ['community', 'arts', 'outdoors', 'learning', 'family', 'volunteering', 'sports', 'food', 'music'];
const MODES: TravelMode[] = ['car', 'transit', 'walk'];
const ACCESS_PICKS: AccessAttr[] = ['stepFree', 'lowNoise', 'noFlashing', 'seating', 'captions', 'largePrint'];

const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list : [...list, v]);

export function optionsFor(slot: Slot): SlotOption[] {
  switch (slot) {
    case 'interests':
      return CATS.map((c) => ({ id: c, labelKey: `cat.${c}` as Key, patch: (p) => ({ interests: toggle(p.interests, c) }) }));
    case 'free':
      return [
        { id: 'free', labelKey: 'agent.free.yes', patch: () => ({ freeOnly: true }) },
        { id: 'any', labelKey: 'agent.free.no', patch: () => ({ freeOnly: false }) },
      ];
    case 'times':
      return (['weekday', 'evening', 'weekend'] as const).map((k) => ({ id: k, labelKey: `ob.time.${k}` as Key, patch: (p) => ({ times: toggle(p.times, k) }) }));
    case 'group':
      return (['solo', 'family', 'seniors', 'friends'] as const).map((g) => ({ id: g, labelKey: `ob.group.${g}` as Key, patch: () => ({ group: g }) }));
    case 'travel':
      return MODES.map((m) => ({ id: m, labelKey: `mode.${m}` as Key, patch: () => ({ travelMode: m }) }));
    case 'area':
      return Object.entries(AREAS).map(([code, a]) => ({ id: code, label: a.label, patch: () => ({ homeArea: code }) }));
    case 'max':
      return [15, 30, 45, 60].map((n) => ({ id: String(n), labelKey: 'common.min' as Key, vars: { n }, patch: () => ({ maxTravelMin: n }) }));
    case 'access':
      return [
        ...ACCESS_PICKS.map((a) => ({
          id: a,
          labelKey: `access.${a}` as Key,
          patch: (p: Profile) => ({ access: { ...p.access, [a]: 'essential' as const } }),
        })),
        { id: 'none', labelKey: 'agent.nothing' as Key, patch: () => ({}) },
      ];
  }
}

const PRIORITY: Slot[] = ['interests', 'travel', 'access', 'area', 'free', 'times', 'max', 'group'];

function known(slot: Slot, p: Profile, asked: ReadonlySet<Slot>): boolean {
  if (asked.has(slot)) return true;
  switch (slot) {
    case 'interests':
      return p.interests.length > 0;
    case 'free':
      return p.freeOnly;
    case 'times':
      return p.times.length > 0;
    case 'group':
      return p.group !== 'solo';
    case 'travel':
      return p.travelMode !== 'car';
    case 'area':
      return p.homeArea !== 'L3R';
    case 'max':
      return p.maxTravelMin !== 30;
    case 'access':
      return Object.keys(p.access).length > 0;
  }
}

function topIds(p: Profile, now: Date, n = 5): Set<string> {
  return new Set(recommend(EVENTS, p, now, n).map((x) => x.event.id));
}

function jaccardDistance(a: Set<string>, b: Set<string>): number {
  const union = new Set([...a, ...b]).size;
  if (union === 0) return 0;
  let shared = 0;
  for (const x of a) if (b.has(x)) shared++;
  return 1 - shared / union;
}

/**
 * How much would answering this question change the top five picks?
 * Tries every answer and measures how different the resulting lists are. 0 means the question cannot matter.
 */
export function impactOf(slot: Slot, profile: Profile, now: Date): number {
  if (slot === 'group') return 0.05; // not used by scoring yet, so it is asked last
  const lists = optionsFor(slot)
    .filter((o) => o.id !== 'none')
    .map((o) => topIds({ ...profile, ...o.patch(profile) }, now));
  if (lists.length < 2) return 0;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < lists.length; i++) {
    for (let j = i + 1; j < lists.length; j++) {
      total += jaccardDistance(lists[i], lists[j]);
      pairs++;
    }
  }
  return total / pairs;
}

export interface NextQuestion {
  slot: Slot;
  /** 0 to 1. Shown to the person as the reason this question was chosen. */
  impact: number;
  options: SlotOption[];
}

/** Chooses the next unanswered question by how much it would change the person's picks. */
export function nextQuestion(profile: Profile, asked: ReadonlySet<Slot>, now: Date): NextQuestion | null {
  const open = PRIORITY.filter((s) => !known(s, profile, asked));
  if (open.length === 0) return null;
  const ranked = open
    .map((slot, i) => ({ slot, impact: impactOf(slot, profile, now), order: i }))
    .sort((a, b) => b.impact - a.impact || a.order - b.order);
  const best = ranked[0];
  return { slot: best.slot, impact: best.impact, options: optionsFor(best.slot) };
}

/** Enough to give useful picks: at least two lasting answers, and something about interests or access. */
export function enoughToRecommend(profile: Profile, asked: ReadonlySet<Slot>): boolean {
  const answered = PRIORITY.filter((s) => known(s, profile, asked)).length;
  const meaningful = profile.interests.length > 0 || Object.keys(profile.access).length > 0;
  return answered >= 3 && meaningful;
}

export function previewPicks(profile: Profile, now: Date, n = 3) {
  return recommend(EVENTS, profile, now, n);
}
