# Strategy — how ajency.in wins

The judgement half of `ajency-seo`. `SKILL.md` holds the rules a page must pass;
this file holds what to *do*, and why.

Everything below is sourced. Where the evidence contradicts something this site
believes, that's marked ⚠️ rather than quietly reconciled — mined from the vendored
`claude-seo` skills (`.claude/skills/seo-geo/`, `seo/references/`), which carry
primary sources with verification dates. **Re-check anything marked with a date;
this field moves fast.**

## The one-line version

The site's entire advantage is that its content is **first-hand and non-commodity**.
That is not a nice-to-have — it is the single thing Google names as what actually
matters for AI search. Everything else here is secondary, and some of it is theatre.

---

## What Google actually says (primary source)

> "Optimizing for generative AI search is **still SEO** from Google's perspective.
> AEO and GEO are rebranded labels for the same work."
> — [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (verified 2026-05-18)

**Eligibility floor:** a page must be indexed and snippet-eligible in classic Search
to appear in *any* AI surface. There is no separate "AI index". A page that isn't
indexed cannot be cited, no matter how citable its prose.

**What Google says matters:** unique, non-commodity, first-hand content. Their own
worked example contrasts "7 Tips for First-Time Homebuyers" (commodity) against
"Why We Waived the Inspection & Saved Money: A Look Inside the Sewer Line" (lived
experience).

That second example *is* this site. "Mama ji is not a discrepancy" — field notes
from cash counters in Jhumri Telaiya, a ₹500-crore-plus dealer, a number nobody
else has — is the exact shape Google describes. **The moat is the reporting, not
the markup.** Protect the thing that makes the copy specific and first-hand; it is
doing more work than any technical lever on this list.

### Google's myth list — things you do NOT need to do

| Claim Google rejects | Does this site do it? |
|---|---|
| Create `llms.txt` or AI-specific markup files | **Yes** ⚠️ see below |
| "Chunk" content into small pieces for AI | No |
| Rewrite content for AI with specific phrasings / long-tail variations | **Partly** ⚠️ the FAQ block is phrased "exactly as the target searches" |
| Chase inauthentic mentions across blogs / forums / videos | No — and don't start |
| Over-invest in structured data specifically for AI features | **Partly** ⚠️ FAQPage JSON-LD |

Google's warning signs to self-audit against: writing to a target word count,
entering niches without expertise, faking publication-date freshness, mass content
churn for "freshness" signals. This site does none of them. Keep it that way — the
refresh cadence below is about *genuinely revisiting* posts, not date-bumping.

---

## ⚠️ llms.txt is not a citation lever

This site treats `llms.txt` as "the file written *for* the AI-citation audience".
**The evidence says no major AI search system consumes it.**

| Source | Date | Finding |
|---|---|---|
| John Mueller (Google) | 2025 | "No AI system currently uses llms.txt." Compared it to meta keywords. |
| Gary Illyes (Google) | Jul 2025 | Google has no plans to support it. |
| SE Ranking, 300k-domain study | Nov 2025 | Of the 50 most AI-cited domains, **one** had an llms.txt. |
| OtterlyAI, server-log audit | 2025 | **0.1%** of AI-bot traffic requests it (84 of 62,100). |
| Anthropic, Stripe, Cloudflare, NVIDIA | 2024–25 | All publish one. **None** say their crawlers read third-party ones. |

(`seo-geo/references/llmstxt-evidence.md`, verified 2026-05-17. Google's own myth
list independently rejects it.)

**Where it does matter:** AI *coding* agents (Cursor, Cline, Claude Code) read
`llms.txt` for per-library docs. This is not a developer-docs site, so that path
doesn't apply.

**What to do:** keep the file — it costs nothing and buys optionality if a provider
adopts it. But **stop treating it as load-bearing**, and don't spend a single
judgement call on it that you'd rather spend on the copy. Its correctness is worth
a lint check; its evangelism is not worth a paragraph in CLAUDE.md.

**Revisit if:** any major AI search system documents consumption, OtterlyAI/SE
Ranking show an inflection in request rate, or Mueller/Illyes retract.

---

## Where the leverage actually is

### 1. Recency — the highest-leverage lever this site has

Content under **3 months old is ~3x more likely to be cited**; pages left stale
**6+ months lose citation eligibility** (SE Ranking, 1.3M-citation study).

Every post here is fresh *today* and will be stale by default. This is the one
mechanical thing that decays without anyone touching it — and the one where a
calendar beats an insight.

**Do:** revisit each post on a ~quarterly cadence and genuinely update it — a new
number, what changed since, what turned out wrong. **Don't** bump the date without
changing the content; Google names "faking publication-date freshness" as a warning
sign, and a real revisit is a better post anyway.

### 2. Brand mentions >> backlinks

Brand mentions correlate **3x more strongly** with AI visibility than backlinks
(Ahrefs, Dec 2025, 75,000 brands).

| Signal | Correlation with AI citations |
|---|---|
| YouTube mentions | ~0.737 (strongest) |
| Reddit mentions | High |
| Wikipedia presence | High |
| LinkedIn presence | Moderate |
| Domain Rating (backlinks) | ~0.266 (weak) |

This reframes what "SEO work" means here: **chasing links is close to worthless;
being talked about is not.** The LinkedIn cross-posting already in the workflow is
the one signal being actively fed — and it's the weakest of the four that count.

⚠️ Google explicitly rejects *chasing inauthentic mentions*. The play is not
mention-farming. It's that genuine participation where the audience already argues
about this stuff (Reddit, YouTube) is worth more than any backlink campaign — and
only if it's real. If it isn't going to be real, skip it; the content moat is the
better investment.

### 3. Front-loading — with an honest tension

- **~44%** of AI citations come from the **first 30%** of a page (SE Ranking).
- Optimal citable passage: **134–167 words**, self-contained.
- Direct answer in the **first 40–60 words** of a section.

⚠️ **This is in direct tension with how these posts are written, and the tension
should not be resolved by default.** The posts open on a narrative hook — "At
closing, the day's cash doesn't go into a safe; it goes home with a man everyone
calls Mama ji." That is the best sentence on the page and the reason a human keeps
reading. Replacing it with "ERP adoption fails at Indian dealerships because…"
would buy citability and cost the thing that makes the post worth citing.

**The resolution is additive, not substitutive:** the FAQ block at the end already
*is* the self-contained, extractable answer. That's why it earns its place — not
because of FAQPage schema. If you want more citability, the lever is a question-
phrased H2 over an extractable answer **in the first third of the page**, not
sanding down the opening.

### 4. Two Google surfaces, not one

AI Overviews and AI Mode agree on the *answer* ~86% of the time but cite the **same
URLs only 13.7%** of the time (Ahrefs, 540K query pairs).

- **AI Overviews** — strongly ranking-correlated. Cites what already ranks. For a
  new, tiny site, this is gated behind classic ranking. Slow.
- **AI Mode** (Gemini 3.5 Flash, default since I/O 2026) — weakly ranking-correlated,
  broader pool (~9 domains cited/query). Freshness and entity authority outweigh raw
  position.

**AI Mode is the realistic target.** A 4-post site will not out-rank incumbents into
AI Overviews any time soon, but AI Mode's pool is broad and freshness-weighted —
which is exactly the axis a small, genuinely-updated site can compete on. This is
the strategic reason recency (§1) outranks everything else here.

Platform sourcing differs sharply: ChatGPT leans Wikipedia (47.9%) and Reddit
(11.3%); Perplexity leans Reddit (46.7%). Only **11%** of domains are cited by both
ChatGPT and Google AIO for the same query — there is no single "AI visibility".

### 5. Already won — don't re-spend effort here

- **AI crawlers do not execute JavaScript.** This site is static HTML with no
  framework. Perfect by construction; nothing to do.
- **robots.txt explicitly welcomes AI crawlers** (GPTBot, ClaudeBot, PerplexityBot,
  OAI-SearchBot). Done.
- **Dates, bylines, first-hand authorship, specific numbers.** All present.
- **Multi-modal** (+156% selection rate): illustrations and video already ship.

---

## The FAQ block — why it stays

Google **retired FAQ rich results for all sites on 7 May 2026**. There is no SERP
feature left to win, and Google's myth list rejects over-investing in structured
data for AI features. So the schema is not the reason.

The block stays because **it is the self-contained, extractable answer** the
citability research describes (§3) — and because a reader with the literal question
gets a straight answer. Both survive the rich-result retirement.

⚠️ But note the myth list: "rewrite content for AI with specific phrasings or
long-tail keyword variations". Phrasing FAQ questions *exactly as the target search*
is arguably that. The defence is that these are real questions real people asked —
the cashiers in the UAT post literally asked "How do I cancel an incorrect money
receipt?". **Keep it honest: if a FAQ question is one nobody would ask aloud, it's
keyword-stuffing with extra steps, and Google's own guidance says it won't work.**

---

## Known blind spot

**We cannot currently verify indexation.** No Google API credentials are configured
(`google_auth.py --check` → Tier -1), so there is no Search Console data: no way to
confirm these pages are indexed, snippet-eligible, or drawing impressions.

Since indexation is the **eligibility floor** for every AI surface, this is the one
gap where the site is flying blind — and no amount of on-page work substitutes for
knowing whether the page is in the index at all. Everything in this file assumes
indexation; that assumption is unverified.

Fixing it costs a free API key. It is the highest-value missing input here.

---

## What to do next, in order

1. **Verify indexation.** Free GSC/PageSpeed key → `seo-google`. Everything else
   assumes it.
2. **Set a refresh cadence.** Quarterly, genuine. It's the top lever and it decays
   on a clock.
3. **Keep writing first-hand posts.** The moat, and what Google names as decisive.
4. **Consider one question-phrased H2 + extractable answer in the first third** of
   each post — additive, not at the expense of the opening.
5. **Leave llms.txt alone.** Correct, not evangelised.
6. **Ignore backlinks.** Weak correlation (~0.266). Not worth the hours.

## Sources

- Google AI optimization guide — https://developers.google.com/search/docs/fundamentals/ai-optimization-guide (verified 2026-05-18)
- Google, creating helpful content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- `seo-geo/references/llmstxt-evidence.md` (verified 2026-05-17)
- `seo-geo/SKILL.md` — Ahrefs brand-mention study (Dec 2025), SE Ranking citability + recency studies, Ahrefs AIO-vs-AI-Mode (540K query pairs)
