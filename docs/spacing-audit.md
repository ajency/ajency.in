# Spacing audit — `assets/css/style.css`

Status: **applied.** The scale below is live in `:root`; every margin, padding and
gap now reads from it, except the exemptions in §5. Numbers are measured in Chrome
at 1400px unless noted.

Two things went differently from the proposal:

- **The CTA band kept its asymmetry** — `var(--band)` top, `var(--band-lg)` bottom
  (64 / 96). It's tokenized, but not symmetric: the band closes the page and reads
  better sitting heavier at the base. The comment in the rule says so.
- **`--band` was already taken.** The yellow highlight wash used `--band` for its
  thickness (`background-size: 100% var(--band, 0.32em)`), relying on it being
  *undefined* at `:root` so the 0.32em fallback applied. Defining a spacing token
  by that name would have inherited 64px into it and painted a solid yellow slab
  behind every highlighted phrase and the ledger numeral. It is now `--hl-band`.

---

## 1. What's wrong

**Nine different fluid scales separate the major bands.** Every band invented its
own. Four of them agree only by coincidence.

| Rule | Declaration | Desktop |
|---|---|---|
| `.site-header` | `clamp(1.5rem, 4vw, 2.75rem)` | 44 / 44 |
| `.hero` | `clamp(3rem, 6vw, 4.5rem)` / `clamp(2rem, 6vw, 4rem)` | 72 / 64 |
| `.essay` | `clamp(3rem, 8vw, 6rem)` | — / 96 |
| `.subscribe` | `clamp(2.5rem, 6vw, 4rem)` + `clamp(2rem, 5vw, 3rem)` | 64 mt, 48 pt |
| `.cta` | `clamp(3rem, 8vw, 5rem)` mt, `clamp(2.75rem, 6vw, 4.5rem)` / `clamp(3rem, 8vw, 6rem)` pad | 80 mt, 72 / 96 |
| `.faq-section` | `clamp(2.5rem, 6vw, 4rem)` | 64 mb |
| `.site-footer` | `clamp(2.5rem, 6vw, 4rem)` | 64 / 64 |
| `.writing` | `clamp(1rem, 4vw, 2rem)` | — / 32 |

**Bands are asymmetric for no stated reason.** The hero is 72 on top, 64 below.
The CTA is 72 on top, 96 below. Nothing in the design calls for either.

**Paired components have drifted apart.** `CLAUDE.md` says the desktop `.rail-cta`
and the mobile `.cta` are the same decision at two breakpoints — "edit one, edit
the other". Their internals disagree:

| | `.cta` | `.rail-cta` |
|---|---|---|
| line margin-top | `1.2rem` | `0.85rem` |
| human margin-top | `1.1rem` | `1.25rem` |
| actions gap | `1.5rem` | `0.65rem` |
| actions margin-top | `1.75rem` | `1.25rem` |

**Four values mean "space above a beat":** `.kicker` 3rem, `.essay > h2` 3.25rem,
`.digression` 3.5rem, `.pullquote` / `.figure-wide` 2.75rem.

**The same 1.3rem rule-inset is written out three times** — `.essay blockquote`,
`.digression`, `.rail-cta` — all of which hang text off a vertical rule.

**33 distinct rem values** appear across margin/padding/gap: 3.5, 3.25, 2.75,
2.25, 1.75, 1.4, 1.35, 1.3, 1.25, 1.2, 1.1, 0.9, 0.85, 0.7, 0.65, 0.6, 0.55,
0.45, 0.4, 0.35, 0.3, 0.15… That is not a scale, it's a pile of nudges.

---

## 2. Proposed tokens

Added to the existing `:root` block, beside `--measure` / `--radius`.

```css
/* Fixed steps — component internals */
--space-1: 0.25rem;  /*  4px */
--space-2: 0.5rem;   /*  8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.5rem;   /* 24px */
--space-6: 2rem;     /* 32px */
--space-7: 3rem;     /* 48px */

/* Fluid steps — separation between page bands */
--band-lg: clamp(3rem, 8vw, 6rem);    /* 48 → 96  deep band padding (CTA, essay end) */
--band:    clamp(2.5rem, 6vw, 4rem);  /* 40 → 64  the default band boundary */
--band-sm: clamp(2rem, 5vw, 3rem);    /* 32 → 48  blocks inside a band */

/* The rule-inset: text hanging off a vertical rule */
--rule-inset: 1.5rem;
```

