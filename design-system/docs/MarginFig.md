---
category: Essay
---
The default home for images: the right margin column, hairline border, quiet serif caption. Also carries the site's video-over-GIF pattern (silent autoplaying loop with a WebP poster). An image earns the main column (FigureWide) only when it IS the payoff. Always the `aside` of an Aside row.

```tsx
<MarginFig
  src="/images/delegate-yoda.webp"
  fallback="/images/delegate-yoda.jpg"
  alt="Yoda meme about model cost-routing."
  caption="Middle management, this is."
/>

<MarginFig
  video={{ src: '/images/cancel-receipt-walkthrough.mp4', poster: '/images/cancel-receipt-poster.webp', width: 480, height: 852 }}
  alt="A self-documenting walkthrough, screen by screen."
  caption="What comes back — click through, don't read."
/>
```
