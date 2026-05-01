import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QA_TMP = ROOT / "qa-tmp"
BASELINE_DIR = QA_TMP / "baseline"
AUDIT_BASELINE = QA_TMP / "audit-baseline.json"
PROTECTED_FILES = {"css/brand.css"}
RECAPTURE_GLOBAL = [
    "index.html",
    "business.html",
    "residential.html",
    "quick-support.html",
    "service-area.html",
]
SEO_PATTERNS = [
    re.compile(r"<\s*title[\s>]", re.I),
    re.compile(r"<\s*meta\s+[^>]*(name|property)=", re.I),
    re.compile(r"<\s*link\s+[^>]*rel=[\"']canonical", re.I),
    re.compile(r"application/ld\+json", re.I),
]


def run(command, *, check=True, capture=False):
    resolved = command[:]
    executable = shutil.which(resolved[0])
    if executable:
        resolved[0] = executable
    result = subprocess.run(
        resolved,
        cwd=ROOT,
        text=True,
        shell=False,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.STDOUT if capture else None,
    )
    if check and result.returncode != 0:
        output = result.stdout or ""
        raise RuntimeError(f"{' '.join(command)} failed with {result.returncode}\n{output}")
    return result.stdout if capture else ""


def current_branch():
    return run(["git", "branch", "--show-current"], capture=True).strip()


def git_tracked_changes():
    output = run(["git", "status", "--short"], capture=True)
    return [line for line in output.splitlines() if line and not line.startswith("?? qa-tmp/")]


def assert_branch(branch):
    actual = current_branch()
    if branch and actual != branch:
        raise RuntimeError(f"expected branch {branch}, got {actual}")


def assert_no_baseline_mutation():
    if AUDIT_BASELINE.exists():
        before = AUDIT_BASELINE.read_bytes()
        return lambda: (_ for _ in ()).throw(RuntimeError("audit baseline mutated")) if AUDIT_BASELINE.read_bytes() != before else None
    return lambda: None


def ensure_clean_guarded_scope():
    for line in git_tracked_changes():
        path = line[3:].replace("\\", "/")
        if path in PROTECTED_FILES:
            raise RuntimeError(f"protected file has tracked changes: {path}")


def read_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2)
        handle.write("\n")


def run_audit(base_url):
    return run_scoped_audit(base_url, "")


def skipped_a11y_report(reason, pages):
    page_list = [page.strip() for page in pages.split(",") if page.strip()]
    report = {
        "generatedAt": None,
        "skipped": True,
        "reason": reason,
        "pageCount": len(page_list),
        "viewportCount": 0,
        "violationCount": 0,
        "results": [],
    }
    write_json(BASELINE_DIR / "axe-report.json", report)
    return report


def run_scoped_audit(base_url, pages, *, skip_a11y=False, reuse_existing=False):
    BASELINE_DIR.mkdir(parents=True, exist_ok=True)
    crawl_path = BASELINE_DIR / "crawl-report.json"
    fleet_path = BASELINE_DIR / "fleet-report.json"
    axe_path = BASELINE_DIR / "axe-report.json"

    if not (reuse_existing and crawl_path.exists()):
        run(["node", "qa/spider.mjs", "--base", base_url, "--out", str(BASELINE_DIR)])

    fleet_cmd = ["node", "qa/fleet.mjs", "--base", base_url, "--out", str(BASELINE_DIR)]
    a11y_cmd = ["node", "qa/a11y.mjs", "--base", base_url, "--out", str(BASELINE_DIR)]
    if pages:
        fleet_cmd.extend(["--pages", pages])
        a11y_cmd.extend(["--pages", pages])

    if not (reuse_existing and fleet_path.exists()):
        run(fleet_cmd)
    if skip_a11y:
        skipped_a11y_report("--skip-a11y", pages)
    elif not (reuse_existing and axe_path.exists()):
        run(a11y_cmd)

    crawl = read_json(BASELINE_DIR / "crawl-report.json")
    metrics = read_json(BASELINE_DIR / "fleet-report.json")
    axe = read_json(BASELINE_DIR / "axe-report.json")
    audit = {
        "version": "VERTEX_RESPONSIVENESS_APP v1",
        "baseUrl": base_url,
        "scopePages": [page.strip() for page in pages.split(",") if page.strip()],
        "generatedAt": metrics.get("generatedAt"),
        "crawl": crawl,
        "metrics": metrics,
        "a11y": axe,
        "guards": {
            "protectedFiles": sorted(PROTECTED_FILES),
            "rejectImportant": True,
            "rejectSeoMetaJsonLd": True,
            "baselineImmutableDuringRemediation": True,
            "noOriginMainPush": True,
        },
    }
    write_json(AUDIT_BASELINE, audit)
    return audit


