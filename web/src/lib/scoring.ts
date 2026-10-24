import type { AccessAttr, AccessInfo, EventItem, Importance, Profile, TravelMode } from '../types';

const WEIGHT: Record<Importance, number> = { essential: 5, preferred: 2 };

/** Home-area coordinates by postal prefix (approximate centroids). */
export const AREAS: Record<string, { label: string; lat: number; lng: number }> = {
  L3P: { label: 'Markham Village', lat: 43.8715, lng: -79.2585 },
  L3R: { label: 'Woodbine / Denison', lat: 43.8561, lng: -79.337 },
  L3S: { label: 'Milliken / Armadale', lat: 43.8255, lng: -79.28 },
  L3T: { label: 'Thornhill', lat: 43.813, lng: -79.415 },
  L6B: { label: 'Cornell', lat: 43.88, lng: -79.22 },
  L6C: { label: 'Berczy / Angus Glen', lat: 43.89, lng: -79.33 },
  L6E: { label: 'Greensborough', lat: 43.91, lng: -79.24 },
  L6G: { label: 'Unionville', lat: 43.865, lng: -79.31 },
};

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rough door-to-door estimate. A real build would call the Routes API. */
export function travelMinutes(e: EventItem, homeArea: string, mode: TravelMode): number {
  const home = AREAS[homeArea] ?? AREAS.L3R;
  const km = distanceKm(home.lat, home.lng, e.lat, e.lng) * 1.3;
  if (mode === 'car') return Math.round((km / 35) * 60 + 5);
  if (mode === 'walk') return Math.round((km / 4.8) * 60);
  if (!e.transit.serviceAtStart) return Infinity;
  return Math.round((km / 22) * 60 + e.transit.walkMeters / 80 + 8);
}

function fitOf(info: AccessInfo | undefined): number {
  if (!info || info.evidence === 'unknown') return 0.35;
  if (info.present) return info.evidence === 'confirmed' ? 1 : 0.75;
  return info.evidence === 'confirmed' ? 0 : 0.2;
}

export interface AccessResult {
  fit: number;
  cap: number;
  unknownEssential: AccessAttr[];
  missingEssential: AccessAttr[];
}

export function accessFit(e: EventItem, needs: Partial<Record<AccessAttr, Importance>>): AccessResult {
  const entries = Object.entries(needs) as [AccessAttr, Importance][];
  if (entries.length === 0) return { fit: 1, cap: 100, unknownEssential: [], missingEssential: [] };

  let total = 0;
  let weights = 0;
  let cap = 100;
  const unknownEssential: AccessAttr[] = [];
  const missingEssential: AccessAttr[] = [];

  for (const [attr, importance] of entries) {
    const info = e.access[attr];
    const w = WEIGHT[importance];
    total += w * fitOf(info);
    weights += w;
    if (importance === 'essential') {
      if (!info || info.evidence === 'unknown') {
        unknownEssential.push(attr);
        cap = Math.min(cap, 69);
      } else if (!info.present && info.evidence === 'confirmed') {
        missingEssential.push(attr);
        cap = Math.min(cap, 39);
      }
    }
  }
  return { fit: total / weights, cap, unknownEssential, missingEssential };
}

function timeFit(e: EventItem, times: Profile['times']): number {
  if (times.length === 0) return 1;
  const d = new Date(e.start);
  const day = d.getDay();
  const kinds: Profile['times'] = [day === 0 || day === 6 ? 'weekend' : 'weekday'];
  if (d.getHours() >= 17) kinds.push('evening');
  return kinds.some((k) => times.includes(k)) ? 1 : 0.4;
}

export interface Scored {
  event: EventItem;
  score: number;
  parts: { access: number; interest: number; travel: number; time: number; trend: number };
  access: AccessResult;
  minutes: number;
}

/** Deterministic 0-100 match. The model only explains this number; it never changes it. */
export function scoreEvent(e: EventItem, p: Profile, trend: number): Scored {
  const access = accessFit(e, p.access);
  const interest = p.interests.length === 0 ? 0.6 : p.interests.includes(e.category) ? 1 : 0.2;
  const minutes = travelMinutes(e, p.homeArea, p.travelMode);
  const travel = !Number.isFinite(minutes)
    ? 0
    : minutes <= p.maxTravelMin
      ? 1
      : Math.max(0, 1 - (minutes - p.maxTravelMin) / p.maxTravelMin);
  const time = timeFit(e, p.times);
  const raw = 100 * (0.35 * access.fit + 0.3 * interest + 0.25 * travel + 0.1 * time) + 5 * trend;
  const score = Math.max(0, Math.min(access.cap, 100, Math.round(raw)));
  return { event: e, score, parts: { access: access.fit, interest, travel, time, trend }, access, minutes };
}

export type MatchLabel = 'strong' | 'possible' | 'review';

export function matchLabel(score: number): MatchLabel {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'possible';
  return 'review';
}

/** Engagement per event, damped by how far away the start is, normalised to 0..1. */
export function trendScores(events: EventItem[], now: Date): Record<string, number> {
  const raw: Record<string, number> = {};
  for (const e of events) {
    const s = e.signals;
    const engagement = s.saves * 3 + s.signups * 4 + s.comments * 2 + s.views * 0.2;
    const hours = Math.max(0, (new Date(e.start).getTime() - now.getTime()) / 36e5);
    raw[e.id] = engagement / Math.sqrt(hours + 24);
  }
  const max = Math.max(1e-9, ...Object.values(raw));
  const out: Record<string, number> = {};
  for (const id of Object.keys(raw)) out[id] = raw[id] / max;
  return out;
}
