import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runLocalTurn, type ReplyPart, type TraceStep, type TurnResult } from '../agent/engine';
import { checkLlm, llmTurn, type HistoryItem, type LlmStatus } from '../agent/llm';
import { factsToPatch, isPreferenceFact, removeFact, understand, type Fact } from '../agent/nlu';
import { enoughToRecommend, nextQuestion, previewPicks, type Slot, type SlotOption } from '../agent/planner';
import type { EventBrief } from '../agent/tools';
import { useVoice } from '../hooks/useVoice';
import { LANGUAGES, useT, type TFn } from '../i18n';
import type { Key } from '../i18n/en';
import type { Pick as AgentPick } from '../lib/agent';
import { NOW } from '../lib/now';
import { AREAS } from '../lib/scoring';
import { useProfile } from '../state/profile';
import type { Profile } from '../types';
import { Icon } from './Icon';
import { MiniEvent } from './MiniEvent';
import { AgentOrb } from './Motion';

interface Quick {
  slot?: Slot;
  options: SlotOption[];
  why?: boolean;
}
interface Msg {
  id: number;
  who: 'maple' | 'you';
  text?: string;
  parts?: ReplyPart[];
  facts?: Fact[];
  events?: EventBrief[];
  picks?: AgentPick[];
  trace?: TraceStep[];
  quick?: Quick;
  savePrompt?: Fact[];
  /** Starter sentences the person can tap to say out loud for them. */
  starters?: Key[];
  source?: 'local' | 'llm';
}

const SLOT_QUESTION: Record<Slot, Key> = {
  interests: 'agent.q.interests',
  free: 'agent.q.free',
  times: 'agent.q.times',
  group: 'agent.q.group',
  travel: 'agent.q.travel',
  area: 'agent.q.area',
  max: 'agent.q.max',
  access: 'agent.q.access',
};

function factLabel(f: Fact, t: TFn): string | null {
  switch (f.kind) {
    case 'interest':
      return t(`cat.${f.category}`);
    case 'free':
      return t('common.free');
    case 'time':
      return f.time === 'morning' ? null : t(`ob.time.${f.time}`);
    case 'group':
      return t(`ob.group.${f.group}`);
    case 'mode':
      return t(`mode.${f.mode}`);
    case 'area':
      return AREAS[f.code]?.label ?? f.code;
    case 'max':
      return t('common.min', { n: f.minutes });
    case 'access':
      return `${t(`access.${f.attr}`)} (${t(f.importance === 'essential' ? 'ob.access.essential' : 'ob.access.preferred')})`;
    case 'eventLang':
      return LANGUAGES.find((l) => l.code === f.lang)?.native ?? f.lang;
  }
}

const optionLabel = (o: SlotOption, t: TFn) => o.label ?? t(o.labelKey!, o.vars);

interface Props {
  mode: 'onboarding' | 'assistant';
  /** Called when the person chooses to see their picks (onboarding only). */
  onFinish?: () => void;
  compact?: boolean;
}

