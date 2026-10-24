import { useState } from 'react';
import { Icon } from '../components/Icon';
import { useT } from '../i18n';
import type { AccessAttr } from '../types';

type Answer = 'yes' | 'no' | 'unsure';
const QUESTIONS: AccessAttr[] = ['stepFree', 'accessibleWashroom', 'seating', 'lowNoise', 'noFlashing', 'quietSpace', 'largePrint', 'interpreter'];

/**
 * Hosting mode (prototype). Mirrors the AI gap checker from the plan: it lists the access details
 * neighbours most often ask about that the host has not confirmed yet.
 */
export function Host() {
  const { t } = useT();
  const [name, setName] = useState('');
  const [when, setWhen] = useState('');
  const [venue, setVenue] = useState('');
  const [free, setFree] = useState(true);
  const [answers, setAnswers] = useState<Partial<Record<AccessAttr, Answer>>>({});
  const [saved, setSaved] = useState(false);

  const gaps = QUESTIONS.filter((q) => !answers[q] || answers[q] === 'unsure');

  return (
    <div className="stack-lg">
      <header className="page-head">
        <p className="status-badge">{t('host.intro')}</p>
        <h1>{t('host.title')}</h1>
        <p className="lead">{t('host.sub')}</p>
      </header>

      <div className="two-col">
        <form
          className="panel stack"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <label className="lbl" htmlFor="h-name">
            {t('host.name')}
          </label>
          <input id="h-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="lbl" htmlFor="h-date">
            {t('host.date')}
          </label>
          <input id="h-date" className="field" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          <label className="lbl" htmlFor="h-venue">
            {t('host.venue')}
          </label>
          <input id="h-venue" className="field" value={venue} onChange={(e) => setVenue(e.target.value)} />
          <label className="check">
            <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} />
            {t('host.free')}
          </label>

          <h2>{t('host.ask')}</h2>
          {QUESTIONS.map((q) => (
            <div className="need-row" key={q} role="group" aria-label={t(`access.${q}`)}>
              <span>{t(`access.${q}`)}</span>
              <div className="tri">
                {(['yes', 'no', 'unsure'] as Answer[]).map((a) => (
                  <button key={a} type="button" aria-pressed={answers[q] === a} onClick={() => setAnswers({ ...answers, [q]: a })}>
                    {a === 'yes' ? t('common.yes') : a === 'no' ? t('common.no') : t('host.notSure')}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="btn">
            {t('host.save')}
          </button>
          {saved && <p role="status">{t('host.saved')}</p>}
        </form>

        <aside className="stack">
          <section className="ai-box">
            <p className="row">
              <Icon name="sparkles" /> <strong>{t('host.gap')}</strong>
            </p>
            {gaps.length === 0 ? (
              <p>{t('host.gapNone')}</p>
            ) : (
              <ul>
                {gaps.map((g) => (
                  <li key={g}>{t(`access.${g}`)}</li>
                ))}
              </ul>
            )}
          </section>
          <section className="panel">
            <h2>{t('host.preview')}</h2>
            <p>
              <strong>{name || t('host.name')}</strong>
            </p>
            <p className="muted">{when ? new Date(when).toLocaleString() : t('host.date')}</p>
            <p className="muted">{venue || t('host.venue')}</p>
            <p>{free ? t('common.free') : '$'}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
