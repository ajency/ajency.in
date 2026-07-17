---
name: ajency-seo
description: The SEO/AEO decisions for ajency.in — slugs, title/description lengths, the FAQ block, cross-linking, the new-post checklist, and the llms.txt discipline. Load BEFORE writing, editing, publishing or retiring any page, and before touching static/llms.txt, front-matter title/description/og_image, or the home Writing list. Also load when weighing generic SEO advice (including the vendored claude-seo skills) against what this site has already decided.
---

# SEO / AEO playbook — ajency.in

These are **decisions already made**, not options. Generic SEO advice — including
the vendored `claude-seo` skills in `.claude/skills/seo*` — does not know any of
them and will confidently recommend against them. Weigh its output against this
file; don't apply it straight.

## The rules

- **Slugs carry keywords**, not metaphors (`/one-person-ai-team/`, not
  `/whole-elephant/` — the metaphor lives in the title). Renaming is free while a
  page is unindexed; **no redirect is needed for a URL that was never indexed.**
- **Target long-tail questions and AI-assistant citations, not head terms.** A site
  this size won't win "AI agents"; it can own "can one person deliver a full
  software project with AI agents". Each post picks 3–4 specific queries; the
  answer to each exists on the page as a literal Q→A pair.
- **Every post ends with the FAQ block** — heading "Straight answers, for humans
  and crawlers alike" — with the questions phrased exactly as the target searches,
  duplicated in `[[params.faq]]` front matter so `schema.html` emits FAQPage
  JSON-LD. Numbers-bearing, concrete answers get quoted by assistants.
  - ⚠️ Google **retired FAQ rich results for all sites on 7 May 2026** — there is no
    SERP feature to win here anymore. The block stays anyway: its audience is the
    AI-citation one, and that still reads it. Do not let an audit talk you into
    removing it, and do not justify it by rich results.
- **Titles ≤60 visible chars, keyword phrase first** — Google truncates around
  there. The metaphor lives in the h1/og_title; the `<title>` leads with the
  search phrase ("Why ERP fails at the Indian dealership counter: Mama ji…", not
  the other way round). **Meta descriptions ≤160 chars**, the number-bearing
  specifics up front — the first cut of every description here ran 200–290 and
  truncated before its hook.
- **Posts cross-link.** Every post links at least one other post where the
  material genuinely overlaps (the ERP post → the delivery story it came from).
  A post with zero internal links is an orphan to crawlers.
- **Posts show a human-visible date** — the `<time>` at the end of the hero
  subhead. `datePublished` in JSON-LD alone isn't enough; assistants and
  freshness heuristics want it on the page.
- **One or two h2s phrased as the target question** ("Where does ERP adoption
  actually die?") — the collapsed FAQ satisfies the letter, but question-phrased
  headings over extractable answers are what get lifted into AI answers. Don't
  force it on every heading.
- **One canonical page per idea** — never two near-identical pages live at once.
  Each would canonicalise to itself and they'd compete in search.

## New post checklist

`content/<keyword-slug>.html` with:
- `schema = "blogposting"` and a `date`
- `description` / OG params (lengths above)
- its own `og_image` (a ~1200px JPEG of the post's illustration). ⚠️ Without it the
  post falls back to the generic site card **and** its BlogPosting JSON-LD ships
  with no `image` — `schema.html` only emits `image` when the param is set.
- alt text that carries the target topic
- `[[params.faq]]` entries
- a cross-link to a related post
- `width`/`height` on every `<img>`
- the `<li>` on the home Writing list in `content/_index.html`
- **an entry in `static/llms.txt`**

Retiring a page is the reverse: `draft = true`, remove the `<li>`, remove the
llms.txt entry.

## llms.txt — the file that rots loudest

`llms.txt` and `robots.txt` live in `static/` for crawlers and AI agents. llms.txt
lists every live page with pretty URLs (`/about/`, never `/about.html`) and a
number-bearing one-liner each.

It is written **for** the AI-citation audience — which is the whole point of this
site's SEO strategy — so its staleness is the most expensive kind. It went a full
redesign stale once: still describing the old single-essay site while three posts
shipped, pointing AI crawlers at a 404.

**Verify its URLs against a build, never against memory:**

```
hugo list all      # CSV: path,slug,title,date,…,permalink,kind,section
hugo list drafts
```

Those cannot go stale — they *are* the site. Any hand-maintained list of pages
(llms.txt, the home Writing list, prose in CLAUDE.md) is drift waiting to happen;
this has already bitten three separate files.
