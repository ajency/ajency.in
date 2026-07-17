#!/usr/bin/env python3
"""Lint ajency.in against its own SEO/AEO decisions (see ../SKILL.md).

Only checks rules that are mechanically decidable. Judgement calls — is the title
actually keyword-first, does the cross-link genuinely overlap — are the skill's job,
not this script's.

The page list comes from `hugo list all`, never from a hand-maintained list here:
every page inventory in this repo has gone stale at least once.

Usage:  python3 .claude/skills/ajency-seo/scripts/lint.py [--quiet]
Exit:   0 = clean (warnings allowed), 1 = at least one error, 2 = lint broke
"""

import csv
import io
import re
import subprocess
import sys
import tomllib
from pathlib import Path

TITLE_MAX = 60
DESC_MAX = 160

errors: list[str] = []
warnings: list[str] = []


def err(page: str, rule: str, msg: str) -> None:
    errors.append(f"  ERROR  {page}\n         [{rule}] {msg}")


def warn(page: str, rule: str, msg: str) -> None:
    warnings.append(f"  WARN   {page}\n         [{rule}] {msg}")


def repo_root() -> Path:
    out = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True, text=True, check=True,
    )
    return Path(out.stdout.strip())


def hugo_pages(root: Path) -> list[dict]:
    """Live pages, straight from the build. Drafts are excluded by hugo itself."""
    out = subprocess.run(
        ["hugo", "list", "all"],
        capture_output=True, text=True, cwd=root,
    )
    if out.returncode != 0:
        print(f"lint: `hugo list all` failed:\n{out.stderr}", file=sys.stderr)
        sys.exit(2)
    return list(csv.DictReader(io.StringIO(out.stdout)))


def split_front_matter(text: str) -> tuple[dict, str]:
    """Hugo TOML front matter is fenced by +++. Returns (parsed, body)."""
    m = re.match(r"^\+\+\+\s*\n(.*?)\n\+\+\+\s*\n(.*)$", text, re.S)
    if not m:
        return {}, text
    try:
        return tomllib.loads(m.group(1)), m.group(2)
    except tomllib.TOMLDecodeError as e:
        return {"__toml_error__": str(e)}, m.group(2)


def visible_len(s: str) -> int:
    """Length as a search engine sees it: entities are one glyph."""
    return len(re.sub(r"&[a-zA-Z]+;|&#\d+;", "X", s))


