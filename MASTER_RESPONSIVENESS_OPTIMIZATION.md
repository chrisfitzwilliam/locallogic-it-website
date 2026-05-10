# VERTEX_RESPONSIVENESS_APP v1

## Purpose

Build a closed-loop Responsiveness QA & Remediation tool for the Local Logic static website. The tool visually and programmatically verifies every code change before keeping it, protecting the global static architecture from cascading responsive-layout regressions.

## Operating Context

The AI CLI agent operates locally on a Windows 11 machine with administrator permissions to install and configure required tools, including Node.js, Python 3.10+, Playwright Chromium browsers, Sharp, Google Cloud SDK, and supporting Python packages.

Target codebase:

```text
C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website\
```

The site is a static HTML/CSS/JS codebase with no build step.

GCP project:

```text
local-logic-research
```

Region:

```text
us-central1
```

The orchestration, Playwright captures, DOM metrics, and remediation pipeline must run locally. No GCP compute should be used. Vertex AI is used only for Gemini model calls.

## Non-Negotiable Repository Rules

Follow the rules in `memory.md`:

1. Preserve `css/brand.css`.
2. Preserve the current dark glassmorphism brand system and palette.
3. Stage only intentionally modified files.
4. Run `git diff --cached --check` before committing.
5. Never push directly to `origin main` during automated remediation.
6. Do not modify SEO meta tags or JSON-LD structures to fix layout issues.
7. Do not use `!important`.
8. Prefer responsive flexbox, grid, container, spacing, wrapping, and min/max-width fixes over layout hacks.
9. Preserve Poppins typography.
10. Preserve blue accents for business pages and amber accents for residential pages.

## Recommended Model Configuration

Do not hardcode uncertain model IDs. Use environment variables.

Recommended defaults:

```powershell
$env:GCP_PROJECT="local-logic-research"
$env:GCP_LOCATION="us-central1"
$env:GEMINI_AUDIT_MODEL="gemini-3-pro-preview"
$env:GEMINI_PATCH_MODEL="gemini-2.5-flash"
$env:LOCAL_BASE_URL="http://127.0.0.1:4173"
```

If the available Vertex model ID differs, update only the environment variable, not the orchestrator logic.

## System-Level Dependency Installation

Run PowerShell as Administrator:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.12
winget install Git.Git
winget install Google.CloudSDK
```

Then install local project dependencies:

```powershell
cd "C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website"

python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install google-genai pillow pydantic jsonschema

npm init -y
npm install -D playwright sharp axe-core
npx playwright install chromium
```

Authenticate and configure GCP locally:

```powershell
gcloud auth application-default login
gcloud config set project local-logic-research
gcloud services enable aiplatform.googleapis.com
```

## Directory Layout

Create this local QA structure:

```text
qa/
  spider.mjs
  fleet.mjs
  a11y.mjs
  optimize.mjs
  orchestrator.py

qa-tmp/
  baseline/
  current/
  logs/
  metrics/
  sheets/
