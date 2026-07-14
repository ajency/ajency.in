import type { ReactNode } from 'react';

export interface DigressionProps {
  /** Short label — "About Ajency.in", "On the acquisition". */
  summary: ReactNode;
  /** The side-note body: one or two short <p> (a bare string becomes one). */
  children: ReactNode;
  /**
   * Whether the note starts expanded. The site syncs this to the viewport
   * (open in the wide margin, tap-to-expand on narrow screens). Default true.
   */
  open?: boolean;
  /** Small image at the top of the note body. */
  img?: { src: string; alt: string };
}

/**
 * Digression — a margin side note. On wide screens it sits open in the right
 * margin behind a yellow rule; on narrow screens it collapses to a
 * tap-to-expand note labeled "a side note" with a yellow +/− toggle. Always
 * place it as the `aside` of an Aside row.
 */
export function Digression({ summary, children, open = true, img }: DigressionProps) {
  return (
    <details className="digression" open={open}>
      <summary>{summary}</summary>
      <div className="digression-body">
        {img && <img className="digression-img" src={img.src} alt={img.alt} loading="lazy" />}
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    </details>
  );
}
