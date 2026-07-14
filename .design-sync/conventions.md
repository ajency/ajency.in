# ajency.in — how to build with this system

This is the design system of ajency.in, a personal essay-driven site: one
white page, generous whitespace, Work Sans for body and headlines, Libre
Baskerville *italic* as the serif accent, and a single brand-yellow accent
spent sparingly. Calm, editorial, low on chrome — never dashboard-like.

## Page skeleton

Every page is: `<SiteHeader>` → `<Hero>` (one big headline — the page's single
loudest element) → content → `<Cta>` (at most one, page end) → `<SiteFooter>`.
Long-form content lives inside `<Essay>`; the home page uses `<PostList>`.
Posts extend the tail: `<Subscribe>` ends the essay (after the closing line),
and `<Faq>` sits after the `<Cta>` as fine print — SEO furniture, deliberately
past the conversion moment.

## Essay scoping — the one rule that breaks silently

All essay typography is CSS-scoped to the `.essay` container that `<Essay>`
renders. `Kicker`, `Pullquote`, `Highlight`, `Quote`, `Aside`, `Digression`,
`MarginFig`, `FigureWide`, and `DictionaryEntry` render UNSTYLED unless
nested inside `<Essay>`. (`Faq` and `Subscribe` carry their own scoping and
work outside it.) Plain `<p>`, `<h2>`, `<ul>`, `<a>`, and `<code>`
inside an Essay are styled automatically (links get the growing yellow
underline; list markers are yellow). `Highlight` must sit inside a `<p>`.
`Digression` and `MarginFig` must be passed as the `aside` prop of an
`<Aside>` row, never placed bare.

## Styling idiom

Components carry no style props — the look comes from the stylesheet. For your
own layout glue, use the CSS custom properties from `styles.css` (`:root`):

- **Colors** `--yellow` (#f9bc23), `--yellow-underline` (#f2cd05), `--ink`,
  `--ink-soft`, `--grey`, `--grey-light`, `--rule`, `--rule-soft`, `--tint`, `--bg`.
- **Spacing** `--space-1…7` (0.25 → 3rem, for component internals) and the fluid
  band steps `--band-lg` / `--band` / `--band-sm` (separation between page bands).
  `--rule-inset` for text hanging off a vertical rule.
- **Type** `--text-xs…2xl` (fixed), `--display-1…5` and `--lead` (fluid),
  `--leading-*`, `--track-*`. Weights are **400 / 500 / 700 only** — those are the
  faces we ship; 600 gets synthesised and looks it.
- **Widths** `--measure` (40rem reading column), `--measure-wide`, `--page-max`,
  `--gutter`; **radii** `--radius`, `--radius-sm`; **fonts** `--font-sans`,
  `--font-serif`, `--font-mono`.

**A raw number in a margin, padding, gap, font-size or line-height is a smell** —
it belongs on a scale. The exceptions are rhythm set in `em` (it must track its
parent's font-size) and the ASCII flow's `--text-mono` / `--leading-mono`, which
are load-bearing geometry, not style: `AsciiFlow`'s two-column connector is
positioned in monospace rows against them.

Never hard-code new colors or fonts; never add shadows, gradients, cards, or
borders the system doesn't have (its only separators are 1px hairlines
`var(--rule)` and a heavy 2px ink rule before closing blocks).

## Restraint rules (what makes it look right)

- Yellow is an accent, not a surface: one `Highlight` per section, one
  `marked` Ledger numeral, the Kicker tick. The `Subscribe` button is the one
  yellow surface on the site — don't add another.
- One `Hero` per page; `Pullquote` about once per section; the reading column
  stays at `--measure` — wide elements (`FigureWide`, `Ledger`) are deliberate
  exceptions.
- Copy voice: first person, concrete, no hype; em dashes (—); external links
  open in a new tab (`external` prop).

## Images

Images are WebP with a hairline border and radius from the stylesheet — never
add your own borders or shadows. `MarginFig` is the default home (right
margin); `FigureWide` only for the payoff image; `Digression` takes a small
`img` for note-sized visuals; motion is `MarginFig`'s `video` prop (silent
loop + poster), never a GIF. Sample assets ship under `images/`
(delegate-yoda.webp/.jpg, uat-storyboard.webp, cancel-receipt-poster.webp,
cancel-receipt-walkthrough.mp4) — use them as stand-ins until real art exists.

## Where the truth lives

Read `styles.css` (the site's real stylesheet, tokens in `:root`) before
inventing any styling, and each component's `.prompt.md` for its props and a
real usage example.

## Idiomatic example

```tsx
<Essay>
  <Kicker>Now</Kicker>
  <Pullquote>One of those itches was building things again.</Pullquote>
  <Aside aside={<Digression summary="On the acquisition">Turtlemint had been a client since 2021.</Digression>}>
    <p>
      I got AI-pilled, spent weeks inside <a href="https://claude.com/claude-code">Claude Code</a>,
      and took a project from discovery to delivery. Solo — <Highlight>building, not managing</Highlight>.
    </p>
  </Aside>
</Essay>
```
