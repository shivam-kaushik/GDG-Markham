import type { EventItem } from '../types';

const base = import.meta.env.BASE_URL;

const BY_CATEGORY: Record<EventItem['category'], string> = {
  community: 'community',
  arts: 'arts',
  outdoors: 'outdoors',
  learning: 'learning',
  family: 'family',
  volunteering: 'volunteering',
  sports: 'outdoors',
  food: 'volunteering',
  music: 'community',
};

/** Sample photographs from the design file. Replace with host-uploaded images once listings are live. */
export function photoFor(e: EventItem): string {
  if (e.id === 'mending-circle') return `${base}photos/mending.jpg`;
  return `${base}photos/${BY_CATEGORY[e.category]}.jpg`;
}

export const HERO_PHOTO = `${base}photos/hero.jpg`;
export const HOST_PHOTO = `${base}photos/host.jpg`;
