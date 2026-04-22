# Local Logic IT Project Memory

This is the single Markdown source of truth for Local Logic IT. Use this file for Codex, Claude, Gemini, or any other agent. Do not recreate separate agent-specific Markdown files unless Chris explicitly asks.

## Project

- Site: `https://locallogic.fitzwilliam.net`
- Repo: `chrisfitzwilliam/locallogic-it-website`
- Local repo path: `C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website`
- Production host: GCP VM `fitzwilliam-web-1`
- Production web root: `/var/www/locallogic/current`
- Current production commit before the landing split-palette rollout: `9999e6b` (`feat: apply graphite bronze responsive redesign`)
- Latest intended production direction after the current rollout: commit on `main` titled `feat: polish landing split palette` after push/deploy verification.
- Stack: static HTML, shared CSS, shared vanilla JS, no framework, no backend, no build step

## Current Site Shape

Active pages:

- `index.html`: landing chooser with residential/business split, iframe previews, header menu, and transition animation.
- `business.html`: business services hub.
- `residential.html`: residential services hub.
- `services/business/*.html`: business service detail pages.
- `services/residential/*.html`: residential service detail pages.

Shared assets:

- `assets/brand/local-logic-logo.svg`
- `assets/brand/local-logic-logo-reversed.svg`
- `assets/brand/local-logic-mark.svg`
- `assets/brand/favicon.svg`
- `assets/brand/favicon-32.png`
- `assets/brand/apple-touch-icon.png`
- `assets/brand/social-card.png`
- `assets/css/site.css`
- `assets/js/site.js`

`assets/logo.png` is legacy. Current pages should use the SVG assets in `assets/brand/`.

## Brand And Current Visual Direction

The base brand is still Local Logic Graphite Bronze, but the landing chooser and two hub pages now use a split audience palette.

- Graphite background: `#232425`
- Deep edge/vignette: `#111213`
- Surface charcoal: `#2F3030`
- Muted bronze: `#A98236`
- Soft highlight gold: `#C7B064`
- Warm text gold: `#B99A4D`
- Light paper: `#F5F1E7`
- Body text on light surfaces: `#222222`

Landing and hub-page palette split:

- Residential / Home & Family: warm honey, gold, and deep brown-gold accents.
- Business / Business & Office: dark gunmetal, blue-gray, and cool light-surface accents.
- Landing top pill: light cream/gold surface with dark text and restrained shadow.
- Landing choice cards: static premium cards; no moving conic border sweep, no breathing glow, no full-screen flash.
- Hub pages only are rethemed with side-specific body classes. Service detail pages intentionally stay visually stable for now.

The older indigo/amber and unified graphite-only directions are historical context only for the landing and hub pages.

## Landing Split-Palette Rollout From 2026-04-21

Files changed for the rollout:

- `index.html`
- `residential.html`
- `business.html`
- `assets/css/site.css`
- `assets/js/site.js`
- `memory.md`

Behavior and implementation notes:

- `index.html` keeps the iframe preview chooser and header menu, but the click transition is now a smoother side selection and header-pill float.
- `sessionStorage.fromLanding` now stores the selected side string: `residential` or `business`.
- `assets/js/site.js` owns the destination arrival behavior through `initLandingArrival()`.
- Destination arrival classes are `is-arriving-from-landing`, `is-arriving-residential`, `is-arriving-business`, and `has-arrived`.
- `residential.html` body class is `site-page residential-page`.
- `business.html` body class is `site-page business-page`.
- The old duplicated inline "Bubble landing + expand animation" scripts were removed from both hub pages.
- The services heading now uses `What We Do` as the primary `h2`; the former headings are now `.section-support` text:
  - Residential support text: `What We Can Help With`
  - Business support text: `What We Offer`
- Shared CSS contains the scoped page palettes, landing chooser overrides, destination arrival reveal, and `.section-support` styling.

## Implementation Rules

- Preserve landing chooser behavior, iframe preview scaling, mobile hamburger menus, header menu behavior, landing transition, and `sessionStorage` receiving animation.
- Preserve links, anchors, mail links, phone display, service navigation, focus states, and reduced-motion behavior.
- Keep shared CSS in `assets/css/site.css` when possible.
- Keep shared JS in `assets/js/site.js` when possible.
- Page-specific inline CSS still exists; edit it carefully and verify representative pages.
- For landing/hub changes, prefer shared CSS/JS overrides instead of expanding more inline scripts.
- Do not reintroduce the old full-screen flash, conic border sweep, breathing card glow, or duplicated inline hub arrival scripts.
- Avoid horizontal overflow on mobile. Verify common mobile widths after layout changes.
- Keep touch targets around 44px where practical.
- Do not introduce a build step, framework, backend, form handler, or package manager unless Chris asks.

## Local Workflow

- Use PowerShell on Windows.
- Use `python`, not `py`.
- Local preview: `python -m http.server <port>`.
- Stage intended files explicitly. Do not use `git add .` or `git add -A`.
- Leave unrelated local files alone unless Chris asks.
- Before commit: run `git diff --cached --check`.
- After push: verify the live site directly with cache-busted URLs.

## Deployment Reality

GitHub Actions does not deploy files for this repo.

`.github/workflows/deploy.yml` is a status-only workflow. Production deploys through a VM-side systemd timer:

