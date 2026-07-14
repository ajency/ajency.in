import type { ReactNode } from 'react';

export interface AsideProps {
  /** The margin content: a Digression or a MarginFig. */
  aside: ReactNode;
  /** The reading-column prose the aside rides next to: one or more <p>. */
  children: ReactNode;
}

/**
 * Aside row: pairs reading-column prose with margin content. On wide screens
 * the aside (a Digression or MarginFig) moves into the right margin column
 * beside the prose; on narrow screens it flows inline after it. The reading
 * column is sacred — a margin aside must never open empty space beside the
 * prose, so keep asides shorter than the text they ride with. Must sit
 * inside an Essay.
 */
export function Aside({ aside, children }: AsideProps) {
  return (
    <div className="has-aside">
      {children}
      {aside}
    </div>
  );
}
