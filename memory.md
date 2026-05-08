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
- Preserve current SEO patterns (`title`, meta description, OG/Twitter, JSON-LD).

## Working Rules for Agents
- Update this `memory.md` when durable project workflows or site-state facts change.
- Keep this file compact; use `additional_info.md` for deeper history.
- Stage only intended files. Run `git diff --cached --check` before commit.
- Deployment: Push to `origin main` triggers a systemd auto-pull on the VM (every 1 minute).

## Infrastructure & Routing
- Host: Apex `https://locallogicit.com/`. `www` redirects to apex.
- Server: `fitzwilliam-web-1` (IP `130.211.118.230`). Admin key: `~/.ssh/google_compute_engine`.
- Nginx: Configured at `/etc/nginx/sites-available/locallogicit.com`.
  - Redirects `/index.html` to `/`.
  - Static assets have `Cache-Control: public, max-age=31536000, immutable`.
  - **Note (2026-05-08):** Removed `always` from `Cache-Control` for static assets to prevent Cloudflare from caching 404 responses as immutable.
- DNS: Managed on Cloudflare (Zone ID: `f6549448e157edee85aa0189cf62f70e`).
- Email: Microsoft 365 (Migrated from Zoho on 2026-05-08).
- Cloudflare Token: Current token in `cloudflare.key` includes `DNS:Edit`, `Zone:Read`, and `Cache Purge` permissions. It is fully functional for automated DNS and cache management.

## Recent Fixes & Remediation
- **Asset Fix (2026-05-08):** Resolved 404 for `assets/logo-cloud.png` (added untracked file).
- **Favicon Standardization (2026-05-08):** Added missing root `favicon.ico` and updated all HTML pages to use `/favicon.ico` consistently.
- **SEO (2026-05-05):** Remediated duplicate-home issues and fixed service-grid gaps.
- **Service Enrichment (2026-05-01):** Added "How It Works" and "Real-World Example" sections to all 16 service detail pages.

## Live Chat / Tawk
- Uses direct Tawk embed and `Tawk_API.maximize()` handlers.
- Do not reintroduce `scripts/tawk-title-lock.js`; it breaks the widget.
- Tawk may change tab titles to unread counts; treat as expected behavior.
