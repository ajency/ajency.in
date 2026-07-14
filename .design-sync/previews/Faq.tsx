import { Essay, Faq } from 'ajency-design';

export const StraightAnswers = () => (
  <Essay>
    <Faq
      items={[
        {
          question: 'Can one person deliver a full software project with AI agents?',
          answer:
            'Yes — a four-month ERP delivery for a ₹1,000-crore automobile dealer, taken from discovery to delivery solo, with a bench of AI agents.',
          open: true,
        },
        {
          question: 'What does a UAT agent actually check?',
          answer:
            'Copy, layout, and feel — bugs are already caught by the API and browser tests before it runs.',
        },
        {
          question: 'How much does it cost to run?',
          answer: 'About 70k tokens per full pass — almost nothing.',
        },
      ]}
    />
  </Essay>
);
