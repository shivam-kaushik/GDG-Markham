import { useState } from 'react';
import { useForum } from '../state/forum';
import { useT } from '../i18n';
import { summarize } from '../lib/forum';
import type { EventItem } from '../types';
import { Icon } from './Icon';
import { PostList } from './Posts';
import { repliesTo } from '../lib/forum';

/** "A conversation before you come": questions and host answers on an event page, with an AI summary. */
export function Discussion({ event }: { event: EventItem }) {
  const { t } = useT();
  const { eventThread, addEventPost, toggleHelpful } = useForum();
  const [text, setText] = useState('');
  const thread = eventThread(event.id);
  const roots = thread ? repliesTo(thread, undefined) : [];
  const unanswered = roots.filter((r) => thread && repliesTo(thread, r.id).length === 0);
  const sum = thread ? summarize(thread) : null;

  return (
    <section aria-labelledby="conv-h" className="discussion">
      <div className="spread">
        <h2 id="conv-h">{t('detail.conv')}</h2>
        <span className="muted">{t('detail.commentsN', { n: thread?.posts.length ?? 0 })}</span>
      </div>

      {thread && (
        <div className="ai-box">
          <p className="row">
            <Icon name="sparkles" /> <strong>{t('detail.summary')}</strong>
          </p>
          <p>{event.commentSummary ?? (sum?.quote ? t('comm.aiLine', { n: sum.replies, quote: sum.quote }) : t('comm.aiNone'))}</p>
          {unanswered.length > 0 && (
            <p className="open-q">
              <Icon name="info" size={16} /> {t('detail.awaiting')} ({unanswered.length})
            </p>
          )}
          <p className="muted small">{t('detail.summary.note')}</p>
        </div>
      )}

      {thread && (
        <PostList
          thread={thread}
          onReply={(txt, parentId) => addEventPost(event.id, event.title, txt, parentId)}
          onHelpful={(postId) => toggleHelpful(thread.id, postId)}
        />
      )}

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addEventPost(event.id, event.title, text);
          setText('');
        }}
      >
        <label htmlFor="evt-comment">
          <strong>{t('detail.joinConv')}</strong>
        </label>
        <textarea id="evt-comment" className="field" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('detail.placeholder')} />
        <div className="spread">
          <span className="muted small">{t('detail.beKind')}</span>
          <button type="submit" className="btn">
            {t('detail.post')}
          </button>
        </div>
      </form>
    </section>
  );
}
