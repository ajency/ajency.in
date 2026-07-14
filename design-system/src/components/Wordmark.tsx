export interface WordmarkProps {
  /** Text before the yellow dot. Default "ajency". */
  name?: string;
  /** Text after the yellow dot. Default "in". */
  tld?: string;
  /** Where the wordmark links. Omit to render a plain <span>. */
  href?: string;
}

/**
 * The logo: the site name in bold Work Sans with the brand-yellow dot
 * (#f9bc23). Renders as a link when given an href, otherwise as static
 * text. SiteHeader places it top-left on every page.
 */
export function Wordmark({ name = 'ajency', tld = 'in', href }: WordmarkProps) {
  const inner = (
    <>
      {name}
      <span className="dot">.</span>
      {tld}
    </>
  );
  return href ? (
    <a className="wordmark" href={href}>
      {inner}
    </a>
  ) : (
    <span className="wordmark">{inner}</span>
  );
}
