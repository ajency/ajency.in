---
category: Layout
---
Closes every page under a thin rule: columns of quiet links, then a light-grey copyright line.

```tsx
<SiteFooter
  columns={[
    [
      { href: 'mailto:talktous@ajency.in', label: 'talktous@ajency.in' },
      { href: 'https://www.linkedin.com/in/anujkhurana/', label: 'LinkedIn', external: true },
    ],
    [{ label: 'Goa, India', muted: true }],
  ]}
  copyright="© 2026 Ajency.in"
/>
```
