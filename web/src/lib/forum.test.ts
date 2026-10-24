import { describe, expect, it } from 'vitest';
import { SEED_THREADS } from '../data/forum';
import { lastActivity, repliesTo, summarize } from './forum';

const thread = SEED_THREADS.find((t) => t.id === 'f2')!;

describe('summarize', () => {
  it('counts replies and quotes the most helpful one', () => {
    const s = summarize(thread);
    expect(s.replies).toBe(2);
    expect(s.quote).toContain('Flashing lights');
  });

  it('handles a thread with no replies', () => {
    const solo = { ...thread, posts: [thread.posts[0]] };
    expect(summarize(solo)).toEqual({ replies: 0, quote: '' });
  });

  it('shortens long replies', () => {
    const long = { ...thread, posts: [thread.posts[0], { ...thread.posts[1], text: 'word '.repeat(80), helpful: 99 }] };
    expect(summarize(long).quote.length).toBeLessThanOrEqual(142);
  });
});

describe('thread helpers', () => {
  it('finds children of a post', () => {
    expect(repliesTo(thread, 'b1').map((p) => p.id)).toEqual(['b2', 'b3']);
  });

  it('returns the latest timestamp', () => {
    expect(lastActivity(thread) >= thread.created).toBe(true);
  });
});
