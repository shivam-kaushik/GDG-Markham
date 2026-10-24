import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { EventMap } from '../components/EventMap';
import { Icon } from '../components/Icon';
import { Tilt } from '../components/Motion';
import { EVENTS } from '../data/events';
import { LANGUAGES, useT } from '../i18n';
import { upcoming } from '../lib/agent';
import { ACCESS_CATEGORIES, ACCESS_GROUPS } from '../lib/access';
import { NOW } from '../lib/now';
import { HERO_PHOTO } from '../lib/photos';
import { AREAS, scoreEvent, travelMinutes, trendScores } from '../lib/scoring';
import { isPersonalized, useProfile } from '../state/profile';
import type { AccessAttr, Category, Lang, SourceName } from '../types';

type Sort = 'soonest' | 'match' | 'trending' | 'rating' | 'distance';
const SOURCES: SourceName[] = ['Eventbrite', 'Luma', 'City of Markham', 'Markham Public Library', 'TodoMarkham'];
const PILLS: Category[] = ['community', 'arts', 'outdoors', 'learning', 'family', 'volunteering', 'music'];

/** Explore page laid out like the Figma file: mint hero with search, filter rail, category pills, photo cards. */
export function Explore() {
  const { t } = useT();
  const { profile } = useProfile();
  const personal = isPersonalized(profile);

  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [when, setWhen] = useState<'any' | 'week' | 'weekend'>('any');
  const [freeOnly, setFreeOnly] = useState(false);
  const [language, setLanguage] = useState<Lang | 'any'>('any');
  const [sources, setSources] = useState<SourceName[]>([]);
  const [volunteer, setVolunteer] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [transitOnly, setTransitOnly] = useState(false);
  const [needs, setNeeds] = useState<AccessAttr[]>([]);
  const [newcomer, setNewcomer] = useState(false);
  const [sort, setSort] = useState<Sort>('soonest');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [railOpen, setRailOpen] = useState(false);

  const results = useMemo(() => {
    const pool = upcoming(EVENTS, NOW);
    const trend = trendScores(pool, NOW);
    const q = text.trim().toLowerCase();
    const weekEnd = NOW.getTime() + 7 * 864e5;
    const filtered = pool.filter((e) => {
      if (q && !`${e.title} ${e.summary} ${e.venue} ${e.audience}`.toLowerCase().includes(q)) return false;
      if (category !== 'all' && e.category !== category) return false;
      if (when === 'week' && new Date(e.start).getTime() > weekEnd) return false;
      if (when === 'weekend' && ![0, 6].includes(new Date(e.start).getDay())) return false;
      if (freeOnly && !e.free) return false;
      if (language !== 'any' && !e.languages.includes(language)) return false;
      if (sources.length && !sources.includes(e.source.name)) return false;
      if (volunteer && !e.volunteer) return false;
      if (minRating && (e.source.rating ?? 0) < minRating) return false;
      if (transitOnly && !(e.transit.serviceAtStart && e.transit.walkMeters <= 650)) return false;
      if (newcomer && !/newcomer|all ages|everyone/i.test(`${e.audience} ${e.title} ${e.summary}`)) return false;
      if (needs.some((a) => !e.access[a]?.present || e.access[a]?.evidence === 'unknown')) return false;
      return true;
    });
    const by: Record<Sort, (a: (typeof filtered)[0], b: (typeof filtered)[0]) => number> = {
      soonest: (a, b) => +new Date(a.start) - +new Date(b.start),
      match: (a, b) => scoreEvent(b, profile, trend[b.id]).score - scoreEvent(a, profile, trend[a.id]).score,
      trending: (a, b) => trend[b.id] - trend[a.id],
      rating: (a, b) => (b.source.rating ?? 0) - (a.source.rating ?? 0),
      distance: (a, b) => travelMinutes(a, profile.homeArea, 'car') - travelMinutes(b, profile.homeArea, 'car'),
    };
    return [...filtered].sort(by[sort]);
  }, [text, category, when, freeOnly, language, sources, volunteer, minRating, transitOnly, newcomer, needs, sort, profile]);

  const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const clear = () => {
    setText('');
    setCategory('all');
    setWhen('any');
    setFreeOnly(false);
    setLanguage('any');
    setSources([]);
    setVolunteer(false);
    setMinRating(0);
    setTransitOnly(false);
    setNewcomer(false);
    setNeeds([]);
  };

  return (
    <div className="stack-lg">
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="pin" size={16} /> {t('explore.eyebrow')}
          </p>
          <h1 id="hero-h">{t('explore.headline')}</h1>
          <p className="lead">{t('explore.sub')}</p>
          <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" size={22} />
            <label className="sr-only" htmlFor="q">
              {t('explore.searchBtn')}
            </label>
            <input id="q" type="search" placeholder={t('events.search.placeholder')} value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" className="btn">
              {t('explore.searchBtn')}
            </button>
          </form>
          <div className="chips quick">
            <span className="muted small">{t('explore.start')}</span>
            <button type="button" className="chip soft" aria-pressed={when === 'weekend'} onClick={() => setWhen(when === 'weekend' ? 'any' : 'weekend')}>
              {t('explore.chip.weekend')}
            </button>
            <button type="button" className="chip soft" aria-pressed={freeOnly} onClick={() => setFreeOnly(!freeOnly)}>
              {t('explore.chip.free')}
            </button>
            <button type="button" className="chip soft" aria-pressed={newcomer} onClick={() => setNewcomer(!newcomer)}>
              {t('explore.chip.newcomer')}
            </button>
          </div>
        </div>
        <Tilt className="hero-3d" max={9}>
          <div className="stack3d">
            <img className="layer base" src={HERO_PHOTO} alt="" />
            <span className="layer float f1">
              <Icon name="check" size={16} /> {t('ev.confirmed')}
            </span>
            <span className="layer float f2">★ 4.8 Eventbrite</span>
            <span className="layer float f3">
              <Icon name="bus" size={16} /> {t('common.min', { n: 12 })}
            </span>
          </div>
        </Tilt>
      </section>

      {!personal && (
        <aside className="banner" aria-label={t('explore.banner')}>
          <span className="row">
            <Icon name="sparkles" /> <strong>{t('explore.banner')}</strong>
          </span>
          <Link className="btn" to="/welcome">
            {t('agent.chip.personalize')}
          </Link>
        </aside>
      )}

      <div className="explore-grid">
        <aside className={`rail ${railOpen ? 'open' : ''}`} aria-label={t('events.filters')}>
          <button type="button" className="rail-toggle" aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}>
            <Icon name="sliders" /> {t('explore.rail')} <Icon name="chevron" size={16} />
          </button>
          <div className="rail-body">
            <h2 className="rail-title">
              <Icon name="sliders" /> {t('explore.rail')}
            </h2>
            <div className="panel">
              <fieldset>
                <legend>{t('events.when')}</legend>
                <select value={when} onChange={(e) => setWhen(e.target.value as 'any' | 'week' | 'weekend')} aria-label={t('events.when')}>
                  <option value="any">{t('events.when.any')}</option>
                  <option value="week">{t('events.when.week')}</option>
                  <option value="weekend">{t('events.when.weekend')}</option>
                </select>
              </fieldset>
              <fieldset>
                <legend>{t('events.cost')}</legend>
                <label className="check">
                  <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} />
                  {t('events.cost.free')}
                </label>
              </fieldset>
              <fieldset>
                <legend>{t('events.language')}</legend>
                <select value={language} onChange={(e) => setLanguage(e.target.value as Lang | 'any')} aria-label={t('events.language')}>
                  <option value="any">{t('common.any')}</option>
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset>
                <legend>{t('events.source')}</legend>
                {SOURCES.map((s) => (
                  <label className="check" key={s}>
                    <input type="checkbox" checked={sources.includes(s)} onChange={() => setSources(toggle(sources, s))} />
                    {s}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>{t('events.minRating')}</legend>
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} aria-label={t('events.minRating')}>
                  <option value={0}>{t('events.minRating.any')}</option>
                  <option value={4}>★ 4.0+</option>
                  <option value={4.5}>★ 4.5+</option>
                </select>
              </fieldset>
              <fieldset>
                <legend>{t('events.takePart')}</legend>
                <label className="check">
                  <input type="checkbox" checked={volunteer} onChange={(e) => setVolunteer(e.target.checked)} />
                  {t('events.takePart.volunteer')}
                </label>
              </fieldset>
              <fieldset>
                <legend>{t('events.getting')}</legend>
                <label className="check">
                  <input type="checkbox" checked={transitOnly} onChange={(e) => setTransitOnly(e.target.checked)} />
                  {t('events.transitOnly')}
                </label>
              </fieldset>
              <hr />
              <fieldset>
                <legend>{t('events.accessNeeds')}</legend>
                {ACCESS_CATEGORIES.map((cat) => (
                  <div key={cat} className="access-filter-group">
                    <strong className="small">{t(`accessCat.${cat}`)}</strong>
                    {ACCESS_GROUPS[cat].map((a) => (
                      <label className="check" key={a}>
                        <input type="checkbox" checked={needs.includes(a)} onChange={() => setNeeds(toggle(needs, a))} />
                        {t(`access.${a}`)}
                      </label>
                    ))}
                  </div>
                ))}
              </fieldset>
              <button type="button" className="btn quiet" onClick={clear}>
                {t('common.clear')}
              </button>
            </div>
            <div className="note-card">
              <p className="row">
                <Icon name="info" /> <strong>{t('detail.expect')}</strong>
              </p>
              <p className="small">{t('ev.help')}</p>
            </div>
          </div>
        </aside>

        <section aria-labelledby="results-h">
          <div className="spread results-head">
            <div>
              <h2 id="results-h">{t('explore.good')}</h2>
              <p className="muted" aria-live="polite">
                {t('events.results', { n: results.length })} · {AREAS[profile.homeArea]?.label}
              </p>
            </div>
            <div className="row">
              <label className="sort">
                <span className="sr-only">{t('events.sort')}</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  {(['soonest', 'match', 'trending', 'rating', 'distance'] as Sort[]).map((s) => (
                    <option key={s} value={s}>
                      {t(`events.sort.${s}`)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="chips" role="group" aria-label="View">
                {(['list', 'map'] as const).map((v) => (
                  <button key={v} type="button" className="chip" aria-pressed={view === v} onClick={() => setView(v)}>
                    {t(`events.view.${v}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pills" role="group" aria-label={t('events.title')}>
            <button type="button" className="pill" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
              {t('common.all')}
            </button>
            {PILLS.map((c) => (
              <button key={c} type="button" className="pill" aria-pressed={category === c} onClick={() => setCategory(category === c ? 'all' : c)}>
                {t(`cat.${c}`)}
              </button>
            ))}
          </div>

          {view === 'map' && results.length > 0 && <EventMap events={results} homeArea={profile.homeArea} label={t('map.title')} />}
          {results.length === 0 ? (
            <p className="notice">{t('events.none')}</p>
          ) : (
            <ul className="grid">
              {results.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </ul>
          )}
          <p className="disclosure">
            <Icon name="info" size={16} /> {t('app.sample')}
          </p>
        </section>
      </div>
    </div>
  );
}
