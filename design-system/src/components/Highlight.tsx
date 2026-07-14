import type { ReactNode } from 'react';

export interface HighlightProps {
  /** The punch clause — a phrase, not a whole sentence. */
  children: ReactNode;
}

/**
 * Highlighter mark: the brand-yellow band painted behind a phrase for
 * emphasis — thicker than a link underline, no hover. Spend it sparingly:
 * about one per section, on the punch clause. Must sit inside an Essay.
 */
export function Highlight({ children }: HighlightProps) {
  return <span className="highlight">{children}</span>;
}
