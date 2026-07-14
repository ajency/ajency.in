import type { ReactNode } from 'react';

export interface Sense {
  /** Sense number as printed — "1.", "2."… */
  n: string;
  /** Serif-italic domain label — "in machines". Carries a yellow fill that grows across the senses. */
  label: ReactNode;
  /** The reading of the definition in that domain. */
  def: ReactNode;
}

export interface DictionaryEntryProps {
  /** The headword split into syllables — ["a", "jen", "cy"] renders a·jen·cy. */
  syllables: string[];
  /** Pronunciation — "| ˈeɪdʒənsi |". */
  pron?: ReactNode;
  /** Part of speech — "noun". */
  pos?: ReactNode;
  /** The word's one true sense, stated before any readings of it. */
  definition: ReactNode;
  /** Quiet serif hinge between definition and senses — "in every sense —". */
  sub?: ReactNode;
  /** Numbered domain readings of the definition. */
  senses?: Sense[];
  /** Etymology line, in a dictionary's usual place: last. */
  etymology?: ReactNode;
  /** Small-caps label before the etymology. Default "Origin". */
  originLabel?: ReactNode;
}

/**
 * Dictionary entry: a closing block set as a lexicographic entry — bold
 * headword with syllable dots, serif pronunciation and part of speech, the
 * definition, numbered senses whose yellow label-fill grows sense by sense,
 * and the etymology last, under a hairline. Opens with a heavy 2px ink rule.
 * Must sit inside an Essay.
 */
export function DictionaryEntry({
  syllables,
  pron,
  pos,
  definition,
  sub,
  senses,
  etymology,
  originLabel = 'Origin',
}: DictionaryEntryProps) {
  return (
    <div className="entry">
      <p className="entry-headword">
        <span className="entry-word">
          {syllables.map((syl, i) => (
            <span key={i}>
              {i > 0 && <span className="entry-sep">&middot;</span>}
              {syl}
            </span>
          ))}
        </span>
        {pron && <span className="entry-pron">{pron}</span>}
        {pos && <span className="entry-pos">{pos}</span>}
      </p>
      <p className="entry-def">{definition}</p>
      {sub && <p className="entry-sub">{sub}</p>}
      {senses && senses.length > 0 && (
        <ol className="senses">
          {senses.map((sense, i) => (
            <li className="sense" key={i}>
              <span className="sense-n">{sense.n}</span>
              <span>
                <span className="sense-label">{sense.label}</span>
                <span className="sense-def">{sense.def}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      {etymology && (
        <p className="entry-etym">
          <span className="entry-origin">{originLabel}</span> {etymology}
        </p>
      )}
    </div>
  );
}
