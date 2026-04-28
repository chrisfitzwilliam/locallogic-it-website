# Local Logic IT Website Memory

Compact project memory for `locallogic-it-website`. Keep this file current and token-light.

## Current Facts
- Brand: Local Logic IT
- Tagline: `Local Service. Logical Solutions.`
- Canonical site: `https://locallogicit.com/`
- Contact email: `contact@locallogicit.com`
- Contact phone: `636-352-6572`
- Default mail link: `mailto:contact@locallogicit.com`
- Default phone link: `tel:6363526572`
- Service region: St. Charles, MO and Greater St. Louis metro

## Repo Shape
- Static HTML/CSS/JS site, no build system.
- Main pages include `index.html`, `business.html`, `residential.html`, `quick-support.html`, and `service-area.html`.
- Service detail pages live under `services/business/` and `services/residential/`.
- Shared styling and scripts live in `assets/`, `css/`, `components/`, and `scripts/`.

## Operating Rules
- Treat `memory.md` as the first file to update when durable repo facts change.
- If you need deeper background on a section, codebase area, or historical detail, check `additional_info.md` first before loading anything else.
- Keep `additional_info.md` as the detailed reference and avoid reading it unless the task needs extra context.
- For this repo, "commit to website", "push to website", or "commit to main" means: stage intended files, run `git diff --cached --check`, commit locally, push `origin main`, then verify live only if production changed.
- GitHub is the source of truth for the website release history; a local commit alone does not update the live site.
- Do not overwrite unrelated working-tree edits.
- Check `git status` before staging anything.
- Keep copy grounded in current site facts; do not invent business claims.

## Design / SEO
- Preserve the existing dark glassmorphism system in `css/brand.css`.
- Poppins remains the site font.
- Business pages use blue accents and `body.business-page`.
- Residential pages use amber accents and `body.residential-page`.
- Keep sitemap and robots aligned with the real page inventory.
- Service-area/local SEO matters and should stay tied to real service coverage.

## Deployment / Live State
- Live production is VM-side and timer-driven, not just GitHub-side.
- The production host is `fitzwilliam-web-1` in `us-central1-a`.
- Expect `locallogic-autodeploy.timer` / `.service` to pull `origin/main` with possible lag.
- Pushes to `main` are what trigger the deploy flow; local commits by themselves are not enough.
- After a push, production may lag until the VM timer runs; GitHub is not instantly live.
- Verify live site state after publish when the task affects production.

## Dead Code Removal (completed 2026-04-28)
- Deleted: `assets/gunmetal_texture.png`, `components/variations/residential-content.html`, `components/variations/whats-included.html`, `scripts/magnetic-slot-smoke.cjs`, `scripts/responsive-audit.cjs`, `scripts/verify-contact-email.ps1`
- CSS trimmed: removed `.muted`, `.rounded-xl`, `.mb-4`, `.mb-8` from `brand.css`; removed `.btn-support`, `.pill-divider`, `.mobile-service-row`/`.mobile-service-btn` blocks from `components/pill-nav.css`
- Total: 1,057 lines removed across 8 files

## Open Items
- Service detail pages still need schema markup.
- `business.html` service grid shows 6 of 8 business services — missing `hardware-procurement.html` and `voip-phone-systems.html`.
- `residential.html` service grid shows 6 of 8 residential services — missing `data-backup-recovery.html` and `printer-setup.html`.
- GitHub remote was severed during git reinit; reconnect with: `git remote add origin git@github.com:chrisfitzwilliam/locallogic-it-website.git`
