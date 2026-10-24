import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { Icon } from '../components/Icon';
import { AgentOrb } from '../components/Motion';
import { EVENTS } from '../data/events';
import { useT } from '../i18n';
import { recommend, transitFriendly, trending } from '../lib/agent';
import { NOW } from '../lib/now';
import { isPersonalized, useProfile } from '../state/profile';

/** Recommended events. Only available once someone has answered at least one of Maple's questions. */
export function ForYou() {
  const { t } = useT();
  const { profile } = useProfile();

  if (!isPersonalized(profile)) {
    return (
      <section className="locked">
        <AgentOrb size={96} />
        <h1>{t('foryou.title')}</h1>
        <p className="lead">{t('foryou.locked')}</p>
        <div className="row center">
          <Link className="btn big-btn" to="/welcome">
            <Icon name="sparkles" /> {t('gate.start')}
          </Link>
          <Link className="btn secondary big-btn" to="/">
            {t('gate.skip')}
          </Link>
        </div>
      </section>
    );
  }

  const picks = recommend(EVENTS, profile, NOW, 6);
  const shown = new Set(picks.map((p) => p.event.id));
  const hot = trending(EVENTS, NOW, 20).filter((e) => !shown.has(e.id)).slice(0, 3);
  hot.forEach((e) => shown.add(e.id));
  const noCar = transitFriendly(EVENTS, profile, NOW, 20).filter((s) => !shown.has(s.event.id)).slice(0, 3);

  return (
    <div className="stack-lg">
      <header className="page-head spread">
        <div>
          <h1>{t('foryou.title')}</h1>
          <p className="lead">{t('foryou.sub')}</p>
        </div>
        <Link className="btn secondary" to="/welcome">
          {t('foryou.edit')}
        </Link>
      </header>

      {picks.length === 0 ? (
        <p className="notice">{t('events.none')}</p>
      ) : (
        <ul className="grid">
          {picks.map((p) => (
            <EventCard key={p.event.id} event={p.event} reasons={p.reasons} score={p.score} />
          ))}
        </ul>
      )}
      <p className="muted">{t('home.agentNote')}</p>

      {hot.length > 0 && (
        <section>
          <h2>{t('home.trending')}</h2>
          <ul className="grid">
            {hot.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </ul>
        </section>
      )}

      {noCar.length > 0 && (
        <section>
          <h2>{t('home.transit')}</h2>
          <ul className="grid">
            {noCar.map((s) => (
              <EventCard key={s.event.id} event={s.event} mode="transit" />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
