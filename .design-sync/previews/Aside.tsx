import { Essay, Aside, Digression } from 'ajency-design';

export const AgencyOrigin = () => (
  <Essay>
    <Aside
      aside={
        <Digression summary="About Ajency.in">
          <p>
            The studio: a Goa-based software development and UI/UX design company, founded in
            2012. We did product engineering, interface design, and web &amp; ecommerce work —
            mostly for startups, including teams backed by Sequoia, Tiger Global, and Google
            Capital.
          </p>
        </Digression>
      }
    >
      <p>
        Fifteen years ago, I started with a simple principle: agency. It's why I named the studio
        Ajency.in. I began as a solo product consultant, moved to Goa, worked closely with founders
        I believed in, and built a studio around that idea.
      </p>
    </Aside>
  </Essay>
);
