import type { ReactNode } from 'react';

export interface QuoteProps {
  /** The quoted words. A bare string becomes one paragraph. */
  children: ReactNode;
}

/**
 * Quoted voice — e.g. a message from a user — set serif italic behind a
 * 2px yellow rule, stepped out of the flow. Must sit inside an Essay.
 */
export function Quote({ children }: QuoteProps) {
  return <blockquote>{typeof children === 'string' ? <p>{children}</p> : children}</blockquote>;
}
