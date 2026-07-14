export interface AsciiFlowProps {
  /** The diagram, as a raw string with newlines. Box-drawing characters align on the monospace grid. */
  children: string;
}

/**
 * ASCII flow diagram: preformatted monospace in a faint tinted box — says in
 * one diagram what three paragraphs would. Preferred over prose for
 * technical flows. Scrolls horizontally on narrow screens rather than
 * wrapping.
 */
export function AsciiFlow({ children }: AsciiFlowProps) {
  return <pre className="ascii-flow">{children}</pre>;
}
