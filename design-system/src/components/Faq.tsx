import type { ReactNode } from 'react';

export interface FaqItem {
  /** The question, phrased exactly as someone would search it. */
  question: ReactNode;
  /** Concrete, numbers-bearing answer. A bare string becomes one paragraph. */
  answer: ReactNode;
  /** Whether this item starts expanded. Default false. */
  open?: boolean;
}

export interface FaqProps {
  items: FaqItem[];
  /** Section heading. Default "Common questions". */
  heading?: ReactNode;
}

/**
 * FAQ as fine print: small grey sans questions split by hairline rules, each
 * with a yellow +/− toggle. It exists for search engines and AI assistants
 * (the site renders it from the same data as its FAQPage JSON-LD), so it sits
 * below the Cta band as an appendix — after the conversion moment, not
 * competing with the post.
 */
export function Faq({ items, heading = 'Common questions' }: FaqProps) {
  return (
    <section className="faq-section">
      <h2 className="kicker">{heading}</h2>
      <div className="faq">
        {items.map((item, i) => (
          <details className="faq-item" key={i} open={item.open}>
            <summary>{item.question}</summary>
            <div className="faq-answer">
              {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
