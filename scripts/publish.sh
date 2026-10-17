#!/usr/bin/env bash
# Build, encrypt the client proposals, verify, deploy. This IS the publish command.
#
#   scripts/publish.sh               build + encrypt + verify + netlify deploy --prod
#   scripts/publish.sh --no-deploy   same, minus the deploy (inspect public/ locally)
#
# Each client folder under public/proposals/<slug>/ is encrypted in place with
# StatiCrypt (AES-256, PBKDF2 600k). Password per client, never written to disk:
#   STATICRYPT_PASSWORD_<SLUG>   e.g. STATICRYPT_PASSWORD_ACME_CORP for acme-corp
# or typed at the prompt when the variable is unset. Use the SAME password on
# every redeploy: the key is password + the salt in private/.staticrypt-<slug>.json,
# and a changed password breaks the client's "remember me".
#
# The deploy is refused if anything under public/proposals/ could be read
# without the password: an HTML page without StatiCrypt's marker or with a
# plaintext <main>, or a file type StatiCrypt doesn't encrypt (.js, .xml, .json…).
# Client data goes inline via `inline_js` in front matter, not as a linked file.
set -euo pipefail
cd "$(dirname "$0")/.."

deploy=1
[ "${1:-}" = "--no-deploy" ] && deploy=0

rm -rf public
hugo --gc --minify

fail() { echo "REFUSING TO DEPLOY: $*" >&2; exit 1; }

# The password screen: Hugo renders it in the site's design (content/staticrypt-gate.html),
# StatiCrypt's logic is spliced in unminified, and the page itself never ships.
gate="$(mktemp -d)/gate.html"
GATE_JS="scripts/staticrypt-gate.js" perl -0pe '
  BEGIN { local $/; open my $f, "<", $ENV{GATE_JS} or die; $js = <$f> }
  s{<script id="?staticrypt-script"?></script>}{<script>$js</script>} or die "no #staticrypt-script in the gate\n"
' public/staticrypt-gate/index.html > "$gate"
rm -rf public/staticrypt-gate

shopt -s nullglob
for dir in public/proposals/*/; do
  slug="$(basename "$dir")"
  var="STATICRYPT_PASSWORD_$(echo "$slug" | tr 'a-z-' 'A-Z_')"
  pw="${!var:-}"
  if [ -z "$pw" ]; then
    [ -t 0 ] || fail "set $var (no terminal to prompt on)"
    read -rsp "Password for $slug: " pw; echo
  fi
  [ "${#pw}" -ge 16 ] || fail "password for $slug must be 16+ characters"

  tmp="$(mktemp -d)"
  npx -y staticrypt@3.5.4 "$dir"* -r -d "$tmp" -p "$pw" --short \
    --config "private/.staticrypt-$slug.json" \
    --remember 30 -t "$gate" >/dev/null
  cp -R "$tmp"/. "$dir"
  rm -rf "$tmp"
  echo "encrypted /proposals/$slug/"
done

# Verify. Everything must pass before anything is uploaded.
if [ -d public/proposals ]; then
  [ ! -e public/proposals/index.html ] || fail "/proposals/ has a listing page"
  while IFS= read -r f; do
    case "$f" in
      *.html)
        grep -q staticrypt "$f" || fail "$f is not encrypted"
        # The gate's own <main class=gate> is the only <main> allowed in the clear.
        ! grep -o "<main[^>]*>" "$f" | grep -qv "^<main class=gate>$" \
          || fail "$f contains a plaintext <main>" ;;
      *.svg|*.png|*.jpg|*.jpeg|*.webp|*.avif|*.gif|*.css|*.woff2) ;;
      *) fail "$f would be published unencrypted (only HTML is encrypted)" ;;
    esac
  done < <(find public/proposals -type f)
  [ ! -e public/staticrypt-gate ] || fail "the gate template is still in public/"
  ! grep -qE "/proposals/|staticrypt-gate" public/sitemap.xml public/index.xml public/llms.txt \
    || fail "/proposals/ leaked into sitemap.xml, index.xml or llms.txt"
  echo "verified: public/proposals/ is encrypted and unlisted"
fi

[ "$deploy" = 1 ] || { echo "built, not deployed (--no-deploy)"; exit 0; }

# ⚠ --no-build is load-bearing. Without it the CLI re-runs netlify.toml's build
# command, which rebuilds public/ over the encrypted pages and ships them in
# plaintext. That happened once (17 Oct 2026): live for ~46 s, then rolled back.
site="$(python3 -c 'import json; print(json.load(open(".netlify/state.json"))["siteId"])')"
prev="$(netlify api getSite --data "{\"site_id\":\"$site\"}" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["published_deploy"]["id"])')"
out="$(mktemp)"
netlify deploy --prod --dir public --no-build --json > "$out"
# Never let a parse failure skip the live check below: the upload already happened.
new="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["deploy_id"])' "$out" 2>/dev/null || true)"
echo "deployed ${new:-<unknown id, see $out>} (previous: $prev)"

# Check what is actually live, not what we meant to upload. Any proposal page
# that isn't StatiCrypt's gate → restore the previous deploy and delete this one
# (its own --ajency.netlify.app link would keep serving the plaintext).
live_ok=1
while IFS= read -r f; do
  path="/${f#public/}"; path="${path%index.html}"
  body="$(curl -fsS "https://ajency.in$path?v=$RANDOM")" || { echo "unreachable: $path" >&2; live_ok=0; continue; }
  if ! grep -q staticrypt <<<"$body" || grep -o "<main[^>]*>" <<<"$body" | grep -qv "^<main class=gate>$"; then
    echo "NOT ENCRYPTED LIVE: $path" >&2; live_ok=0
  fi
done < <(find public/proposals -name index.html 2>/dev/null)

if [ "$live_ok" = 0 ]; then
  netlify api restoreSiteDeploy --data "{\"site_id\":\"$site\",\"deploy_id\":\"$prev\"}" >/dev/null
  if [ -n "$new" ]; then
    netlify api deleteDeploy --data "{\"deploy_id\":\"$new\"}" >/dev/null
    echo "ROLLED BACK to $prev and deleted $new" >&2
  else
    echo "ROLLED BACK to $prev. DELETE THE NEW DEPLOY BY HAND (id in $out)" >&2
  fi
  exit 1
fi
echo "live check passed: every /proposals/ page is behind the password"
