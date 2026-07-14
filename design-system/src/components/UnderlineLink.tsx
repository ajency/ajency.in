import type { ReactNode } from 'react';

export interface UnderlineLinkProps {
  href: string;
  children: ReactNode;
  /** Opens in a new tab with rel="noopener" — the site's rule for external links. */
  external?: boolean;
}

/**
 * Standalone link with the site's signature treatment: ink text over a 2px
 * brand-yellow underline that grows to a full wash on hover. Links inside an
 * Essay get this automatically — reach for this component only outside one.
 */
export function UnderlineLink({ href, children, external }: UnderlineLinkProps) {
  return (
    <a
      className="contact-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  );
}
