import { useT } from '../i18n';
import { ACCESS_CATEGORIES, ACCESS_GROUPS } from '../lib/access';
import type { EventItem } from '../types';
import { EvidenceTag } from './bits';

/** Every attribute grouped by the kind of need, each with its evidence state. Missing data is Unknown, never "No". */
export function AccessCard({ event }: { event: EventItem }) {
  const { t } = useT();
  return (
    <div className="access-all">
      {ACCESS_CATEGORIES.map((cat) => (
        <div className="access-group" key={cat}>
          <h4>{t(`accessCat.${cat}`)}</h4>
          <ul className="access-list">
            {ACCESS_GROUPS[cat].map((a) => {
              const info = event.access[a];
              const evidence = info?.evidence ?? 'unknown';
              return (
                <li className="access-item" key={a}>
                  <div className="top">
                    <strong>
                      {info && info.evidence !== 'unknown' ? (info.present ? '✓ ' : '✕ ') : ''}
                      {t(`access.${a}`)}
                    </strong>
                    <EvidenceTag evidence={evidence} present={info?.present ?? false} />
                  </div>
                  {info?.note && <blockquote>{info.note}</blockquote>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <p className="muted">{t('ev.help')}</p>
    </div>
  );
}
