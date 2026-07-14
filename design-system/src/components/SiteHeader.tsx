import type { ReactNode } from 'react';
import { Wordmark } from './Wordmark';

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
      <Wordmark name={name} tld={tld} href={href} />
      {contact && (
        <a className="contact-link" href={contact.href}>
          {contact.label}
        </a>
      )}
    </header>
  );
}
