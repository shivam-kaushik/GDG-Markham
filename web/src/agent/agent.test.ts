import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE } from '../state/profile';
import type { Profile } from '../types';
import { runLocalTurn } from './engine';
import { factsToPatch, removeFact, understand } from './nlu';
import { enoughToRecommend, impactOf, nextQuestion, optionsFor, type Slot } from './planner';
import { rankForUser, runTool, searchEvents } from './tools';

const now = new Date('2026-10-24T12:00:00-04:00');
const ctx = (p: Partial<Profile> = {}) => ({ profile: { ...DEFAULT_PROFILE, ...p }, now });

describe('understand: English', () => {
  it('reads a lasting accessibility need', () => {
    const u = understand("I use a wheelchair and I don't drive");
    expect(u.durable).toBe(true);
    expect(u.facts).toContainEqual({ kind: 'access', attr: 'stepFree', importance: 'essential' });
    expect(u.facts).toContainEqual({ kind: 'mode', mode: 'transit' });
  });

  it('reads a one-off request as transient', () => {
    const u = understand('free quiet things this weekend');
    expect(u.durable).toBe(false);
    expect(u.facts).toContainEqual({ kind: 'free' });
    expect(u.facts).toContainEqual({ kind: 'time', time: 'weekend' });
    expect(u.facts.some((f) => f.kind === 'access' && f.attr === 'lowNoise')).toBe(true);
  });

  it('treats migraine and flashing lights as essential', () => {
    const u = understand('I get migraines from flashing lights');
    expect(u.facts).toContainEqual({ kind: 'access', attr: 'noFlashing', importance: 'essential' });
  });

  it('reads neighbourhoods and travel limits', () => {
    const u = understand('I live in Unionville and can travel 20 minutes');
    expect(u.facts).toContainEqual({ kind: 'area', code: 'L6G' });
    expect(u.facts).toContainEqual({ kind: 'max', minutes: 20 });
  });

  it('recognises greetings and help', () => {
    expect(understand('hello').intent).toBe('greet');
    expect(understand('help').intent).toBe('help');
  });
});

describe('understand: other languages', () => {
  it('Mandarin (Simplified): free weekend music', () => {
    const u = understand('我想找周末免费的音乐活动');
    expect(u.facts).toContainEqual({ kind: 'free' });
    expect(u.facts).toContainEqual({ kind: 'time', time: 'weekend' });
    expect(u.facts).toContainEqual({ kind: 'interest', category: 'music' });
  });

  it('Cantonese (Traditional): no car and wheelchair', () => {
    const u = understand('我坐輪椅，唔揸車');
    expect(u.facts).toContainEqual({ kind: 'access', attr: 'stepFree', importance: 'essential' });
    expect(u.facts).toContainEqual({ kind: 'mode', mode: 'transit' });
  });

  it('Tamil: free music', () => {
    const u = understand('இலவச இசை நிகழ்ச்சி');
    expect(u.facts).toContainEqual({ kind: 'interest', category: 'music' });
  });

  it('Farsi: quiet and free', () => {
    const u = understand('رایگان و آرام');
    expect(u.facts).toContainEqual({ kind: 'free' });
    expect(u.facts.some((f) => f.kind === 'access' && f.attr === 'lowNoise')).toBe(true);
  });
});

describe('profile patches', () => {
  it('adds facts without removing existing answers', () => {
    const base = { ...DEFAULT_PROFILE, interests: ['arts' as const] };
    const patch = factsToPatch(base, understand('I love music', { forceDurable: true }).facts);
    expect(patch.interests).toEqual(['arts', 'music']);
  });

  it('removes a fact when the person removes the chip', () => {
    const base = { ...DEFAULT_PROFILE, interests: ['arts' as const, 'music' as const] };
    expect(removeFact(base, { kind: 'interest', category: 'music' }).interests).toEqual(['arts']);
  });
});

