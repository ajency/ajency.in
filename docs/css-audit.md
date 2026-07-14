# CSS audit — everything that isn't spacing

Companion to `spacing-audit.md`, which covered margin/padding/gap. This one covers
type, colour, borders, breakpoints and the rest.

Status: **applied.** The type scale, leading, tracking and `--font-mono` tokens are
live in `:root`; the 600 weight is gone; breakpoints are rem and named.

Two things worth recording, both decided during the apply:

- **Tracking got three negative tokens, not one.** §5 proposed a single
  `--track-tight`, but −0.01 / −0.02 / −0.03em are used at three different display
  sizes, and negative tracking legitimately scales with size — the bigger the type,
  the tighter it sets. Collapsing them to one value would have been standardization
  for its own sake. They are `--track-heading`, `--track-display`, `--track-numeral`.
- **The ASCII flow's size and leading are now `--text-mono` / `--leading-mono`**,
  documented in `:root` as load-bearing. Tokenized so they have a name, but at
  their existing values (0.74rem / 1.35) — see §3.

---

## 0. What's already fine — leave it alone

Worth saying up front, because it's most of the properties:

- **Colour: 100% tokenized.** Every `color:` and `background:` in the file reads
  from a var (`--ink`, `--ink-soft`, `--grey`, `--grey-light`, `--yellow`,
  `--yellow-underline`, `--rule`, `--rule-soft`, `--tint`, `--bg`). There is not a
  single literal hex or rgb outside `:root`. Nothing to do.
