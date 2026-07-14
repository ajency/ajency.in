---
name: ai-tells
description: Review a page or post's copy for AI-writing tells (negation templates, em-dash density, triads, filler, grandiosity) and report flagged lines with suggested rewrites. Use when asked to check content for AI tells, review copy before publishing, or vet a new draft. Argument: a content file path (e.g. content/about.html), a URL path (e.g. /about/), or pasted draft text.
argument-hint: <content file, URL path, or draft text>
---

# AI-tells copy review

Review the given copy against `ai-copy-rules.md` (repo root — read it first;
it is the source of truth and this skill only defines the procedure). Report
findings in chat. **Never edit the file** — per the writing workflow in
CLAUDE.md, copy changes happen only after each rewrite is explicitly approved.

## Resolving the target

- `content/*.html` path → read it. Review body copy AND front matter
  (`title`, `description`, `og_description`, `[[params.faq]]` answers) —
  metadata gets quoted by assistants and must match the body's register.
- URL path like `/about/` → map to the content file (`/` → `content/_index.html`,
  `/about/` → `content/about.html`, `/<slug>/` → `content/<slug>.html`).
- Pasted text (e.g. a LinkedIn draft) → review the text directly.
- No argument → ask which page or draft to review.

Ignore HTML tags, the `.ascii-flow` diagrams, and code. Do review alt text,
figcaptions, and FAQ answers — but grade FAQ answers gently: they are a
deliberate AEO device and are allowed to read slightly mechanical.

## The checks (run all, in this order)

**1. Negation templates** — the #1 tell. Grep the copy for `not `, `isn't`,
`wasn't`, `don't`, `didn't`, `never`, `more than`, `instead of` and inspect
each hit for the shape "not X, (it's) Y" and its variants ("X, not Y",
"more than just X", "You don't need X…"). Budget: **one earned contrast per
page**, and only where the negated half carries real information. Flag any
instance hinged on an em dash as HIGH — that combination is the exact
ChatGPT signature.

**2. Em-dash density** — count `&mdash;` and `—` in body prose (exclude
furniture: ledger labels, the dictionary entry, FAQ parentheticals,
figcaptions, alt text). Target ≤ 1 per 150–200 words, never two in one
sentence, never inside a negation. Report the count, the word count, and
each dash that should become a comma, colon, period, or parentheses.

**3. Triads and staccato** — three parallel adjectives/phrases/fragments
("Slower. Calmer. Curiosity-led."). Concrete triads (three real nouns doing
work) are LOW; abstract ones are MEDIUM. Suggest cutting to two items or
breaking the parallelism.

**4. Mirrored aphorisms / bows** — chiastic or perfectly symmetrical
sentences, and sections that end on a polished punch line. Budget: one bow
per page (usually the closing highlight). Flag the surplus.

**5. Filler tics and magic adverbs** — genuinely, actually, truly, quietly,
deeply, fundamentally, seamlessly, effortlessly. Flag ~90% of them.

**6. Grandiosity and significance-labelling** — unearned scale ("the
entirety of human knowledge"), pivotal/crucial/testament/game-changer,
trailing "-ing" significance clauses ("…, highlighting the importance of").

**7. Banned vocabulary** — delve, tapestry, landscape, leverage, harness,
unlock, elevate, empower, foster, showcase, robust, seamless, vibrant,
meticulous, navigate, realm, journey, cutting-edge (full list in
ai-copy-rules.md Tier 4). One is noise; three is a flag.

**8. Windups, openers, closers** — "It's important to note", "Here's the
thing", question-then-instant-answer, "In today's…" openers, conclusions
that restate the piece, "future looks bright" endings.

**9. Copula avoidance** — "serves as", "stands as", "represents", "boasts"
where "is/has" would do.

**10. Repetition check** — the same phrase echoed across title, subhead,
body, alt text, and FAQ (one-point dilution); or synonym-cycling where the
plain word should just repeat.

## Reporting

Lead with the verdict: pass / minor cleanup / needs surgery, plus the two
headline numbers (negation count vs. the one-per-page budget; em-dash rate).

Then findings as a numbered list, most severe first, each with:
- the quoted line (trimmed) and `file:line`
- which check it tripped and severity (HIGH / MEDIUM / LOW)
- a suggested rewrite in Anuj's register — grounded, fewer words, first
  person, no invented facts (the copy principles in CLAUDE.md apply to the
  suggestions too; a rewrite that adds hype or a made-up mechanism is worse
  than the tell)

Also name what should be KEPT: earned contrasts, the page's one bow, jokes,
and anything protected by the "kept on purpose" reasoning — so a future
pass doesn't sand the voice off. If the page is clean, say so plainly and
stop; do not manufacture findings to fill a report.

End by reminding that rewrites go into HTML only after line-by-line
approval.
