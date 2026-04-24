# Local Logic IT Project Memory

This is the single Markdown source of truth for Local Logic IT. Use this file for Codex, Claude, Gemini, or any other agent. Do not recreate separate agent-specific Markdown files unless Chris explicitly asks.

## Project

- Primary site: `https://locallogicit.com`
- Legacy hostname: `https://locallogic.fitzwilliam.net`
- Repo: `chrisfitzwilliam/locallogic-it-website`
- Local repo path: `C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website`
- Production host: GCP VM `fitzwilliam-web-1`
- Production web root: `/var/www/locallogic/current`
- Current production commit before the landing split-palette rollout: `9999e6b` (`feat: apply graphite bronze responsive redesign`)
- Latest verified production commit: `eea3096` (`Fix: Added hover bridge to services dropdown to prevent premature closing.`)
- Stack: static HTML, shared CSS, shared vanilla JS, no framework, no backend, no build step

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
- Stage intended files explicitly. Do not use `git add .` or `git add -A`.
- Before commit: run `git diff --cached --check`.
- After push: verify the live site directly with cache-busted URLs.

## Deployment Reality

Production deploys through a VM-side systemd timer:
- Timer: `locallogic-autodeploy.timer`
- Service: `locallogic-autodeploy.service`
- Command: `git pull --ff-only origin main`
- Working directory: `/var/www/locallogic/current`

Pushing to `main` triggers an automatic deploy within roughly one minute.

## Markdown Policy

This file replaces prior scattered Markdown handoffs and agent instructions. Keep project memory here so every agent reads the same current state.
