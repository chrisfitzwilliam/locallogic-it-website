# Local Logic IT Init

This repo is the static website for Local Logic IT.

## Source Context

Primary source: `..\PROJECT_CONTEXT.md`

Use that file for the full infrastructure and business handoff. This `INIT.md` is the working summary that lives with the code.

## Project Snapshot

- Business: Local Logic IT
- Tagline: `Local Service. Logical Solutions.`
- Primary live site: `https://locallogicit.com`
- Legacy hostname: `https://locallogic.fitzwilliam.net`
- Repo: `chrisfitzwilliam/locallogic-it-website`
- Stack: static site, single `index.html`, local asset folder, GitHub Actions deploy
- Design direction: Travela-inspired marketing layout adapted for IT services

## Current Repo Shape

- `index.html`: all page markup, styling, and small interactive behavior
- `assets/logo.png`: logo asset
- `.github/workflows/deploy.yml`: deploys on push to `main`

There is no app framework, build step, backend, or form processing in this repo today.

## Brand Rules

- Primary color: `#1E2D5C`
- Accent color: `#C9A96E`
- Tone: professional, friendly, local, practical
- Core message: local IT support with premium, logical service

## Current Site Model

The live page is a single-page marketing site with:

- sticky navigation
- hero section
- service tabs / tiles
- consultation-style inquiry form
- footer

The site is responsive and mostly self-contained in one file.

## Deployment

- Branch: `main`
- Trigger: push to GitHub
- Remote path: `/var/www/locallogic/current`
- Server: `nginx` on GCP VM `fitzwilliam-web-1`
- Auto-update mechanism: server-side `systemd` timer running as `deploy`
- Status workflow: `.github/workflows/deploy.yml` reports deployment mode but does not perform the deploy

Expected deploy flow:

1. Edit locally.
2. Commit and push to `main`.
3. The VM timer checks `origin/main` about once per minute.
4. The server repo runs `git pull --ff-only origin main`.
5. Site updates automatically, usually within about 1 minute.

## Important Constraints

- The inquiry form is presentational only right now.
- Copy is still partly placeholder / generic.
- Analytics are not installed.
- Because the repo is static, keep changes simple unless a backend or form service is explicitly introduced.

## Immediate Priorities

If taking over work on this project, focus in this order:

1. Improve business copy so it reflects the actual offer.
2. Decide whether the inquiry form should email, store leads, or stay informational.
3. Add trust-building content such as testimonials, industries, and process.
4. Add analytics and basic SEO improvements.
5. Expand into additional pages only if the owner wants more than a landing page.

## Working Notes

- The user is non-technical and prefers direct, visual progress.
- Favor changes that are easy to preview live.
- When editing, verify the result in `index.html` first because most of the site lives there.
