import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatPanel } from '../components/ChatPanel';
import { Icon } from '../components/Icon';
import { AgentOrb } from '../components/Motion';
import { LANGUAGES, useT } from '../i18n';
import { useProfile } from '../state/profile';

/**
 * First visit. Maple talks with the person (typed, spoken or tapped), learns what they enjoy, and builds their picks.
 * Skipping shows all events. Answering even one question switches the site to recommended events.
 */
export function Welcome() {
  const { t } = useT();
  const { profile, update } = useProfile();
  const navigate = useNavigate();
  const [chatting, setChatting] = useState(profile.gate !== 'new');

  const skipAll = () => {
    if (profile.gate === 'new') update({ gate: 'skipped' });
    navigate('/');
  };

  return (
    <div className="welcome">
      <header className="welcome-head">
        <span className="row">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="sprout" size={22} />
          </span>
          <strong className="brand-name">{t('app.name')}</strong>
        </span>
        <button type="button" className="btn secondary" onClick={skipAll}>
          {t('agent.skipAll')}
        </button>
      </header>

      <main className="welcome-main" id="main" tabIndex={-1}>
        {!chatting ? (
          <section className="intro" aria-labelledby="gate-h">
            <div className="orb-stage" aria-hidden="true">
              <AgentOrb size={120} />
            </div>
            <h1 id="gate-h">{t('gate.title')}</h1>
            <p className="lead">{t('gate.sub')}</p>
            <div className="chips" role="radiogroup" aria-label={t('prof.language')} style={{ justifyContent: 'center' }}>
              {LANGUAGES.map((l) => (
                <button key={l.code} type="button" role="radio" aria-checked={profile.language === l.code} className="chip" lang={l.html} onClick={() => update({ language: l.code })}>
                  {l.native}
                </button>
              ))}
            </div>
            <div className="row center">
              <button type="button" className="btn big-btn" onClick={() => setChatting(true)}>
                <Icon name="sparkles" /> {t('gate.start')}
              </button>
              <button type="button" className="btn secondary big-btn" onClick={skipAll}>
                {t('gate.skip')}
              </button>
            </div>
            <p className="muted">{t('gate.later')}</p>
          </section>
        ) : (
          <section aria-label={t('chat.title')}>
            <ChatPanel mode="onboarding" onFinish={() => navigate('/for-you')} />
          </section>
        )}
      </main>
    </div>
  );
}
