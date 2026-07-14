import type { ReactNode } from 'react';

export interface EssayProps {
  /** Essay content: <p>, <h2>, Kicker, Pullquote, Aside, Quote, Faq… */
  children: ReactNode;
}

/**
 * The essay container — the reading column every long-form page is built in.
 * Paragraphs cap at the 40rem reading measure; the block itself is wider so
 * Aside can host digressions and margin figures in the right column. All
 * essay typography (kicker, pullquote, highlight, links, lists, code) is
 * scoped to this container: those pieces must sit inside an Essay to be
 * styled.
 */
export function Essay({ children }: EssayProps) {
  return <article className="essay">{children}</article>;
}