def collect_bugs(audit):
    bugs = []
    for report in audit.get("metrics", {}).get("reports", []):
        issues = report.get("issues", {})
        base = {
            "url": report.get("url"),
            "viewport": report.get("viewport"),
            "screenshot": report.get("screenshot"),
            "page": report.get("page"),
        }
        if issues.get("horizontalScroll"):
            bugs.append({**base, "type": "horizontal-scroll", "amount": issues["horizontalScroll"]})
        for key, bug_type in [
            ("overflowElements", "visible-overflow"),
            ("clippedElements", "clipped-visible-element"),
            ("smallTapTargets", "small-tap-target"),
        ]:
            for element in issues.get(key, []):
                bugs.append({**base, "type": bug_type, "element": element})
    return bugs


def url_to_file(url):
    parsed_path = re.sub(r"^https?://[^/]+/?", "", url or "").split("#", 1)[0].split("?", 1)[0]
    if not parsed_path:
        return "index.html"
    if parsed_path.endswith("/"):
        parsed_path += "index.html"
    parsed_path = parsed_path.lstrip("/")
    return parsed_path or "index.html"


def candidate_files_for_bug(bug):
    page_file = url_to_file(bug.get("url"))
    files = [page_file]
    if page_file in RECAPTURE_GLOBAL or bug.get("type") in {"horizontal-scroll", "visible-overflow"}:
        files.extend(["components/pill-nav.css", "css/service.css"])
    return [file for file in dict.fromkeys(files) if (ROOT / file).exists() and file not in PROTECTED_FILES]