```

Baseline captures must be immutable during a remediation run. Current captures may be overwritten during each micro-verification cycle.

## Phase 0: Local Server Spin-Up

Start a local static HTTP server from the repository root.

Default command:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Default base URL:

```text
http://127.0.0.1:4173
```

The server must serve editable local files directly from the target repository.

## Phase 1: Local Data Collection With Node.js

Create four Node.js scripts using Playwright, Sharp, and axe-core patterns.

### `qa/spider.mjs`

Responsibilities:

1. Crawl the local static site from the base URL.
2. Discover internal HTML pages.
3. Exclude external links, mailto links, tel links, fragments, assets, PDFs, images, scripts, and stylesheets.
4. Save discovered pages to JSON.
5. Provide a stable page list for capture scripts.

Expected command:

```powershell
node qa/spider.mjs --base http://127.0.0.1:4173 --out qa-tmp/baseline
```

### `qa/fleet.mjs`

Responsibilities:

1. Capture target pages across mobile, tablet, and desktop viewports.
2. Extract DOM layout metrics including:
   - `documentElement.scrollWidth`
   - `documentElement.clientWidth`
   - `body.scrollWidth`
   - `body.clientWidth`
   - `bodyOverflow`
   - overflowing elements
   - clipped elements
   - visible text bounding boxes
   - tap target dimensions
3. Save per-page JSON metric files.
4. Save viewport screenshots.
5. Save stitched `.webp` contact sheets.

Expected command for full capture:

```powershell
node qa/fleet.mjs --base http://127.0.0.1:4173 --out qa-tmp/baseline
```

Expected command for scoped capture:

```powershell
node qa/fleet.mjs --base http://127.0.0.1:4173 --pages index.html,business.html --out qa-tmp/current
```

### `qa/a11y.mjs`

Responsibilities:

1. Run axe-core checks locally through Playwright.
2. Focus on responsive and interaction-adjacent signals.
3. Save structured results to JSON.
4. Report small tap targets, inaccessible controls, missing labels, and obvious keyboard/focus issues.

Expected command:

```powershell
node qa/a11y.mjs --base http://127.0.0.1:4173 --pages index.html,business.html --out qa-tmp/current
```

### `qa/optimize.mjs`

Responsibilities:

1. Use Sharp to compress screenshot artifacts.
2. Stitch mobile, tablet, and desktop captures into `.webp` contact sheets.
3. Keep filenames deterministic and page-specific.
4. Avoid overwriting baseline files during remediation.

Expected command:

```powershell
node qa/optimize.mjs --in qa-tmp/current --out qa-tmp/current
```

## Phase 2: Baseline AI Audit With Python And Vertex

Create `qa/orchestrator.py` using `asyncio`, subprocess calls, and `google-genai`.

The orchestrator must:

1. Start the local server.
2. Create or refresh the baseline artifact folder.
3. Run the Node capture pipeline.
4. Send `.webp` contact sheets and JSON metrics to the Vertex Gemini audit model.
5. Ask Gemini to identify only concrete responsive layout bugs.
6. Output a structured `qa-tmp/audit-baseline.json` file.

The baseline audit prompt must focus on:

1. Overlapping text.
2. Horizontal scroll.
3. Broken mobile layouts.
4. Clipped or hidden content.
5. Broken responsive grids.
6. Tap targets below expected minimum size.
7. CSS selectors and likely source files.

The baseline audit output must be structured JSON:

```json
{
  "bugs": [
    {
      "id": "B001",
      "page": "index.html",
      "file": "css/site.css",
      "selector": ".hero-grid",
      "description": "Hero cards overflow the mobile viewport at 390px.",
      "failure_type": "bodyOverflow",
      "metric_key": "bodyOverflow"
    }
  ]
}
```

## Phase 3: Micro-Verification Fix Loop

This is the core safety mechanism.

The orchestrator reads `qa-tmp/audit-baseline.json` and processes bugs one at a time.

### 3.1 Propose And Apply

For each bug:

1. Read the local file identified by the baseline audit.
2. Send only the relevant file content and bug description to the patch model.
3. Ask for a minimal unified diff.
4. Reject the patch before application if it:
   - uses `!important`
   - touches `css/brand.css`
   - touches SEO meta tags
   - touches JSON-LD
   - rewrites unrelated sections
   - changes unrelated pages
5. Apply the patch locally with `git apply --check` followed by `git apply`.

### 3.2 CSS Anti-Hack Rules

All proposed patches must follow these rules:

1. No `!important`.
2. No SEO meta or JSON-LD edits.
3. No `css/brand.css` edits.
4. Prefer responsive flex or grid changes.
5. Prefer wrapping, spacing, min/max-width, and container fixes.
6. Preserve Poppins typography.
7. Preserve dark glassmorphism styling.
8. Preserve blue accents for business pages.
9. Preserve amber accents for residential pages.
10. Keep changes small and local.

### 3.3 Micro-Capture Ripple Effect Check

After applying each candidate patch, run a scoped capture.

If the changed file is global, capture the five core pages:

```text
index.html
business.html
residential.html
quick-support.html
service-area.html
```

A file is global if it is inside:

```text
css/
assets/
scripts/
```

If the changed file is a specific HTML page, capture only that page.

### 3.4 Programmatic Fast-Fail DOM Math

Before calling Gemini again, inspect the new JSON metrics.

If the original bug was a hard DOM failure and the new metrics still fail, immediately roll back the file with:

```powershell
git restore -- path/to/file
```

Fast-fail examples:

1. `bodyOverflow: true`
2. `documentElement.scrollWidth > documentElement.clientWidth`
3. `body.scrollWidth > body.clientWidth`
4. overflowing visible elements still exist
5. tap targets below 24px still exist
6. clipped visible elements still exist

If fast-fail triggers, do not spend another Vertex call for visual verification.

### 3.5 Visual Verification With Gemini

If fast-fail passes:

1. Send the new `.webp` contact sheets.
2. Send the matching baseline `.webp` contact sheets.
3. Send current JSON metrics.
4. Ask Gemini:

```text
Did the layout fix resolve the issue?
Did it inadvertently break any other viewports or elements?
Return JSON only.
```

Expected verification JSON:

```json
{
  "fixed": true,
  "regression": false,
  "confidence": 0.92,
  "reason": "The mobile overflow is resolved and no new clipping appears in tablet or desktop captures.",
  "new_issues": []
}
```

### 3.6 Keep Or Roll Back

If Gemini confirms the fix and no regressions:

1. Keep the file modification.
2. Log the successful fix.
3. Continue to the next bug.

If Gemini detects failure or regression:

1. Roll back immediately:

```powershell
git restore -- path/to/file
```

2. Log the failed fix.
3. Continue to the next bug.

## Phase 4: Branch, Stage, Commit, And Hand-Off

Create the remediation branch before applying fixes:

```powershell
git checkout -B fix/responsive-audit-YYYYMMDD
```

After all bugs are processed:

1. Collect only verified modified files.
2. Stage only those files:

```powershell
git add -- path/to/verified-file-1 path/to/verified-file-2
```

3. Run:

```powershell
git diff --cached --check
```

4. If the check passes, commit:

```powershell
git commit -m "Fix responsive layout issues from QA audit"
```

5. Do not push directly to `origin main`.

Final hand-off must include:

1. Branch name.
2. Successful fixes.
3. Rolled-back fixes.
4. Rejected patches.
5. Skipped bugs.
6. Final changed files.
7. Location of QA artifacts.
8. Confirmation that `git diff --cached --check` passed.

## Python Orchestrator

Save as:

```text
qa/orchestrator.py
```

```python
import asyncio
import json
import os
import re
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from google import genai
from google.genai import types


