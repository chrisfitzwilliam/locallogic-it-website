# Local Logic IT Website Memory

Compact project memory for `locallogic-it-website`. Keep this file short and current.

## Core Project Facts
- Brand: Local Logic IT
- Tagline: `Local Service. Logical Solutions.`
- Canonical site: `https://locallogicit.com/`
- Contact email: `contact@locallogicit.com`
- Contact phone display: `636-244-8827`
- Contact link targets: `mailto:contact@locallogicit.com` and `tel:6362448827`
- Service region: St. Charles, MO and Greater St. Louis metro

## Repo Shape
- Static HTML/CSS/JS site (no build step).
- Core pages: `index.html`, `business.html`, `residential.html`, `quick-support.html`, `service-area.html`.
- Service detail pages: `services/business/` and `services/residential/`.
- Shared assets/code: `assets/`, `css/`, `components/`, `scripts/`.

## Design and Content Rules
- Keep existing visual system in `css/brand.css` (dark glassmorphism + current palette split).
- Font system is Poppins across the main site.
- Business context uses blue accents (`body.business-page`); residential uses amber (`body.residential-page`).
- Keep copy factual and local to real services; do not invent claims.
- Preserve the current SEO page pattern already used across the site (`title`, meta description, OG/Twitter, JSON-LD).

## Working Rules for Agents
- Update this `memory.md` when durable project workflows or site-state facts change.
- Keep this file compact; use `additional_info.md` only when deeper history/context is required.
- Do not revert or overwrite unrelated working-tree edits.
- Stage only intended files in mixed worktrees.
- Run `git diff --cached --check` before commit.

## Deploy and Publish Contract
- For this repo, `commit to website`, `push to website`, or `commit to main` means:
  1. Stage intended files only.
  2. Commit locally.
  3. Push `origin main`.
  4. Verify production when live behavior/content changed.
- Local commits alone do not deploy production.
- Always follow: `C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website\deployment.md`.
- `deployment.md` is the source of truth for key locations, SSH/host details, VM auto-deploy behavior, post-push verification, and deploy recovery steps.

## Live Routing Facts
- Production host is apex `https://locallogicit.com/`.
- `https://www.locallogicit.com/` redirects to apex.

## Recent SEO Remediation
- `SEO_AUDIT.md` records the 2026-04 SEO audit recommendations and approval-gated items.
- SEO remediation commit `a52a762` was pushed to `origin/main` and deployed by the VM auto-deploy timer.
- Hub service-grid gaps were fixed by adding cards for:
  - `services/business/hardware-procurement.html`
  - `services/business/voip-phone-systems.html`
  - `services/residential/data-backup-recovery.html`
  - `services/residential/printer-setup.html`
- Missing image attributes were fixed using exact PNG dimensions:
  - `assets/logo.png`: `1024x682`
  - `assets/quick-assist-guide.png`: `1024x576`
- Targeted Cloudflare purge for `/assets/lordicon/lordicon.js` and `/assets/og-image.png` completed after user provided a temporary token. Edge and origin matched afterward; the user confirmed the exposed token was revoked.
- UI Fix (2026-05-01): Standardized contact section to a uniform 3-card grid site-wide, moved "Quick Support" to a global footer pill, and added a "Testimonials" section to main hub pages.
- Cleanup: Fixed capitalization (PC Repair, passkeys) and removed redundant phrasing in business service descriptions.
- Deployment: All changes pushed to origin main and verified on production.

## Recent Service Detail Enrichment
- On 2026-05-01, all 16 current chooser-card service detail pages were enriched with a `How It Works` pipeline section and a `Real-World Example` section between the includes and trust sections.
- Shared pipeline styling lives in `css/service.css` (`.pipeline`, `.pipeline-flow`, `.pipeline-step`, `.pipeline-icon`), including mobile stacking and reduced-motion handling.
- Current service detail scope is 8 business pages and 8 residential pages. The business scope includes `voip-phone-systems.html` and `it-consulting.html` because those pages are linked from `business.html`.
- Service detail contact cards use `mailto:contact@locallogicit.com`.
