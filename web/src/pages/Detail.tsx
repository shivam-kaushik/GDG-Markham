import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AccessCard } from '../components/AccessCard';
import { AccessTiles } from '../components/AccessTiles';
import { SourceLine, WhyList } from '../components/bits';
import { Discussion } from '../components/Discussion';
import { Reviews } from '../components/Reviews';
import { languageNames } from '../components/EventCard';
import { Icon } from '../components/Icon';
import { getEvent } from '../data/events';
import { localeFor, useT } from '../i18n';
import { explain } from '../lib/agent';
import { formatPrice } from '../lib/format';
import { NOW } from '../lib/now';
import { HOST_PHOTO, photoFor } from '../lib/photos';
import { AREAS, scoreEvent, travelMinutes, trendScores } from '../lib/scoring';
import { isPersonalized, useProfile } from '../state/profile';

const TZ = 'America/Toronto';

export function Detail() {
  const { id } = useParams();
  const { t, lang } = useT();
  const { profile, toggleSaved, join } = useProfile();
  const e = id ? getEvent(id) : undefined;
  const [occ, setOcc] = useState(0);
  const [role, setRole] = useState<'participant' | 'volunteer'>('participant');

  if (!e) {
    return (
      <div className="stack">
        <p>{t('detail.notFound')}</p>
        <Link to="/">{t('detail.back')}</Link>
      </div>
    );
  }

  const loc = localeFor(lang);
  const dateFmt = new Intl.DateTimeFormat(loc, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: TZ });
  const timeFmt = new Intl.DateTimeFormat(loc, { hour: 'numeric', minute: '2-digit', timeZone: TZ });
  const short = (iso: string) => new Intl.DateTimeFormat(loc, { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZ }).format(new Date(iso));
  const price = formatPrice(e, lang);
  const trend = trendScores([e], NOW)[e.id];
  const scored = scoreEvent(e, profile, trend);
  const mins = travelMinutes(e, profile.homeArea, profile.travelMode);
  const joined = profile.joined.includes(e.id);
  const saved = profile.saved.includes(e.id);
  const area = AREAS[profile.homeArea]?.label ?? profile.homeArea;
  const maps = `https://www.openstreetmap.org/?mlat=${e.lat}&mlon=${e.lng}#map=17/${e.lat}/${e.lng}`;
  const current = e.occurrences?.[occ];
  const start = current?.start ?? e.start;
  const spots = e.spots ? { left: current?.spotsLeft ?? e.spots.left, total: e.spots.total } : undefined;
  const host = e.hostName ?? e.source.name;
  const initialsOf = (s: string) => s.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <article className="detail stack-lg">
      <div className="spread crumbs">
        <nav aria-label="Breadcrumb" className="row small">
          <Link to="/">{t('nav.explore')}</Link>
          <Icon name="chevron" size={14} />
          <span>{t(`cat.${e.category}`)}</span>
          <Icon name="chevron" size={14} />
          <span aria-current="page">{e.venue}</span>
        </nav>
        <div className="row">
          <button type="button" className="link-btn" aria-pressed={saved} onClick={() => toggleSaved(e.id)}>
            <Icon name={saved ? 'bookmark-filled' : 'bookmark'} /> {saved ? t('common.saved') : t('common.save')}
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => undefined)}
          >
            <Icon name="share" /> Share
          </button>
        </div>
      </div>

      <p className="notice row">
        <Icon name="info" size={16} /> {t('detail.demo')}
      </p>

      <header className="identity">
        <div className="row">
          <span className="status-badge">{t(`cat.${e.category}`)}</span>
          {e.series && <span className="status-badge">{e.series}</span>}
          <span className="muted small">{t('src.from', { name: e.source.name })}</span>
        </div>
        <h1>{e.title}</h1>
        <p className="lead">{e.summary}</p>
        <p className="byline">
          <span className="muted">{t('detail.hostedBy')}</span> <strong>{e.hostCollective ?? host}</strong>
          <span className="muted"> · </span>
          <Icon name="globe" size={16} /> {languageNames(e)}
        </p>
      </header>

      <div className="photo-reg">
        <figure className="big-photo">
          <img src={photoFor(e)} alt="" />
          {e.id === 'mending-circle' && (
            <figcaption>
              <Icon name="heart-hand" size={16} /> New faces. All skill levels. Always welcome.
            </figcaption>
          )}
        </figure>
        <div className="panel reg">
          <div className="spread">
            <p className="price">{price ?? t('common.free')}</p>
            {spots && <span className="status-badge ok">{t('detail.spots', { n: spots.left })}</span>}
          </div>
          {e.included && <p className="muted small">{e.included}</p>}
          <ul className="facts icons">
            <li>
              <Icon name="calendar" /> {dateFmt.format(new Date(start))}
            </li>
            <li>
              <Icon name="clock" /> {timeFmt.format(new Date(start))} – {timeFmt.format(new Date(e.end))}
            </li>
            <li>
              <Icon name="pin" /> {e.venue}
            </li>
          </ul>
          {e.volunteer && (
            <label className="role-select">
              <span className="small muted">{t('detail.role')}</span>
              <select value={role} onChange={(ev) => setRole(ev.target.value as 'participant' | 'volunteer')}>
                <option value="participant">{t('detail.role.participant')}</option>
                <option value="volunteer">{t('detail.role.volunteer')}</option>
              </select>
            </label>
          )}
          <button type="button" className="btn wide" onClick={() => join(e.id)} disabled={joined}>
            {joined ? `✓ ${t('detail.joined')}` : role === 'volunteer' ? t('detail.volunteer') : t('detail.join')} {!joined && <Icon name="arrow-right" />}
          </button>
          {spots && <p className="muted small center-text">{t('detail.reassure', { a: spots.total - spots.left, b: spots.total })}</p>}
          <a className="btn secondary wide" href={e.source.url} target="_blank" rel="noreferrer">
            {t('common.viewOn', { name: e.source.name })} <Icon name="arrow-up-right" />
          </a>
          <SourceLine event={e} long />
          <p className="muted small">{t('detail.sourceNote', { name: e.source.name })}</p>
        </div>
      </div>

      {isPersonalized(profile) && <WhyList reasons={explain(scored, profile)} />}

      <section className="expect" aria-labelledby="expect-h">
        <div className="spread">
          <div>
            <h2 id="expect-h">{t('detail.expect')}</h2>
            <p className="muted">{t('detail.expect.sub')}</p>
          </div>
          <span className="muted small row">
            <Icon name="check" size={16} /> {t('detail.updated', { when: short(e.source.lastSynced) })}
          </span>
        </div>
        <AccessTiles event={e} />
        <details className="all-access">
          <summary>{t('detail.allAccess')}</summary>
          <AccessCard event={e} />
        </details>
        <div className="spread">
          <span className="muted small">{t('ev.private')}</span>
          <a href="#conv-h" className="link-btn">
            {t('detail.askHost')} ↓
          </a>
        </div>
      </section>

      <div className="two-col">
        <div className="stack-lg">
          <section aria-labelledby="about-h">
            <h2 id="about-h">{t('detail.about')}</h2>
            <p>{e.summary}</p>
            {e.schedule && (
              <>
                <h3>{t('detail.schedule')}</h3>
                <ol className="schedule">
                  {e.schedule.map((s) => (
                    <li key={s.time}>
                      <span className="small muted">{s.time}</span>
                      <strong>{s.title}</strong>
                      <span className="muted">{s.desc}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <p className="row">
              <Icon name="heart-hand" size={18} /> <span>{t('detail.comfort.sub').split('.')[0]}.</span>
            </p>
          </section>

          {e.occurrences && (
            <section aria-labelledby="dates-h">
              <h2 id="dates-h">{t('detail.nextDate')}</h2>
              <ul className="occ">
                {e.occurrences.map((o, i) => {
                  const d = new Date(o.start);
                  const selected = i === occ;
                  return (
                    <li key={o.start} className={selected ? 'selected' : ''}>
                      <span className="date-tile" aria-hidden="true">
                        <span className="small">{new Intl.DateTimeFormat(loc, { month: 'short', timeZone: TZ }).format(d).toUpperCase()}</span>
                        <strong>{new Intl.DateTimeFormat(loc, { day: 'numeric', timeZone: TZ }).format(d)}</strong>
                      </span>
                      <span className="occ-info">
                        <strong>{dateFmt.format(d)}</strong>
                        <span className="muted small">
                          {timeFmt.format(d)} · {e.venue} · {t('detail.spots', { n: o.spotsLeft })}
                        </span>
                      </span>
                      <button type="button" className={selected ? 'status-badge ok' : 'link-btn'} aria-pressed={selected} onClick={() => setOcc(i)}>
                        {selected ? `✓ ${t('detail.selected')}` : t('detail.choose')}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {e.past && (
                <>
                  <h3>{t('detail.past')}</h3>
                  <ul className="past">
                    {e.past.map((p) => (
                      <li key={p.date} className="spread">
                        <span className="row">
                          <Icon name="check" size={16} /> {dateFmt.format(new Date(p.date))}
                        </span>
                        <span className="muted small">{t('detail.joinedN', { n: p.attended })}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          <Reviews event={e} />

          <Discussion event={e} />
        </div>

        <aside className="stack">
          <section className="panel" aria-labelledby="meet-h">
            <h2 id="meet-h" className="row">
              <Icon name="pin" /> {t('detail.meet')}
            </h2>
            <p>
              <strong>{e.venue}</strong>
              <br />
              {e.room && <span>{e.room}</span>}
              <br />
              <span className="muted">{e.address}</span>
            </p>
            <hr />
            {e.directions && <p className="small">{e.directions}</p>}
            <p className="small">
              {Number.isFinite(mins) ? t('detail.travel', { n: mins, mode: t(`mode.${profile.travelMode}`), area }) : t('map.noService')}
            </p>
            <ul className="facts small">
              <li>{t('detail.nearestStop', { stop: e.transit.stop, m: e.transit.walkMeters })}</li>
              <li>{t('detail.routes', { routes: e.transit.routes.join(', ') })}</li>
              <li>{t(`detail.parking.${e.parking}`)}</li>
            </ul>
            <a className="link-btn" href={maps} target="_blank" rel="noreferrer">
              {t('detail.directions')} <Icon name="arrow-up-right" size={16} />
            </a>
          </section>

          {e.volunteerRole && (
            <section className="panel soft" aria-labelledby="lend-h">
              <h2 id="lend-h" className="row">
                <Icon name="heart-hand" /> {t('detail.lend')}
              </h2>
              <div className="role-card">
                <strong>{e.volunteerRole.title}</strong>
                <p className="small">{e.volunteerRole.shift}</p>
                <p className="small muted">{e.volunteerRole.tasks}</p>
              </div>
              <p className="small row">
                <Icon name="users" size={16} /> {t('detail.helperSpots', { a: e.volunteerRole.open, b: e.volunteerRole.total })}
              </p>
              <button
                type="button"
                className="btn secondary wide"
                onClick={() => {
                  setRole('volunteer');
                  join(e.id);
                }}
                disabled={joined}
              >
                {t('detail.volunteer')} <Icon name="arrow-right" />
              </button>
            </section>
          )}

          <section className="panel" aria-labelledby="host-h">
            <h2 id="host-h">{t('detail.meetHost')}</h2>
            <div className="row">
              {e.hostName ? <img className="host-photo" src={HOST_PHOTO} alt="" /> : <span className="avatar host">{initialsOf(host)}</span>}
              <div>
                <strong>{host}</strong>
                <br />
                <span className="status-badge">
                  <Icon name="check" size={13} /> {t('detail.eventHost')}
                </span>
              </div>
            </div>
            <p className="small">
              <strong>{e.hostCollective ?? e.source.name}</strong>
              <br />
              {e.hostBlurb}
            </p>
            <p className="small muted">{languageNames(e)}</p>
            <a href="#conv-h" className="btn secondary wide">
              {t('detail.message')} <Icon name="message" />
            </a>
          </section>

          {e.hostQuote && (
            <section className="panel soft">
              <p className="small muted row">
                <Icon name="message" size={16} /> {t('detail.noteFrom', { name: host.split(' ')[0] })}
              </p>
              <blockquote className="quote">“{e.hostQuote}”</blockquote>
            </section>
          )}

          <section className="panel">
            <Icon name="heart-hand" size={26} />
            <h2>{t('detail.comfort')}</h2>
            <p className="small">{t('detail.comfort.sub')}</p>
            <a className="link-btn" href="#conv-h">
              {t('detail.private')} <Icon name="arrow-right" size={16} />
            </a>
          </section>

          <p className="center-text small muted">
            <Icon name="flag" size={14} /> {t('detail.report')}
          </p>
        </aside>
      </div>
    </article>
  );
}