REPO = Path(r"C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website")
QA = REPO / "qa-tmp"
BASELINE = QA / "baseline"
CURRENT = QA / "current"
LOGS = QA / "logs"

PROJECT_ID = os.getenv("GCP_PROJECT", "local-logic-research")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")
AUDIT_MODEL = os.getenv("GEMINI_AUDIT_MODEL", "gemini-3-pro-preview")
PATCH_MODEL = os.getenv("GEMINI_PATCH_MODEL", "gemini-2.5-flash")
BASE_URL = os.getenv("LOCAL_BASE_URL", "http://127.0.0.1:4173")

GLOBAL_PREFIXES = ("css/", "assets/", "scripts/")
CORE_PAGES = [
    "index.html",
    "business.html",
    "residential.html",
    "quick-support.html",
    "service-area.html",
]

PROTECTED_PATTERNS = [
    re.compile(r"<script[^>]+application/ld\+json", re.I),
    re.compile(r"<meta\s+name=[\"']description[\"']", re.I),
    re.compile(r"<meta\s+property=[\"']og:", re.I),
    re.compile(r"<link\s+rel=[\"']canonical[\"']", re.I),
]


@dataclass
class Bug:
    id: str
    page: str
    file: str
    selector: str
    description: str
    failure_type: str
    metric_key: str | None = None


def run(cmd: list[str], cwd: Path = REPO, check: bool = True) -> subprocess.CompletedProcess:
    result = subprocess.run(cmd, cwd=str(cwd), text=True, capture_output=True, shell=False)
    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}")
    return result


async def arun(cmd: list[str], cwd: Path = REPO, check: bool = True) -> subprocess.CompletedProcess:
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        cwd=str(cwd),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await proc.communicate()
    result = subprocess.CompletedProcess(
        cmd,
        proc.returncode,
        stdout.decode("utf-8", "replace"),
        stderr.decode("utf-8", "replace"),
    )
    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}")
    return result


