#!/usr/bin/env python3
"""Submit ajency.in's sitemap to Google Search Console.

Run this after a publish (`netlify deploy --prod`). A push is not a deploy here,
and a deploy is not a submission — Google only re-reads the sitemap when told, or
on its own slow schedule.

Why this exists rather than `gsc_query.py`: the vendored read scripts authenticate
with `webmasters.readonly`. Submitting needs the read/write `webmasters` scope.

Why it matters: GSC was left holding the old WordPress sitemap
(`sitemap_index.xml`, last submitted 2019-03-07) until 2026-07-17. It 404s, so
Google never discovered any page of the Hugo site except the homepage — five of
six URLs were "unknown to Google" with 0 impressions. A wrong sitemap entry fails
silently and reports `[processed] errors=0`.

Credentials: ~/.config/claude-seo/google-api.json (service_account_path, and the
service account needs Full permission on the property). See
.claude/skills/seo-google/references/auth-setup.md.

Usage:
  python3 .claude/skills/ajency-seo/scripts/submit-sitemap.py            # show current state
  python3 .claude/skills/ajency-seo/scripts/submit-sitemap.py --apply    # submit
  python3 .claude/skills/ajency-seo/scripts/submit-sitemap.py --apply --prune-stale
"""

import argparse
import json
import sys
from pathlib import Path

CONFIG = Path.home() / ".config/claude-seo/google-api.json"
SITE = "sc-domain:ajency.in"
SITEMAP = "https://ajency.in/sitemap.xml"
SCOPES = ["https://www.googleapis.com/auth/webmasters"]


def service():
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        sys.exit(
            "error: google-api-python-client not importable.\n"
            "  This script needs the vendored claude-seo venv:\n"
            "    .claude/skills/seo/.venv/bin/python "
            ".claude/skills/ajency-seo/scripts/submit-sitemap.py"
        )

    if not CONFIG.exists():
        sys.exit(f"error: no config at {CONFIG} — see seo-google/references/auth-setup.md")

    cfg = json.loads(CONFIG.read_text())
    sa = cfg.get("service_account_path", "")
    if not sa:
        sys.exit("error: config has no service_account_path")
    sa_path = Path(sa.replace("~", str(Path.home())))
    if not sa_path.exists():
        sys.exit(f"error: service account file not found: {sa_path}")

    creds = service_account.Credentials.from_service_account_file(str(sa_path), scopes=SCOPES)
    from googleapiclient.discovery import build as _build
    return _build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def show(svc) -> list[str]:
    res = svc.sitemaps().list(siteUrl=SITE).execute()
    entries = res.get("sitemap", [])
    if not entries:
        print("  (none — Google knows of no sitemap for this property)")
        return []
    paths = []
    for s in entries:
        paths.append(s["path"])
        flag = "" if s["path"] == SITEMAP else "   <-- not ours"
        print(f"  {s['path']}{flag}")
        print(
            f"    lastSubmitted={s.get('lastSubmitted', '-')} "
            f"errors={s.get('errors', '-')} warnings={s.get('warnings', '-')} "
            f"pending={s.get('isPending', '-')}"
        )
    return paths


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="actually submit (default: read-only)")
    ap.add_argument("--prune-stale", action="store_true",
                    help="also delete sitemap entries that are not ours (e.g. the 2019 WordPress one)")
    args = ap.parse_args()

    svc = service()

    print("=== sitemaps GSC currently knows ===")
    existing = show(svc)

    if not args.apply:
        print("\n(read-only — pass --apply to submit)")
        return 0

    print(f"\nsubmitting {SITEMAP} …")
    svc.sitemaps().submit(siteUrl=SITE, feedpath=SITEMAP).execute()
    print("  ok")

    if args.prune_stale:
        for path in existing:
            if path == SITEMAP:
                continue
            print(f"deleting stale {path} …")
            try:
                svc.sitemaps().delete(siteUrl=SITE, feedpath=path).execute()
                print("  ok")
            except Exception as e:
                print(f"  could not delete: {e}")

    print("\n=== after ===")
    show(svc)
    print("\nNote: `pending=True` means queued, not read. Indexation is Google's call —")
    print("submission only makes pages discoverable. Watch URL Inspection, not impressions.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
