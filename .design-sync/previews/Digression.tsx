import { Essay, Aside, Digression } from 'ajency-design';

export const OnTheAcquisition = () => (
  <Essay>
    <Aside
      aside={
        <Digression summary="On the acquisition">
          <p>
            Turtlemint had been a client since 2021. After a couple of years working together,
            they offered to acquire the studio — an acqui-hire, for the team and the talent. They
            made sure I had no good reason to say no. :)
          </p>
        </Digression>
      }
    >
      <p>
        After the 2022 acquisition, I spent three years at Turtlemint, a fintech that recently
        IPO'd. Turtlemint is primarily an insurance distribution business; I was product lead for
        new verticals — mutual funds and lending — and, horizontally, product lead for data,
        automation, and AI across the company. Then I stepped out of full-time work entirely.
      </p>
    </Aside>
  </Essay>
);

export const WithImage = () => (
  <Essay>
    <Aside
      aside={
        <Digression
          summary="What comes back"
          img={{
            src: '../../../images/cancel-receipt-poster.webp',
            alt: 'First frame of a generated walkthrough: cancelling an incorrect money receipt.',
          }}
        >
          <p>
            The same filmstrip the agent builds for UAT, pointed at whoever asked — built live
            against the current UI, so it never goes stale.
          </p>
        </Digression>
      }
    >
      <p>
        Earlier, I'd write the steps out or hop on a call myself. Now I just forward the question
        to the agent, and it builds a walkthrough for that exact need.
      </p>
    </Aside>
  </Essay>
);
