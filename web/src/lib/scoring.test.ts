import { describe, expect, it } from 'vitest';
import { accessFit, matchLabel, scoreEvent, travelMinutes, trendScores } from './scoring';
import type { EventItem, Profile } from '../types';

const base: EventItem = {
  id: 'e1',
  title: 't',
  summary: 's',
  category: 'community',
  start: '2026-11-07T13:00:00-05:00',
  end: '2026-11-07T15:00:00-05:00',
  free: true,
  venue: 'v',
  address: 'a',
  lat: 43.8561,
  lng: -79.337,
  languages: ['en'],
  audience: 'All ages',
  volunteer: false,
  source: { name: 'Eventbrite', url: 'x', lastSynced: '2026-10-24' },
  access: {},
  transit: { stop: 's', walkMeters: 200, routes: ['Viva'], serviceAtStart: true },
  parking: 'free',
  signals: { saves: 0, signups: 0, comments: 0, views: 0 },
  image: '',
};

const profile: Profile = {
  gate: 'done',
  mode: 'participating',
  reduceMotion: false,
  onboarded: true,
  language: 'en',
  interests: ['community'],
  freeOnly: false,
  times: ['weekend'],
  group: 'solo',
  homeArea: 'L3R',
  travelMode: 'car',
  maxTravelMin: 30,
  access: {},
  saved: [],
  joined: [],
  textSize: 'normal',
  contrast: false,
};

describe('accessFit', () => {
  it('returns neutral 1 with no needs', () => {
    expect(accessFit(base, {}).fit).toBe(1);
  });

  it('caps at 69 when an essential need is unknown', () => {
    expect(accessFit(base, { stepFree: 'essential' }).cap).toBe(69);
  });

  it('caps at 39 when an essential need is confirmed absent', () => {
    const e = { ...base, access: { stepFree: { present: false, evidence: 'confirmed' as const } } };
    expect(accessFit(e, { stepFree: 'essential' }).cap).toBe(39);
  });

  it('gives full fit when essential is confirmed present', () => {
    const e = { ...base, access: { stepFree: { present: true, evidence: 'confirmed' as const } } };
    const r = accessFit(e, { stepFree: 'essential' });
    expect(r.fit).toBe(1);
    expect(r.cap).toBe(100);
  });

  it('weights essential above preferred', () => {
    const e = {
      ...base,
      access: {
        stepFree: { present: true, evidence: 'confirmed' as const },
        quietSpace: { present: false, evidence: 'confirmed' as const },
      },
    };
    const essentialHit = accessFit(e, { stepFree: 'essential', quietSpace: 'preferred' }).fit;
    const preferredHit = accessFit(e, { stepFree: 'preferred', quietSpace: 'essential' }).fit;
    expect(essentialHit).toBeGreaterThan(preferredHit);
  });
});

describe('travelMinutes', () => {
  it('is infinite for transit when no service at start', () => {
    const e = { ...base, transit: { ...base.transit, serviceAtStart: false } };
    expect(travelMinutes(e, 'L3R', 'transit')).toBe(Infinity);
  });

  it('walking takes longer than driving for the same trip', () => {
    expect(travelMinutes(base, 'L3S', 'walk')).toBeGreaterThan(travelMinutes(base, 'L3S', 'car'));
  });
});

describe('scoreEvent', () => {
  it('never exceeds the access cap', () => {
    const s = scoreEvent(base, { ...profile, access: { stepFree: 'essential' } }, 1);
    expect(s.score).toBeLessThanOrEqual(69);
  });

  it('scores a matching interest higher than a mismatch', () => {
    const hit = scoreEvent(base, profile, 0).score;
    const miss = scoreEvent({ ...base, category: 'sports' }, profile, 0).score;
    expect(hit).toBeGreaterThan(miss);
  });

  it('stays within 0..100', () => {
    const s = scoreEvent(base, profile, 1).score;
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });
});

describe('matchLabel', () => {
  it('maps thresholds', () => {
    expect(matchLabel(85)).toBe('strong');
    expect(matchLabel(65)).toBe('possible');
    expect(matchLabel(30)).toBe('review');
  });
});

describe('trendScores', () => {
  it('ranks higher engagement higher and normalises to 0..1', () => {
    const hot = { ...base, id: 'hot', signals: { saves: 50, signups: 30, comments: 20, views: 900 } };
    const cold = { ...base, id: 'cold', signals: { saves: 1, signups: 0, comments: 0, views: 20 } };
    const t = trendScores([hot, cold], new Date('2026-10-24T12:00:00-04:00'));
    expect(t.hot).toBe(1);
    expect(t.cold).toBeLessThan(t.hot);
    expect(t.cold).toBeGreaterThanOrEqual(0);
  });
});
