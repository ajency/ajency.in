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
  means removing its `<li>` from the Writing list in `content/_index.html` **and its
  entry in `static/llms.txt`**; publishing one means the reverse (drop `draft = true`,
  add the `<li>`, add the llms.txt entry). llms.txt went a full redesign stale once —
  it kept describing the old single-essay site while three posts shipped, and pointed
  AI crawlers (its whole audience) at a 404.
- **Analytics: GoatCounter** (dashboard: https://ajency.goatcounter.com), loaded
  from the shared footer. No cookies, ignores localhost. Own views are excluded per
  browser by visiting any page with `#goatcounter-off` appended; `#goatcounter-on`
  resumes counting (localStorage flag, one browser/device at a time). Both hashes
  are idempotent and self-clearing — a *toggle* silently cancelled itself whenever
  the browser ran the page twice (address-bar prerender), so don't reintroduce one.
- **Events = intent to talk, nothing else.** Only the actions that could start a
  conversation are counted, via `data-goatcounter-click="<name>"` on the link (no JS).
  GoatCounter cannot record *which page* an event fired on, so the page is baked into
  the name:
  - `cta-book-call-<slug>` / `cta-email-<slug>` — the two CTA links. `cta.html` derives
    `<slug>` from the page itself (`home`, `about`, `one-person-ai-team`, …), so a new
    post gets its own conversion counters with **no extra work** — and you can see which
    post actually converts.
  - ⚠️ Home has **two** CTAs — the `.rail-cta` in `_index.html` (desktop) and the shared
    `.cta` band (mobile; CSS hides one or the other). They deliberately carry the **same**
    event names, since only one is ever visible and the split is a breakpoint, not a
    decision. Edit one, edit the other.
  - `header-email`, `header-whatsapp`, `header-linkedin` — chrome, so deliberately flat
    (not per-page): the question is only "which channel do people reach for".
  - **Don't count curiosity** — no events on `<details>` digressions, videos, or internal
    nav, and no scroll-depth (it would mean adding page JS for a number nobody acts on).
    A pageview already says "they read it".
- Page JS is deliberately minimal: the `<details>`-sync script and the
  GoatCounter snippet, both in `footer.html` (the sync script no-ops on pages
  without digressions). No styling in JS, ever.

## Performance — decisions worth not re-litigating
- **Fonts are self-hosted** in `static/fonts/` (12 woff2: Work Sans + Libre
  Baskerville, latin + latin-ext; vietnamese dropped). `@font-face` lives at the top
  of `assets/css/style.css`.
  - **₹ stays ₹.** U+20B9 lives in the latin-ext subset, so any page with a rupee
    amount pulls one extra ~36 KB woff2. Deliberate: correct typography over the
    one-time fetch (the file is cached immutable for a year). Don't "fix" it by
    rewriting copy to "Rs". Do **not** reintroduce the Google Fonts `<link>` — it put a
  render-blocking `fonts.googleapis.com → fonts.gstatic.com` chain in front of first
  paint. `head.html` preloads the two faces every page needs above the fold
  (Work Sans 400 + 700).
- **Zero third-party requests**, with one deliberate exception: the async
  GoatCounter script. Anything else third-party needs a very good reason.
- **Images are WebP** with a PNG/JPG `<picture>` fallback.
  Size sources to the rendered slot: margin figures render at 176px wide on
  desktop / 352px on mobile, so ~704px source width covers retina; full-measure
  figures (~640px slot) warrant ~1280px.
  - **Every `<img>` carries its intrinsic `width`/`height`** (CSS still scales it;
    the attributes are what let the browser reserve the box — no CLS). Below-fold
    images get `loading="lazy"`; a post's above-fold hero figure gets
    `fetchpriority="high"` instead, never lazy.
  - **Encode with `magick` (JPEG) / `cwebp` (WebP), not `sips`** — sips compresses
    ~2× worse at the same quality. q72–78 is the sweet spot for the illustrations.
  - **Check the WebP is actually smaller than its fallback** before shipping the
    pair: a lossy-encoded flat illustration once shipped a 23 KB WebP next to a
    5.5 KB PNG (lossless `cwebp` got it to 4.5 KB). And the fallback must be
    slot-sized too — one `<picture>` carried a 2.84 MB full-res PNG behind a
    238 KB WebP.
  - Giant source exports (ChatGPT/originals) stay out of `static/` — resize on the
    way in; the original lives in `originals/` or just in Downloads.
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
- Only **three weights** are shipped (400/500/700) and only three are used. The
  stylesheet used to ask for `600` in four rules with no 600 face loaded — the
  browser synthesised it. That's gone; see the CSS section below.

## CSS — rules the stylesheet enforces on itself
- **⚠ Editing `assets/css/style.css` means re-running the design-system build:**
  `npm --prefix design-system run build`. That script regenerates
  `design-system/styles/` **from** the site stylesheet — the site is the single
  source of truth and the package is derived output (`styles/` and `dist/` are
  gitignored). Nothing triggers it automatically, so it silently goes stale: the
  spacing + type refactor left it shipping the *old* CSS, tokens and all, until
  it was rebuilt by hand. **Rebuild in the same change as the CSS edit**, never as
  a follow-up you'll forget.
- **Spacing comes from the scale.** `:root` defines `--space-1…7` (fixed, for
  component internals) and `--band-lg` / `--band` / `--band-sm` (fluid, for the
  separation between page bands), plus `--rule-inset` for text hanging off a
  vertical rule. **A margin/padding/gap with a raw number in it is a smell** —
  either it belongs on the scale, or it's one of the documented exemptions:
  paragraph rhythm in `em` (it must scale with its own font-size), the ASCII
  flow's `ch`/`em` monospace grid, and a few optical nudges (each commented as
  such, so nobody "fixes" them). Full mapping: `docs/spacing-audit.md`.
  - Why it matters: before the scale there were **nine** ad-hoc `clamp()`s doing
    one job — separating bands — and 33 distinct rem values. Sections stacked
    their cushions against each other and left voids (the dead space under the
    subscribe form was `.essay`'s padding-bottom + `.cta`'s margin-top + `.cta`'s
    padding-top, all doing the same job).