- Timer: `locallogic-autodeploy.timer`
- Service: `locallogic-autodeploy.service`
- Runs as: `deploy`
- Command: `git pull --ff-only origin main`
- Working directory: `/var/www/locallogic/current`

Normal deploy flow:

1. Commit on `main`.
2. Push `origin main`.
3. Wait about one minute for the VM timer.
4. Verify live URLs with cache-busting query strings.

Recommended live verification:

- `/index.html` contains `assets/css/site.css`
- `/business.html` contains `assets/brand/local-logic-mark.svg`
- `/residential.html` contains `assets/js/site.js`
- `/business.html` contains `site-page business-page`
- `/residential.html` contains `site-page residential-page`
- `/assets/js/site.js` contains `initLandingArrival`
- `/assets/css/site.css` contains `.landing-page .half.is-selected`
- `/services/residential/pc-repair.html` contains shared CSS
- `/services/business/managed-it.html` contains the SVG mark
- `/assets/css/site.css` contains `--ll-graphite: #232425;`
- `/assets/brand/favicon.svg` contains `#A98236`

## Verification Already Done For Landing Split-Palette Rollout

Before commit:

- TDD-style marker validation failed before implementation and passed after implementation.
- `git diff --check` passed.
- Temporary local HTTP preview with `python -m http.server` returned HTTP 200 for:
  - `/index.html`
  - `/residential.html`
  - `/business.html`
  - `/services/residential/pc-repair.html`
  - `/services/business/managed-it.html`
  - `/assets/css/site.css`
  - `/assets/js/site.js`
- Static checks confirmed removed markers are gone from edited files:
  - `Bubble landing + expand animation`
  - `function injectFlash`
  - `border-sweep`
  - `glow-gold`
  - `glow-blue`
- HTML asset checks confirmed `index.html`, `residential.html`, and `business.html` still reference shared CSS and JS.
- Headless Chrome checks passed:
  - Desktop `1366x768` landing: no horizontal overflow, pseudo animated border hidden, non-empty screenshot.
  - Mobile `390x844` landing: no horizontal overflow, pseudo animated border hidden, non-empty screenshot.
  - `residential.html` and `business.html`: no horizontal overflow; services heading is `What We Do`; support text present.
  - Clicking Business lands on `/business.html` with `site-page business-page` and arrival classes.
  - Clicking Residential lands on `/residential.html` with `site-page residential-page` and arrival classes.
  - Mobile hamburger menus open on both hub pages and set `aria-expanded="true"`.

## Production Fix From 2026-04-21

Symptom:

- Commit `9999e6b` was pushed to `main`.
- GitHub Action showed success.
- The live site stayed old.
- New asset URLs such as `/assets/css/site.css` returned old `index.html` content.

Root cause:

- The GitHub Action was only a status workflow.
- The production checkout had diverged from GitHub: `main...origin/main [ahead 4, behind 5]`.
- `locallogic-autodeploy.service` failed every minute with `fatal: Not possible to fast-forward, aborting.`

Fix performed after explicit approval:

```bash
cd /var/www/locallogic/current
git branch backup/server-main-before-sync-20260421191427 HEAD
git fetch origin main
git reset --hard origin/main
systemctl reset-failed locallogic-autodeploy.service
systemctl start locallogic-autodeploy.service
```

Backup branch:

- `backup/server-main-before-sync-20260421191427`
- Points to old server-only commit `6055f928f782b0ab01e12ad754173969213185e2`

Healthy state after fix:

- VM current commit: `9999e6b5b64c820af0d183769c9b20d4428f27ce`
- VM `origin/main`: `9999e6b5b64c820af0d183769c9b20d4428f27ce`
- `locallogic-autodeploy.service`: exits successfully with `Already up to date`
- `locallogic-autodeploy.timer`: active

If live deploy fails again, investigate first:

```bash
gcloud compute ssh fitzwilliam-web-1 --zone us-central1-a --command "sudo -n -u deploy bash -lc 'cd /var/www/locallogic/current && git status --short --branch && git rev-parse HEAD && git rev-parse origin/main'"
gcloud compute ssh fitzwilliam-web-1 --zone us-central1-a --command "sudo -n journalctl -u locallogic-autodeploy.service -n 80 --no-pager"
```

Do not run production `git reset --hard origin/main` without first creating a backup branch and getting explicit approval.

## Verification Already Done For Commit `9999e6b`

Before push:

- Shared asset/reference check passed for all 19 pages.
- Old palette/logo/script scan passed.
- Local link/script/image target scan passed.
- `git diff --cached --check` passed.
- Chrome rendered all 19 pages across `320x568`, `360x740`, `390x844`, `430x932`, `768x1024`, `1024x768`, `1366x768`, `1440x900`, and `1920x1080`.
- Browser checks found no horizontal overflow.
- Mobile menu spot checks passed on hub and service pages.

After production sync:

- Live `index.html`, `business.html`, `residential.html`, `pc-repair.html`, and `managed-it.html` returned expected new markers.
- Live `/assets/css/site.css` returned the new CSS.
- Live `/assets/brand/favicon.svg` returned the new SVG.

## Markdown Policy

This file replaces prior scattered Markdown handoffs and agent instructions. Keep project memory here so every agent reads the same current state.
