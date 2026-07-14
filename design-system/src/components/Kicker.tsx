import type { ReactNode } from 'react';

export interface KickerProps {
  /** Two-or-three-word section label — "The acquisition", "Now". */
  children: ReactNode;
}

/**
 * Section kicker: a small uppercase grey label with a short yellow tick
 * before it — how essay sections start. Must sit inside an Essay.
 */
export function Kicker({ children }: KickerProps) {
  return <p className="kicker">{children}</p>;
}