def clean_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def rel(path: Path) -> str:
    return path.relative_to(REPO).as_posix()


def is_global_file(file: str) -> bool:
    normalized = file.replace("\\", "/")
    return normalized.startswith(GLOBAL_PREFIXES)


def pages_for_file(file: str, fallback_page: str) -> list[str]:
    if is_global_file(file):
        return CORE_PAGES
    if file.endswith(".html"):
        return [file]
    return [fallback_page or "index.html"]


def protect_patch(diff: str) -> tuple[bool, str]:
    if "!important" in diff:
        return False, "Patch contains !important"
    if "css/brand.css" in diff.replace("\\", "/"):
        return False, "Patch touches css/brand.css"
    for pattern in PROTECTED_PATTERNS:
        if pattern.search(diff):
            return False, "Patch appears to touch protected SEO or JSON-LD content"
    return True, "ok"


def extract_diff(text: str) -> str:
    fenced = re.search(r"```(?:diff|patch)?\s*(.*?)```", text, re.S | re.I)
    if fenced:
        return fenced.group(1).strip()
    start = text.find("diff --git")
    if start >= 0:
        return text[start:].strip()
    start = text.find("--- ")
    if start >= 0:
        return text[start:].strip()
    return text.strip()


def apply_diff(diff: str) -> bool:
    patch_file = QA / "candidate.patch"
    patch_file.parent.mkdir(parents=True, exist_ok=True)
    patch_file.write_text(diff, encoding="utf-8")
    check = run(["git", "apply", "--check", str(patch_file)], check=False)
    if check.returncode != 0:
        return False
    applied = run(["git", "apply", str(patch_file)], check=False)
    return applied.returncode == 0


def restore_file(file: str) -> None:
    run(["git", "restore", "--", file], check=False)


def changed_files() -> list[str]:
    result = run(["git", "diff", "--name-only"], check=False)
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def load_metric_files(root: Path) -> list[dict[str, Any]]:
    metrics_dir = root / "metrics"
    if not metrics_dir.exists():
        return []
    rows = []
    for path in metrics_dir.glob("*.json"):
        try:
            data = read_json(path)
            data["_file"] = rel(path)
            rows.append(data)
        except Exception:
            pass
    return rows


def metric_still_fails(metrics: list[dict[str, Any]], bug: Bug) -> bool:
    if not bug.metric_key:
        return False
    for item in metrics:
        value = item.get(bug.metric_key)
        if value is True:
            return True
        if isinstance(value, (int, float)) and value > 0:
            return True
        failures = item.get("failures")
        if isinstance(failures, dict) and failures.get(bug.metric_key):
            return True
    return False


def image_parts(paths: list[Path]) -> list[types.Part]:
    parts = []
    for path in paths:
        if path.exists():
            parts.append(types.Part.from_bytes(data=path.read_bytes(), mime_type="image/webp"))
    return parts


def json_part(path: Path) -> types.Part:
    return types.Part.from_text(text=path.read_text(encoding="utf-8", errors="replace"))


def collect_webps(root: Path, pages: list[str]) -> list[Path]:
    found = []
    names = [p.replace(".html", "") for p in pages]
    for path in root.rglob("*.webp"):
        lower = path.name.lower()
        if any(name.replace("/", "_").lower() in lower for name in names):
            found.append(path)
    return found


async def start_server() -> asyncio.subprocess.Process:
    proc = await asyncio.create_subprocess_exec(
        "python",
        "-m",
        "http.server",
        "4173",
        "--bind",
        "127.0.0.1",
        cwd=str(REPO),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    await asyncio.sleep(1.5)
    return proc


async def run_capture(out_dir: Path, pages: list[str] | None = None) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    page_arg = ",".join(pages) if pages else ""
    if pages:
        await arun(["node", "qa/fleet.mjs", "--base", BASE_URL, "--pages", page_arg, "--out", str(out_dir)])
        await arun(["node", "qa/a11y.mjs", "--base", BASE_URL, "--pages", page_arg, "--out", str(out_dir)])
    else:
        await arun(["node", "qa/spider.mjs", "--base", BASE_URL, "--out", str(out_dir)])
        await arun(["node", "qa/fleet.mjs", "--base", BASE_URL, "--out", str(out_dir)])
        await arun(["node", "qa/a11y.mjs", "--base", BASE_URL, "--out", str(out_dir)])
    await arun(["node", "qa/optimize.mjs", "--in", str(out_dir), "--out", str(out_dir)])


async def generate_json(client: Any, model: str, contents: list[Any]) -> Any:
    response = await client.models.generate_content(
        model=model,
        contents=contents,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        ),
    )
    text = response.text or "{}"
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.S)
        if not match:
            raise
        return json.loads(match.group(0))


