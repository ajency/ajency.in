import type { ReactNode } from 'react';

export interface LedgerItem {
  /** The big figure — "2012", "50", "3", "1". */
  value: ReactNode;
  /** Small unit riding the numeral — "yrs", "people". */
  unit?: ReactNode;
  /** Short grey caption under the numeral. */
  label: ReactNode;
  /** Paint the yellow band behind this numeral. Spend it once per ledger. */
  marked?: boolean;
}

export interface LedgerProps {
  /** Usually four items — a story told in figures, left to right. */
  items: LedgerItem[];
}

/**
 * Hero ledger: a row of big tabular numerals between hairlines, each with a
 * small grey label — a story told in figures before the prose starts. Only
 * one numeral takes the yellow band (marked); the accent is spent once.
 * Sits inside a Hero, above the essay. Collapses to two columns on mobile.
 */
export function Ledger({ items }: LedgerProps) {
  return (
    <div className="ledger">
      {items.map((item, i) => (
        <div className="ledger-item" key={i}>
          <span className="ledger-num">
            {item.marked ? <span className="ledger-mark">{item.value}</span> : item.value}
            {item.unit && <span className="ledger-unit">{item.unit}</span>}
          </span>
          <span className="ledger-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
