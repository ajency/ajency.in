#!/usr/bin/env bash
# Rewrite claude-seo's script invocations to use the vendored venv and
# repo-root-relative paths.
#
# Upstream's SKILL.md/agent files say `python3 scripts/foo.py`, which assumes a
# `/plugin install` where CLAUDE_PLUGIN_ROOT expands. This is a manual install,
# so that fails twice over: bare `python3` is system Python (no bs4, no
# playwright) and relative `scripts/` only resolves from the skill dir.
#
# Run from the repo root, after any claude-seo update. Idempotent.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

PY=".claude/skills/seo/.venv/bin/python"
SCRIPTS=".claude/skills/seo/scripts"

if [[ ! -x "$PY" ]]; then
  echo "error: no venv at $PY" >&2
  echo "  python3 -m venv .claude/skills/seo/.venv && \\" >&2
  echo "  .claude/skills/seo/.venv/bin/pip install -r .claude/skills/seo/requirements.txt" >&2
  exit 1
fi

FILES=()
while IFS= read -r f; do
  FILES+=("$f")
done < <(
  find .claude/skills/seo .claude/skills/seo-* .claude/agents \
    -name '*.md' -not -path '*/.venv/*' 2>/dev/null | sort
)

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "error: no skill/agent markdown found — is claude-seo installed?" >&2
  exit 1
fi

# BSD sed (macOS) uses POSIX ERE: no \b. [[:<:]] is the word-start equivalent.
# `|| true`: grep exits 1 on no matches, which pipefail would turn into an abort.
count() { { grep -rhoE '[[:<:]]python3? scripts/' "${FILES[@]}" 2>/dev/null || true; } | wc -l | tr -d ' '; }

before=$(count)

for f in "${FILES[@]}"; do
  sed -i '' -E "s|[[:<:]]python3? scripts/([a-zA-Z0-9_]+\.py)|$PY $SCRIPTS/\1|g" "$f"
done

after=$(count)

echo "files scanned:  ${#FILES[@]}"
echo "rewritten:      $((before - after))"
echo "remaining:      $after"

# Bare `python foo.py` (no scripts/ prefix) is left alone on purpose: those
# assume CWD is the scripts dir and live in reference prose, not run steps.
bare=$(grep -rhoE '[[:<:]]python3? [a-zA-Z0-9_]+\.py' "${FILES[@]}" 2>/dev/null | wc -l | tr -d ' ' || true)
echo "bare (skipped): $bare"