async def baseline_audit(client: Any) -> list[Bug]:
    metrics = load_metric_files(BASELINE)
    metric_path = BASELINE / "combined-metrics.json"
    write_json(metric_path, metrics)
    webps = sorted(BASELINE.rglob("*.webp"))

    prompt = """
You are auditing a static website for responsive layout defects.
Identify only concrete layout bugs visible in the images or proven by the JSON metrics.
Focus on overlapping text, horizontal scroll, clipped content, broken responsive grids, tiny tap targets, and viewport-specific regressions.
Return JSON only:
{
  "bugs": [
    {
      "id": "B001",
      "page": "index.html",
      "file": "css/site.css",
      "selector": ".example",
      "description": "specific issue",
      "failure_type": "bodyOverflow|overlap|tapTarget|visual|clipping",
      "metric_key": "bodyOverflow"
    }
  ]
}
Do not invent selectors. Prefer the smallest likely file and selector.
"""
    contents = [types.Part.from_text(text=prompt), json_part(metric_path), *image_parts(webps)]
    data = await generate_json(client, AUDIT_MODEL, contents)
    write_json(QA / "audit-baseline.json", data)

    bugs = []
    for item in data.get("bugs", []):
        bugs.append(Bug(
            id=str(item.get("id", "")),
            page=str(item.get("page", "")),
            file=str(item.get("file", "")),
            selector=str(item.get("selector", "")),
            description=str(item.get("description", "")),
            failure_type=str(item.get("failure_type", "")),
            metric_key=item.get("metric_key"),
        ))
    return bugs


async def propose_patch(client: Any, bug: Bug) -> str:
    file_path = REPO / bug.file
    source = read_text(file_path)
    prompt = f"""
Generate a minimal unified diff patch for this responsive layout bug.

Bug:
id: {bug.id}
page: {bug.page}
file: {bug.file}
selector: {bug.selector}
description: {bug.description}
failure_type: {bug.failure_type}

Rules:
Return only a unified diff.
Do not use !important.
Do not modify css/brand.css.
Do not modify SEO meta tags.
Do not modify JSON-LD.
Preserve Poppins.
Preserve dark glassmorphism styling.
Use responsive flex/grid/container fixes before width hacks.
Make the smallest safe change.
"""
    contents = [
        types.Part.from_text(text=prompt),
        types.Part.from_text(text=f"FILE: {bug.file}\n\n{source}"),
    ]
    response = await client.models.generate_content(
        model=PATCH_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(temperature=0.1),
    )
    return extract_diff(response.text or "")


async def verify_visual(client: Any, bug: Bug, pages: list[str]) -> dict[str, Any]:
    baseline_images = collect_webps(BASELINE, pages)
    current_images = collect_webps(CURRENT, pages)
    current_metrics = load_metric_files(CURRENT)
    current_metric_path = CURRENT / "combined-metrics.json"
    write_json(current_metric_path, current_metrics)

    prompt = f"""
You are verifying a proposed responsive layout fix.

Original bug:
id: {bug.id}
page: {bug.page}
selector: {bug.selector}
description: {bug.description}
failure_type: {bug.failure_type}

Compare the baseline images and current images.
Decide whether the original issue is fixed.
Also detect new regressions in any viewport or page.
Return JSON only:
{{
  "fixed": true,
  "regression": false,
  "confidence": 0.0,
  "reason": "brief explanation",
  "new_issues": []
}}
"""
    contents = [
        types.Part.from_text(text=prompt),
        types.Part.from_text(text="CURRENT METRICS JSON:"),
        json_part(current_metric_path),
        types.Part.from_text(text="BASELINE IMAGES:"),
        *image_parts(baseline_images),
        types.Part.from_text(text="CURRENT IMAGES:"),
        *image_parts(current_images),
    ]
    return await generate_json(client, AUDIT_MODEL, contents)


