import type { EventItem, Lang } from '../types';
import { localeFor } from '../i18n';

const TZ = 'America/Toronto';

export function formatWhen(e: EventItem, lang: Lang): string {
  const loc = localeFor(lang);
  const day = new Intl.DateTimeFormat(loc, { weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ });
  const time = new Intl.DateTimeFormat(loc, { hour: 'numeric', minute: '2-digit', timeZone: TZ });
  return `${day.format(new Date(e.start))}, ${time.format(new Date(e.start))} – ${time.format(new Date(e.end))}`;
}

export function formatPrice(e: EventItem, lang: Lang): string | null {
  if (e.free || e.price === undefined) return null;
  return new Intl.NumberFormat(localeFor(lang), { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(
    e.price,
  );
}

export function formatSynced(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor(lang), { month: 'short', day: 'numeric', timeZone: TZ }).format(new Date(iso));
}
