import { Cta } from 'ajency-design';

export const HomeCta = () => (
  <Cta
    title="Let's build something with intention."
    line="I've done this before — for early-stage startups, a publicly listed enterprise, and most stages in between. If it overlaps with what you're working through, I'm glad to share what I learned."
    primary={{ href: 'https://calendar.app.google/wibfA7H9xZdb3Zaq7', label: 'Grab 30 minutes →', external: true }}
    secondary={[{ href: 'mailto:talktous@ajency.in', label: 'Or email me' }]}
    human="I take these calls because I genuinely enjoy them — comparing notes with founders is how I keep learning, and the best conversations usually drift into motorcycles or cocktails anyway."
  />
);
