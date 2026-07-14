import type { ReactNode } from 'react';

export interface PullquoteProps {
  /** The lifted line. Keeps to ~24 characters per line by design. */
  children: ReactNode;
}

/**
 * Pull quote: a lifted line set large and bold as a section beat — the
 * essay's "turn". Use sparingly, roughly once per section at most. Must sit
 * inside an Essay.
 */
export function Pullquote({ children }: PullquoteProps) {
  return <p className="pullquote">{children}</p>;
}
