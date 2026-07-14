import type { ReactNode } from 'react';

export interface CtaAction {
  href: string;
  label: ReactNode;
  /** Opens in a new tab with rel="noopener". */
  external?: boolean;
}

export interface CtaProps {
  /** Bold closing headline — e.g. "Curious what agents could do for you?" */
  title: ReactNode;
  /** One supporting sentence under the title. */
  line?: ReactNode;
  /** The low-friction primary action (e.g. a calendar link). Set larger. */
  primary?: CtaAction;
  /** Fallback actions — email, LinkedIn. */
  secondary?: CtaAction[];
  /** Small grey reassurance right at the point of action. */
  human?: ReactNode;
}

/**
 * Get-in-touch CTA: a full-width closing band under a heavy 2px ink rule —
 * bold title, one supporting line, a primary action link plus quieter
 * fallbacks, and a small human reassurance note. Use once, at the end of a
 * page, before the SiteFooter. The offer is a peer conversation, not a sale.
 */
export function Cta({ title, line, primary, secondary, human }: CtaProps) {
  return (
    <section className="cta">
      <h2 className="cta-title">{title}</h2>
      {line && <p className="cta-line">{line}</p>}
      {(primary || secondary) && (
        <p className="cta-actions">
          {primary && (
            <a
              className="cta-primary"
              href={primary.href}
              {...(primary.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {primary.label}
            </a>
          )}
          {secondary?.map((action, i) => (
            <a
              key={i}
              href={action.href}
              {...(action.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {action.label}
            </a>
          ))}
        </p>
      )}
      {human && <p className="cta-human">{human}</p>}
    </section>
  );
}
