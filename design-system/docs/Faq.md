---
category: Layout
---
Fine print for search engines and AI assistants — rendered from the same data as the FAQPage JSON-LD, so the two never drift. Sits below the Cta band, after the conversion moment: small grey sans questions, hairline rules, yellow +/− toggles. Questions phrased exactly as the target searches; concrete, numbers-bearing answers.

```tsx
<Faq
  items={[
    {
      question: 'Can one person deliver a full software project with AI agents?',
      answer: 'Yes — a four-month ERP delivery for a ₹1,000-crore dealer, solo.',
    },
  ]}
/>
```