Three fluid steps replace nine. `--band` is already the most-used value (footer,
FAQ, subscribe all land on 64), so it becomes the default and the outliers move
to it rather than the other way round.

---

## 3. Band mapping

⚠ = pixels move; eyeball before accepting.

| Rule | Now (desktop) | Proposed | Effect |
|---|---|---|---|
| `.site-header` padding | 44 / 44 | `--band-sm` / `--band-sm` | ⚠ +4 each. Chrome stays deliberately tighter than a content band. |
| `.hero` padding | 72 / 64 | `--band` / `--band` | ⚠ −8 top. Symmetric. |
| `.essay` padding-bottom | 96 | `--band-lg` | no change |
| `.essay:has(> .subscribe:last-child)` | 0 | 0 | no change (the fix from earlier) |
| `.writing` padding-bottom | 32 | `--space-6` | no change at desktop; stops being fluid |
| `.subscribe` margin-top | 64 | `--band` | no change |
| `.subscribe` padding-top | 48 | `--band-sm` | no change |
| `.cta` margin-top | 80 | `--band` | ⚠ −16. Unifies with subscribe. |
| `.cta` padding | 72 / 96 | `--band-lg` / `--band-lg` | ⚠ +24 top. Symmetric closing band. |
| `.faq-section` margin-bottom | 64 | `--band` | no change |
| `.site-footer` padding | 64 / 64 | `--band` | no change |

**Open question for you:** the CTA's asymmetry (72 top / 96 bottom) may be
deliberate — a closing band that sits heavier at the base. If so, say the word and
it keeps `--band` / `--band-lg` instead, which is still tokenized, just not
symmetric.

---

## 4. Component mapping

| Rule | Now | Proposed | Effect |
|---|---|---|---|
| `.back-link` margin | `0 0 1.5rem` | `0 0 var(--space-5)` | none |
| `.site-header` gap | `1rem` | `--space-4` | none |
| `.header-meta` gap | `1.4rem` | `--space-5` | ⚠ +2 |
| `.subhead` margin-top | `clamp(1rem, 2.5vw, 1.75rem)` | `--space-5` | ⚠ −4 |
| `.hero-lead` / `.hero-actions` margin-top | `clamp(1.5rem, 3vw, 2.25rem)` | `--space-6` | ⚠ −4 |
| `.ledger` margin-top | `2.75rem` | `--space-7` | ⚠ +4 |
| `.ledger-item` gap | `0.4rem` | `--space-2` | ⚠ +2 |
| `.ledger-item` padding | `1.25rem 1.25rem 1.35rem 0` | `--space-4 --space-4 --space-4 0` | ⚠ −4 |
| `.kicker` margin | `3rem 0 1.1rem` | `--space-7 0 --space-4` | ⚠ −2 bottom |
| `.essay > h2` margin | `3.25rem 0 1.1rem` | `--space-7 0 --space-4` | ⚠ −4 top |
| `.pullquote` margin | `2.75rem 0` | `--space-7 0` | ⚠ +4 |
| `.figure-wide` margin | `2.75rem 0` | `--space-7 0` | ⚠ +4 |
| `.digression` margin | `3.5rem 0` | `--space-7 0` | ⚠ −8 |
| `.margin-fig` margin | `2rem 0` | `--space-6 0` | none |
| `.ascii-flow` margin | `1.75rem 0` | `--space-6 0` | ⚠ +4 |
| `.ascii-flow` padding | `1rem 1.1rem` | `--space-4` | ⚠ −2 sides |
| `.essay blockquote` padding-left | `1.3rem` | `--rule-inset` | ⚠ +3 |
| `.digression` padding-left | `1.3rem` | `--rule-inset` | ⚠ +3 |
| `.rail-cta` padding-left | `1.3rem` | `--rule-inset` | ⚠ +3 |
| `.essay blockquote` margin | `2rem 0` | `--space-6 0` | none |
| `.entry` margin / padding-top | `3rem 0 0` / `2.25rem` | `--space-7` / `--space-6` | ⚠ −4 pad |
| `.entry-headword` gap / margin-bottom | `0.75rem` / `0.4rem` | `--space-3` / `--space-2` | ⚠ +2 |
| `.entry-def` margin | `1.5rem 0 2rem` | `--space-5 0 --space-6` | none |
| `.entry-sub` margin | `0 0 1.5rem` | `0 0 --space-5` | none |
| `.entry-etym` margin-top / padding-top | `2.25rem` / `1.5rem` | `--space-6` / `--space-5` | ⚠ −4 |
| `.senses` gap | `1.5rem` | `--space-5` | none |
| `.faq-item` padding | `0.75rem 0` | `--space-3 0` | none |
| `.faq-answer` margin-top | `0.6rem` | `--space-2` | ⚠ −2 |
| `.margin-fig figcaption` margin-top | `0.6rem` | `--space-2` | ⚠ −2 |
| `.digression-body` margin-top | `0.85rem` | `--space-3` | ⚠ −2 |
| `.digression-img` margin-bottom | `0.7rem` | `--space-3` | ⚠ +1 |
| `.post > a` padding | `1.5rem 0` | `--space-5 0` | none |
| `.post-meta` margin-bottom | `0.5rem` | `--space-2` | none |
| `.post-dek` margin-top | `0.55rem` | `--space-2` | ⚠ −1 |
| `.subscribe-line` margin | `0.5rem 0 1.25rem` | `--space-2 0 --space-5` | ⚠ +4 |
| `.subscribe-form` gap | `0.75rem` | `--space-3` | none |
| `.subscribe-email` padding | `0.65rem 0.9rem` | `--space-3 --space-4` | ⚠ +3 tall |
| `.subscribe-btn` padding | `0.65rem 1.4rem` | `--space-3 --space-5` | ⚠ +3 tall |

