import { Hero } from 'ajency-design';

export const HomeHero = () => (
  <Hero
    title="Independent builder in pursuit of agency."
    lead={
      <>
        <p>
          These days, I help small teams punch above their headcount &mdash; finding where
          autonomous systems genuinely change how the work gets done. Sometimes that&rsquo;s an AI
          agent. Sometimes it&rsquo;s rethinking a workflow, or a product, from first principles.
        </p>
        <p className="lead-close">That&rsquo;s Ajency 2.0.</p>
      </>
    }
    action={{ href: '/about/', label: 'Read the story →' }}
  />
);

export const EssayHero = () => (
  <Hero
    back={{ href: '/' }}
    title="It was always about agency."
    subhead="Back to one."
  />
);
