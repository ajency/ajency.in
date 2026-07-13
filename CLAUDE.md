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
- **Hosting: Netlify**, deployed from that repo. **A push to `main` is a deploy** —
  Netlify runs `hugo --gc --minify` itself (see `netlify.toml`, which pins
  `HUGO_VERSION`; keep it in step with local `hugo version`). There is no manual
  upload step and `public/` is **gitignored** — never deploy it by hand.
  - Was on DreamHost + SFTP until 2026-07-12. DreamHost still serves **DNS only**
    (domain is registered at GoDaddy). The apex `A` record points at Netlify
    (`75.2.60.5`); `www` is a CNAME to `ajency.netlify.app`. Rollback = point the
    `A` record back at `69.163.177.47`; TTLs are 60s.
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
  sitemap *and* RSS. Used to retire a page without deleting it. If you retire a
  page, also remove its `<li>` from the Writing list in `content/_index.html`.
- The only page JS is a small inline script in `content/about.html` (syncs the
  margin-aside `<details>` open-state to the breakpoint).

## Performance — decisions worth not re-litigating
- **Fonts are self-hosted** in `static/fonts/` (12 woff2: Work Sans + Libre
  Baskerville, latin + latin-ext; vietnamese dropped). `@font-face` lives at the top
  of `assets/css/style.css`. Do **not** reintroduce the Google Fonts `<link>` — it put a
  render-blocking `fonts.googleapis.com → fonts.gstatic.com` chain in front of first
  paint. The site now makes **zero third-party requests**. `head.html` preloads the
  two faces every page needs above the fold (Work Sans 400 + 700).
- **Images are WebP** with the original PNG/JPG kept as a `<picture>` fallback.
- **The walkthrough is an MP4**, not a GIF: `<video autoplay loop muted playsinline
  preload="none">` with a WebP poster. 5.6 MB GIF → 465 KB H.264. The source GIF is
  archived in `originals/` (outside `static/`, so it is never published).
- **The stylesheet is minified + content-hashed** by Hugo Pipes. Source lives in
  **`assets/css/style.css`** (*not* `static/`); `head.html` runs it through
  `resources.Get | minify | fingerprint` and emits
  `/css/style.min.<sha256>.css` with an SRI `integrity` attribute. 23.3 KB → 13.5 KB.
  - ⚠️ **Edit the CSS in `assets/css/`.** A file dropped back into `static/style.css`
    would be published but never linked — it would look like your edits do nothing.
  - Why: the hash is in the filename, so a CSS change is a *new URL*. That makes a
    stale hit impossible, which is what lets `/css/*` be cached for a year. Before
    this, the HTML was revalidated on every load but the CSS was cached for an hour —
    so a deploy touching both could serve **new HTML with old CSS** for up to an hour.
- **`static/_headers`** sets cache policy on Netlify: `/fonts/*` and `/css/*` immutable
  for a year (both are content-addressed — fonts by stable filename, CSS by hash),
  `/images/*` 30 days. HTML needs no rule: Netlify edge-caches it and purges on deploy.
- `font-weight: 600` is used in a few rules but no 600 face is loaded; the browser
  synthesises it from 500/700. Pre-existing and intentional-by-omission.
- `font-weight: 600` is used in a few rules but no 600 face is loaded; the browser
  synthesises it from 500/700. Pre-existing and intentional-by-omission.

## Layout of the repo
- `hugo.toml` — config (baseURL, OG image defaults, `security.allowContent` so
  hand-written `.html` content files are allowed).
- `content/` — **one file per page**, each = TOML front matter + the page's `<main>`
  inner HTML (passed through verbatim — not Markdown):
  - `_index.html` — **home** (`/`): hero → Writing section → full-width CTA.
  - `about.html` — **personal essay / story** (`/about/`; linked from home as
    "Read the story →"). Has a `← Back` link + the `<details>`-sync script.
  - `self-documenting-uat-agent.html` — live blog post
    (`/self-documenting-uat-agent/`). Was `four-hours.html` → `/four-hours/` until
    2026-07-13; renamed for a keyword-bearing URL. No redirect exists, and none is
    needed — the old URL was never indexed.
  - `one-person-ai-team.html` — **live** (published 2026-07-13). "The whole
    elephant": one person + AI agents delivering full projects end to end, proven
    on the ERP delivery. Rewritten from scratch, replacing `whole-elephant.html`
    (old URL never indexed, no redirect needed). The same copy runs as a LinkedIn
    post; body text is deliberately identical between the two. One full-width
    illustration (`management-pattern-01`) opens the essay; its 1200px JPEG
    (`management-pattern-01-og.jpg`) is the page's own OG/Twitter card via the
    per-page `og_image*` front-matter params supported by `head.html`.
  - `four-hours-v2.html` — **draft.** A longer rewrite of the same post that shared
    ~79% of its wording; both were live and in the sitemap, each canonicalising to
    itself, so Google was shown two near-identical competing pages. The shorter one
    won. Kept as a draft because it is worth mining for material.
  - Front-matter vars drive the head: `title` (full `<title>`), `description` (meta),
    `og_type`/`og_title`/`og_description`, and `schema`
    (`website` | `blogposting` | `""`) which picks the per-page JSON-LD node.
- `layouts/` — **the shared chrome, defined once:**
  - `_default/baseof.html` — page skeleton (doctype → head → header → main → footer).
  - `_default/single.html`, `index.html` — wrap `.Content` in `<main>`.
  - `partials/head.html`, `header.html`, `footer.html`, `schema.html` — **edit these
    to change the head/header/footer/structured-data on every page at once.**
- `assets/` — **processed** by Hugo (not copied verbatim). Currently just
  `css/style.css`, the single stylesheet (tokens in `:root`), which `head.html`
  minifies + fingerprints into `/css/style.min.<hash>.css`. **This is where you edit
  the CSS.**
