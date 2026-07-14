---
category: Home
---
One big headline per page — the single loudest element. Essay pages add a serif-italic subhead and a back link; the home page adds a prose lead and one action link.

```tsx
<Hero
  title="Independent builder in pursuit of agency."
  lead={
    <>
      <p>These days, I help small teams punch above their headcount.</p>
      <p className="lead-close">That's Ajency 2.0.</p>
    </>
  }
  action={{ href: '/about/', label: 'Read the story →' }}
/>
```
