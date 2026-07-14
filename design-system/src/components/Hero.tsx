import type { ReactNode } from 'react';

export interface HeroProps {
  /** Optional "← Back" link above the headline (essay pages). */
  back?: { href: string; label?: ReactNode };
  /** The one big headline. Keep it short — it sets the whole page. */
  title: ReactNode;
  /** Single serif-italic line under the headline. One line, not a paragraph. */
  subhead?: ReactNode;
  /**
   * Prose lead under the headline: pass <p> elements (a bare string becomes
   * one paragraph). Give the landing line className="lead-close".
   */
  lead?: ReactNode;
  /** "Read the story →"-style action link under the lead. */
  action?: { href: string; label: ReactNode };
  /** Anything after — typically a <Ledger>. */
  children?: ReactNode;
}

/**
 * Page hero: one big Work Sans 700 headline (the page's single loudest
 * element), optionally a serif-italic subhead, a short prose lead, and one
 * quiet action link. Use once per page, directly under the SiteHeader.
 */
export function Hero({ back, title, subhead, lead, action, children }: HeroProps) {
  return (
    <section className="hero">
      {back && (
        <p className="back-link">
          <a href={back.href}>&larr; {back.label ?? 'Back'}</a>
        </p>
      )}
      <h1>{title}</h1>
      {subhead && <p className="subhead">{subhead}</p>}
      {lead && <div className="hero-lead">{typeof lead === 'string' ? <p>{lead}</p> : lead}</div>}
      {action && (
        <p className="hero-actions">
          <a href={action.href}>{action.label}</a>
        </p>
      )}
      {children}
    </section>
  );
}
