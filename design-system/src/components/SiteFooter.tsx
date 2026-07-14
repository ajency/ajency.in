import type { ReactNode } from 'react';

export interface FooterItem {
  /** Link target. Omit for plain text. */
  href?: string;
  label: ReactNode;
  /** Grey text instead of ink — for labels like "Goa, India". */
  muted?: boolean;
  /** Opens in a new tab with rel="noopener". */
  external?: boolean;
}

export interface SiteFooterProps {
  /** Columns of links/text, left to right. */
  columns: FooterItem[][];
  /** Small grey copyright line under the columns. */
  copyright?: ReactNode;
}

/**
 * Site footer: a thin top rule, columns of quiet links (each carrying the
 * growing yellow underline), and a light-grey copyright line. Closes every
 * page.
 */
export function SiteFooter({ columns, copyright }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {columns.map((col, i) => (
          <div className="footer-col" key={i}>
            {col.map((item, j) =>
              item.href ? (
                <a
                  key={j}
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {item.label}
                </a>
              ) : (
                <span key={j} className={item.muted ? 'muted' : undefined}>
                  {item.label}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
      {copyright && <p className="copyright">{copyright}</p>}
    </footer>
  );
}
