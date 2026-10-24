import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { Lang } from '../types';
import { en, type Key } from './en';
import { fa } from './fa';
import { ta } from './ta';
import { yue } from './yue';
import { zh } from './zh';

const DICTS: Record<Lang, Partial<Record<Key, string>>> = { en, yue, zh, ta, fa };

export const LANGUAGES: { code: Lang; native: string; dir: 'ltr' | 'rtl'; html: string }[] = [
  { code: 'en', native: 'English', dir: 'ltr', html: 'en' },
  { code: 'yue', native: '廣東話', dir: 'ltr', html: 'yue-Hant' },
  { code: 'zh', native: '普通话', dir: 'ltr', html: 'zh-Hans' },
  { code: 'ta', native: 'தமிழ்', dir: 'ltr', html: 'ta' },
  { code: 'fa', native: 'فارسی', dir: 'rtl', html: 'fa' },
];

export type TFn = (key: Key, vars?: Record<string, string | number>) => string;

interface I18nValue {
  lang: Lang;
  t: TFn;
}

const I18nContext = createContext<I18nValue>({ lang: 'en', t: (k) => en[k] });

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const translate = useCallback<TFn>(
    (key, vars) => {
      let text: string = DICTS[lang][key] ?? en[key];
      if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v));
      return text;
    },
    [lang],
  );
  const value = useMemo(() => ({ lang, t: translate }), [lang, translate]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useT = () => useContext(I18nContext);

/**
 * Locale tag for Intl formatting. Persian defaults to the Solar Hijri calendar, so Gregorian is forced
 * to avoid a resident reading a different date from the one the host published.
 */
export function localeFor(lang: Lang): string {
  return { en: 'en-CA', yue: 'zh-HK', zh: 'zh-CN', ta: 'ta-IN', fa: 'fa-IR-u-ca-gregory' }[lang];
}
