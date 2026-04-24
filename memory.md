# Local Logic IT Project Memory

This is the single Markdown source of truth for Local Logic IT. Use this file for Codex, Claude, Gemini, or any other agent. Do not recreate separate agent-specific Markdown files unless Chris explicitly asks.

## Project

- Primary site: `https://locallogicit.com`
- WWW redirect: `https://www.locallogicit.com` -> `https://locallogicit.com`
- Legacy hostname: `https://locallogic.fitzwilliam.net`
- Repo: `chrisfitzwilliam/locallogic-it-website`
- Local repo path: `C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website`
- Production host: GCP VM `fitzwilliam-web-1`
- Production web root: `/var/www/locallogic/current`
- Latest verified production commit: `bac3aef` (`fix: make contact cards fully clickable on landing page`)
- Stack: static HTML, shared CSS, shared vanilla JS, no framework, no backend, no build step

## Domain State

- Canonical public host is `https://locallogicit.com`.
- `www.locallogicit.com` should only redirect to the apex domain. Do not treat it as a separate canonical host.
- `locallogic.fitzwilliam.net` stays live and should continue serving the same site on its own hostname.
- Deployed HTML pages now include canonical tags pointing at `https://locallogicit.com/...`.
- The VM has a Let's Encrypt certificate covering `locallogicit.com` and `www.locallogicit.com`.
- Cloudflare proxy is enabled for apex and `www`.
- Current Cloudflare edge SSL mode is `Full` with active certificate status. Do not assume `Full (strict)` without re-validating the origin certificate path first.

### Email Routing

- Cloudflare Email Routing for `locallogicit.com` was configured on April 23, 2026 local time. Cloudflare API state reached `status: ready`, `enabled: true`, and `synced: true`.
- `contact@locallogicit.com` forwards to the verified destination address `chris@fitzwilliam.net`.
- Required inbound-mail DNS records now exist on the zone: MX records for `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, and `route3.mx.cloudflare.net`; SPF `v=spf1 include:_spf.mx.cloudflare.net ~all`; and DKIM at `cf2024-1._domainkey.locallogicit.com`.
- This is inbound forwarding only. Replies still send from the underlying mailbox unless a real `@locallogicit.com` mailbox is added later.
- Local checkout contact links were updated site-wide to `mailto:contact@locallogicit.com` and `tel:6363526572` in the current working tree.
- The visible phone text remains `636-352-6572`; only the clickable `tel:` targets use the unformatted digits.

### Current Local Checkout State (April 24, 2026)

- Branch state is currently up to date with `origin/main`.
- The contact-link, SEO metadata, and landing UI sweep touched `index.html`, `business.html`, `residential.html`, `quick-support.html`, and all 16 service detail pages under `services/`.
- `scripts/verify-contact-email.ps1` now verifies both contact email and phone. Latest local run returned: `Verified 19 mailto links use contact@locallogicit.com and 60 phone displays use 636-352-6572.`
- `robots.txt` and `sitemap.xml` have been added and verified live.
- `memory.md` is now up to date with the production state.

## Current Site Shape

Active pages:

- `index.html`: Landing chooser with residential/business split, high-level "About" and "Contact" sections, and cinematic header pill.
- `business.html`: Business services hub with synchronized animated navigation.
- `residential.html`: Residential services hub with synchronized animated navigation.
- `quick-support.html`: Dedicated support portal for Windows Quick Assist (Ctrl+Win+Q workflow).
- `services/business/*.html`: Business service detail pages.
- `services/residential/*.html`: Residential service detail pages.

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
- `assets/quick-assist-guide.png`: Visual guide for Windows Quick Assist.

`assets/logo.png` is legacy. Current pages should use the SVG assets in `assets/brand/`.

## Brand And Current Visual Direction

The base brand is still Local Logic Graphite Bronze, but the landing chooser and two hub pages now use a split audience palette.

- Graphite background: `#07070f` (Current Landing/Hubs use deep dark themes)
- Deep edge/vignette: `#04040a`
- Surface charcoal: `#2F3030`
- Muted bronze: `#A98236`
- Soft highlight gold: `#C7B064`
- Warm text gold: `#B99A4D`
- Primary Blue (Business/Global Support): `#4A80E8`
- Warm Amber (Residential): `#F59E0B`

### The "Double Pill" Navigation
The site now uses a cinematic, glassmorphic header pill:
- **Main Pill**: Contains the logo, "Services" dropdown, "About", "Contact", and a primary "Quick Support" button.
- **Tagline Pill**: A secondary, smaller pill floating directly beneath the main pill ("LOCAL SERVICE. LOGICAL SOLUTIONS.").
- **Entrance Animation**: On `index.html`, the pill enters first, followed by a horizontal expansion of the links, and finally the tagline pill fades in.
- **Services Dropdown**: Features a "hover bridge" (invisible padding) to prevent accidental closing as the mouse moves from the trigger to the menu.

## Recent UI & Navigation Overhaul (April 22-23, 2026)

Key architectural changes:

1.  **Landing Page Expansion**: `index.html` is no longer a simple chooser. It now includes "About" and "Contact" sections below the hero to provide immediate context for first-time visitors.
2.  **Global Support Integration**: Added `quick-support.html` and a persistent "Quick Support" CTA button in the header across all pages.
3.  **Branding Identity**: All logos and site names in the navigation are clickable and return the user to `index.html`.
4.  **Hover Bridge Logic**: Fixed a common UX pitfall where the services dropdown would flicker or close prematurely by implementing a contiguous hit area between the trigger and the menu.

## Implementation Rules

- Preserve landing chooser behavior, iframe preview scaling, mobile hamburger menus, header menu behavior, landing transition, and `sessionStorage` receiving animation.
- Preserve links, anchors, mail links, phone display, service navigation, focus states, and reduced-motion behavior.
- Keep shared CSS in `assets/css/site.css` when possible.
- Keep shared JS in `assets/js/site.js` when possible.
- Page-specific inline CSS still exists; edit it carefully and verify representative pages.
- For landing/hub changes, prefer shared CSS/JS overrides instead of expanding more inline scripts.
- **Navigation Consistency**: When adding new pages, always replicate the "Double Pill" header and ensure the "Services" dropdown is functional.

## Local Workflow

- Use PowerShell on Windows.
- Use `python`, not `py`.
- Local preview: `python -m http.server <port>`.
- When Chris says "commit to locallogicit.com" or "commit to website", interpret that as a commit to `main` in `https://github.com/chrisfitzwilliam/locallogic-it-website`; that repo's GitHub Action is what updates the server.
- Contact sweep verification: `powershell -ExecutionPolicy Bypass -File .\scripts\verify-contact-email.ps1`.
- `keys.txt` is a local-only secrets file and may contain live Cloudflare API tokens. Keep it untracked and do not commit it.
- Stage intended files explicitly. Do not use `git add .` or `git add -A`.
- Before commit: run `git diff --cached --check`.
- After push: verify the live site directly with cache-busted URLs.

## Deployment Reality

Production deploys through a VM-side systemd timer:
- Timer: `locallogic-autodeploy.timer`
- Service: `locallogic-autodeploy.service`
- Command: `git pull --ff-only origin main`
- Working directory: `/var/www/locallogic/current`
- Nginx serves both `locallogicit.com` and `locallogic.fitzwilliam.net` from the same deployed tree.

Pushing to `main` triggers an automatic deploy within roughly one minute. Production verification should cover the apex domain, the `www` redirect, and the legacy hostname.

## Markdown Policy

This file replaces prior scattered Markdown handoffs and agent instructions. Keep project memory here so every agent reads the same current state.
