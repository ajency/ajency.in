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
}

/**
 * FAQ accordion: serif questions split by hairline rules, each with a yellow
 * +/− toggle — the "Straight answers, for humans and crawlers alike" block
 * that ends every post. Stays in the reading column; no JS. Must sit inside
 * an Essay.
 */
export function Faq({ items }: FaqProps) {
  return (
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
  );
}
