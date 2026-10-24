import { useState } from 'react';
import { EventCard } from '../components/EventCard';
import { EventMap } from '../components/EventMap';
import { EVENTS } from '../data/events';
import { useT } from '../i18n';
import { upcoming } from '../lib/agent';
import { NOW } from '../lib/now';
import { AREAS, travelMinutes } from '../lib/scoring';
import { useProfile } from '../state/profile';
import type { TravelMode } from '../types';

const MODES: TravelMode[] = ['car', 'transit', 'walk'];

/** Map plus the same events as a list, since a map alone is not accessible. */
export function MapPage() {
  const { t } = useT();
  const { profile, update } = useProfile();
  const [limit, setLimit] = useState(profile.maxTravelMin);

  const events = upcoming(EVENTS, NOW)
    .filter((e) => {
      const m = travelMinutes(e, profile.homeArea, profile.travelMode);
      return Number.isFinite(m) && m <= limit;
    })
    .sort((a, b) => travelMinutes(a, profile.homeArea, profile.travelMode) - travelMinutes(b, profile.homeArea, profile.travelMode));

  return (
    <div className="stack">
      <h1>{t('map.title')}</h1>
      <p className="muted">{t('map.from', { area: AREAS[profile.homeArea]?.label ?? profile.homeArea })}</p>

      <div>
        <p className="lbl" style={{ marginBlock: '0 0.35rem' }}>
          {t('map.mode')}
        </p>
        <div className="chips" role="group" aria-label={t('map.mode')}>
          {MODES.map((m) => (
            <button key={m} type="button" className="chip" aria-pressed={profile.travelMode === m} onClick={() => update({ travelMode: m })}>
              {t(`mode.${m}`)}
            </button>
          ))}
        </div>
        <label className="lbl" htmlFor="limit">
          {t('ob.travel.max')}: {t('common.min', { n: limit })}
        </label>
        <input id="limit" type="range" min={10} max={90} step={5} value={limit} onChange={(e) => setLimit(Number(e.target.value))} style={{ width: '100%', maxWidth: '24rem' }} />
      </div>

      <EventMap events={events} homeArea={profile.homeArea} label={t('map.title')} />
      <p className="muted">{t('map.hint')}</p>

      {events.length === 0 ? (
        <p className="notice">{t('events.none')}</p>
      ) : (
        <ul className="grid">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </ul>
      )}
    </div>
  );
}
