import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../types';

/** Minimal shapes for the Web Speech API, which TypeScript's DOM lib does not include everywhere. */
interface SpeechResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechEvent {
  resultIndex: number;
  results: ArrayLike<SpeechResult>;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => Recognition;

/** Speech recognition and speech synthesis locales for each launch language. */
export const SPEECH_LANG: Record<Lang, string> = {
  en: 'en-CA',
  yue: 'yue-Hant-HK',
  zh: 'zh-CN',
  ta: 'ta-IN',
  fa: 'fa-IR',
};
const SYNTH_LANG: Record<Lang, string> = { en: 'en-CA', yue: 'zh-HK', zh: 'zh-CN', ta: 'ta-IN', fa: 'fa-IR' };

function ctor(): RecognitionCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type VoiceError = 'denied' | 'nospeech' | 'unsupported' | 'other' | null;

/**
 * Voice in and out. Recognition runs in the browser in the person's language; the final transcript is handed to
 * onFinal, which sends it to the chat. Nothing is recorded or stored by the app.
 */
export function useVoice(lang: Lang, onFinal: (text: string) => void) {
  const recRef = useRef<Recognition | null>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<VoiceError>(null);
  const supported = typeof window !== 'undefined' && !!ctor();

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const C = ctor();
    if (!C) {
      setError('unsupported');
      return;
    }
    setError(null);
    setInterim('');
    const rec = new C();
    rec.lang = SPEECH_LANG[lang];
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = '';
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      let live = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else live += r[0].transcript;
      }
      setInterim(finalText + live);
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setError('denied');
      else if (e.error === 'no-speech') setError('nospeech');
      else if (e.error !== 'aborted') setError('other');
    };
    rec.onend = () => {
      setListening(false);
      setInterim('');
      recRef.current = null;
      const text = finalText.trim();
      if (text) onFinalRef.current(text);
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      setError('other');
    }
  }, [lang]);

  useEffect(() => () => recRef.current?.abort(), []);

  const [speaking, setSpeaking] = useState(false);
  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = SYNTH_LANG[lang];
      const prefix = SYNTH_LANG[lang].split('-')[0];
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(prefix));
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [lang],
  );
  const silence = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { supported, listening, interim, error, start, stop, speak, silence, speaking };
}
