import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { EVENT_DISCUSSIONS, MORE_FORUM_THREADS } from '../data/discussions';
import { SEED_THREADS, type ForumCategory, type Post, type Thread } from '../data/forum';
import type { Lang } from '../types';

const ALL_SEED: Thread[] = [...SEED_THREADS, ...EVENT_DISCUSSIONS, ...MORE_FORUM_THREADS];

const KEY = 'todomarkham.forum.v2';

interface Ctx {
  threads: Thread[];
  eventThread: (eventId: string) => Thread | undefined;
  addThread: (input: { title: string; body: string; category: ForumCategory; lang: Lang }) => string;
  addPost: (threadId: string, text: string, parentId?: string) => void;
  /** Event pages create their discussion the first time a neighbour posts. */
  addEventPost: (eventId: string, title: string, text: string, parentId?: string) => void;
  toggleHelpful: (threadId: string, postId: string) => void;
}

const ForumContext = createContext<Ctx | null>(null);

function load(): Thread[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Thread[];
  } catch {
    /* fall back to seed */
  }
  return ALL_SEED;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function ForumProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(threads));
    } catch {
      /* ignore */
    }
  }, [threads]);

  const value = useMemo<Ctx>(() => {
    const newPost = (text: string, parentId?: string): Post => ({
      id: uid(),
      author: 'You',
      role: 'you',
      text: text.trim(),
      time: new Date().toISOString(),
      parentId,
      helpful: 0,
    });
    return {
      threads,
      eventThread: (eventId) => threads.find((t) => t.eventId === eventId),
      addThread: ({ title, body, category, lang }) => {
        const id = uid();
        const thread: Thread = {
          id,
          title: title.trim(),
          category,
          lang,
          created: new Date().toISOString(),
          posts: [newPost(body)],
        };
        setThreads((all) => [thread, ...all]);
        return id;
      },
      addPost: (threadId, text, parentId) =>
        setThreads((all) =>
          all.map((t) => (t.id === threadId ? { ...t, posts: [...t.posts, newPost(text, parentId)] } : t)),
        ),
      addEventPost: (eventId, title, text, parentId) =>
        setThreads((all) => {
          const existing = all.find((t) => t.eventId === eventId);
          if (existing) {
            return all.map((t) => (t === existing ? { ...t, posts: [...t.posts, newPost(text, parentId)] } : t));
          }
          const thread: Thread = {
            id: `event-${eventId}`,
            eventId,
            title,
            category: 'newcomers',
            lang: 'en',
            created: new Date().toISOString(),
            posts: [newPost(text, parentId)],
          };
          return [...all, thread];
        }),
      toggleHelpful: (threadId, postId) =>
        setThreads((all) =>
          all.map((t) =>
            t.id !== threadId
              ? t
              : {
                  ...t,
                  posts: t.posts.map((p) =>
                    p.id !== postId
                      ? p
                      : { ...p, helpedByMe: !p.helpedByMe, helpful: p.helpful + (p.helpedByMe ? -1 : 1) },
                  ),
                },
          ),
        ),
    };
  }, [threads]);

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum(): Ctx {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum must be used inside ForumProvider');
  return ctx;
}
