import type { ReactNode } from 'react';

export interface MarginFigVideo {
  /** MP4 source — the site's video-over-GIF pattern. */
  src: string;
  /** WebP poster shown before playback. */
  poster?: string;
  width?: number;
  height?: number;
}

export interface MarginFigProps {
  /** Image source (WebP on the site). Omit when `video` is set. */
  src?: string;
  /** Alt text for the image, or the aria-label for a video. */
  alt: string;
  /** Quiet serif-italic caption under the figure. */
  caption?: ReactNode;
  /**
   * Original PNG/JPG for browsers without WebP: renders the site's
   * <picture> markup with `src` as the WebP source and this as the <img>.
   */
  fallback?: string;
  /** Render a silent autoplaying loop instead of an image. */
  video?: MarginFigVideo;
}

/**
 * Margin figure: an image (or silent video loop) that rides the right margin
 * column on wide screens (inline and capped on narrow ones), with a hairline
 * border and a quiet serif-italic caption. The default home for images — an
 * image earns the main column (FigureWide) only when it is the payoff.
 * Always place it as the `aside` of an Aside row.
 */
export function MarginFig({ src, alt, caption, fallback, video }: MarginFigProps) {
  return (
    <figure className="margin-fig">
      {video ? (
        <video
          src={video.src}
          poster={video.poster}
          width={video.width}
          height={video.height}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-label={alt}
        />
      ) : fallback ? (
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
