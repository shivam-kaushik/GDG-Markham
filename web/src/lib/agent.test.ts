import { describe, expect, it } from 'vitest';
import { ask, parseQuery, recommend, transitFriendly, trending } from './agent';
import { EVENTS } from '../data/events';
import { DEFAULT_PROFILE } from '../state/profile';
import { trendScores } from './scoring';

const now = new Date('2026-10-24T12:00:00-04:00');

describe('parseQuery', () => {
  it('detects free, weekend, transit and access words', () => {
    const q = parseQuery('free and quiet this Saturday near a bus');
    expect(q.free).toBe(true);
    expect(q.weekend).toBe(true);
    expect(q.transit).toBe(true);
    expect(q.access).toContain('lowNoise');
  });
});

describe('recommend', () => {
  it('only returns upcoming events', () => {
    const later = new Date('2026-11-05T00:00:00-05:00');
    const picks = recommend(EVENTS, DEFAULT_PROFILE, later, 20);
    expect(picks.every((p) => new Date(p.event.end) >= later)).toBe(true);
  });

  it('drops events where an essential need is confirmed absent', () => {
    const profile = { ...DEFAULT_PROFILE, access: { noFlashing: 'essential' as const } };
    const ids = recommend(EVENTS, profile, now, 20).map((p) => p.event.id);
    expect(ids).not.toContain('maker-afternoon');
  });

  it('respects free-only', () => {
    const picks = recommend(EVENTS, { ...DEFAULT_PROFILE, freeOnly: true }, now, 20);
    expect(picks.every((p) => p.event.free)).toBe(true);
  });

  it('ranks an interest match first', () => {
    const profile = { ...DEFAULT_PROFILE, interests: ['music' as const], maxTravelMin: 60 };
    expect(recommend(EVENTS, profile, now, 3)[0].event.category).toBe('music');
  });

  it('gives a traceable reason for every pick', () => {
    const profile = { ...DEFAULT_PROFILE, interests: ['community' as const] };
    for (const p of recommend(EVENTS, profile, now, 5)) {
      if (p.reasons.some((r) => r.kind === 'interest')) expect(p.event.category).toBe('community');
    }
  });
});

describe('transitFriendly', () => {
  it('only includes events with bus service at the start time', () => {
    const list = transitFriendly(EVENTS, { ...DEFAULT_PROFILE, maxTravelMin: 90 }, now, 20);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((s) => s.event.transit.serviceAtStart)).toBe(true);
  });
});

describe('trending', () => {
  it('orders upcoming events by descending trend score', () => {
    const list = trending(EVENTS, now, 20);
    const t = trendScores(list, now);
    for (let i = 1; i < list.length; i++) expect(t[list[i - 1].id]).toBeGreaterThanOrEqual(t[list[i].id]);
  });

  it('never includes events that already ended', () => {
    const later = new Date('2026-11-05T00:00:00-05:00');
    expect(trending(EVENTS, later, 20).every((e) => new Date(e.end) >= later)).toBe(true);
  });
});

describe('ask', () => {
  it('finds free weekend events', () => {
    const r = ask(EVENTS, 'free this weekend', { ...DEFAULT_PROFILE, maxTravelMin: 90 }, now);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.event.free && [0, 6].includes(new Date(p.event.start).getDay()))).toBe(true);
  });

  it('returns nothing for nonsense', () => {
    expect(ask(EVENTS, 'zzzzqq', DEFAULT_PROFILE, now)).toEqual([]);
  });
});