- **⚠ Before defining a `:root` variable, `grep -- "--name"` first.** The
  highlight wash reads `background-size: 100% var(--band, 0.32em)` and *depended
  on `--band` being undefined* so the fallback applied. Adding a spacing token by
  that name inherited 64px into it and would have painted a solid yellow slab
  behind every highlighted phrase. It's `--hl-band` now. A `var(--x, fallback)`
  that relies on `--x` being unset is a landmine — name such vars distinctively.
- **⚠ A bare class on a `<p>` inside `.essay` loses to `.essay p`.** `.essay p`
  is `0-1-1`; `.flow-jump` is `0-1-0`, so **every margin it set was silently
  dropped** — the CSS comment described an offset the browser never applied.
  Scope such rules (`.ascii-flow .flow-jump`) rather than reaching for
  `!important`. Same trap for any new `.essay p.foo`.
- **⚠ `.kicker` (and similar) are scoped, not global.** The rules read
  `.essay .kicker, .faq-section .kicker, .writing .kicker` — using the class in a
  new section renders **unstyled with no error** until the section is added to the
  selector list (the home "Writing" label shipped as a default paragraph this way).
  When markup uses an existing class in a new container, check the selector's scope
  actually reaches it.
- **Inherited `white-space: pre` doesn't wrap.** `.ascii-flow` sets it, so any
  prose inside a flow diagram must opt back out (`white-space: normal`) or it
  runs as one unbroken line — `max-width` won't save it.
- **Type comes from the scale too.** `--text-xs…2xl` (fixed), `--display-1…5` +
  `--lead` (fluid), `--leading-*`, `--track-*`, `--font-mono`. Same rule: a raw
  font-size/line-height is a smell unless it's relative-by-design (`em`, so it
  tracks its parent — `.essay code`, `.ledger-unit`) or an icon glyph (the FAQ
  `+`/`−`). There were **30 font-sizes** and **15 line-heights** before this;
  `.copyright` (0.875) and `.rail-cta-human` (0.88) differed by 0.4 of a pixel.
  Mapping: `docs/css-audit.md`.
- **⚠ Never change `.ascii-flow`'s `--text-mono` / `--leading-mono` (0.74rem /
  1.35).** They are **load-bearing, not style**: `.flow-jump` positions the
  flowchart's connector at `margin-top: 20.25em` = *15 rows × 1.35em*, and the
  two 44-char columns are sized to fit the measure at 0.74rem. Touch either and
  the arrow slides off the box it points at.
- **Only three font weights exist — 400 / 500 / 700 — because that's what we
  ship.** `600` was in use with no 600 face loaded, so the browser synthesised it.
  If a rule wants 600, it wants 500 (small letterspaced labels) or 700 (body-size
  emphasis). Adding a weight means adding font files and a preload.
- **Colour, radius, borders and transitions are already fully tokenized** — no
  literal hex/rgb outside `:root`, one transition in the whole file. Keep it that
  way; a new literal colour is a bug, not a choice.
