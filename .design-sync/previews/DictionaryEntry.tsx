import { Essay, DictionaryEntry } from 'ajency-design';

export const AgencyEntry = () => (
  <Essay>
    <DictionaryEntry
      syllables={['a', 'jen', 'cy']}
      pron="| ˈeɪdʒənsi |"
      pos="noun"
      definition="The capacity to act independently, and to make one's own choices."
      sub="in every sense —"
      senses={[
        { n: '1.', label: 'in machines', def: 'AI agents learning autonomy.' },
        { n: '2.', label: 'in clients', def: 'Founders building with intention.' },
        {
          n: '3.',
          label: 'in myself',
          def: 'Still figuring out what work and freedom look like together.',
        },
      ]}
      etymology="a misspelling, kept on purpose — fifteen years and counting."
    />
  </Essay>
);