- **Border radius: tokenized** (`--radius`, `--radius-sm`, `--radius-xs`).
- **Borders: consistent.** Ten declarations, all `1px`/`2px solid var(--…)`. The
  vocabulary is small and it's used honestly: 1px for hairlines, 2px for the
  emphatic (yellow left rule, the CTA's closing rule).
- **Transitions:** exactly one, used twice (`background-size 0.18s ease` — the
  growing underline). Nothing to standardize.

So this audit is really about **type** and **breakpoints**.

---

## 1. Font sizes — 30 distinct values

Twelve of them sit between 0.7rem and 0.97rem, i.e. twelve "small text" sizes
within a hair of each other:

| Value | Used by |
|---|---|
| 0.7rem | `.entry-origin` |
| 0.72rem | `.kicker` |
| 0.74rem | `.ascii-flow` |
| 0.78rem | `.ledger-label`, `.post-meta` |
| 0.82rem | `.margin-fig figcaption` (wide) |
| 0.875rem | `.copyright` |
| 0.88rem | `.rail-cta-human` |
| 0.9rem | `.digression > summary::before` |
| 0.92rem | `.margin-fig figcaption` |
| 0.95rem | `.back-link`, `.header-loc`, `.entry-sub`, `.entry-etym`, `.sense-label`, `.cta-human` |
| 0.97rem | `.rail-cta-line`, `.digression-body p` |
| 1rem | `.contact-link`, `.digression`, `.post-dek`, `.sense-n`, `.entry-pos`, controls |

`.copyright` at 0.875 and `.rail-cta-human` at 0.88 differ by **0.4 of a pixel**.
`.rail-cta-line` at 0.97 and `.digression` at 1rem differ by half a pixel. These
aren't decisions, they're drift.

### Proposed type scale

```css
--text-xs:   0.75rem;   /* 12px — uppercase kickers, meta, labels */
--text-sm:   0.875rem;  /* 14px — captions, footnotes, copyright */
--text-md:   0.95rem;   /* 15px — secondary/grey prose */
--text-base: 1rem;      /* 16px — UI, controls, digression body */
--text-lg:   1.125rem;  /* 18px — body copy (the <body> default) */
--text-xl:   1.2rem;    /* 19px — lead-ins: blockquote, cta-line, closing */
--text-2xl:  1.28rem;   /* 20px — serif titles: FAQ summary, rail CTA title */
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
--text-mono: 0.74rem;   /* the ASCII flow — see the ⚠ in §3 */
```

Seven steps, and the collapse is nearly free:

| Now | → | Effect |
|---|---|---|
| 0.7, 0.72, 0.78 | `--text-xs` | ⚠ ±1px on kickers/meta |
| 0.82, 0.86em, 0.88, 0.9, 0.92 | `--text-sm` | ⚠ ±1px on captions |
| 0.97 | `--text-md` | ⚠ −0.3px |
| 1.05 (`.hero-actions`, `.cta-actions`, `.rail-cta .cta-primary`) | `--text-base` | ⚠ **−0.8px, visible on the CTA links** |
| 1.3 (`.wordmark`) | `--text-2xl` | ⚠ −0.3px |

**The monospace stack is written out twice** (`.essay code`, `.ascii-flow`) — one
`--font-mono` token fixes that.

**Open question:** the 1.05rem action links. Folding them to 1rem shrinks the
"Grab 30 minutes →" links slightly. The alternative is an eighth step at 1.05.
I lean toward folding — the primary CTA already carries 1.2rem for emphasis — but
it's the one change here you'd actually see, so it's your call.

---

## 2. Fluid display sizes — 11 clamps, 11 different formulas

Every large size invented its own curve:

| Selector | clamp |
|---|---|
| `.hero h1` | `(2.5rem, 8vw, 5.5rem)` |
| `.entry-word` | `(2.2rem, 6vw, 3.1rem)` |
| `.ledger-num` | `(2rem, 5vw, 2.9rem)` |
| `.cta-title` | `(1.8rem, 4.5vw, 2.6rem)` |
| `.pullquote` | `(1.6rem, 4vw, 2.3rem)` |
| `.essay > h2` | `(1.4rem, 3vw, 1.75rem)` |
| `.subhead` | `(1.25rem, 3vw, 1.75rem)` |
| `.post-title` | `(1.3rem, 3vw, 1.6rem)` |
| `.subscribe-title` | `(1.25rem, 3vw, 1.5rem)` |
| `.entry-def` | `(1.3rem, 2.6vw, 1.5rem)` |
| `.hero-lead p` | `(1.15rem, 2.2vw, 1.3rem)` |

The bottom six are all "roughly 1.25 → 1.6, fluid" and are indistinguishable in
practice. Proposed — six tokens:

```css
--display-1: clamp(2.5rem, 8vw, 5.5rem);    /* hero h1 */
--display-2: clamp(2.2rem, 6vw, 3.1rem);    /* entry word, ledger numeral */
--display-3: clamp(1.8rem, 4.5vw, 2.6rem);  /* CTA title */
--display-4: clamp(1.6rem, 4vw, 2.3rem);    /* pull quote */
--display-5: clamp(1.4rem, 3vw, 1.75rem);   /* section headings, subhead, subscribe title */
--lead:      clamp(1.15rem, 2.2vw, 1.3rem); /* hero lead, entry definition */
```

⚠ `.ledger-num` moving to `--display-2` grows it (2.9 → 3.1rem cap). `.post-title`
and `.subscribe-title` moving to `--display-5` grow them too (1.6/1.5 → 1.75rem).
Both are visible; both are the point (they're headings, they should agree).

---

## 3. Line heights — 15 distinct values

1, 1.04, 1.05, 1.15, 1.18, 1.2, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.85.

Proposed six:

```css
--leading-none:    1;      /* the ledger numeral */
--leading-display: 1.05;   /* hero h1 (1.04), entry word (1.05) */
--leading-heading: 1.2;    /* h2, post title, cta title (1.15), pullquote (1.18) */
--leading-snug:    1.3;    /* serif titles */
--leading-normal:  1.5;    /* 1.4, 1.45, 1.5, 1.55 all land here */
--leading-body:    1.65;   /* body copy; 1.6 folds in */
--leading-loose:   1.85;   /* .agency-lines — deliberately airy, kept */
```

### ⚠ Do NOT touch `.ascii-flow`'s `line-height: 1.35`

It is **load-bearing**. The flowchart's connector is positioned with
`margin-top: 20.25em` — that's *15 rows × 1.35em*, computed against this exact
line-height. Snapping it to 1.4 shifts the arrow off the escalation box, which is
the bug we just spent a session fixing. It stays 1.35, and the rule should say so.
Same for `font-size: 0.74rem`: the two-column layout is sized so 44 monospace
characters fit the measure.

---

## 4. Font weights — the phantom 600

`400`, `500`, `600`, `700` are all in use, **but no 600 face is loaded.** The
browser synthesises it from 500 (`CLAUDE.md` already notes this). Four rules ask
for it:

| Selector | What it is |
|---|---|
| `.kicker` | uppercase, letterspaced |
| `.entry-origin` | uppercase, letterspaced |
| `.post-meta` | uppercase, letterspaced |
| `.cta-primary` | the "Grab 30 minutes →" link |

The three uppercase labels are tiny and letterspaced, where synthetic weight is
nearly invisible — those are safe to move to **500** (a real face). `.cta-primary`
is body-size and the synthesis is more likely to show; it wants **700**.

Recommendation: drop 600 entirely, so every weight on the page maps to a font file
we actually ship. Three weights, three files. ⚠ Visible on the CTA link.

---

## 5. Letter spacing — fine, but name it

Six values: `-0.03em`, `-0.02em`, `-0.01em`, `0`, `0.12em`, `0.15em`. This is
coherent already — negative tightening scales with display size, positive tracking
is for uppercase labels. The only wart: `.post-meta` tracks at `0.12em` while
`.kicker` and `.entry-origin` (same uppercase-label role) track at `0.15em`.

```css
--track-tight: -0.02em;  /* display */
--track-label: 0.15em;   /* uppercase labels — .post-meta joins at 0.15 */
```

⚠ `.post-meta` 0.12 → 0.15 widens the "2026 · AI AGENTS" line slightly.

---

## 6. Breakpoints — three, in two units, none named

| Breakpoint | Used by |
|---|---|
| `min-width: 1080px` | `.has-aside` margin column, `.writing-row` rail |
| `max-width: 46rem` (= 736px) | `.ascii-flow-split` stacking |
| `max-width: 620px` | `.header-loc` hiding |

**Honest constraint: CSS custom properties do not work in media queries.**
`@media (min-width: var(--bp-wide))` is invalid and silently fails — this is a
spec limitation, not an oversight, and no amount of tokenizing fixes it. (Native
`@custom-media` isn't in browsers yet.)

So the fix here is convention, not variables:

1. **Pick one unit.** Currently 1080px and 620px are px while 46rem is rem — so a
   user's font-size setting moves one breakpoint and not the others. Recommend
   **rem throughout**: `67.5rem` (1080), `46rem` (736), `38.75rem` (620).
2. **Declare them once, in a comment block at the top of the file**, so there's a
   single place to look — and repeat the name in each `@media`'s comment.

---

## 7. If we implement

1. Tokens into `:root` (type, leading, tracking, `--font-mono`). No visual change.
2. Map font-sizes and line-heights. Verify every page.
3. Drop the 600 weight. ⚠ Look at the CTA link specifically.
4. Breakpoint units → rem, with the comment block.

Visible changes to expect, in rough order of noticeability: the CTA action links
shrink (1.05 → 1rem), `.post-title` / `.subscribe-title` / `.ledger-num` grow to
meet their shared display step, the CTA link's weight changes (600 → 700), and
`.post-meta`'s tracking widens. Everything else moves by a pixel or less.

Verify at 1400px and 390px on `/`, `/about/`, `/self-documenting-uat-agent/`,
`/one-person-ai-team/`, `/why-erp-fails-indian-smb/`.
