# ajency.in — how to build with this system

This is the design system of ajency.in, a personal essay-driven site: one
white page, generous whitespace, Work Sans for body and headlines, Libre
Baskerville *italic* as the serif accent, and a single brand-yellow accent
spent sparingly. Calm, editorial, low on chrome — never dashboard-like.

## Page skeleton

Every page is: `<SiteHeader>` → `<Hero>` (one big headline — the page's single
loudest element) → content → `<Cta>` (at most one, page end) → `<SiteFooter>`.
Long-form content lives inside `<Essay>`; the home page uses `<PostList>`.

## Essay scoping — the one rule that breaks silently

All essay typography is CSS-scoped to the `.essay` container that `<Essay>`
renders. `Kicker`, `Pullquote`, `Highlight`, `Quote`, `Aside`, `Digression`,
`MarginFig`, `FigureWide`, `Faq`, and `DictionaryEntry` render UNSTYLED unless
nested inside `<Essay>`. Plain `<p>`, `<h2>`, `<ul>`, `<a>`, and `<code>`
inside an Essay are styled automatically (links get the growing yellow
underline; list markers are yellow). `Highlight` must sit inside a `<p>`.
`Digression` and `MarginFig` must be passed as the `aside` prop of an
`<Aside>` row, never placed bare.

## Styling idiom

Components carry no style props — the look comes from the stylesheet. For your
own layout glue, use the CSS custom properties from `styles.css` (`:root`):
colors `--yellow` (#f9bc23), `--yellow-underline` (#f2cd05), `--ink`,
`--ink-soft`, `--grey`, `--grey-light`, `--rule`, `--rule-soft`, `--tint`,
`--bg`; widths `--measure` (40rem reading column), `--measure-wide`,
`--page-max`, `--gutter`; radii `--radius`, `--radius-sm`; fonts `--font-sans`,
`--font-serif`. Never hard-code new colors or fonts; never add shadows,
gradients, cards, or borders the system doesn't have (its only separators are
1px hairlines `var(--rule)` and a heavy 2px ink rule before closing blocks).

## Restraint rules (what makes it look right)

- Yellow is an accent, not a surface: one `Highlight` per section, one
  `marked` Ledger numeral, the Kicker tick. Never yellow backgrounds/buttons.
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
