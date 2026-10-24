import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PostList } from '../components/Posts';
import { FORUM_CATEGORIES, type ForumCategory } from '../data/forum';
import { LANGUAGES, localeFor, useT } from '../i18n';
import { lastActivity, summarize } from '../lib/forum';
import { useForum } from '../state/forum';
import type { Lang } from '../types';

function useDate() {
  const { lang } = useT();
  return (iso: string) => new Intl.DateTimeFormat(localeFor(lang), { month: 'short', day: 'numeric', timeZone: 'America/Toronto' }).format(new Date(iso));
}

/** Community forum: topics for newcomers, access needs, seniors, families, volunteers and hosts. */
export function Community() {
  const { t, lang } = useT();
  const { threads, addThread } = useForum();
  const navigate = useNavigate();
  const fmt = useDate();
  const [cat, setCat] = useState<ForumCategory | 'all'>('all');
  const [tongue, setTongue] = useState<Lang | 'any'>('any');
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [newCat, setNewCat] = useState<ForumCategory>('newcomers');

  const list = threads
    .filter((th) => !th.eventId)
    .filter((th) => cat === 'all' || th.category === cat)
    .filter((th) => tongue === 'any' || th.lang === tongue)
    .sort((a, b) => lastActivity(b).localeCompare(lastActivity(a)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const id = addThread({ title, body, category: newCat, lang });
    setTitle('');
    setBody('');
    setComposing(false);
    navigate(`/community/${id}`);
  };

  return (
    <div className="stack-lg">
      <header className="page-head spread">
        <div>
          <h1>{t('comm.title')}</h1>
          <p className="lead">{t('comm.sub')}</p>
        </div>
        <button type="button" className="btn" onClick={() => setComposing((c) => !c)} aria-expanded={composing}>
          <Icon name="message" /> {t('comm.new')}
        </button>
      </header>

      {composing && (
        <form className="panel composer-card" onSubmit={submit}>
          <label className="lbl" htmlFor="th-title">
            {t('comm.titleLabel')}
          </label>
          <input id="th-title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <p className="lbl">{t('comm.topic')}</p>
          <div className="chips" role="radiogroup" aria-label={t('comm.topic')}>
            {FORUM_CATEGORIES.map((c) => (
              <button key={c} type="button" role="radio" aria-checked={newCat === c} className="chip" onClick={() => setNewCat(c)}>
                {t(`comm.cat.${c}`)}
              </button>
            ))}
          </div>
          <label className="lbl" htmlFor="th-body">
            {t('comm.bodyLabel')}
          </label>
          <textarea id="th-body" className="field" rows={4} value={body} onChange={(e) => setBody(e.target.value)} required />
          <p className="muted small">{t('comm.guidelines')}</p>
          <div className="row">
            <button type="submit" className="btn">
              {t('comm.post')}
            </button>
            <button type="button" className="btn quiet" onClick={() => setComposing(false)}>
              {t('comm.cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="spread">
        <div className="pills" role="group" aria-label={t('comm.topic')}>
          <button type="button" className="pill" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
            {t('comm.cat.all')}
          </button>
          {FORUM_CATEGORIES.map((c) => (
            <button key={c} type="button" className="pill" aria-pressed={cat === c} onClick={() => setCat(cat === c ? 'all' : c)}>
              {t(`comm.cat.${c}`)}
            </button>
          ))}
        </div>
        <label className="row">
          <span className="small muted">{t('comm.lang')}</span>
          <select value={tongue} onChange={(e) => setTongue(e.target.value as Lang | 'any')}>
            <option value="any">{t('comm.langAny')}</option>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="notice">{t('comm.empty')}</p>
      ) : (
        <ul className="threads">
          {list.map((th) => {
            const s = summarize(th);
            const first = th.posts[0];
            return (
              <li key={th.id} className="thread-card">
                <div className="row small">
                  <span className="status-badge">{t(`comm.cat.${th.category}`)}</span>
                  <span className="muted" lang={th.lang}>
                    {LANGUAGES.find((l) => l.code === th.lang)?.native}
                  </span>
                </div>
                <h2>
                  <Link to={`/community/${th.id}`} lang={th.lang}>
                    {th.title}
                  </Link>
                </h2>
                <p className="muted small">
                  {first.author} · {fmt(lastActivity(th))} · {t('comm.replies', { n: s.replies })}
                </p>
                {s.quote && (
                  <p className="snippet small">
                    <Icon name="sparkles" size={14} /> {s.quote}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ThreadPage() {
  const { id } = useParams();
  const { t } = useT();
  const { threads, addPost, toggleHelpful } = useForum();
  const fmt = useDate();
  const [text, setText] = useState('');
  const thread = threads.find((th) => th.id === id);

  if (!thread) {
    return (
      <div className="stack">
        <p>{t('detail.notFound')}</p>
        <Link to="/community">{t('comm.back')}</Link>
      </div>
    );
  }
  const first = thread.posts[0];
  const s = summarize(thread);

  return (
    <article className="stack-lg thread-page">
      <Link to="/community">← {t('comm.back')}</Link>
      <header>
        <span className="status-badge">{t(`comm.cat.${thread.category}`)}</span>
        <h1 lang={thread.lang}>{thread.title}</h1>
        <p className="muted small">
          {first.author} · {fmt(first.time)}
        </p>
        <p className="lead" lang={thread.lang}>
          {first.text}
        </p>
      </header>

      <div className="ai-box">
        <p className="row">
          <Icon name="sparkles" /> <strong>{t('comm.ai')}</strong>
        </p>
        <p>{s.quote ? t('comm.aiLine', { n: s.replies, quote: s.quote }) : t('comm.aiNone')}</p>
        <p className="muted small">{t('comm.aiNote')}</p>
      </div>

      <PostList thread={thread} skipFirst onReply={(txt, parentId) => addPost(thread.id, txt, parentId)} onHelpful={(postId) => toggleHelpful(thread.id, postId)} />

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addPost(thread.id, text, first.id);
          setText('');
        }}
      >
        <label htmlFor="th-reply">
          <strong>{t('comm.writeReply')}</strong>
        </label>
        <textarea id="th-reply" className="field" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="spread">
          <span className="muted small">{t('comm.guidelines')}</span>
          <button type="submit" className="btn">
            {t('comm.send')}
          </button>
        </div>
      </form>
    </article>
  );
}
