import { useState } from 'react';
import type { Post, Thread } from '../data/forum';
import { useT, localeFor } from '../i18n';
import { repliesTo } from '../lib/forum';
import { Icon } from './Icon';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function PostRow({
  post,
  thread,
  depth,
  onReply,
  onHelpful,
}: {
  post: Post;
  thread: Thread;
  depth: number;
  onReply: (text: string, parentId: string) => void;
  onHelpful: (postId: string) => void;
}) {
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const kids = repliesTo(thread, post.id);
  const date = new Intl.DateTimeFormat(localeFor(lang), { month: 'short', day: 'numeric', timeZone: 'America/Toronto' }).format(new Date(post.time));
  const badge = post.role === 'host' ? t('comm.host') : post.role === 'mod' ? t('comm.mod') : post.role === 'you' ? t('comm.you') : null;

  return (
    <li className={`post ${depth > 0 ? 'reply' : ''}`}>
      <span className={`avatar ${post.role}`} aria-hidden="true">
        {initials(post.author)}
      </span>
      <div className="post-main">
        <p className="post-meta">
          <strong>{post.author}</strong>
          {badge && <span className={`role ${post.role}`}>{badge}</span>}
          <span className="muted small">{date}</span>
        </p>
        <p className="post-text">{post.text}</p>
        <div className="post-actions">
          <button type="button" className="link-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {t('comm.reply')}
          </button>
          <button type="button" className="link-btn" aria-pressed={!!post.helpedByMe} onClick={() => onHelpful(post.id)}>
            <Icon name="thumb" size={15} /> {post.helpful > 0 ? t('comm.helpfulN', { n: post.helpful }) : t('comm.helpful')}
          </button>
        </div>
        {open && (
          <form
            className="inline-reply"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              onReply(text, post.id);
              setText('');
              setOpen(false);
            }}
          >
            <label className="sr-only" htmlFor={`r-${post.id}`}>
              {t('comm.writeReply')}
            </label>
            <textarea id={`r-${post.id}`} className="field" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('comm.writeReply')} />
            <button type="submit" className="btn small-btn">
              {t('comm.send')}
            </button>
          </form>
        )}
        {kids.length > 0 && (
          <ul className="posts nested">
            {kids.map((k) => (
              <PostRow key={k.id} post={k} thread={thread} depth={depth + 1} onReply={onReply} onHelpful={onHelpful} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/** Threaded posts: top-level posts with host and moderator replies nested under them. */
export function PostList({
  thread,
  onReply,
  onHelpful,
  skipFirst = false,
}: {
  thread: Thread;
  onReply: (text: string, parentId: string) => void;
  onHelpful: (postId: string) => void;
  /** On forum threads the opening post is shown separately. */
  skipFirst?: boolean;
}) {
  const top = skipFirst ? repliesTo(thread, thread.posts[0]?.id) : repliesTo(thread, undefined);
  return (
    <ul className="posts">
      {top.map((p) => (
        <PostRow key={p.id} post={p} thread={thread} depth={0} onReply={onReply} onHelpful={onHelpful} />
      ))}
    </ul>
  );
}
