import { reviewsFor, summarizeReviews } from '../data/reviews';
import { localeFor, useT } from '../i18n';
import type { EventItem } from '../types';
import { Icon } from './Icon';

function Stars({ value }: { value: number }) {
  const { t } = useT();
  return (
    <span className="stars" role="img" aria-label={t('reviews.stars', { n: value })}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name={i <= Math.round(value) ? 'star-filled' : 'star'} size={16} />
      ))}
    </span>
  );
}

/** Reviews from people who attended, shown next to (and kept apart from) the rating on the source platform. */
export function Reviews({ event }: { event: EventItem }) {
  const { t, lang } = useT();
  const list = reviewsFor(event.id);
  const sum = summarizeReviews(list);
  const date = (iso: string) => new Intl.DateTimeFormat(localeFor(lang), { month: 'short', year: 'numeric', timeZone: 'America/Toronto' }).format(new Date(iso));

  return (
    <section aria-labelledby="rev-h" className="reviews">
      <h2 id="rev-h">{t('reviews.title')}</h2>
      <div className="rating-split">
        <div className="panel">
          <p className="muted small">{t('reviews.community')}</p>
          {sum.count ? (
            <>
              <p className="big-num">
                {sum.average.toFixed(1)} <Stars value={sum.average} />
              </p>
              <p className="muted small">{t('reviews.count', { n: sum.count })}</p>
              <ul className="dist" aria-hidden="true">
                {[5, 4, 3, 2, 1].map((n) => (
                  <li key={n}>
                    <span>{n}</span>
                    <span className="bar">
                      <span style={{ width: `${(sum.counts[n - 1] / sum.count) * 100}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>{t('reviews.none')}</p>
          )}
        </div>
        <div className="panel">
          <p className="muted small">{t('reviews.platform', { name: event.source.name })}</p>
          {event.source.rating !== undefined ? (
            <>
              <p className="big-num">
                {event.source.rating.toFixed(1)} <Stars value={event.source.rating} />
              </p>
              <p className="muted small">{t('common.reviews', { n: event.source.reviewCount ?? 0 })}</p>
            </>
          ) : (
            <p>{t('common.noRating')}</p>
          )}
        </div>
      </div>

      {list.length > 0 && (
        <ul className="review-list">
          {list.map((r) => (
            <li key={r.id} className="review">
              <div className="spread">
                <strong>{r.author}</strong>
                <span className="muted small">
                  {t('reviews.attended')} · {date(r.date)}
                </span>
              </div>
              <Stars value={r.rating} />
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
