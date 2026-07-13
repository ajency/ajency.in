# Ajency.in 2.0 — site notes

Personal site for **Anuj Khurana** — an independent builder ("in pursuit of agency"),
working with early-stage startups through listed enterprises on AI agents, automation,
and products.

## Stack & workflow
- **Hugo** static site (extended, installed via Homebrew). Still just **HTML + one
  CSS file** in spirit — no Node/npm, no JS framework. Hugo only stitches the shared
  chrome (head/header/footer) so it lives in **one place** instead of being copied
  onto every page.
- **Git repo:** `ajency/ajency.in` on GitHub (public), default branch `main`.
- **Hosting: Netlify** — but **a push is NOT a deploy**. Netlify charges credits
  per deploy (free tier: 300/month), so `netlify.toml` carries `ignore = "exit 0"`,
  which makes Netlify skip every git-triggered build. **Deploying is an explicit
  publish decision:**
  - Commit freely; **batch pushes** (target: every 2–3 days, or when a piece of
    work is done).
  - **Publish** = `rm -rf public && hugo --gc --minify && netlify deploy --prod
    --dir public` (the CLI is logged in and linked to the `ajency` project;
    `rm -rf public` first because Hugo doesn't prune stale files).
  - `netlify api listSiteDeploys …` shows deploy states if something looks off.
  - `netlify.toml` pins `HUGO_VERSION`; keep it in step with local `hugo version`.
  - `public/` is **gitignored**.
  - DreamHost serves **DNS only** (domain registered at GoDaddy). The apex `A`
    record points at Netlify (`75.2.60.5`); `www` is a CNAME to
    `ajency.netlify.app`.
  - ⚠️ **Never touch the MX / SPF / DKIM / DMARC records.** Email is Google
    Workspace with `p=reject` + strict alignment, so a mangled record gets mail
    **rejected**, not junked. The DKIM key is a split TXT record — the classic
    thing a DNS migration corrupts. This is why the site is *not* behind
    Cloudflare: its free tier demands the whole zone.
- **Preview:** `hugo server --renderToMemory` → http://localhost:1313 (live reload).
  ⚠️ Use `--renderToMemory`. A plain `hugo server` **writes to `public/`** and
  rewrites every URL to `localhost:1313` — including `sitemap.xml`.
- **Build:** `hugo --gc --minify` → `public/`. **Never hand-edit `public/`** — it's
  generated, and Hugo does not prune stale files from it (`rm -rf public` first if
  something was renamed or removed).
- **Drafts:** `draft = true` in front matter keeps a page out of the build, the
  sitemap *and* RSS. Used to retire a page without deleting it. Retiring a page also
  means removing its `<li>` from the Writing list in `content/_index.html`;
  publishing one means the reverse (drop `draft = true` **and** add the `<li>`).
- **Analytics: GoatCounter** (dashboard: https://ajency.goatcounter.com), loaded
  from the shared footer. No cookies, ignores localhost. Own views are excluded per
  browser by visiting any page with `#toggle-goatcounter` appended (localStorage
  flag; the same URL toggles it back).
- Page JS is deliberately minimal: the `<details>`-sync script in
  `content/about.html` and the GoatCounter snippet in `footer.html`. No styling in
  JS, ever.

## Performance — decisions worth not re-litigating
- **Fonts are self-hosted** in `static/fonts/` (12 woff2: Work Sans + Libre
  Baskerville, latin + latin-ext; vietnamese dropped). `@font-face` lives at the top
  of `assets/css/style.css`. Do **not** reintroduce the Google Fonts `<link>` — it put a
  render-blocking `fonts.googleapis.com → fonts.gstatic.com` chain in front of first
  paint. `head.html` preloads the two faces every page needs above the fold
  (Work Sans 400 + 700).
- **Zero third-party requests**, with one deliberate exception: the async
  GoatCounter script. Anything else third-party needs a very good reason.
- **Images are WebP** with the original PNG/JPG kept as a `<picture>` fallback.
  Size sources to the rendered slot: margin figures render at 176px wide on
  desktop / 352px on mobile, so ~704px source width covers retina; full-measure
  figures (~640px slot) warrant the full-resolution source.
- **Video over GIF**: `<video autoplay loop muted playsinline preload="none">` with
  a WebP poster (a 5.6 MB GIF became a 465 KB H.264). Source GIFs are archived in
  `originals/` (outside `static/`, so never published).
- **The stylesheet is minified + content-hashed** by Hugo Pipes. Source lives in
  **`assets/css/style.css`** (*not* `static/`); `head.html` runs it through
  `resources.Get | minify | fingerprint` and emits
  `/css/style.min.<sha256>.css` with an SRI `integrity` attribute.
  - ⚠️ **Edit the CSS in `assets/css/`.** A file dropped back into `static/style.css`
    would be published but never linked — it would look like your edits do nothing.
  - Why: the hash is in the filename, so a CSS change is a *new URL*. That makes a
    stale hit impossible, which is what lets `/css/*` be cached for a year. Without
    it, a deploy touching HTML + CSS could serve **new HTML with old CSS**.
- **`static/_headers`** sets cache policy on Netlify: `/fonts/*` and `/css/*` immutable
  for a year (both are content-addressed — fonts by stable filename, CSS by hash),
  `/images/*` 30 days. HTML needs no rule: Netlify edge-caches it and purges on deploy.
- `font-weight: 600` is used in a few rules but no 600 face is loaded; the browser
  synthesises it from 500/700. Pre-existing and intentional-by-omission.

## Layout of the repo
- `hugo.toml` — config (baseURL, OG image defaults, `security.allowContent` so
  hand-written `.html` content files are allowed).
- `content/` — **one file per page**, each = TOML front matter + the page's `<main>`
  inner HTML (passed through verbatim — not Markdown):
  - `_index.html` — **home** (`/`): hero → Writing section → full-width CTA.
  - `about.html` — **personal essay / story** (`/about/`). `← Back` link + the
    `<details>`-sync script.
  - `self-documenting-uat-agent.html` — live post: the UAT agent that documents
    itself.
  - `one-person-ai-team.html` — live post: "The whole elephant" — one person + AI
    agents delivering full projects, proven on the ERP delivery. The same copy runs
    as a LinkedIn post; the two bodies are deliberately identical.
  - `four-hours-v2.html` — draft, kept only as material to mine. Its lesson is a
    principle now: never leave two near-identical pages live — each canonicalises
    to itself and they compete in search. One canonical page per idea.
  - Front-matter vars drive the head: `title` (full `<title>`), `description` (meta),
    `og_type`/`og_title`/`og_description`, optional per-page
    `og_image`/`og_image_width`/`og_image_height`/`og_image_alt`, `schema`
    (`website` | `blogposting` | `""`) which picks the JSON-LD node, and `[[params.faq]]`
    entries that render as FAQPage JSON-LD.
- `layouts/` — **the shared chrome, defined once:**
  - `_default/baseof.html` — page skeleton (doctype → head → header → main → footer).
  - `_default/single.html`, `index.html` — wrap `.Content` in `<main>`.
  - `partials/head.html`, `header.html`, `footer.html`, `schema.html` — **edit these
    to change the head/header/footer/structured-data on every page at once.**
- `assets/` — **processed** by Hugo (not copied verbatim). Currently just
  `css/style.css`, the single stylesheet (tokens in `:root`). **This is where you
  edit the CSS.**
- `static/` — served at site root **as-is**: `fonts/`, `images/`, `favicon*`,
  `apple-touch-icon.png`, `og-image.png`, `robots.txt`, `llms.txt`, and `_headers`
  (Netlify cache/security headers). ⚠️ Reference these with **root-absolute** paths
  (`/fonts/…`) — pages live at `/about/`, so relative paths would break.
- `netlify.toml` — build command, publish dir, pinned `HUGO_VERSION`.
- `originals/` — source assets deliberately kept **out of `static/`** so Hugo never
  publishes them.
- `sitemap.xml` + RSS (`index.xml`) are **auto-generated by Hugo**. Drafts are
  excluded from both.
- ⚠️ **`ajency/` (+ `ajency.tar`) is an archive of the OLD WordPress site.** Ignore it
  entirely — Hugo doesn't read it. It is ~7.4 GB and **gitignored**: `ajency.tar`
  alone is 2.2 GB, far over GitHub's 100 MB file limit, so it must never be committed.

## Writing workflow — how posts get made
- **Three gated steps: outline → copy → visuals.** Each step is discussed and
  approved before the next begins. The outline pins audience, hero message, flow,
  and what's deliberately excluded.
- **Never touch the HTML while copy is under discussion.** Share suggested text in
  chat; edit files only after "approved / go ahead / put in html."
- **Feedback lands one item at a time** — process the correction, show the result,
  wait for the next.
- **Everything is reviewed on localhost before it ships.** Push to `main` only when
  asked to publish.
- Posts usually run on **both the site and LinkedIn with identical body text**; the
  site adds furniture (hero, FAQ block, inline links) that LinkedIn drops. External
  links go in LinkedIn's first comment, not the post body.

## Copy principles — gleaned from every correction so far
- **The cringe test.** If a line could have been written by AI for anyone, rewrite
  it. Real rejected examples: "systems that perceive, decide, and act",
  "the world finally caught up", "it doesn't — and the why is the interesting
  part", "each layer only hands down what it can't do itself". Grounded, real,
  honest; low on adjectives; zero hype.
- **Accuracy beats flourish.** Never invent a mechanism, a "someone", or a fact
  about Anuj's history or systems to make a sentence land. Every such invention has
  been caught and corrected ("there is no someone. i am an independent builder";
  UAT checks copy/layout/feel — bugs are already caught by API and browser tests).
  When paraphrasing his work, verify against what he actually said, not against
  plausibility.
- **The honesty test.** Claims must survive "is it actually true?". And if a claim
  needs defending, don't defend it — restate it so it doesn't ("why are we bringing
  this up. feels defensive"). State what's true and let the specifics argue.
- **Words are precise.** Skills vs roles, checking vs testing, "a new way became
  possible" vs "I changed". When he corrects a word, the distinction matters —
  carry it through the whole piece.
- **Fewer words win.** Text that repeats what an image or figure already shows gets
  cut. Long glosses get compressed ("Product held the trunk. Design, the ear.").
  One idea per sentence.
- **Humor is self-deprecating and light** (seagull management, "I'm lazy in a
  specific way"). Metaphor budget: ~2 per post, never re-explained once landed.
- **Specifics earn credibility**: ₹1,000-crore dealer, four months, 70k tokens,
  named models with links. Avoid startup-landing clichés ("worst case / best
  case", "no pitch, no funnel", "optional but encouraged").
- First person, calm, curiosity-led. Personal warmth (motorcycles & cocktails) is
  welcome but must feel genuine, not bolted on.
- Home CTA audience = founders (early-stage → listed enterprise). Lead with proof
  of having done the work; the offer is a peer conversation, not a sale.
- Use `&mdash;` for em dashes. External links get `target="_blank" rel="noopener"`.

## Layout instincts — how pages are composed
- **Reuse existing styles before inventing new ones.** The site already has the
  vocabulary: `.kicker`, `.pullquote`, `.agency-lines` + `.highlight` (yellow band
  on the punch clause — sparingly, ~one per section), `.has-aside` +
  `.margin-fig` / `.digression`, `.figure-wide`, `.ascii-flow`.
- **The reading column is sacred.** Images default to the margin column
  (`.has-aside` + `.margin-fig`); an image earns the main column (`.figure-wide`)
  only when it *is* the payoff. A margin figure must never open up empty space in
  the reading column beside it.
- **ASCII flowcharts (`.ascii-flow`) over prose** for technical flows — they say in
  one diagram what three paragraphs of copy would.
- Emphasis comes from the existing devices, not new ones: highlight for the punch
  clause, pullquote for the turn, kicker for section starts.

## SEO / AEO playbook
- **Slugs carry keywords**, not metaphors (`/one-person-ai-team/`, not
  `/whole-elephant/` — the metaphor lives in the title). Renaming is free while a
  page is unindexed; **no redirect is needed for a URL that was never indexed.**
- **Target long-tail questions and AI-assistant citations, not head terms.** A
  two-post site won't win "AI agents"; it can own "can one person deliver a full
  software project with AI agents". Each post picks 3–4 specific queries; the
  answer to each exists on the page as a literal Q→A pair.
- **Every post ends with the FAQ block** — heading "Straight answers, for humans
  and crawlers alike" — with the questions phrased exactly as the target searches,
  duplicated in `[[params.faq]]` front matter so `schema.html` emits FAQPage
  JSON-LD. Numbers-bearing, concrete answers get quoted by assistants.
- **New post checklist:** `content/<keyword-slug>.html` with `schema =
  "blogposting"`, a `date`, `description`/OG params, its own `og_image` (a ~1200px
  JPEG of the post's illustration), alt text that carries the target topic, FAQ
  params, and the `<li>` on the home Writing list.
- One canonical page per idea — never two near-identical pages live at once.
- `llms.txt` and `robots.txt` exist in `static/` for crawlers and AI agents.
