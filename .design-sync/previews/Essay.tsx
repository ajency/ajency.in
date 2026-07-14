import { Essay, Kicker, Pullquote } from 'ajency-design';

export const ReadingRhythm = () => (
  <Essay>
    <Kicker>Now</Kicker>
    <p>
      I got AI-pilled, spent weeks inside <a href="https://claude.com/claude-code">Claude Code</a>, and took an
      automation project from discovery to delivery for an automobile dealer. Solo. Turns out I love working
      solo &mdash; building, not managing and delegating like the last 20 years.
    </p>
    <p>
      The obvious worry is the token bill. A full job-card-to-payment walkthrough burns ~70,000 tokens through{' '}
      <code>Qwen 3.5 35B</code> on my Mac Pro, so re-run it a hundred times and the bill stays flat at zero.
    </p>
    <Pullquote>One of those itches was building things again.</Pullquote>
  </Essay>
);
