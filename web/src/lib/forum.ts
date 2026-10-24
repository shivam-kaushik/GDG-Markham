import type { Post, Thread } from '../data/forum';

export interface ThreadSummary {
  replies: number;
  /** Most helpful reply, shortened. Empty when nobody has replied yet. */
  quote: string;
}

function shorten(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 40))}…`;
}

/**
 * Prototype summary built from the replies themselves, so nothing is invented.
 * The full build asks Gemini for a summary and keeps this as the fallback.
 */
export function summarize(thread: Thread): ThreadSummary {
  const replies = thread.posts.filter((p, i) => i > 0 || p.parentId);
  const best = [...replies].sort((a: Post, b: Post) => b.helpful - a.helpful)[0];
  return { replies: replies.length, quote: best ? shorten(best.text) : '' };
}

export function lastActivity(thread: Thread): string {
  return thread.posts.reduce((latest, p) => (p.time > latest ? p.time : latest), thread.created);
}

export function repliesTo(thread: Thread, parentId: string | undefined): Post[] {
  return thread.posts.filter((p) => p.parentId === parentId);
}
