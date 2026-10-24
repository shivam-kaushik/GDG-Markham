import type { Lang, Profile } from '../types';
import type { TurnResult } from './engine';

export interface LlmStatus {
  live: boolean;
  provider?: string;
  model?: string;
}

/** Asks the backend whether a model key is configured. Any failure means offline mode. */
export async function checkLlm(): Promise<LlmStatus> {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 1500);
    const res = await fetch('/api/health', { signal: ctl.signal });
    clearTimeout(timer);
    if (!res.ok) return { live: false };
    const data = (await res.json()) as LlmStatus;
    return { live: !!data.live, provider: data.provider, model: data.model };
  } catch {
    return { live: false };
  }
}

export interface HistoryItem {
  role: 'user' | 'model';
  text: string;
}

export async function llmTurn(payload: {
  text: string;
  lang: Lang;
  profile: Profile;
  mode: 'onboarding' | 'assistant';
  history: HistoryItem[];
}): Promise<TurnResult> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Agent error ${res.status}`);
  return (await res.json()) as TurnResult;
}
