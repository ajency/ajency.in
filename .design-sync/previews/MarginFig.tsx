import { Essay, Aside, MarginFig } from 'ajency-design';

export const WorkbenchFigure = () => (
  <Essay>
    <Aside
      aside={
        <MarginFig
          src="../../../images/delegate-yoda.webp"
          fallback="../../../images/delegate-yoda.jpg"
          alt="Yoda meme about model cost-routing: 'Delegate to the cheapest model, you must. Middle management, this is.'"
          caption="Middle management, this is."
        />
      }
    >
      <p>
        Look at that long enough and it&rsquo;s an org chart. I delegate to Claude, Claude
        delegates to Qwen, Qwen delegates to Python.
      </p>
      <p>
        So Ajency.in 2.0 isn&rsquo;t a comeback. It&rsquo;s what the space made room for. More of
        the same, and yet very different. Slower. Calmer. Curiosity-led &mdash; I take on work I
        genuinely want to think about.
      </p>
    </Aside>
  </Essay>
);

export const WalkthroughVideo = () => (
  <Essay>
    <Aside
      aside={
        <MarginFig
          video={{
            src: '../../../images/cancel-receipt-walkthrough.mp4',
            poster: '../../../images/cancel-receipt-poster.webp',
            width: 480,
            height: 852,
          }}
          alt="A self-documenting walkthrough: the UAT agent steps through cancelling an incorrect money receipt, screen by screen."
          caption="What comes back — click through, don't read."
        />
      }
    >
      <p>
        Earlier, I&rsquo;d write the steps out or hop on a call myself. Now I just forward the
        question to the agent. It builds a walkthrough for that exact need &mdash; pulls the right
        screenshots, marks the buttons to press, and sends back something you click through
        instead of read.
      </p>
    </Aside>
  </Essay>
);
