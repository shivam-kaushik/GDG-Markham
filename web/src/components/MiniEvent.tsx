import { Link } from 'react-router-dom';
import { getEvent } from '../data/events';
import { reviewsFor, summarizeReviews } from '../data/reviews';
import { useT } from '../i18n';
import type { Reason } from '../lib/agent';
import { formatWhen } from '../lib/format';
import { matchLabel } from '../lib/scoring';
import { WhyList } from './bits';

/** Compact event card used inside chat. Always built from the real event, never from model text. */
export function MiniEvent({ id, score, reasons, minutes }: { id: string; score?: number; reasons?: Reason[]; minutes?: number | null }) {
  const { t, lang } = useT();
  const e = getEvent(id);
  if (!e) return null;
  const community = summarizeReviews(reviewsFor(id));
  return (
    <li className="mini-event">
      <Link to={`/event/${e.id}`} className="mini-title">
        {e.title}
      </Link>
      <span className="muted small">
        {formatWhen(e, lang)} · {e.venue}
      </span>
      <span className="row small">
        {e.free ? <span className="tag soft">{t('common.free')}</span> : <span className="tag soft">${e.price}</span>}
        {score !== undefined && <span className="tag ok">{t(`match.${matchLabel(score)}`)}</span>}
        {minutes != null && <span className="tag">{t('common.min', { n: minutes })}</span>}
        {e.source.rating !== undefined && (
          <span className="tag">
            {e.source.name} ★ {e.source.rating.toFixed(1)}
          </span>
        )}
        {community.count > 0 && (
          <span className="tag">
            {t('reviews.community')} ★ {community.average.toFixed(1)}
          </span>
        )}
      </span>
      {reasons && reasons.length > 0 && <WhyList reasons={reasons} />}
    </li>
  );
}
