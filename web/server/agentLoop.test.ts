import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE } from '../src/state/profile';
import { runAgent, type GenerateFn, type GenerateRequest } from './agentLoop';

const now = new Date('2026-10-24T12:00:00-04:00');
const base = { lang: 'en' as const, profile: DEFAULT_PROFILE, mode: 'assistant' as const, history: [], now };

/** A stand-in model that first asks for a tool, then answers from the tool result. */
function scripted(steps: (req: GenerateRequest, call: number) => { text?: string; call?: { name: string; args: Record<string, unknown> }[] }): GenerateFn {
  let n = 0;
  return async (req) => {
    const s = steps(req, n++);
    if (s.call) return { candidates: [{ content: { parts: s.call.map((c) => ({ functionCall: c })) } }] };
    return { candidates: [{ content: { parts: [{ text: s.text ?? '' }] } }] };
  };
}

describe('runAgent', () => {
  it('executes the requested tool and returns only events the tool produced', async () => {
    const gen = scripted((_req, i) =>
      i === 0 ? { call: [{ name: 'search_events', args: { free: true, weekend: true } }] } : { text: 'Here are free weekend events.' },
    );
    const r = await runAgent({ ...base, text: 'free weekend' }, gen);
    expect(r.source).toBe('llm');
    expect(r.text).toBe('Here are free weekend events.');
    expect(r.events.length).toBeGreaterThan(0);
    expect(r.events.every((e) => e.free)).toBe(true);
    expect(r.trace[0].text).toContain('search_events');
  });

  it('feeds tool results back to the model', async () => {
    let sawResult = false;
    const gen = scripted((req, i) => {
      if (i === 0) return { call: [{ name: 'get_trending', args: { limit: 2 } }] };
      sawResult = req.contents.some((c) => c.parts.some((p) => p.functionResponse?.name === 'get_trending'));
      return { text: 'done' };
    });
    await runAgent({ ...base, text: 'what is popular' }, gen);
    expect(sawResult).toBe(true);
  });

  it('does not let the model invent events: unknown tool names return an error and no events', async () => {
    const gen = scripted((_r, i) => (i === 0 ? { call: [{ name: 'book_event', args: { id: 'fake' } }] } : { text: 'ok' }));
    const r = await runAgent({ ...base, text: 'book it' }, gen);
    expect(r.events).toEqual([]);
    expect(r.trace[0].text).toContain('Unknown tool');
  });

  it('turns a profile proposal into facts for the person to confirm', async () => {
    const gen = scripted((_r, i) =>
      i === 0
        ? { call: [{ name: 'propose_profile_update', args: { accessNeeds: [{ attr: 'stepFree', importance: 'essential' }], travelMode: 'transit' } }] }
        : { text: 'Noted.' },
    );
    const r = await runAgent({ ...base, text: 'I use a wheelchair and take the bus' }, gen);
    expect(r.facts).toContainEqual({ kind: 'access', attr: 'stepFree', importance: 'essential' });
    expect(r.facts).toContainEqual({ kind: 'mode', mode: 'transit' });
    expect(r.durable).toBe(true);
  });

  it('stops after the step limit even if the model keeps calling tools', async () => {
    const gen = scripted(() => ({ call: [{ name: 'get_trending', args: {} }] }));
    const r = await runAgent({ ...base, text: 'loop' }, gen, 3);
    expect(r.trace.length).toBe(3);
  });

  it('tells the model which language to answer in and includes the safety rules', async () => {
    let system = '';
    const gen: GenerateFn = async (req) => {
      system = req.system;
      return { candidates: [{ content: { parts: [{ text: 'ok' }] } }] };
    };
    await runAgent({ ...base, lang: 'fa', text: 'سلام' }, gen);
    expect(system).toContain('Persian');
    expect(system).toContain('Unknown never means "no"');
    expect(system).toContain('Never infer');
  });
});
