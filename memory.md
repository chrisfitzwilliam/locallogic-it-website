# Local Logic IT Project Memory

This is the single Markdown source of truth for Local Logic IT. Use this file for Codex, Claude, Gemini, or any other agent. Do not create separate agent-specific handoff files unless Chris explicitly asks.

## Project

- Primary site: `https://locallogicit.com`
- WWW redirect: `https://www.locallogicit.com` -> `https://locallogicit.com`
- Legacy hostname: `https://locallogic.fitzwilliam.net`
- Repo: `chrisfitzwilliam/locallogic-it-website`
- Local repo path: `C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website`
- Stack: plain static HTML with mostly page-local inline CSS and JS, no framework, no backend, no build step
- Public site footprint: 20 HTML pages
- Current local `HEAD`: `d9a1d91` (`feat: implement 'Top-Left Float & Snap' navigation animation variation`)

## Domain State

- Canonical public host is `https://locallogicit.com`.
- `www.locallogicit.com` should only redirect to the apex domain. Do not treat it as a separate canonical host.
- `locallogic.fitzwilliam.net` stays live and should continue serving the same site on its own hostname.
- Canonical tags in the current checkout point at `https://locallogicit.com/...`.
- Cloudflare Email Routing for `contact@locallogicit.com` forwards to `chris@fitzwilliam.net`.
- Visible phone text is `636-352-6572`. Clickable phone links use `tel:6363526572`.

## Current Local Checkout State (April 25, 2026)

- Branch state is `main...origin/main` with a mixed worktree. Do not assume a clean checkout before making edits.
- Tracked modifications currently present: `index.html`, `business.html`, `residential.html`, and `memory.md`.
- Untracked files currently relevant to site work include `assets/services/`, `components/`, the navbar planning/spec docs under `docs/superpowers/`, and `scripts/magnetic-slot-smoke.cjs`. There are also unrelated untracked support files and folders such as `.superpowers/`, `.audit-output/`, `.claude/`, `.playwright-mcp/`, `.openclaude-profile.json`, `keys.txt`, and `timeline.txt`; do not stage them by accident.
- `index.html`, `business.html`, `residential.html`, `quick-support.html`, and all 16 service detail pages currently include `<title>`, meta description, canonical, Open Graph metadata, Twitter metadata, and one JSON-LD block with `Organization`, `WebSite`, and `WebPage`.
- `index.html` now has one visible semantic `h1`: `Choose Your Home or Business IT Support`.
- Safe existing social-preview image path in this checkout is `assets/logo.png`. Do not assume `assets/brand/` or a dedicated social-card asset exists.
- `robots.txt` and `sitemap.xml` are tracked in this checkout, target `https://locallogicit.com`, and reflect the current 20-page public footprint.

### Latest Local Verification (April 25, 2026)

- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-contact-email.ps1` confirmed 19 mailto links target `contact@locallogicit.com` and 60 visible phone displays use `636-352-6572`.
- Temporary local preview via `python -m http.server` plus headless Playwright confirmed the landing pill handoff into `business.html` / `residential.html` works without the old pre-navigation blink.
- The current fallback model for that handoff is geometry-based: the landing page stores the live pill frame in `sessionStorage.landingPillFrame`, and the destination hub animates the real nav pill from that source frame into the top-left slot if a native cross-document view transition does not run.

## Current Site Shape

Active pages:

- `index.html`: Landing chooser with residential/business split, About and Contact sections, and the cinematic pill header.
- `business.html`: Business services hub.
- `residential.html`: Residential services hub.
- `quick-support.html`: Quick Assist support page.
- `services/business/*.html`: 8 business service detail pages.
- `services/residential/*.html`: 8 residential service detail pages.

Current asset reality:

- Key top-level assets in active use are `assets/logo.png`, `assets/quick-assist-guide.png`, and service artwork under `assets/services/`.
- `assets/gunmetal_texture.png` exists locally but is currently untracked.
- There is no `assets/brand/` directory in this checkout.
- There is no shared `assets/css/site.css` or `assets/js/site.js` in this checkout. Most styling and interaction logic still live inline in the HTML files.

## Current Visual Direction

- The landing chooser and two hub pages use a split audience palette: blue for business, amber for residential, with a dark graphite base.
- The navigation direction is the glassmorphic "double pill" header with `quartz-shell` / `pill-wrapper` structure and a floating tagline pill.
- The current navigation-motion target is: keep the landing pill visually intact, then have it float and magnetically snap into the top-left hub nav position with no intentional blink.
- Header and landing-motion work is still concentrated in `index.html`, `business.html`, and `residential.html`. Merge carefully there and do not overwrite unrelated in-progress animation or layout adjustments.

## Implementation Rules

- Preserve landing chooser behavior, iframe preview scaling, reduced-motion handling, anchor links, mail links, phone links, and service navigation.
- Because the worktree is mixed, patch only the lines required for the task and do not revert unrelated local changes.
- Do not assume shared sitewide CSS/JS bundles or brand-asset folders that are not present in this checkout.
- For landing-to-hub pill animation work, preserve both layers: the shared `site-pill` view-transition hooks and the `landingPillFrame` geometry fallback.
- For sitewide sweeps, validate all 20 public pages and confirm every `href="services/..."` target resolves to a real file.
- When touching SEO, keep facts evidence-based. Do not invent address, hours, pricing, reviews, or other unsupported business data.

## Local Workflow

- Use PowerShell on Windows.
- Use `python`, not `py`.
- Local preview: `python -m http.server <port>`.
- `gcloud` CLI is installed on this host and can be used for VM/deploy checks.
- Contact verification: `powershell -ExecutionPolicy Bypass -File .\scripts\verify-contact-email.ps1`.
- `commit to website` means do the minimum needed to update the GitHub repo `https://github.com/chrisfitzwilliam/locallogic-it-website`: stage only the intended files, commit them, and push to the repo. Do not add live-site verification or broader production checks unless Chris explicitly asks for `commit to main`, `locallogicit.com`, or live verification.
- `commit to main` / `commit to locallogicit.com` means: stage only intended files, commit on `main`, push `origin/main`, then verify the live site after the VM auto-deploy delay.
- Stage intended files explicitly. Do not use `git add .` or `git add -A`.
- Before commit: run `git diff --cached --check`.
- `keys.txt` is local-only and may contain real secrets. Keep it untracked.

## Deployment Reality

- Production deploys through the VM-side systemd timer, not through a local build step.
- The website is hosted on one VM only; there is no secondary production VM to check.
- The VM can lag behind GitHub by one timer interval; a fresh push may not be live until the next scheduled pull.
- Timer: `locallogic-autodeploy.timer`
- Service: `locallogic-autodeploy.service`
- Deploy command on the VM: `git pull --ff-only origin main`
- Working directory on the VM: `/var/www/locallogic/current`
- Nginx serves both `locallogicit.com` and `locallogic.fitzwilliam.net` from the same deployed tree. `www` should redirect to apex.
- After push, verify the apex domain, the `www` redirect, and the legacy hostname instead of assuming the deploy succeeded.

## Markdown Policy

This file replaces scattered Markdown handoffs. Keep durable repo state, workflow rules, and current resume handles here so every agent reads the same current context.
