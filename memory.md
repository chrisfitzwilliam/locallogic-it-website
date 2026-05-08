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
- Search Console duplicate-home handling was remediated on 2026-05-05: live Nginx redirects client requests for `https://locallogicit.com/index.html` to `https://locallogicit.com/`, while `/` still serves the homepage normally.
- `http://` and `www` URL variants are expected to remain "Page with redirect" in Search Console because they intentionally canonicalize to the HTTPS apex host.
- On 2026-05-06, the static Gigi's Italian Kitchen site from `C:\Users\DESKTOP\Documents\gigis\gigis_website` was deployed to `fitzwilliam-web-1`: document root `/var/www/gigi/current`, Nginx vhost `/etc/nginx/sites-available/gigi.fitzwilliam.net`, enabled symlink in `sites-enabled`, and forced-host HTTP verification returned `200 OK`.
- `fitzwilliam.net` remains registered at IONOS, but authoritative nameservers were moved from Cloudflare to Google Cloud DNS on 2026-05-08. The Google project is `fitzwilliamdotnet`, managed zone `fitzwilliam-net`, nameservers `ns-cloud-a1.googledomains.com` through `ns-cloud-a4.googledomains.com`. IONOS registrar readback confirmed the Google nameservers; public resolvers may lag after the move.
- Google Cloud DNS for `fitzwilliam.net` contains Proton MX, SPF, verification TXT, DMARC, and the three Proton DKIM CNAMEs. `rdp.fitzwilliam.net` was removed from Google DNS on 2026-05-08 after abandoning the Cloudflare Tunnel / browser-RDP path in favor of WireGuard plus direct RDP.
- `gigi.fitzwilliam.net` DNS now lives in the `fitzwilliam.net` Google Cloud DNS zone, and HTTPS was issued on 2026-05-06 with Certbot. HTTP redirects to HTTPS, HTTPS returns `200 OK`, and the certificate expires on 2026-08-04. If the Windows host still cannot resolve the subdomain immediately, treat it as local DNS propagation/cache lag; the VM resolved it and Certbot validation succeeded.

## Live Chat / Tawk
- The site uses the direct Tawk embed `https://embed.tawk.to/69ee4a2453f59e1c3596b2ef/1jn5d37fc` and direct `Tawk_API.maximize()` click handlers.
- Do not reintroduce `scripts/tawk-title-lock.js` or the `LocalLogicOpenTawk()` wrapper without a browser-tested replacement; that guard was reverted in commit `ab98aa8` because it made the chatbox stop working.
- Tawk may change the browser tab title to unread-message text. Treat that as a Tawk-side behavior unless a future fix is proven to preserve chat loading and manual Live Chat clicks on production.

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

## Recent Infrastructure & Email Migration
- On 2026-05-08, the domain `locallogicit.com` was migrated from Zoho Mail to Microsoft 365.
- DNS management remains on Cloudflare. The correct Zone ID for `locallogicit.com` was confirmed as `f6549448e157edee85aa0189cf62f70e`.
- Microsoft 365 records applied:
  - MX: `locallogicit-com.mail.protection.outlook.com` (Priority 0)
  - CNAME: `autodiscover.outlook.com` for the `autodiscover` hostname.
  - SPF (TXT): Updated to `v=spf1 include:spf.protection.outlook.com -all`.
  - Verification: Added `MS=ms34195605` TXT record.
- Legacy Cleanup: All Zoho-related MX records, verification TXT records, and the `zmail._domainkey` DKIM record were removed to prevent conflicts.
- Cloudflare API Token: A new custom token with `DNS:Edit` and `Zone:Read` permissions was provided by the user and updated in `cloudflare.key`.