- `static/` — served at site root **as-is**: `fonts/` (self-hosted woff2), `images/`,
  `favicon*`, `apple-touch-icon.png`, `og-image.png`, `robots.txt`, `llms.txt`, and
  `_headers` (Netlify cache/security headers). ⚠️ Reference these with
  **root-absolute** paths (`/fonts/…`) — pages live at `/about/`, so relative paths
  would break.
- `netlify.toml` — build command, publish dir, pinned `HUGO_VERSION`.
- `originals/` — source assets deliberately kept **out of `static/`** so Hugo never
  publishes them (currently the 5.3 MB source GIF superseded by the MP4).
- `sitemap.xml` + RSS (`index.xml`) are **auto-generated by Hugo** into `public/`.
  Drafts are excluded from both.
- ⚠️ **`ajency/` (+ `ajency.tar`) is an archive of the OLD WordPress site.** Ignore it
  entirely — Hugo doesn't read it; it is not part of the live site. It is ~7.4 GB and
  **gitignored**: `ajency.tar` alone is 2.2 GB, far over GitHub's 100 MB file limit,
  so it must never be committed.

## Design language (keep edits consistent with this)
- **Fonts:** Work Sans (headline + body), Libre Baskerville *italic* (serif accent —
  subheads, eyebrows).
- **Color tokens:** `--yellow #f9bc23`, `--yellow-underline #f2cd05`, `--ink #1b1c1e`,
  `--ink-soft`, `--grey`. Yellow is used sparingly as an accent.
- **Links:** signature "growing yellow underline" on hover. **No filled buttons** —
  every CTA is a text link.
- **Width hierarchy (important):**
  - `--measure` (40rem) → reading width: the essay body and the article list.
  - `--measure-wide` (48rem) → hero lead + CTA text (statements read wider than the
    reading list; the contrast is intentional).
  - Header, footer, and the CTA band span the full page (`--page-max`, 72rem) so their
    rules run edge-to-edge.
- **Kicker:** small uppercase label preceded by a short yellow tick (`.kicker`).
- Minimal chrome, generous whitespace, left-aligned, one big headline per page.

## CSS conventions (keep the one stylesheet clean)
All styling lives in **`assets/css/style.css`** (Hugo minifies + fingerprints it into
`/css/style.min.<hash>.css` — never edit the built file, and never put CSS back in
`static/`, where it would be published but not linked). The goal is to never need a
cleanup pass. Follow these so it stays that way:
- **Write it readable.** Do not hand-minify or strip comments — `minify` does that at
  build time, and it only shrinks the *output*. Comments cost nothing in production.
- **No inline `style=` and no `<style>` blocks**, ever — add a class and a rule instead.
  (The lone `<script>` in `about.html` syncs `<details>` open-state to the breakpoint;
  it does *not* style anything, and no styling should ever be done in JS.)
- **No raw colors in rules.** Every `#hex`/`rgba()` must be a `:root` token (`--ink`,
  `--grey`, `--rule`, `--rule-soft`, `--tint`, …). If a colour isn't tokenised yet, add
  the token, don't inline the literal.
- **Tokenise shared magic numbers**, not one-offs. Radii use `--radius` (4px, figures) /
  `--radius-sm` (3px, code & small) / `--radius-xs` (2px, focus). Widths use the
  `--measure*` / `--page-max` / `--aside-*` tokens. A value used once locally can stay
  literal; a value repeated or conceptually shared becomes a token.
- **Don't duplicate rule blocks.** When two selectors want the same treatment, give them
  one rule with a comma-separated selector list (e.g. the growing-underline links share
  `.essay a, .footer-col a, .back-link a, .contact-link, .hero-actions a, .cta-actions a`).
  `.post-title`'s wipe-in underline is deliberately a *different* effect — not a dupe.
- **No `!important`.** Resolve conflicts with specificity/cascade instead — e.g.
  `.essay p.agency-lines` outranks `.essay p` on its own.
- **Media queries hold only what changes.** Put shared properties in the base rule; a
  `@media` block should contain just the declarations that actually differ at that
  breakpoint (the wide layout starts at `min-width: 1080px`).
- After any CSS change: `hugo --gc --minify` must build clean, and a quick check that
  `grep -rn 'style=' layouts content` and `grep -n '!important' assets/css/style.css` both
  come back empty.

## Copy voice
- First person, calm, curiosity-led. Slower/considered, not hype.
- **Avoid startup-landing clichés** ("worst case / best case", "no pitch, no funnel",
  "optional but encouraged"). Earn credibility with specifics, not slogans.
- Home CTA audience = founders (early-stage → listed enterprise). Lead with proof of
  having done the work; make the offer a peer conversation, not a sale.
- Personal warmth (motorcycles & cocktails) is welcome but must feel genuine, not
  bolted on.
- Use `&mdash;` for em dashes. External links get `target="_blank" rel="noopener"`.

## Open TODOs
- ~~Restore the elephant post to the Writing list~~ — done: rewritten as
  `one-person-ai-team.html` and published 2026-07-13; the list now carries it plus
  `self-documenting-uat-agent`. (A "Buzzword compliant" placeholder that pointed at
  `#` was removed earlier and has no page behind it.) Publishing a post = restore
  its `<li>` in `content/_index.html` **and** drop `draft = true`.
- **New posts** = a new `content/<slug>.html` with `schema = "blogposting"` + a `date`.
- ~~Fingerprint `style.css`~~ — done: minified + content-hashed via Hugo Pipes,
  `/css/*` now cached for a year.
- ~~`sitemap.xml`~~ — auto-generated by Hugo, not a manual task.
- ~~Deploy by SFTP~~ — replaced by push-to-deploy on Netlify.
