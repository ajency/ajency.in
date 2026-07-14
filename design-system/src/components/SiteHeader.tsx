import type { ReactNode } from 'react';

export interface SiteHeaderProps {
  /** Wordmark text before the yellow dot. Default "ajency". */
  name?: string;
  /** Wordmark text after the yellow dot. Default "in". */
  tld?: string;
  /** Where the wordmark links. Default "/". */
  href?: string;
  /** Contact link on the right. Omit to render no contact link. */
  contact?: { href: string; label: ReactNode };
}

/**
 * Site header: a bold wordmark with the brand-yellow dot on the left and a
 * single contact link with the growing yellow underline on the right. Spans
 * the full page width and aligns on the shared gutter; every page starts
 * with it.
 */
export function SiteHeader({
  name = 'ajency',
  tld = 'in',
  href = '/',
  contact = { href: 'mailto:talktous@ajency.in', label: 'Get in touch' },
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="wordmark" href={href}>
        {name}
        <span className="dot">.</span>
        {tld}
      </a>
      {contact && (
        <a className="contact-link" href={contact.href}>
          {contact.label}
        </a>
      )}
    </header>
  );
}
