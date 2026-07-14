import type { ReactNode } from 'react';

export interface FigureWideProps {
  /** Image source (WebP on the site). */
  src: string;
  alt: string;
  /** Quiet serif-italic caption under the image. */
  caption?: ReactNode;
  /**
   * Original PNG/JPG for browsers without WebP: renders the site's
   * <picture> markup with `src` as the WebP source and this as the <img>.
   */
  fallback?: string;
}

/**
 * Wide inline figure: breaks past the reading measure so storyboards and
 * screenshots have room for their detail. Reserved for the image that IS
 * the payoff of a section — everything else belongs in a MarginFig. Must
 * sit inside an Essay.
 */
export function FigureWide({ src, alt, caption, fallback }: FigureWideProps) {
  return (
    <figure className="figure-wide">
      {fallback ? (
        <picture>
          <source type="image/webp" srcSet={src} />
          <img src={fallback} alt={alt} loading="lazy" />
        </picture>
      ) : (
        <img src={src} alt={alt} loading="lazy" />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