export function ChatPanel({ mode, onFinish, compact = false }: Props) {
  const { t, lang } = useT();
  const { profile, update } = useProfile();
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [llm, setLlm] = useState<LlmStatus>({ live: false });
  const [readAloud, setReadAloud] = useState(false);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const idRef = useRef(0);
  const asked = useRef<Set<Slot>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HistoryItem[]>([]);
  const started = useRef(false);

  const push = useCallback((m: Omit<Msg, 'id'>) => setMsgs((all) => [...all, { ...m, id: ++idRef.current }]), []);

  const markStarted = () => {
    const g = profileRef.current.gate;
    if (g === 'new' || g === 'skipped') update({ gate: 'started' });
  };

  const replyText = useCallback(
    (m: Pick<Msg, 'parts' | 'text'>): string => (m.text ?? (m.parts ?? []).map((p) => t(p.key, p.vars)).join(' ')),
    [t],
  );

  const voice = useVoice(lang, (text) => void send(text));

  useEffect(() => {
    void checkLlm().then(setLlm);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length, busy]);

  /** Appends Maple's next question, chosen by how much the answer would change the picks. */
  const askNext = useCallback(
    (p: Profile) => {
      if (mode !== 'onboarding') return;
      const q = nextQuestion(p, asked.current, NOW);
      if (!q) {
        push({ who: 'maple', parts: [{ key: 'chat.enough' }] });
        return;
      }
      asked.current.add(q.slot);
      push({ who: 'maple', parts: [{ key: SLOT_QUESTION[q.slot] }], quick: { slot: q.slot, options: q.options, why: true } });
    },
    [mode, push],
  );

  // Opening message
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (mode === 'onboarding') {
      push({ who: 'maple', parts: [{ key: 'chat.hello' }], starters: ['chat.starter1', 'chat.starter2', 'chat.starter3', 'chat.starter4', 'chat.starter5'] });
      askNext(profileRef.current);
    } else {
      push({
        who: 'maple',
        parts: [{ key: 'chat.greetReply' }],
        quick: {
          options: [
            { id: 'free', labelKey: 'agent.chip.free', label: undefined, patch: () => ({}) },
            { id: 'quiet', labelKey: 'agent.chip.quiet', patch: () => ({}) },
            { id: 'nocar', labelKey: 'agent.chip.nocar', patch: () => ({}) },
            { id: 'family', labelKey: 'agent.chip.family', patch: () => ({}) },
            { id: 'vol', labelKey: 'agent.chip.volunteer', patch: () => ({}) },
          ],
        },
      });
    }
  }, [mode, push, askNext]);

  const send = useCallback(
    async (raw: string, display?: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      voice.silence();
      setInput('');
      push({ who: 'you', text: display ?? text });
      setBusy(true);
      const current = profileRef.current;
      const base = { text, profile: current, lang, mode, now: NOW };

      let result: TurnResult;
      let degraded = false;
      if (llm.live) {
        try {
          result = await llmTurn({ text, lang, profile: current, mode, history: historyRef.current });
        } catch {
          degraded = true;
          result = runLocalTurn(base);
        }
      } else {
        result = runLocalTurn(base);
      }

      // Onboarding: everything the person says about themselves is saved right away, and shown as removable chips.
      let facts = result.facts;
      if (mode === 'onboarding' && facts.length === 0) facts = understand(text, { forceDurable: true }).facts;
      const prefFacts = facts.filter(isPreferenceFact);
      let merged = current;
      if (mode === 'onboarding' && prefFacts.length) {
        const patch = factsToPatch(current, prefFacts);
        merged = { ...current, ...patch };
        update({ ...patch, ...(current.gate === 'new' || current.gate === 'skipped' ? { gate: 'started' as const } : {}) });
      }

      const maple: Omit<Msg, 'id'> = {
        who: 'maple',
        parts: result.parts,
        text: degraded ? `${t('chat.error')} ${replyText(result)}` : result.text,
        facts: prefFacts.length ? prefFacts : undefined,
        events: mode === 'assistant' ? result.events : undefined,
        trace: result.trace,
        savePrompt: mode === 'assistant' && result.durable && prefFacts.length ? prefFacts : undefined,
        source: result.source,
      };
      if (mode === 'onboarding') maple.picks = previewPicks(merged, NOW, 3);
      push(maple);
      const spoken = replyText(maple);
      historyRef.current = [...historyRef.current, { role: 'user' as const, text }, { role: 'model' as const, text: spoken }].slice(-10);
      if (readAloud) voice.speak(spoken);
      setBusy(false);
      if (mode === 'onboarding') askNext(merged);
    },
    [busy, voice, push, lang, mode, llm.live, update, t, replyText, readAloud, askNext],
  );

  const pickOption = (q: Quick, o: SlotOption) => {
    const label = optionLabel(o, t);
    if (mode === 'assistant') {
      const query: Record<string, string> = { free: 'free this weekend', quiet: 'quiet step-free', nocar: 'bus transit no car', family: 'family kids', vol: 'volunteer' };
      void send(query[o.id] ?? label, label);
      return;
    }
    const current = profileRef.current;
    const patch = o.patch(current);
    markStarted();
    update(patch);
    const merged = { ...current, ...patch };
    push({ who: 'you', text: label });
    push({ who: 'maple', parts: [{ key: 'chat.noted' }], picks: previewPicks(merged, NOW, 3) });
    if (q.slot) asked.current.add(q.slot);
    if (enoughToRecommend(merged, asked.current)) push({ who: 'maple', parts: [{ key: 'chat.enough' }] });
    askNext(merged);
  };

  const removeChip = (m: Msg, f: Fact, i: number) => {
    update(removeFact(profileRef.current, f));
    setRemoved((s) => new Set(s).add(`${m.id}:${i}`));
  };

  const savePrefs = (m: Msg) => {
    if (!m.savePrompt) return;
    update({ ...factsToPatch(profileRef.current, m.savePrompt), ...(profileRef.current.gate === 'new' || profileRef.current.gate === 'skipped' ? { gate: 'started' as const } : {}) });
    setSaved((s) => new Set(s).add(m.id));
  };

  const finish = () => {
    update({ gate: 'done', onboarded: true });
    onFinish?.();
  };

  const canFinish = mode === 'onboarding' && profile.gate !== 'new';
  const voiceMsg = useMemo(() => {
    if (voice.error === 'denied') return t('chat.micDenied');
    if (voice.error === 'nospeech') return t('chat.micNoSpeech');
    if (voice.error === 'unsupported' || (!voice.supported && voice.error === null && false)) return t('chat.micUnsupported');
    return '';
  }, [voice.error, voice.supported, t]);

  return (
    <div className={`chat-panel ${compact ? 'compact' : ''}`}>
      <div className="chat-bar">
        <span className={`ai-badge ${llm.live ? 'live' : 'local'}`} title={llm.live ? undefined : t('chat.mode.localHint')}>
          <Icon name="sparkles" size={14} /> {llm.live ? t('chat.mode.live', { model: llm.model ?? 'Gemini' }) : t('chat.mode.local')}
        </span>
        <label className="check small">
          <input type="checkbox" checked={readAloud} onChange={(e) => { setReadAloud(e.target.checked); if (!e.target.checked) voice.silence(); }} />
          {t('chat.readAloud')}
        </label>
      </div>

      <div className="chat-list" ref={listRef} role="log" aria-live="polite" aria-label={t('chat.title')}>
        {msgs.map((m) => (
          <div key={m.id} className={`msg ${m.who}`}>
            {m.who === 'maple' && <AgentOrb size={30} />}
            <div className="msg-body">
              {(m.text || m.parts) && <p className="msg-text">{replyText(m)}</p>}

              {m.facts && m.facts.length > 0 && (
                <div className="understood">
                  <span className="muted small">{t('chat.understood')}:</span>
                  <span className="chips">
                    {m.facts.map((f, i) => {
                      const label = factLabel(f, t);
                      if (!label || removed.has(`${m.id}:${i}`)) return null;
                      return (
                        <span key={i} className="chip-fact">
                          {label}
                          <button type="button" onClick={() => removeChip(m, f, i)} aria-label={t('chat.remove', { label })}>
                            <Icon name="x" size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </span>
                </div>
              )}

              {m.events && m.events.length > 0 && (
                <ul className="mini-events">
                  {m.events.slice(0, 3).map((e) => (
                    <MiniEvent key={e.id} id={e.id} score={e.score} reasons={e.reasons} minutes={e.travelMinutes} />
                  ))}
                </ul>
              )}

              {m.picks && m.picks.length > 0 && (
                <div className="preview">
                  <p className="small muted">
                    <strong>{t('chat.preview')}</strong>
                  </p>
                  <ul className="mini-events">
                    {m.picks.map((p) => (
                      <MiniEvent key={p.event.id} id={p.event.id} score={p.score} reasons={p.reasons.slice(0, 2)} />
                    ))}
                  </ul>
                </div>
              )}

              {m.savePrompt && (
                <div className="save-prompt">
                  {saved.has(m.id) ? (
                    <p className="small" role="status">
                      {t('chat.savedOk')}
                    </p>
                  ) : (
                    <>
                      <p className="small">{t('chat.saveAsk')}</p>
                      <div className="row">
                        <button type="button" className="btn small-btn" onClick={() => savePrefs(m)}>
                          {t('chat.save')}
                        </button>
                        <button type="button" className="btn quiet small-btn" onClick={() => setSaved((s) => new Set(s).add(m.id))}>
                          {t('chat.noSave')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {m.trace && m.trace.length > 0 && (
                <details className="trace">
                  <summary>{t('chat.how')}</summary>
                  <ol>
                    {m.trace.map((s, i) => (
                      <li key={i}>{s.text ?? t(s.key!, s.vars)}</li>
                    ))}
                  </ol>
                </details>
              )}

              {m.starters && (
                <div className="chips quick" aria-label={t('chat.opts')}>
                  {m.starters.map((k) => (
                    <button key={k} type="button" className="chip" onClick={() => void send(t(k))}>
                      {t(k)}
                    </button>
                  ))}
                </div>
              )}

              {m.quick && (
                <div className="quick-wrap">
                  {m.quick.why && m.quick.slot && <p className="muted small">{t('chat.whyAsk')}</p>}
                  <div className="chips quick" role="group" aria-label={t('chat.opts')}>
                    {m.quick.options.map((o) => (
                      <button key={o.id} type="button" className="chip" onClick={() => pickOption(m.quick!, o)}>
                        {optionLabel(o, t)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="msg maple">
            <AgentOrb size={30} />
            <div className="msg-body">
              <p className="msg-text muted">{t('chat.thinking')}</p>
            </div>
          </div>
        )}
      </div>

      {canFinish && (
        <div className="finish-row">
          <button type="button" className="btn" onClick={finish}>
            <Icon name="sparkles" /> {t('chat.seePicks')}
          </button>
        </div>
      )}

      <form
        className="composer-row"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label className="sr-only" htmlFor={`chat-in-${mode}`}>
          {t('chat.placeholder')}
        </label>
        <input
          id={`chat-in-${mode}`}
          className={`field ${voice.listening ? 'listening' : ''}`}
          value={voice.listening ? voice.interim : input}
          readOnly={voice.listening}
          onChange={(e) => setInput(e.target.value)}
          placeholder={voice.listening ? t('chat.listening') : t('chat.placeholder')}
          lang={lang}
          autoComplete="off"
        />
        <button
          type="button"
          className={`btn secondary mic ${voice.listening ? 'on' : ''}`}
          aria-pressed={voice.listening}
          aria-label={voice.listening ? t('chat.micStop') : t('chat.mic')}
          onClick={() => (voice.listening ? voice.stop() : voice.start())}
          disabled={!voice.supported}
          title={!voice.supported ? t('chat.micUnsupported') : undefined}
        >
          <Icon name="mic" />
          <span className="mic-label">{voice.listening ? t('chat.micStop') : t('chat.mic')}</span>
        </button>
        <button type="submit" className="btn" disabled={busy || !input.trim()}>
          <Icon name="arrow-right" /> <span className="mic-label">{t('chat.send')}</span>
        </button>
      </form>
      <p className="small muted voice-note" role="status">
        {!voice.supported ? t('chat.micUnsupported') : voiceMsg || (voice.listening ? t('chat.listening') : '')}
      </p>
    </div>
  );
}
