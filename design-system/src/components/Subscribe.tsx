import type { ReactNode } from 'react';

export interface SubscribeProps {
  /** Heading. Default "Get the next post by email." */
  title?: ReactNode;
  /** One-line pitch under the heading. */
  line?: ReactNode;
  /** Form endpoint (EmailOctopus form URL). */
  action: string;
  /** Name of the email input. Default "field_0" (EmailOctopus). */
  emailFieldName?: string;
  /** Name of the hidden honeypot input; bots that fill it are rejected server-side. */
  honeypotName?: string;
}

/**
 * Email signup: hairline rule, quiet heading, one email input and the yellow
 * button. Sits at the end of a post, between the closing line and the FAQ.
 * The site pairs it with a small script that submits in the background and
 * swaps in a confirmation line.
 */
export function Subscribe({
  title = 'Get the next post by email.',
  line = 'I publish slowly. You’ll get an email when something new is up.',
  action,
  emailFieldName = 'field_0',
  honeypotName,
}: SubscribeProps) {
  return (
    <section className="subscribe">
      <h2 className="subscribe-title">{title}</h2>
      <p className="subscribe-line">{line}</p>
      <form className="subscribe-form" method="post" action={action}>
        <input
          className="subscribe-email"
          type="email"
          name={emailFieldName}
          required
          placeholder="Email address"
          aria-label="Email address"
        />
        <button className="subscribe-btn" type="submit">
          Subscribe
        </button>
        {honeypotName && (
          <input
            className="subscribe-hp"
            type="text"
            name={honeypotName}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        )}
      </form>
      <p className="subscribe-msg" role="status" aria-live="polite" hidden></p>
    </section>
  );
}
