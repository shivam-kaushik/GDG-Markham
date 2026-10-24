import { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LANGUAGES, useT } from '../i18n';
import { useProfile } from '../state/profile';
import type { Lang, Profile } from '../types';
import { AgentDock } from './AgentDock';
import { Icon } from './Icon';

const SIZES: Profile['textSize'][] = ['normal', 'large', 'xlarge'];

/** Applies language direction, text size and contrast to the document. Shared by every page, including the welcome flow. */
export function useDocumentSettings() {
  const { lang } = useT();
  const { profile } = useProfile();
  useEffect(() => {
    const meta = LANGUAGES.find((l) => l.code === lang)!;
    const root = document.documentElement;
    root.lang = meta.html;
    root.dir = meta.dir;
    root.dataset.size = profile.textSize;
    root.dataset.contrast = profile.contrast ? 'high' : 'normal';
    root.dataset.motion = profile.reduceMotion ? 'reduce' : 'full';
  }, [lang, profile.textSize, profile.contrast, profile.reduceMotion]);
}

export function Layout() {
  const { t, lang } = useT();
  const { profile, update } = useProfile();
  const navigate = useNavigate();
  useDocumentSettings();

  const step = (dir: 1 | -1) => {
    const i = SIZES.indexOf(profile.textSize);
    update({ textSize: SIZES[Math.min(SIZES.length - 1, Math.max(0, i + dir))] });
  };

  const setMode = (mode: Profile['mode']) => {
    update({ mode });
    navigate(mode === 'hosting' ? '/host' : '/');
  };

  return (
    <>
      <a className="skip" href="#main">
        {t('nav.skip')}
      </a>
      <header className="site-header">
        <div className="wrap bar">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Icon name="pin" size={20} />
            </span>
            <span className="brand-name">{t('app.name')}</span>
          </Link>
          <nav className="nav" aria-label="Main">
            <NavLink to="/" end>
              {t('nav.explore')}
            </NavLink>
            <NavLink to="/for-you">{t('nav.foryou')}</NavLink>
            <NavLink to="/community">{t('nav.community')}</NavLink>
            <NavLink to="/map">{t('nav.map')}</NavLink>
            <NavLink to="/saved">{t('nav.saved')}</NavLink>
            <NavLink to="/mission">{t('nav.mission')}</NavLink>
            <NavLink to="/about">{t('nav.about')}</NavLink>
          </nav>
          <div className="tools">
            <div className="mode" role="group" aria-label="Mode">
              <button type="button" aria-pressed={profile.mode === 'participating'} onClick={() => setMode('participating')}>
                {t('mode.participating')}
              </button>
              <button type="button" aria-pressed={profile.mode === 'hosting'} onClick={() => setMode('hosting')}>
                {t('mode.hosting')}
              </button>
            </div>
            <label className="lang-select">
              <Icon name="globe" size={18} />
              <span className="sr-only">{t('prof.language')}</span>
              <select value={lang} onChange={(e) => update({ language: e.target.value as Lang })}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} lang={l.html}>
                    {l.native}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="icon-btn text" onClick={() => step(-1)} aria-label={`${t('prof.textSize')} −`}>
              A−
            </button>
            <button type="button" className="icon-btn text" onClick={() => step(1)} aria-label={`${t('prof.textSize')} +`}>
              A+
            </button>
            <Link to="/settings" className="avatar-link" aria-label={t('nav.profile')}>
              JD
            </Link>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <div className="wrap">
          <Outlet />
        </div>
      </main>
      <footer className="site-footer">
        <div className="wrap spread">
          <span className="row">
            <Icon name="sprout" size={20} /> <strong>{t('app.name')}</strong>
            <span className="muted">{t('app.tagline')}</span>
          </span>
          <span className="muted small">
            <Link to="/mission">{t('nav.mission')}</Link> · <Link to="/about">{t('nav.about')}</Link> · {t('footer.note')}
          </span>
        </div>
      </footer>
      <AgentDock />
    </>
  );
}
