import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Profile } from '../types';

const KEY = 'todomarkham.profile.v1';

export const DEFAULT_PROFILE: Profile = {
  gate: 'new',
  mode: 'participating',
  reduceMotion: false,
  onboarded: false,
  language: 'en',
  interests: [],
  freeOnly: false,
  times: [],
  group: 'solo',
  homeArea: 'L3R',
  travelMode: 'car',
  maxTravelMin: 30,
  access: {},
  saved: [],
  joined: [],
  textSize: 'large',
  contrast: false,
};

function load(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: fall through to defaults */
  }
  return DEFAULT_PROFILE;
}

interface Ctx {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
  toggleSaved: (id: string) => void;
  join: (id: string) => void;
  /** Clears answers but keeps display settings and language. */
  clearAnswers: () => void;
}

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile]);

  const value = useMemo<Ctx>(
    () => ({
      profile,
      update: (patch) => setProfile((p) => ({ ...p, ...patch })),
      toggleSaved: (id) =>
        setProfile((p) => ({
          ...p,
          saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id],
        })),
      join: (id) => setProfile((p) => (p.joined.includes(id) ? p : { ...p, joined: [...p.joined, id] })),
      clearAnswers: () =>
        setProfile((p) => ({
          ...DEFAULT_PROFILE,
          gate: 'skipped',
          language: p.language,
          textSize: p.textSize,
          contrast: p.contrast,
          reduceMotion: p.reduceMotion,
          saved: p.saved,
          joined: p.joined,
        })),
    }),
    [profile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): Ctx {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}

/** True once someone has answered at least one question: they see recommended events. */
export function isPersonalized(p: Profile): boolean {
  return p.gate === 'started' || p.gate === 'done';
}
