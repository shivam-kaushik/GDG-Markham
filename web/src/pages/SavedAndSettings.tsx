import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { EVENTS } from '../data/events';
import { LANGUAGES, useT } from '../i18n';
import { useProfile } from '../state/profile';
import type { Lang, Profile } from '../types';

export function Saved() {
  const { t } = useT();
  const { profile } = useProfile();
  const saved = EVENTS.filter((e) => profile.saved.includes(e.id));
  const joined = EVENTS.filter((e) => profile.joined.includes(e.id));
  return (
    <div className="stack">
      <h1>{t('saved.title')}</h1>
      {saved.length === 0 ? (
        <p className="notice">{t('saved.empty')}</p>
      ) : (
        <ul className="grid">
          {saved.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </ul>
      )}
      {joined.length > 0 && (
        <section className="section">
          <h2>{t('saved.joined')}</h2>
          <ul className="grid">
            {joined.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function Settings() {
  const { t } = useT();
  const { profile, update, clearAnswers } = useProfile();
  const [deleted, setDeleted] = useState(false);
  const sizes: Profile['textSize'][] = ['normal', 'large', 'xlarge'];

  return (
    <div className="stack" style={{ maxWidth: '40rem' }}>
      <h1>{t('prof.title')}</h1>

      <section className="panel">
        <h2>{t('prof.display')}</h2>
        <p className="lbl">{t('prof.textSize')}</p>
        <div className="chips" role="radiogroup" aria-label={t('prof.textSize')}>
          {sizes.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={profile.textSize === s} className="chip" onClick={() => update({ textSize: s })}>
              {t(`prof.size.${s}`)}
            </button>
          ))}
        </div>
        <label className="check" style={{ marginBlockStart: '1rem' }}>
          <input type="checkbox" checked={profile.contrast} onChange={(e) => update({ contrast: e.target.checked })} />
          {t('prof.contrast')}
        </label>
        <label className="check">
          <input type="checkbox" checked={profile.reduceMotion} onChange={(e) => update({ reduceMotion: e.target.checked })} />
          {t('prof.motion')}
        </label>
        <p className="muted small">{t('prof.motionNote')}</p>
        <p className="lbl">{t('prof.language')}</p>
        <div className="chips" role="radiogroup" aria-label={t('prof.language')}>
          {LANGUAGES.map((l) => (
            <button key={l.code} type="button" role="radio" aria-checked={profile.language === l.code} className="chip" lang={l.html} onClick={() => update({ language: l.code as Lang })}>
              {l.native}
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack">
        <Link className="btn" to="/welcome">
          {t('prof.redo')}
        </Link>
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            clearAnswers();
            setDeleted(true);
          }}
        >
          {t('prof.delete')}
        </button>
        {deleted && <p role="status">{t('prof.deleted')}</p>}
        <p className="muted">{t('prof.privacy')}</p>
      </section>
    </div>
  );
}
