import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { AgentOrb } from '../components/Motion';
import { useT } from '../i18n';
import type { Key } from '../i18n/en';

type Level = 'yes' | 'partial' | 'no';

/**
 * Feature comparison. The other columns describe each kind of service in general terms and are deliberately cautious:
 * we have not audited any specific product, and the page says so.
 */
const ROWS: { label: Key; us: Level; ticketing: Level; city: Level; social: Level }[] = [
  { label: 'about.f1', us: 'yes', ticketing: 'partial', city: 'no', social: 'partial' },
  { label: 'about.f2', us: 'yes', ticketing: 'partial', city: 'no', social: 'no' },
  { label: 'about.f3', us: 'yes', ticketing: 'no', city: 'no', social: 'no' },
  { label: 'about.f4', us: 'yes', ticketing: 'no', city: 'partial', social: 'no' },
  { label: 'about.f5', us: 'yes', ticketing: 'partial', city: 'partial', social: 'partial' },
  { label: 'about.f6', us: 'yes', ticketing: 'no', city: 'no', social: 'no' },
  { label: 'about.f7', us: 'yes', ticketing: 'no', city: 'partial', social: 'no' },
  { label: 'about.f8', us: 'yes', ticketing: 'partial', city: 'no', social: 'partial' },
  { label: 'about.f9', us: 'yes', ticketing: 'partial', city: 'no', social: 'yes' },
  { label: 'about.f10', us: 'yes', ticketing: 'no', city: 'partial', social: 'no' },
];

const HOW: { icon: IconName; t: Key; b: Key }[] = [
  { icon: 'globe', t: 'about.how1.t', b: 'about.how1.b' },
  { icon: 'check', t: 'about.how2.t', b: 'about.how2.b' },
  { icon: 'message', t: 'about.how3.t', b: 'about.how3.b' },
  { icon: 'bus', t: 'about.how4.t', b: 'about.how4.b' },
  { icon: 'sparkles', t: 'about.how5.t', b: 'about.how5.b' },
  { icon: 'users', t: 'about.how6.t', b: 'about.how6.b' },
];

const WHO: Key[] = ['about.who1', 'about.who2', 'about.who3', 'about.who4', 'about.who5'];
const PROMISES: Key[] = ['about.promise1', 'about.promise2', 'about.promise3'];

function Cell({ level }: { level: Level }) {
  const { t } = useT();
  const mark = level === 'yes' ? '✓' : level === 'partial' ? '~' : '–';
  const label = level === 'yes' ? t('about.yes') : level === 'partial' ? t('about.partial') : t('about.no');
  return (
    <td>
      <span className={`cmp ${level}`}>
        <span aria-hidden="true">{mark}</span> {label}
      </span>
    </td>
  );
}

export function About() {
  const { t } = useT();
  return (
    <div className="stack-lg about">
      <section className="hero about-hero" aria-labelledby="about-h">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="sprout" size={16} /> {t('app.name')}
          </p>
          <h1 id="about-h">{t('about.title')}</h1>
          <p className="lead">{t('about.lead')}</p>
          <div className="row">
            <Link className="btn big-btn" to="/welcome">
              <Icon name="sparkles" /> {t('about.cta1')}
            </Link>
            <Link className="btn secondary big-btn" to="/">
              {t('about.cta2')}
            </Link>
          </div>
        </div>
        <div className="about-orb" aria-hidden="true">
          <AgentOrb size={160} />
        </div>
      </section>

      <section aria-labelledby="problem-h" className="problem">
        <h2 id="problem-h">{t('about.problem.title')}</h2>
        <p className="lead">{t('about.problem.body')}</p>
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">{t('about.how.title')}</h2>
        <ul className="how-grid">
          {HOW.map((h) => (
            <li key={h.t} className="how-card">
              <span className="how-icon" aria-hidden="true">
                <Icon name={h.icon} size={22} />
              </span>
              <h3>{t(h.t)}</h3>
              <p>{t(h.b)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="who-h">
        <h2 id="who-h">{t('about.who.title')}</h2>
        <ul className="who-list">
          {WHO.map((k) => (
            <li key={k}>
              <Icon name="check" size={18} /> <span>{t(k)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cmp-h">
        <h2 id="cmp-h">{t('about.compare.title')}</h2>
        <p className="muted small">{t('about.compare.note')}</p>
        <div className="table-wrap">
          <table className="cmp-table">
            <caption className="sr-only">{t('about.compare.title')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('about.compare.feature')}</th>
                <th scope="col" className="us">
                  {t('about.compare.us')}
                </th>
                <th scope="col">{t('about.compare.ticketing')}</th>
                <th scope="col">{t('about.compare.city')}</th>
                <th scope="col">{t('about.compare.social')}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{t(r.label)}</th>
                  <Cell level={r.us} />
                  <Cell level={r.ticketing} />
                  <Cell level={r.city} />
                  <Cell level={r.social} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="promise-h" className="promises">
        <h2 id="promise-h">{t('about.promise.title')}</h2>
        <ul>
          {PROMISES.map((k) => (
            <li key={k}>{t(k)}</li>
          ))}
        </ul>
      </section>

      <p className="notice">
        <Icon name="info" size={16} /> {t('about.proto')}
      </p>
    </div>
  );
}