def file_excerpt(file_path, limit=14000):
    full = ROOT / file_path
    text = full.read_text(encoding="utf-8", errors="replace")
    if len(text) <= limit:
        return text
    return text[: limit // 2] + "\n\n/* ... middle omitted for QA prompt ... */\n\n" + text[-limit // 2 :]


def vertex_config():
    project = os.environ.get("GCP_PROJECT") or run(["gcloud", "config", "get-value", "project"], check=False, capture=True).strip()
    return {
        "project": project if project and "unset" not in project.lower() else "",
        "location": os.environ.get("GCP_LOCATION", ""),
        "audit_model": os.environ.get("GEMINI_AUDIT_MODEL", ""),
        "patch_model": os.environ.get("GEMINI_PATCH_MODEL", ""),
    }


def call_vertex_for_patch(bug, files):
    config = vertex_config()
    missing = [name for name in ["project", "location", "patch_model"] if not config[name]]
    if missing:
        return {"status": "skipped", "reason": f"missing Vertex config: {', '.join(missing)}"}

    try:
        from google import genai
        from google.genai import types
    except Exception as exc:
        return {"status": "skipped", "reason": f"google-genai unavailable: {exc}"}

    prompt_parts = [
        "You are patching a static HTML/CSS site for one responsive defect.",
        "Return only a unified diff. Do not edit css/brand.css. Do not add !important.",
        "Do not change title, meta tags, canonical links, or JSON-LD.",
        "Keep the patch minimal and production-safe.",
        "",
        "Bug:",
        json.dumps(bug, indent=2),
        "",
    ]
    for file in files:
        prompt_parts.extend([f"File: {file}", "```", file_excerpt(file), "```", ""])

    client = genai.Client(vertexai=True, project=config["project"], location=config["location"])
    response = client.models.generate_content(
        model=config["patch_model"],
        contents="\n".join(prompt_parts),
        config=types.GenerateContentConfig(temperature=0.1),
    )
    text = (response.text or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:diff)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return {"status": "ok", "patch": text, "config": {k: v for k, v in config.items() if k != "project"}}


def validate_patch_text(patch_text):
    if "!important" in patch_text.lower():
        raise RuntimeError("candidate patch rejected: !important")
    for pattern in SEO_PATTERNS:
        for line in patch_text.splitlines():
            if line.startswith("+") and not line.startswith("+++") and pattern.search(line):
                raise RuntimeError("candidate patch rejected: SEO/meta/JSON-LD")
    for protected in PROTECTED_FILES:
        if f" {protected}" in patch_text or f"/{protected}" in patch_text:
            raise RuntimeError(f"candidate patch rejected: protected file {protected}")


def apply_candidate_patch(patch_text):
    validate_patch_text(patch_text)
    patch_file = QA_TMP / "candidate.diff"
    patch_file.write_text(patch_text, encoding="utf-8")
    run(["git", "apply", "--check", str(patch_file)])
    run(["git", "apply", str(patch_file)])


def changed_files():
    output = run(["git", "diff", "--name-only"], capture=True)
    return [line.strip().replace("\\", "/") for line in output.splitlines() if line.strip()]


def restore_files(files):
    for file in files:
        if file and (ROOT / file).exists():
            run(["git", "restore", "--", file], check=False)


def recapture_after_patch(base_url, touched_files):
    out = QA_TMP / "remediation-check"
    out.mkdir(parents=True, exist_ok=True)
    if any(file.endswith((".css", ".js")) for file in touched_files):
        pages = [{"url": f"{base_url.rstrip('/')}/{file}", "path": f"/{file}", "title": file, "status": 200} for file in RECAPTURE_GLOBAL]
    else:
        pages = [{"url": f"{base_url.rstrip('/')}/{file}", "path": f"/{file}", "title": file, "status": 200} for file in touched_files if file.endswith(".html")]
    if not pages:
        pages = [{"url": base_url, "path": "/", "title": "Home", "status": 200}]
    write_json(out / "pages.json", pages)
    run(["node", "qa/fleet.mjs", "--base", base_url, "--out", str(out)])
    return read_json(out / "fleet-report.json")


def remediate(args):
    immutable = assert_no_baseline_mutation()
    audit = read_json(AUDIT_BASELINE) if AUDIT_BASELINE.exists() else run_scoped_audit(
        args.base_url,
        args.pages,
        skip_a11y=args.skip_a11y,
        reuse_existing=args.reuse_existing,
    )
    bugs = collect_bugs(audit)
    trial = {
        "generatedAt": audit.get("generatedAt"),
        "maxBugs": args.max_bugs,
        "maxVertexCalls": args.max_vertex_calls,
        "status": "no-bugs" if not bugs else "started",
        "attempts": [],
    }
    calls = 0

    for bug in bugs[: args.max_bugs]:
        files = candidate_files_for_bug(bug)
        attempt = {"bug": bug, "candidateFiles": files}
        if calls >= args.max_vertex_calls:
            attempt.update({"status": "skipped", "reason": "max Vertex calls reached"})
            trial["attempts"].append(attempt)
            continue
        if not files:
            attempt.update({"status": "skipped", "reason": "no editable candidate files"})
            trial["attempts"].append(attempt)
            continue

        calls += 1
        response = call_vertex_for_patch(bug, files)
        if response["status"] != "ok":
            attempt.update(response)
            trial["attempts"].append(attempt)
            continue

        before = set(changed_files())
        try:
            apply_candidate_patch(response["patch"])
            after = [file for file in changed_files() if file not in before]
            ensure_clean_guarded_scope()
            check = recapture_after_patch(args.base_url, after)
            if check.get("blankCaptures", 1) > 0:
                raise RuntimeError("recapture produced blank screenshots")
            attempt.update({"status": "kept", "changedFiles": after, "recaptureIssueCount": check.get("issueCount")})
        except Exception as exc:
            after = [file for file in changed_files() if file not in before]
            restore_files(after)
            attempt.update({"status": "rolled-back", "changedFiles": after, "reason": str(exc)})
        trial["attempts"].append(attempt)
        break

    immutable()
    trial["status"] = "complete"
    write_json(QA_TMP / "remediation-trial.json", trial)
    return trial


def main():
    parser = argparse.ArgumentParser(description="Local guarded responsiveness QA orchestrator")
    parser.add_argument("--audit-only", action="store_true")
    parser.add_argument("--max-bugs", type=int, default=1)
    parser.add_argument("--max-vertex-calls", type=int, default=1)
    parser.add_argument("--base-url", default="http://127.0.0.1:4173")
    parser.add_argument("--branch", default="fix/responsive-audit-20260501")
    parser.add_argument("--pages", default="")
    parser.add_argument("--skip-a11y", action="store_true")
    parser.add_argument("--reuse-existing", action="store_true")
    args = parser.parse_args()

    assert_branch(args.branch)
    ensure_clean_guarded_scope()

    if args.audit_only:
        before = set(git_tracked_changes())
        audit = run_scoped_audit(
            args.base_url,
            args.pages,
            skip_a11y=args.skip_a11y,
            reuse_existing=args.reuse_existing,
        )
        after = set(git_tracked_changes())
        if before != after:
            raise RuntimeError("audit-only changed tracked files")
        print(textwrap.dedent(f"""
        audit-only complete
        pages: {len(audit['crawl']['pages'])}
        captures: {audit['metrics']['captureCount']}
        issues: {audit['metrics']['issueCount']}
        blank captures: {audit['metrics']['blankCaptures']}
        """).strip())
        return

    trial = remediate(args)
    print(json.dumps(trial, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"orchestrator failed: {exc}", file=sys.stderr)
        sys.exit(1)
