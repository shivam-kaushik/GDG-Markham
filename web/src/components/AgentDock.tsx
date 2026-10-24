import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import { isPersonalized, useProfile } from '../state/profile';
import { ChatPanel } from './ChatPanel';
import { Icon } from './Icon';
import { AgentOrb } from './Motion';

/**
 * Floating "Ask Maple" button that opens the same chat used during onboarding, in assistant mode.
 * The panel stays mounted while closed so the conversation is still there when it is reopened.
 */
export function AgentDock() {
  const { t } = useT();
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="dock-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open}>
        <AgentOrb size={34} />
        <span>{t('agent.dock.open')}</span>
      </button>
      <div className="dock" hidden={!open} role="dialog" aria-modal="false" aria-label={t('agent.dock.title')}>
        <div className="dock-head">
          <span className="row">
            <AgentOrb size={36} />
            <span>
              <strong>{t('agent.name')}</strong>
              <br />
              <span className="muted small">{t('agent.tagline')}</span>
            </span>
          </span>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={t('agent.close')}>
            <Icon name="x" />
          </button>
        </div>
        {!isPersonalized(profile) && (
          <Link to="/welcome" className="chip accent" onClick={() => setOpen(false)}>
            <Icon name="sparkles" size={16} /> {t('agent.chip.personalize')}
          </Link>
        )}
        <ChatPanel mode="assistant" compact />
      </div>
    </>
  );
}
