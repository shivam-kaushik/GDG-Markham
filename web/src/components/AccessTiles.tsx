import { useT } from '../i18n';
import type { AccessAttr, AccessInfo, EventItem } from '../types';
import { EvidenceTag } from './bits';

interface Tile {
  key: 'accessibility' | 'noise' | 'crowd' | 'seating' | 'flashing' | 'quiet';
  attrs: AccessAttr[];
}

/** The six headline questions from the Figma "What to expect" grid. */
export const TILES: Tile[] = [
  { key: 'accessibility', attrs: ['stepFree', 'accessibleWashroom'] },
  { key: 'noise', attrs: ['lowNoise'] },
  { key: 'crowd', attrs: ['lowCrowd'] },
  { key: 'seating', attrs: ['seating'] },
  { key: 'flashing', attrs: ['noFlashing'] },
  { key: 'quiet', attrs: ['quietSpace'] },
];

export function tileState(e: EventItem, attrs: AccessAttr[]) {
  const infos = attrs.map((a) => ({ attr: a, info: e.access[a] as AccessInfo | undefined }));
  const known = infos.filter((x) => x.info && x.info.evidence !== 'unknown');
  const evidence = known.length === 0 ? 'unknown' : known.some((x) => x.info!.evidence === 'estimated') ? 'estimated' : 'confirmed';
  const note = known.find((x) => x.info?.note)?.info?.note;
  return { known, evidence: evidence as 'unknown' | 'estimated' | 'confirmed', note };
}

export function AccessTiles({ event }: { event: EventItem }) {
  const { t } = useT();
  return (
    <ul className="tiles">
      {TILES.map(({ key, attrs }) => {
        const { known, evidence, note } = tileState(event, attrs);
        const allPresent = known.length > 0 && known.every((x) => x.info!.present);
        const headline =
          known.length === 0
            ? t('tile.unknown')
            : known.map((x) => (x.info!.present ? t(`access.${x.attr}`) : t('tile.absent', { attr: t(`access.${x.attr}`) }))).join(', ');
        return (
          <li className="tile" key={key}>
            <div className="spread">
              <h3>{t(`tile.${key}`)}</h3>
              <EvidenceTag evidence={evidence} present={known.length === 0 ? true : allPresent} />
            </div>
            <p className="tile-head">{headline}</p>
            {note && <p className="muted small">{note}</p>}
          </li>
        );
      })}
    </ul>
  );
}