### The drifted CTA pair — unify both sides

| | `.cta` now | `.rail-cta` now | Proposed (both) |
|---|---|---|---|
| line margin-top | `1.2rem` | `0.85rem` | `--space-4` |
| actions margin-top | `1.75rem` | `1.25rem` | `--space-5` |
| actions gap | `1.5rem` | `0.65rem` | `--space-5` desktop band / `--space-3` rail |
| human margin-top | `1.1rem` | `1.25rem` | `--space-4` |

The actions **gap** is the one place they should legitimately differ: the band
lays two links side by side across a wide measure, the rail stacks them in a 19rem
column. Everything else should match, and today doesn't.

---

## 5. Deliberately left alone

- **Paragraph rhythm in `em`** — `.essay p` `1.5em`, `.hero-lead p` `1.1em`,
  `.essay > ul li` `0.85em`, `.faq-answer p` `0.7em`, `.essay p.closing` `2.5em`,
  `.has-aside` `margin-bottom: 1.5em` + `.has-aside > p` `0.75em`, `.ledger-unit`
  `margin-left: 0.15em`. These scale with their own font-size, which is the
  point. A rem token would break that.
- **The ASCII grid** — `.flow-jump` `margin-top: 20.25em`, `padding-left: 1ch`,
  `2ch`. These are monospace-row and character units; they must stay on that grid.
- **Optical one-offs** — `.essay code` `0.12em 0.36em`, the shared link rule's
  `padding-bottom: 1px` (`.essay a`, `.back-link a`, `.post-title`, CTA links —
  seats the underline wash), `.sense-label` `0.15rem`, `.essay > ul li`
  `padding-left: 0.3rem`, `.digression > summary, .faq-item > summary`
  `padding-right: 1.75rem` (clears the chevron). Snapping these to a scale would
  be worse, not better. Each carries an "off the scale on purpose" comment at
  the rule.
- **Existing layout tokens** — `--gutter`, `--aside-gap`, `--measure`. Already
  centralized and correct.

---

## 6. If we implement

Order, smallest blast radius first:

1. Add the tokens to `:root`. No visual change.
2. Bands (§3) — 11 rules. Verify home, about, and all three posts.
3. The drifted CTA pair (§4) — verify at both breakpoints, since one hides the other.
4. Component internals (§4) — the long tail.

Verify each stage at **1400px and 390px** on: `/`, `/about/`,
`/self-documenting-uat-agent/`, `/one-person-ai-team/`, `/why-erp-fails-indian-smb/`.

Roughly 45 rules change. About half move pixels, none by more than 24.
