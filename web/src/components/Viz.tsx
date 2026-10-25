import { Icon, type IconName } from './Icon';

export interface Bar {
  label: string;
  value: number;
  /** Shown instead of "{value}%" when the bar needs more explanation. */
  display?: string;
  /** The bar being talked about gets the brand colour, the others stay quiet. */
  focus?: boolean;
}

/**
 * Horizontal bars drawn to a common scale. The values are written out as text beside each bar,
 * so the list is its own table and nothing depends on colour or on seeing the bar.
 */
export function Bars({ title, bars, scaleMax, caption }: { title: string; bars: Bar[]; scaleMax: number; caption: string }) {
  return (
    <figure className="viz">
      <figcaption>
        <strong>{title}</strong>
        <span className="muted small">{caption}</span>
      </figcaption>
      <ul className="bars">
        {bars.map((b) => (
          <li key={b.label}>
            <span className="bar-label">{b.label}</span>
            <span className="bar-track" aria-hidden="true">
              <span className={`bar-fill${b.focus ? ' focus' : ''}`} style={{ width: `${Math.min(100, (b.value / scaleMax) * 100)}%` }} />
            </span>
            <span className="bar-value">{b.display ?? `${b.value}%`}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export interface Step {
  icon: IconName;
  text: string;
}

/** A row of steps joined by arrows. It stacks vertically on a phone. `tone` separates "today" from "ours" without relying on colour alone: the lane carries a text label. */
export function Lane({ label, steps, tone }: { label: string; steps: Step[]; tone: 'today' | 'ours' }) {
  return (
    <div className={`lane ${tone}`}>
      <p className="lane-label">{label}</p>
      <ol className="lane-steps">
        {steps.map((s, i) => (
          <li key={s.text}>
            <span className="lane-icon" aria-hidden="true">
              <Icon name={s.icon} size={20} />
            </span>
            <span className="lane-n">{i + 1}</span>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
