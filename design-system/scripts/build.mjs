// Build for the design-sync wrapper package.
// The site's stylesheet (assets/css/style.css) stays the single source of
// truth: this script regenerates styles/ from it on every build, so the
// package never drifts from the site. Then tsc emits dist/ + .d.ts.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = resolve(pkgDir, '..');

const css = readFileSync(join(siteDir, 'assets/css/style.css'), 'utf8');

// Split the @font-face rules out into fonts.css and rewrite their absolute
// /fonts/ URLs to package-relative ones so the woff2 files travel with the
// bundle instead of pointing at the live site's root.
const faceBlocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
if (faceBlocks.length === 0) throw new Error('no @font-face rules found in site stylesheet');
const fontsCss = faceBlocks.join('\n').replaceAll('url(/fonts/', 'url(./fonts/');
let mainCss = css;
for (const block of faceBlocks) mainCss = mainCss.replace(block, '');
// No @import between the two: the converter ships fonts.css via cfg.extraFonts
// and wires both into the bundle's root styles.css itself.
mainCss = mainCss.replace(/\n{3,}/g, '\n\n');

const stylesDir = join(pkgDir, 'styles');
rmSync(stylesDir, { recursive: true, force: true });
mkdirSync(join(stylesDir, 'fonts'), { recursive: true });
writeFileSync(join(stylesDir, 'fonts.css'), fontsCss);
writeFileSync(join(stylesDir, 'styles.css'), mainCss);

const fontFiles = [...fontsCss.matchAll(/url\(\.\/fonts\/([^)]+)\)/g)].map((m) => m[1]);
for (const f of new Set(fontFiles)) {
  copyFileSync(join(siteDir, 'static/fonts', f), join(stylesDir, 'fonts', f));
}
console.log(`styles/: fonts.css (${faceBlocks.length} faces), styles.css, ${new Set(fontFiles).size} woff2`);

execFileSync(join(pkgDir, 'node_modules/.bin/tsc'), ['-p', pkgDir], { stdio: 'inherit', cwd: pkgDir });
console.log('dist/: built');