def check_page(page: dict, root: Path, llms: str, index_body: str, all_slugs: set[str]) -> None:
    path = page["path"]
    src = root / path
    if not src.exists():
        err(path, "missing-file", "hugo lists this page but the file is gone")
        return

    fm, body = split_front_matter(src.read_text(encoding="utf-8"))
    name = path

    if "__toml_error__" in fm:
        err(name, "front-matter", f"TOML will not parse: {fm['__toml_error__']}")
        return
    if not fm:
        err(name, "front-matter", "no +++ front matter found")
        return

    params = fm.get("params", {})
    schema = params.get("schema", "")
    is_post = schema == "blogposting"
    permalink = page["permalink"]
    url_path = "/" + permalink.split("://", 1)[-1].split("/", 1)[-1]

    # --- rules for every page -------------------------------------------------
    title = fm.get("title", "")
    if not title:
        err(name, "title", "no title")
    elif visible_len(title) > TITLE_MAX:
        err(name, "title-len",
            f"{visible_len(title)} chars (max {TITLE_MAX}) — Google truncates: {title!r}")

    desc = fm.get("description", "")
    if not desc:
        err(name, "description", "no description")
    elif visible_len(desc) > DESC_MAX:
        err(name, "description-len",
            f"{visible_len(desc)} chars (max {DESC_MAX}) — truncates before the hook")

    if page["kind"] != "home" and url_path not in llms:
        err(name, "llms-txt",
            f"{url_path} missing from static/llms.txt — the AI-citation audience "
            f"is this site's whole SEO strategy")

    # llms.txt must use pretty URLs
    if f"{url_path.rstrip('/')}.html" in llms:
        err(name, "llms-txt-ugly", f"llms.txt links {url_path.rstrip('/')}.html — use the pretty URL")

    # --- images ---------------------------------------------------------------
    for img in re.findall(r"<img\b[^>]*>", body):
        if "width=" not in img or "height=" not in img:
            snippet = re.search(r'src="([^"]+)"', img)
            where = snippet.group(1) if snippet else img[:60]
            err(name, "img-dims", f"<img> without width/height (CLS): {where}")
        if 'alt="' not in img:
            snippet = re.search(r'src="([^"]+)"', img)
            where = snippet.group(1) if snippet else img[:60]
            err(name, "img-alt", f"<img> without alt: {where}")

    # --- post-only rules ------------------------------------------------------
    if not is_post:
        return

    if "date" not in fm:
        err(name, "date", "post has no `date` in front matter")

    og_image = params.get("og_image", "")
    if not og_image:
        err(name, "og-image",
            "no og_image — falls back to the generic site card AND schema.html "
            "ships BlogPosting with no `image`")
    else:
        if not (root / "static" / og_image.lstrip("/")).exists():
            err(name, "og-image-missing", f"og_image points at {og_image}, which is not in static/")
        if not params.get("og_image_alt"):
            warn(name, "og-image-alt", "og_image has no og_image_alt")

    if not params.get("faq"):
        err(name, "faq", "no [[params.faq]] — no FAQPage JSON-LD, nothing for assistants to quote")

    # human-visible date, not just JSON-LD
    if not re.search(r"<time\b[^>]*datetime=", body):
        err(name, "visible-date",
            "no <time datetime=…> in the body — datePublished in JSON-LD alone "
            "isn't enough for freshness heuristics")

    # cross-link to another post
    others = {s for s in all_slugs if s != url_path}
    if not any(re.search(rf'href="{re.escape(o)}"', body) for o in others):
        err(name, "cross-link",
            "links no other post — an orphan to crawlers")

    # on the home Writing list
    if f'href="{url_path}"' not in index_body:
        err(name, "writing-list",
            f"{url_path} has no <li> in the home Writing list (content/_index.html)")


def main() -> int:
    quiet = "--quiet" in sys.argv
    root = repo_root()

    llms_path = root / "static" / "llms.txt"
    if not llms_path.exists():
        print("lint: static/llms.txt is missing entirely", file=sys.stderr)
        return 2
    llms = llms_path.read_text(encoding="utf-8")

    index_src = root / "content" / "_index.html"
    _, index_body = split_front_matter(index_src.read_text(encoding="utf-8"))

    pages = hugo_pages(root)
    if not pages:
        print("lint: hugo listed no pages", file=sys.stderr)
        return 2

    # every post's URL path, for the cross-link check
    post_slugs = set()
    for p in pages:
        src = root / p["path"]
        if not src.exists():
            continue
        fm, _ = split_front_matter(src.read_text(encoding="utf-8"))
        if fm.get("params", {}).get("schema") == "blogposting":
            post_slugs.add("/" + p["permalink"].split("://", 1)[-1].split("/", 1)[-1])

    for p in pages:
        check_page(p, root, llms, index_body, post_slugs)

    # llms.txt listing a page hugo doesn't serve = the rot that already happened once
    live = {"/" + p["permalink"].split("://", 1)[-1].split("/", 1)[-1] for p in pages}
    for url in re.findall(r"\(https://ajency\.in(/[^)]*)\)", llms):
        if url not in live:
            errors.append(
                f"  ERROR  static/llms.txt\n"
                f"         [llms-txt-ghost] links {url}, which hugo does not build — "
                f"AI crawlers get a 404"
            )

    for line in errors:
        print(line)
    if not quiet:
        for line in warnings:
            print(line)

    n_pages = len(pages)
    n_posts = len(post_slugs)
    print(f"\n{n_pages} pages ({n_posts} posts) · {len(errors)} errors · {len(warnings)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