describe('tools', () => {
  it('search returns only events that exist', () => {
    const r = searchEvents({ free: true, weekend: true }, ctx());
    expect(r.events.length).toBeGreaterThan(0);
    expect(r.events.every((e) => e.free)).toBe(true);
  });

  it('search excludes events where a needed feature is confirmed absent', () => {
    const r = searchEvents({ accessNeeds: ['noFlashing'], limit: 10 }, ctx());
    expect(r.events.map((e) => e.id)).not.toContain('maker-afternoon');
    expect(r.events.map((e) => e.id)).not.toContain('diwali-lights');
  });

  it('flags unknown access evidence instead of treating it as a no', () => {
    const r = searchEvents({ categories: ['volunteering'], accessNeeds: ['quietSpace'], limit: 10 }, ctx());
    expect(r.events.length).toBeGreaterThan(0);
    expect(r.events.every((e) => e.accessChecks?.quietSpace === 'unknown')).toBe(true);
  });

  it('ranks events with confirmed access above those with unknown access', () => {
    const r = searchEvents({ accessNeeds: ['quietSpace'], limit: 10 }, ctx());
    expect(r.events[0].accessChecks?.quietSpace).toBe('confirmed');
  });

  it('transit-only search only returns events with bus service at start', () => {
    const r = searchEvents({ transitOnly: true, limit: 10 }, ctx());
    expect(r.events.every((e) => e.travelMinutes !== null)).toBe(true);
    expect(r.events.map((e) => e.id)).not.toContain('fall-colours-walk');
  });

  it('rank_for_user respects interests', () => {
    const r = rankForUser({ limit: 3 }, ctx({ interests: ['music'], maxTravelMin: 60 }));
    expect(r.events[0].category).toBe('music');
  });

  it('runTool dispatches and rejects unknown names', () => {
    expect(runTool('get_trending', {}, ctx())).toHaveProperty('events');
    expect(runTool('nope', {}, ctx())).toHaveProperty('error');
  });
});

describe('runLocalTurn', () => {
  const base = { profile: DEFAULT_PROFILE, lang: 'en' as const, now };

  it('assistant: a first-person statement is flagged as lasting so the app can offer to save it', () => {
    const r = runLocalTurn({ ...base, mode: 'assistant', text: 'I use a wheelchair and want free things' });
    expect(r.durable).toBe(true);
    expect(r.facts).toContainEqual({ kind: 'access', attr: 'stepFree', importance: 'essential' });
  });

  it('assistant: a one-off request is not flagged as lasting', () => {
    const r = runLocalTurn({ ...base, mode: 'assistant', text: 'free quiet things this weekend' });
    expect(r.durable).toBe(false);
    expect(r.events.length).toBeGreaterThan(0);
    expect(r.parts?.[0].key).toBe('chat.found');
  });

  it('onboarding: everything counts as describing the person and events are ranked for them', () => {
    const r = runLocalTurn({ ...base, mode: 'onboarding', text: 'music' });
    expect(r.durable).toBe(true);
    expect(r.events[0].category).toBe('music');
  });

  it('replies to a greeting and to a message with no preference', () => {
    expect(runLocalTurn({ ...base, mode: 'assistant', text: 'hello' }).parts?.[0].key).toBe('chat.greetReply');
    expect(runLocalTurn({ ...base, mode: 'assistant', text: '???' }).parts?.[0].key).toBe('chat.noUnderstand');
  });

  it('records a trace the person can read', () => {
    const r = runLocalTurn({ ...base, mode: 'assistant', text: 'free weekend' });
    expect(r.trace.map((s) => s.key)).toEqual(expect.arrayContaining(['chat.step.understood', 'chat.step.search']));
  });
});

describe('planner', () => {
  it('asks something when nothing is known and gives options', () => {
    const q = nextQuestion(DEFAULT_PROFILE, new Set<Slot>(), now)!;
    expect(q).not.toBeNull();
    expect(q.options.length).toBeGreaterThan(1);
  });

  it('does not repeat an answered question', () => {
    const q = nextQuestion({ ...DEFAULT_PROFILE, interests: ['arts'] }, new Set<Slot>(['travel']), now)!;
    expect(q.slot).not.toBe('interests');
    expect(q.slot).not.toBe('travel');
  });

  it('returns null when everything is known', () => {
    const all = new Set<Slot>(['interests', 'free', 'times', 'group', 'travel', 'area', 'max', 'access']);
    expect(nextQuestion(DEFAULT_PROFILE, all, now)).toBeNull();
  });

  it('measures impact between 0 and 1 and asks the most impactful question', () => {
    const q = nextQuestion(DEFAULT_PROFILE, new Set<Slot>(), now)!;
    expect(q.impact).toBeGreaterThanOrEqual(0);
    expect(q.impact).toBeLessThanOrEqual(1);
    const others: Slot[] = ['interests', 'free', 'times', 'travel', 'area', 'max', 'access'];
    for (const s of others) expect(impactOf(s, DEFAULT_PROFILE, now)).toBeLessThanOrEqual(q.impact + 1e-9);
  });

  it('every slot has options and group questions come last', () => {
    for (const s of ['interests', 'free', 'times', 'group', 'travel', 'area', 'max', 'access'] as Slot[]) {
      expect(optionsFor(s).length).toBeGreaterThan(0);
    }
    expect(impactOf('group', DEFAULT_PROFILE, now)).toBeLessThan(0.1);
  });

  it('needs at least three answers including interests or access before recommending', () => {
    expect(enoughToRecommend(DEFAULT_PROFILE, new Set<Slot>())).toBe(false);
    const p = { ...DEFAULT_PROFILE, interests: ['arts' as const], freeOnly: true, travelMode: 'transit' as const };
    expect(enoughToRecommend(p, new Set<Slot>())).toBe(true);
  });
});
