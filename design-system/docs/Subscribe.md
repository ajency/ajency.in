---
category: Essay
---
Email signup at the end of every post, between the closing line and the FAQ: hairline rule, quiet heading, one email input, yellow button. The site submits it in the background and swaps in a confirmation line; the hidden honeypot field replaces a captcha.

```tsx
<Subscribe
  line="I publish slowly. You'll get an email when something new is up."
  action="https://eocampaign1.com/form/…"
  honeypotName="hp…"
/>
```
