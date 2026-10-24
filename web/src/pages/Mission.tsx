import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AI_NOT, AI_NOT_YET, AI_USES, GAPS, PILOT_MEASURES, STATS, TRUST, UNVERIFIED } from '../data/mission';
import { useT } from '../i18n';

export function Mission() {
  const { t } = useT();
  return (
    <div className="stack-lg mission">
      <section className="hero about-hero" aria-labelledby="mission-h">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="heart-hand" size={16} /> {t('app.name')}
          </p>
          <h1 id="mission-h">{t('mission.title')}</h1>
          <p className="lead">{t('mission.lead')}</p>
          <div className="row">
            <Link className="btn big-btn" to="/welcome">
              <Icon name="sparkles" /> {t('about.cta1')}
            </Link>
            <Link className="btn secondary big-btn" to="/about">
              {t('nav.about')}
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="problem-h">
        <h2 id="problem-h">{t('mission.problem.title')}</h2>
        <p className="lead">{t('mission.problem.body')}</p>
        {STATS.map((g) => (
          <div key={g.group} className="stat-group">
            <h3>{g.group}</h3>
            <ul className="stat-grid">
              {g.items.map((s) => (
                <li key={s.value + s.label} className="stat-card">
                  <strong className="stat-value">{s.value}</strong>
                  <span>{s.label}</span>
                  <span className="muted small">{s.where}</span>
                  <a className="small" href={s.url} target="_blank" rel="noreferrer noopener">
                    {s.source} <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="notice">
          <Icon name="info" size={16} /> {t('mission.sowhat')}
        </p>
      </section>

      <section aria-labelledby="gaps-h">
        <h2 id="gaps-h">{t('mission.gaps.title')}</h2>
        <p className="muted small">{t('about.compare.note')}</p>
        <div className="table-wrap">
          <table className="cmp-table">
            <caption className="sr-only">{t('mission.gaps.title')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('about.compare.feature')}</th>
                <th scope="col">{t('mission.gaps.today')}</th>
                <th scope="col" className="us">
                  {t('about.compare.us')}
                </th>
              </tr>
            </thead>
            <tbody>
              {GAPS.map((g) => (
                <tr key={g.gap}>
                  <th scope="row">{g.gap}</th>
                  <td>{g.today}</td>
                  <td>{g.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="ai-h">
        <h2 id="ai-h">{t('mission.ai.title')}</h2>
        <p className="lead">{t('mission.ai.lead')}</p>
        <div className="table-wrap">
          <table className="cmp-table">
            <caption className="sr-only">{t('mission.ai.title')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('mission.ai.what')}</th>
                <th scope="col">{t('mission.ai.how')}</th>
                <th scope="col">{t('mission.ai.why')}</th>
              </tr>
            </thead>
            <tbody>
              {AI_USES.map((u) => (
                <tr key={u.what}>
                  <th scope="row">
                    {u.what}
                    <br />
                    <span className={`cmp ${u.real === 'ai' ? 'yes' : 'partial'}`}>
                      {u.real === 'ai' ? t('mission.ai.tagAi') : t('mission.ai.tagRules')}
                    </span>
                  </th>
                  <td>{u.how}</td>
                  <td>{u.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>{t('mission.ai.not.title')}</h3>
        <ul className="who-list">
          {AI_NOT.map((x) => (
            <li key={x.what}>
              <Icon name="check" size={18} />{' '}
              <span>
                <strong>{x.what}.</strong> {x.why}
              </span>
            </li>
          ))}
        </ul>
        <h3>{t('mission.ai.notyet.title')}</h3>
        <ul className="promises-list">
          {AI_NOT_YET.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="trust-h">
        <h2 id="trust-h">{t('mission.trust.title')}</h2>
        <ul className="how-grid">
          {TRUST.map((x) => (
            <li key={x.title} className="how-card">
              <span className="how-icon" aria-hidden="true">
                <Icon name="check" size={22} />
              </span>
              <h3>{x.title}</h3>
              <p>{x.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="feasible-h">
        <h2 id="feasible-h">{t('mission.feasible.title')}</h2>
        <ul className="who-list">
          <li>
            <Icon name="check" size={18} /> <span>{t('mission.feasible1')}</span>
          </li>
          <li>
            <Icon name="check" size={18} /> <span>{t('mission.feasible2')}</span>
          </li>
          <li>
            <Icon name="check" size={18} /> <span>{t('mission.feasible3')}</span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="unv-h" className="promises">
        <h2 id="unv-h">{t('mission.unverified.title')}</h2>
        <p className="muted">{t('mission.unverified.lead')}</p>
        <ul>
          {UNVERIFIED.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pilot-h" className="promises">
        <h2 id="pilot-h">{t('mission.pilot.title')}</h2>
        <p className="muted">{t('mission.pilot.lead')}</p>
        <ul>
          {PILOT_MEASURES.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>

      <p className="notice">
        <Icon name="info" size={16} /> {t('about.proto')}
      </p>
    </div>
  );
}
