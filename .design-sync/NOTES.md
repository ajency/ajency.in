# design-sync notes — ajency.in

This repo is a Hugo site, not a React design system. The synced package is
`design-system/` — thin React wrappers over the site's real CSS vocabulary.
`design-system/scripts/build.mjs` regenerates `styles/` from
`assets/css/style.css` on every build (fonts split into `fonts.css` with
relative URLs, copied from `static/fonts/`), so the site stylesheet stays the
single source of truth. Never hand-edit `design-system/styles/`.

- Converter invocation (no dist self-install; entry passed explicitly):
  `node .ds-sync/package-build.mjs --config .design-sync/config.json
  --node-modules design-system/node_modules --entry design-system/dist/index.js
  --out ./ds-bundle`
- `cfg.buildCmd` (`npm --prefix design-system run build`) must run before the
  converter whenever `assets/css/style.css` or `design-system/src/` changed.
- Doc examples live in `design-system/docs/`; cross-check sample props against
  the live partials (`layouts/partials/*.html`) — the site's contact address is
  `talktous@ajency.in`, LinkedIn is `linkedin.com/in/anujkhurana`.
- Real copy for previews comes from `content/*.html` and `layouts/partials/`.
  Never invent facts about Anuj (site copy principle).
- Essay-scoped components (Kicker, Pullquote, Highlight, Quote, Aside,
  Digression, MarginFig, FigureWide, Faq, DictionaryEntry) render unstyled
  outside `<Essay>` — every preview wraps in it.
- `Highlight` must sit inside a `<p>` inside Essay.
- No image assets ship in the bundle: MarginFig/FigureWide previews use inline
  SVG data-URI placeholders (#e8e8e4, "figure" label).
- The `.has-aside` margin-column layout only engages at `min-width: 1080px`;
  Aside/Digression/MarginFig carry `cfg.overrides` viewport `1280x640`
  (cardMode single) so captures show the true margin arrangement.

- Sample images ship in the bundle under `images/` via
  `.design-sync/sync-images.sh` (copies from `static/images/`). The converter
  wipes `ds-bundle/` on every run, so RE-RUN THE SCRIPT after every
  package-build/resync, before upload. The upload plan must include
  `images/**`. Previews reference them as `../../../images/<file>` (relative
  to the card's `components/<group>/<Name>/` dir).

## Known render warns

- `[FONT_MISSING] "Baskerville"` — intentional: it's the system-font fallback
  in `--font-serif: 'Libre Baskerville', Baskerville, Georgia, serif`. Libre
  Baskerville itself ships (12 woff2). Accepted, not a missing brand font.

## Re-sync risks

- `design-system/docs/` examples and `.design-sync/previews/*.tsx` quote live
  site copy (CTA text, footer columns, post titles/deks, the a·jen·cy entry).
  When site copy changes, they silently go stale — re-check against
  `content/` and `layouts/partials/` on re-sync.
- Wrappers mirror the class vocabulary of `assets/css/style.css` by hand. A
  renamed/added CSS class or component pattern on the site needs a matching
  wrapper edit in `design-system/src/` — nothing detects this automatically.
- `.d.ts` parse check is skipped by validate ("typescript not in
  node_modules" — it looks next to the bundle); d.ts files are tsc-generated,
  low risk.
- Toolchain assumed: node 26, npm; playwright chromium cached at
  ~/Library/Caches/ms-playwright (chromium-headless-shell v1228).
