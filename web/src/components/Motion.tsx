import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useProfile } from '../state/profile';

/** True when animation should be off: the person turned it off, or their device asks for less motion. */
export function useReducedMotion(): boolean {
  const { profile } = useProfile();
  const [os, setOs] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    setOs(q.matches);
    const on = (e: MediaQueryListEvent) => setOs(e.matches);
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return profile.reduceMotion || os;
}

interface TiltProps {
  children: ReactNode;
  /** Maximum rotation in degrees. Kept small so text stays readable. */
  max?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pointer-driven 3D tilt with a soft light sheen (the idea behind 21st.dev's Tilt Card).
 * Hover-only, mouse-only, and switched off for reduced motion, so touch and keyboard users get a flat card.
 */
export function Tilt({ children, max = 5, className = '', style }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(x * 100).toFixed(0)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(0)}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div className={`tilt ${className}`} style={style} ref={ref} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}

/** Small rotating 3D orb used as Maple's avatar. Pure CSS; static when motion is reduced. */
export function AgentOrb({ size = 44 }: { size?: number }) {
  return (
    <span className="orb" style={{ width: size, height: size }} aria-hidden="true">
      <span className="orb-ring r1" />
      <span className="orb-ring r2" />
      <span className="orb-ring r3" />
      <span className="orb-core" />
    </span>
  );
}