async def process_bug(client: Any, bug: Bug) -> dict[str, Any]:
    file_path = REPO / bug.file
    if not file_path.exists():
        return {"id": bug.id, "status": "skipped", "reason": "file not found", "file": bug.file}

    diff = await propose_patch(client, bug)
    allowed, reason = protect_patch(diff)
    if not allowed:
        return {"id": bug.id, "status": "rejected", "reason": reason, "file": bug.file}

    if not apply_diff(diff):
        restore_file(bug.file)
        return {"id": bug.id, "status": "rejected", "reason": "patch did not apply", "file": bug.file}

    pages = pages_for_file(bug.file, bug.page)
    clean_dir(CURRENT)
    await run_capture(CURRENT, pages)

    metrics = load_metric_files(CURRENT)
    if metric_still_fails(metrics, bug):
        restore_file(bug.file)
        return {"id": bug.id, "status": "rolled_back", "reason": "fast-fail metric still failing", "file": bug.file}

    verdict = await verify_visual(client, bug, pages)
    if verdict.get("fixed") is True and verdict.get("regression") is False:
        return {"id": bug.id, "status": "kept", "file": bug.file, "pages": pages, "verdict": verdict}

    restore_file(bug.file)
    return {"id": bug.id, "status": "rolled_back", "reason": "visual verification failed", "file": bug.file, "verdict": verdict}


async def main() -> None:
    os.chdir(REPO)
    QA.mkdir(exist_ok=True)
    LOGS.mkdir(parents=True, exist_ok=True)

    branch = f"fix/responsive-audit-{datetime.now().strftime('%Y%m%d')}"
    run(["git", "checkout", "-B", branch])

    server = await start_server()

    try:
        clean_dir(BASELINE)
        await run_capture(BASELINE)

        client = genai.Client(
            vertexai=True,
            project=PROJECT_ID,
            location=LOCATION,
            http_options=types.HttpOptions(api_version="v1"),
        ).aio

        try:
            bugs = await baseline_audit(client)
            results = []

            for bug in bugs:
                result = await process_bug(client, bug)
                results.append(result)
                write_json(LOGS / "remediation-results.json", results)

            verified = sorted(set(item["file"] for item in results if item.get("status") == "kept"))

            if verified:
                run(["git", "add", "--", *verified])
                check = run(["git", "diff", "--cached", "--check"], check=False)
                if check.returncode != 0:
                    run(["git", "restore", "--staged", "--", *verified], check=False)
                    raise RuntimeError(check.stderr or check.stdout)
                run(["git", "commit", "-m", "Fix responsive layout issues from QA audit"])
            else:
                write_json(LOGS / "no-verified-fixes.json", {"message": "No fixes were verified"})

            summary = {
                "branch": branch,
                "successful": [r for r in results if r.get("status") == "kept"],
                "rolled_back": [r for r in results if r.get("status") == "rolled_back"],
                "rejected": [r for r in results if r.get("status") == "rejected"],
                "skipped": [r for r in results if r.get("status") == "skipped"],
                "changed_files": changed_files(),
            }
            write_json(QA / "final-summary.json", summary)
            print(json.dumps(summary, indent=2))
        finally:
            await client.aclose()
    finally:
        server.terminate()
        await server.wait()


if __name__ == "__main__":
    asyncio.run(main())
```

## Additional Recommendations

1. Add `--dry-run`, `--max-bugs`, and `--max-vertex-calls` options before production use.
2. Add deterministic screenshot diffing before Gemini verification to reduce Vertex calls.
3. Add a retry limit per bug.
4. Add a hard denylist for files that automation may never edit.
5. Store every proposed patch in `qa-tmp/logs/patches/`.
6. Store every rollback reason in `qa-tmp/logs/remediation-results.json`.
7. Treat Gemini output as advisory unless DOM metrics and visual verification agree.
8. Never overwrite baseline artifacts during the fix loop.
9. Create the remediation branch before any file is modified.
10. Do not push automatically.
