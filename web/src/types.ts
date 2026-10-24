export type Lang = 'en' | 'yue' | 'zh' | 'ta' | 'fa';

export type Category =
  | 'community'
  | 'arts'
  | 'outdoors'
  | 'learning'
  | 'family'
  | 'volunteering'
  | 'sports'
  | 'food'
  | 'music';

export type SourceName =
  | 'Eventbrite'
  | 'Luma'
  | 'City of Markham'
  | 'Markham Public Library'
  | 'TodoMarkham';

export type TravelMode = 'car' | 'transit' | 'walk';

export type Evidence = 'confirmed' | 'estimated' | 'unknown';

/** Access attributes grouped by disability category. */
export type AccessAttr =
  | 'stepFree'
  | 'accessibleWashroom'
  | 'accessibleParking'
  | 'seating'
  | 'largePrint'
  | 'audioDescription'
  | 'interpreter'
  | 'captions'
  | 'lowNoise'
  | 'noFlashing'
  | 'quietSpace'
  | 'lowCrowd'
  | 'plainLanguage'
  | 'supportPerson';

export type AccessCategory =
  | 'mobility'
  | 'vision'
  | 'hearing'
  | 'sensory'
  | 'cognitive';

export interface AccessInfo {
  /** true = feature is present, false = absent. */
  present: boolean;
  evidence: Evidence;
  /** Quote from host/listing or reasoning for the estimate. */
  note?: string;
}

export interface SourceInfo {
  name: SourceName;
  url: string;
  /** Rating on that platform, if the platform provides one. */
  rating?: number;
  reviewCount?: number;
  lastSynced: string;
}

export interface EventItem {
  id: string;
  title: string;
  summary: string;
  category: Category;
  start: string; // ISO
  end: string; // ISO
  free: boolean;
  price?: number;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  languages: Lang[];
  audience: string;
  volunteer: boolean;
  source: SourceInfo;
  access: Partial<Record<AccessAttr, AccessInfo>>;
  transit: { stop: string; walkMeters: number; routes: string[]; serviceAtStart: boolean };
  parking: 'free' | 'paid' | 'none' | 'unknown';
  /** Raw engagement counts used for the trending score. */
  signals: { saves: number; signups: number; comments: number; views: number };
  image: string;
  commentSummary?: string;
  /** Optional richer detail used by the event page. */
  series?: string;
  hostName?: string;
  hostCollective?: string;
  hostBlurb?: string;
  hostQuote?: string;
  spots?: { left: number; total: number };
  included?: string;
  schedule?: { time: string; title: string; desc: string }[];
  occurrences?: { start: string; spotsLeft: number }[];
  past?: { date: string; attended: number }[];
  volunteerRole?: { title: string; shift: string; tasks: string; open: number; total: number };
  directions?: string;
  room?: string;
}

export type Importance = 'essential' | 'preferred';

/** new = never asked, skipped = chose all events, started = answered some, done = finished the questions. */
export type Gate = 'new' | 'skipped' | 'started' | 'done';

export interface Profile {
  gate: Gate;
  mode: 'participating' | 'hosting';
  reduceMotion: boolean;
  onboarded: boolean;
  language: Lang;
  interests: Category[];
  freeOnly: boolean;
  times: ('weekday' | 'evening' | 'weekend')[];
  group: 'solo' | 'family' | 'seniors' | 'friends';
  homeArea: string; // postal prefix e.g. L3R
  travelMode: TravelMode;
  maxTravelMin: number;
  access: Partial<Record<AccessAttr, Importance>>;
  saved: string[];
  joined: string[];
  textSize: 'normal' | 'large' | 'xlarge';
  contrast: boolean;
}
