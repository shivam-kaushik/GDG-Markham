import { Link } from 'react-router-dom';
import { LANGUAGES, useT } from '../i18n';
import type { Reason } from '../lib/agent';
import { formatPrice, formatWhen } from '../lib/format';
import { photoFor } from '../lib/photos';
import { matchLabel, travelMinutes } from '../lib/scoring';
import { useProfile } from '../state/profile';
import type { AccessAttr, EventItem, TravelMode } from '../types';
import { SourceLine, WhyList } from './bits';
import { Icon } from './Icon';
import { Tilt } from './Motion';

interface Props {
  event: EventItem;
  reasons?: Reason[];
  score?: number;
  /** Overrides the profile's travel mode, e.g. on the "without a car" list. */
  mode?: TravelMode;
}

const PREVIEW: AccessAttr[] = ['seating', 'stepFree', 'quietSpace'];

export function languageNames(e: EventItem): string {
  return e.languages.map((l) => LANGUAGES.find((x) => x.code === l)?.native ?? l).join(' · ');
}

/** Card from the Figma explore page: photo, date and cost, title, venue, tags, source, "what to expect" strip. */
export function EventCard({ event, reasons, score, mode }: Props) {
  const { t, lang } = useT();
  const { profile, toggleSaved } = useProfile();
  const saved = profile.saved.includes(event.id);
  const price = formatPrice(event, lang);
  const travelMode = mode ?? profile.travelMode;
  const mins = travelMinutes(event, profile.homeArea, travelMode);
  const noService = travelMode === 'transit' && !Number.isFinite(mins);

  const infos = PREVIEW.map((a) => event.access[a]);
  const known = infos.filter((i) => i && i.evidence !== 'unknown');
  const status =
    known.length === 0
      ? t('card.notProvided')
      : known.some((i) => i!.evidence === 'confirmed')
        ? t('ev.confirmed')
        : t('ev.estimated');

  return (
    <li className="card-wrap">
      <Tilt className="event-card">
        <div className="photo">
          <img src={photoFor(event)} alt="" loading="lazy" />
          <span className="badge">
            {event.volunteer && <Icon name="heart-hand" size={14} />}
            {t(`cat.${event.category}`)}
          </span>
          <button
            type="button"
            className="bookmark"
            aria-pressed={saved}
            aria-label={`${saved ? t('common.saved') : t('common.save')}: ${event.title}`}
            onClick={() => toggleSaved(event.id)}
          >
            <Icon name={saved ? 'bookmark-filled' : 'bookmark'} />
          </button>
        </div>
        <div className="body">
          <div className="spread">
            <span className="when">{formatWhen(event, lang)}</span>
            <strong>{price ?? t('common.free')}</strong>
          </div>
          <h3>
            <Link to={`/event/${event.id}`}>{event.title}</Link>
          </h3>
          <p className="venue">
            <Icon name="pin" size={15} /> {event.venue}
            <span className="muted">
              {' · '}
              {noService ? t('map.noService') : `${t('common.min', { n: mins })} ${t(`mode.${travelMode}`)}`}
            </span>
          </p>
          <div className="tags">
            <span className="tag soft">{languageNames(event)}</span>
            <span className="tag soft">{event.audience}</span>
          </div>
          <SourceLine event={event} />
          <div className="expect-mini">
            <div className="spread">
              <strong>{t('card.expect')}</strong>
              <span className="muted small">{status}</span>
            </div>
            <p className="small muted">
              {PREVIEW.map((a, i) => {
                const info = event.access[a];
                const mark = !info || info.evidence === 'unknown' ? '?' : info.present ? '✓' : '✕';
                return (
                  <span key={a}>
                    {i > 0 && ' · '}
                    {mark} {t(`access.${a}`)}
                  </span>
                );
              })}
            </p>
          </div>
          {score !== undefined && <span className="tag ok">{t(`match.${matchLabel(score)}`)}</span>}
          {reasons && <WhyList reasons={reasons} />}
          <Link className="view" to={`/event/${event.id}`}>
            {event.volunteer ? t('card.volunteerOp') : t('card.view')} <Icon name="arrow-up-right" size={16} />
          </Link>
        </div>
      </Tilt>
    </li>
  );
}
