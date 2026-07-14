import { Essay, Kicker, Highlight } from 'ajency-design';

export const NeverOutOfDate = () => (
  <Essay>
    <Kicker>Self-documenting walkthroughs that never go stale</Kicker>
    <p>
      Most user docs are written once and quietly go stale the moment the UI moves. This is the opposite &mdash;
      built on the spot, always matching the app as it stands today, and shaped around the person who asked.{' '}
      <Highlight>A live walkthrough that&rsquo;s never out of date, because it&rsquo;s never written in advance.</Highlight>
    </p>
  </Essay>
);

export const BestTeamIveRun = () => (
  <Essay>
    <p>
      Look at that long enough and it&rsquo;s an org chart. I delegate to Claude, Claude delegates to Qwen, Qwen
      delegates to Python. <Highlight>Best team I&rsquo;ve ever run.</Highlight>
    </p>
  </Essay>
);