- **Breakpoints: three, all rem, none of them variables.** `bp-narrow` 38.75rem,
  `bp-stack` 46rem, `bp-wide` 67.5rem — indexed in the comment block at the top of
  `style.css`, and each `@media` repeats its name. ⚠ They **cannot** be custom
  properties: `@media (min-width: var(--bp))` is invalid CSS and fails *silently*.
  Rem (not px) so a reader's font-size setting moves the breakpoints with the type.
- **Verify layout by measuring, not by eyeballing.** These were all invisible in
  a screenshot until measured: `getBoundingClientRect()` in the browser tells you
  a gap is 0px and a computed `margin-top` is `0px` when the source says
  `20.25em`.

## Layout of the repo
- `hugo.toml` — config (baseURL, OG image defaults, `security.allowContent` so
  hand-written `.html` content files are allowed).
- `content/` — **one file per page**, each = TOML front matter + the page's `<main>`
  inner HTML (passed through verbatim — not Markdown):
  - `_index.html` — **home** (`/`): hero → Writing section → full-width CTA.
  - `about.html` — **personal essay / story** (`/about/`).
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
    (`website` | `blogposting` | `aboutpage` | `""`) which picks the JSON-LD node, and
    `[[params.faq]]` entries that render as FAQPage JSON-LD (via `faq.html`) — one
    source feeds both the on-page block and the structured data.
    ⚠️ Without `og_image`, a post falls back to the generic site card **and** its
    BlogPosting JSON-LD ships without an `image` — `schema.html` only emits it
    when the param is set. Every post sets one.
- `layouts/` — **the shared chrome, defined once:**
  - `_default/baseof.html` — page skeleton (doctype → head → header → main → footer).
  - `_default/single.html`, `index.html` — wrap `.Content` in `<main>`.
  - `partials/head.html`, `header.html`, `footer.html`, `schema.html` — **edit these
    to change the head/header/footer/structured-data on every page at once.**
- `assets/` — **processed** by Hugo (not copied verbatim). Currently just
  `css/style.css`, the single stylesheet (tokens in `:root`). **This is where you
  edit the CSS.**
- `static/` — served at site root **as-is**: `fonts/`, `images/`, `favicon*`,
  `apple-touch-icon.png`, `og-image.png`, `robots.txt`, `llms.txt`, `_headers`
  (Netlify cache/security headers), and `_redirects` (301s: every old-WordPress
  URL → home, old feeds → `/index.xml`; non-forced, so they can never shadow a
  live page). ⚠️ Reference these with **root-absolute** paths
  (`/fonts/…`) — pages live at `/about/`, so relative paths would break.
- `netlify.toml` — build command, publish dir, pinned `HUGO_VERSION`.
- `originals/` — source assets deliberately kept **out of `static/`** so Hugo never
  publishes them.
- `sitemap.xml` is auto-generated by Hugo; RSS (`index.xml`) uses the **custom
  template `layouts/_default/rss.xml`** — posts only (`schema = "blogposting"`),
  item descriptions from front-matter `description`. Hugo's default template was
  shipping the full page HTML as each item ("← Back" as the first line in feed
  readers). Drafts are excluded from both.
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
- **Specifics earn credibility**: ₹500-crore-plus dealer, four months, 70k tokens,
  named models with links. Avoid startup-landing clichés ("worst case / best
  case", "no pitch, no funnel", "optional but encouraged").
- ⚠️ **The ERP client is anonymized in all public copy** (site, llms.txt, alt
  text, OG images, illustrations): "₹500-crore-plus", no Jharkhand/Koderma, no
  Maruti ("the carmaker"). The illustrations use fictional geography (Patna,
  Bhagalpur). Never "correct" copy back to the real specifics.
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
- **New post checklist:** `content/<keyword-slug>.html` with `schema =
  "blogposting"`, a `date`, `description`/OG params (lengths above), its own
  `og_image` (a ~1200px JPEG of the post's illustration), alt text that carries
  the target topic, FAQ params, a cross-link to a related post, `width`/`height`
  on every `<img>`, the `<li>` on the home Writing list, **and an entry in
  `static/llms.txt`**.
- One canonical page per idea — never two near-identical pages live at once.
- `llms.txt` and `robots.txt` exist in `static/` for crawlers and AI agents.
  llms.txt lists every live page with pretty URLs (`/about/`, never `/about.html`)
  and a number-bearing one-liner each — it is the file written *for* the AI-citation
  audience, so it goes stale loudest. Verify its URLs against a build when touching it.
