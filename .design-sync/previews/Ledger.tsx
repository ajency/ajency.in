import { Ledger } from 'ajency-design';

export const FifteenYearArc = () => (
  <Ledger
    items={[
      { value: '2012', label: 'Started solo, in Goa' },
      { value: '50', unit: 'people', label: 'The studio, at its peak' },
      { value: '3', unit: 'yrs', label: 'Inside the fintech that acquired us' },
      { value: '1', marked: true, label: 'Back to one — building, not managing' },
    ]}
  />
);
