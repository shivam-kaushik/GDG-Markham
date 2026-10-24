import type { Reason } from '../lib/agent';
import { formatSynced } from '../lib/format';
import { useT } from '../i18n';
import type { Evidence, EventItem } from '../types';

/** Evidence tag. Always an icon plus a word, never colour alone. */
export function EvidenceTag({ evidence, present = true }: { evidence: Evidence; present?: boolean }) {
  const { t } = useT();
  if (evidence === 'unknown') return <span className="tag warn">? {t('ev.unknown')}</span>;
  if (!present) return <span className="tag">✕ {t('ev.absent')}</span>;
  if (evidence === 'confirmed') return <span className="tag ok">✓ {t('ev.confirmed')}</span>;
  return <span className="tag warn">~ {t('ev.estimated')}</span>;
}

export function SourceLine({ event, long = false }: { event: EventItem; long?: boolean }) {
  const { t, lang } = useT();
  const s = event.source;
  return (
    <p className="source muted" style={{ margin: 0 }}>
      <strong>{t('src.from', { name: s.name })}</strong>
      {' · '}
      {s.rating !== undefined ? (
        <span aria-label={`${s.rating} / 5, ${t('common.reviews', { n: s.reviewCount ?? 0 })}`}>
          ★ {s.rating.toFixed(1)} ({t('common.reviews', { n: s.reviewCount ?? 0 })})
        </span>
      ) : (
        <span>{t('common.noRating')}</span>
      )}
      {long && (
        <>
          {' · '}
          {t('src.synced', { when: formatSynced(s.lastSynced, lang) })}
        </>
      )}
    </p>
  );
}

export function WhyList({ reasons }: { reasons: Reason[] }) {
  const { t } = useT();
  if (reasons.length === 0) return null;
  const text = (r: Reason): string => {
    switch (r.kind) {
      case 'interest':
        return t('why.interest', { cat: t(`cat.${r.category}`) });
      case 'free':
        return t('why.free');
      case 'travel':
        return t('why.travel', { n: r.minutes, mode: t(`mode.${r.mode}`) });
      case 'access':
        return t('why.access', { attr: t(`access.${r.attr}`) });
      case 'askHost':
        return t('why.askHost', { attrs: r.attrs.map((a) => t(`access.${a}`)).join(', ') });
      case 'language':
        return t('why.language');
    }
  };
  return (
    <div className="why">
      <strong>{t('home.why')}</strong>
      <ul>
        {reasons.map((r, i) => (
          <li key={i}>{text(r)}</li>
        ))}
      </ul>
    </div>
  );
}
