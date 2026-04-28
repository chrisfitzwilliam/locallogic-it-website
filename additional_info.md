# Additional Info — Local Logic IT Website
> **Purpose:** This is the detailed background reference for the Local Logic IT website project. `memory.md` is the compact operational file to keep current first. Read this file when you need fuller structure, design, or historical context.

---

## 1. Business Overview

| Field | Value |
|---|---|
| **Company Name** | Local Logic IT |
| **Tagline** | "Local Service. Logical Solutions." |
| **Website** | https://locallogicit.com/ |
| **Phone** | 636-352-6572 (area code 636 = St. Charles / St. Louis, MO) |
| **Email** | contact@locallogicit.com |
| **Primary Service Region** | St. Charles, MO and surrounding Greater St. Louis metro area |
| **Service Model** | On-site and remote IT support for residential (home/family) and business clients |

### What they do
- **Residential:** PC repair, virus/malware removal, home networking, smart home support, device setup & training, password & account help, data backup/recovery, printer setup
- **Business:** Managed IT services, backup & recovery, AI automation, cybersecurity, cloud services (M365), IT consulting, hardware procurement, VoIP phone systems

### Brand Personality
- Friendly, human, no-jargon
- Local accountability — "not a faceless helpdesk"
- No call centers; real people solving real problems

---

## 2. File & Folder Structure

```
locallogic-it-website/
├── index.html                          # Landing / "Chooser" page (home)
├── business.html                       # Business IT services landing page
├── residential.html                    # Residential IT support landing page
├── quick-support.html                  # Windows Quick Assist remote support guide
├── robots.txt                          # Allow all; Sitemap pointer
├── sitemap.xml                         # Full sitemap (19 URLs)
├── MASTER_MEMORY.md                    # ← THIS FILE
│
├── assets/
│   ├── logo.png                        # Full logo (used as favicon too)
│   ├── logo-mark.svg                   # Logomark SVG (used on service detail pages)
│   ├── favicon.png                     # Same as logo.png (32×32 display)
│   ├── og-image.png                    # Open Graph social share image
│   ├── gunmetal_texture.png            # Background texture (available, not always used)
│   └── quick-assist-guide.png          # Screenshot for quick-support.html
│
├── css/
│   ├── brand.css                       # ⭐ GLOBAL design system (tokens, typography, layout, footer, contact grid, buttons)
│   └── service.css                     # Styles specific to service detail pages (services/*)
│
├── components/
│   ├── pill-nav.css                    # ⭐ Pill navigation component styles (shared by index, residential, business)
│   └── variations/
│       ├── residential-content.html    # (Variant/prototype content for residential)
│       └── whats-included.html         # (Variant/prototype for service includes)
│
├── scripts/
│   ├── pill-nav.js                     # ⭐ Pill navigation component JS (shared by index, residential, business)
│   ├── magnetic-slot-smoke.cjs         # Dev/prototype script (not in production)
│   ├── responsive-audit.cjs            # Dev audit tool
│   └── verify-contact-email.ps1        # PowerShell diagnostic script
│
└── services/
    ├── business/                       # 8 business service detail pages
    │   ├── managed-it.html
    │   ├── backup-recovery.html
    │   ├── ai-automation.html
    │   ├── cybersecurity.html
    │   ├── cloud-services.html
    │   ├── it-consulting.html
    │   ├── hardware-procurement.html
    │   └── voip-phone-systems.html
    └── residential/                    # 8 residential service detail pages
        ├── pc-repair.html
        ├── virus-malware-removal.html
        ├── home-networking.html
        ├── smart-home-support.html
        ├── device-setup-training.html
        ├── password-account-help.html
        ├── data-backup-recovery.html
        └── printer-setup.html
```

---

## 3. Design System (brand.css)

### Color Tokens
```css
--bg-graphite:       #0B0F19    /* Page background (very dark navy/graphite) */
--bg-darker:         #05070a    /* Section backgrounds, footer */
--accent-blue:       #0066FF    /* Business brand accent; CTAs, links, indicators */
--accent-blue-glow:  rgba(0, 102, 255, 0.15)
--accent-amber:      #FF8A00    /* Residential brand accent; also "IT" in logo name */
--accent-amber-glow: rgba(255, 138, 0, 0.15)
--text-primary:      #FFFFFF
--text-secondary:    #A6A9B3    /* Muted text */
--border-glass:      rgba(255, 255, 255, 0.12)
--glass-bg:          rgba(255, 255, 255, 0.03)
--glass-bg-hover:    rgba(255, 255, 255, 0.06)
--font-main:         'Poppins', sans-serif
--transition:        all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Key Utility Classes
- `.glass-panel` — frosted glass card (blur + border + bg)
- `.btn`, `.btn-primary` (blue), `.btn-secondary` (amber), `.btn-outline` — buttons
- `.section` — `padding: 80px 24px; max-width: 1200px; margin: 0 auto`
- `.section-title`, `.section-label` — typography patterns
- `.text-gradient-blue`, `.text-gradient-amber` — gradient text spans
- `.contact-grid` / `.contact-card` — 4-card contact section
- `.footer` — shared footer pattern
- `.bg-pattern`, `.bg-network` — fixed decorative background layers

### Color Theming by Page
- **Business pages:** blue accent (`#0066FF`), `class="business-page"` on `<body>`
- **Residential pages:** amber accent (`#FF8A00`), `class="residential-page"` on `<body>`
  - `.residential-page .section-label` overrides label color to amber
  - `.residential-page .contact-card:hover` uses amber border

---

## 4. Typography

- **Font:** `Poppins` (Google Fonts) — weights 300, 400, 500, 600, 700, 800
- **Secondary font (quick-support only):** `JetBrains Mono` (monospace, for keyboard shortcut display)
- **Headings:** `font-weight: 600` global; `700` on hero H1s and section titles
- **Letter-spacing:** `-0.01em` on headings; `-0.04em` on large display headings
- All fonts are loaded via `<link>` in each page's `<head>` (not centralized, repeated per page)

---

## 5. The Pill Navigation Component

### Overview
The nav is a distinctive floating "pill" (rounded capsule) that:
1. On `index.html` — starts **centered**, floats in with animation, then expands to show links
2. On `business.html` / `residential.html` — starts **docked top-left**, already expanded
3. Has a smooth animated transition between the two positions using CSS View Transitions

### Files
- **CSS:** `components/pill-nav.css` — included on index, residential, business
- **JS:** `scripts/pill-nav.js` — included on index, residential, business
- **NOT used** on `quick-support.html` or `services/**` (those have their own simple navs)

### Key Attributes
- `<div class="pill-wrapper" id="quartz-shell" data-pill-position="center|docked">`
- `data-pill-position="center"` — for index.html (landing)
- `data-pill-position="docked"` — for residential.html, business.html

### Nav Items (all pages)
- Home → `index.html`
- Services (dropdown): Home & Family → `residential.html`, Business & Office → `business.html`
- About → `#about` anchor
- Contact (dropdown): Contact Info → `#contact`, Live Chat → opens Tawk.to

### Mobile Behavior
- Below 767px: pill stretches full width, links hidden, hamburger visible
- Opens a `.pill-mobile-menu` drawer below the pill
- Includes "Quick Support" button in mobile drawer (→ `quick-support.html`)

### Tagline Pill
- `<div class="tagline-pill">Local Service. Logical Solutions.</div>` renders below the pill nav when expanded.
- **Docked Behavior:** When the main pill is docked to the top-left, the tagline pill aligns to the left (12px offset from the wrapper edge) rather than centering. This ensures it does not visually overlap with the center dropdown menus (like Services).
- **Z-Index:** The tagline pill has `z-index: 1` so it falls safely behind the dropdown menus if any overlap occurs.

---

## 6. Page-by-Page Summary

### `index.html` — Landing / Chooser
- **Purpose:** Entry point. Presents a split-screen: left = Residential, right = Business
- **UX:** Clicking a half animates it to fullscreen then navigates to the destination page
- **Key sections:** Chooser (hero), About (`#about`), Contact (`#contact`), Footer
- **Schema.org:** Organization + WebSite + WebPage
- **Body class:** none (neutral)
- **OG image:** `assets/logo.png`

### `business.html` — Business IT Services
- **Purpose:** Business-focused landing page
- **Key sections:** Hero, Process/Onboarding (6-step cards), Services Grid (6 cards → service detail pages), About (grid layout with feature items), Contact, Footer
- **Accent:** Blue (`#0066FF`)
- **Body class:** `business-page`
- **Service cards link to:** `services/business/*.html`
- **Icons:** Lordicon animated JSON icons (blue color scheme)
- **About section distinguisher:** Mentions "Based in St. Louis" in the Local & Responsive feature item

### `residential.html` — Residential IT Support
- **Purpose:** Residential/home-user focused landing page
- **Key sections:** Hero, Services Grid (6 cards with problem/solution format), About, Contact, Footer
- **Accent:** Amber (`#FF8A00`)
- **Body class:** `residential-page`
- **Service cards link to:** `services/residential/*.html`
- **Icons:** Lordicon animated JSON icons (amber color scheme)
- **Card format:** Shows a "customer problem" quote + "The Logic Fix" solution

### `quick-support.html` — Quick Support
- **Purpose:** Guide for Windows Quick Assist remote sessions
- **Nav:** Simple centered pill (NOT the shared pill-nav component)
- **Content:** Image guide + 3-step instructions (Ctrl+Win+Q → Enter code → Allow screen)
- **Contact footer:** Phone link 636-352-6572

### `services/business/*.html` — Business Service Detail Pages (8 pages)
- **Shared nav:** Simple bar with back arrow + logo + "Get in Touch" link
- **CSS:** `../../css/service.css` (NOT brand.css or pill-nav.css)
- **Sections:** Hero, Includes, Why Us, Contact (3-card grid: email, phone, chat), Footer
- **Body class:** `business-page`
- **No Tawk.to widget auto-expand** — chat card still links to maximize

### `services/residential/*.html` — Residential Service Detail Pages (8 pages)
- Same structure as business service pages
- **Body class:** `residential-page`
- CSS: `../../css/service.css`

---

## 7. Third-Party Integrations

| Service | Purpose | Key ID/Config |
|---|---|---|
| **Google Fonts** | Typography (Poppins) | Linked via `fonts.googleapis.com` |
| **Phosphor Icons** | UI icons (phone, envelope, etc.) | `https://unpkg.com/@phosphor-icons/web` |
| **Lordicon** | Animated service card icons | `https://cdn.lordicon.com/lordicon.js` |
| **Tawk.to** | Live chat widget | Widget ID: `69ee4a2453f59e1c3596b2ef`, Channel: `1jn5d37fc` |

### Tawk.to Notes
- Loaded on every page via inline `<script>` at bottom of `<body>`
- On `index.html`, `residential.html`, `business.html`: `Tawk_API.minimize()` on load (starts minimized)
- On `quick-support.html`: no `.minimize()` call (widget may open by default)
- Chat can be triggered via `Tawk_API.maximize()` from nav/contact links

---

## 8. SEO & Schema

### Current Meta Setup (per page)
- `<title>` — unique per page
- `<meta name="description">` — unique per page
- `<link rel="canonical">` — absolute URL per page
- `<meta property="og:*">` — Open Graph tags on all pages
- `<meta name="twitter:card">` — Twitter card tags on all pages
- `<meta name="view-transition" content="same-origin">` — enables CSS View Transitions

### Schema.org (JSON-LD)
- **index.html:** `Organization` + `WebSite` + `WebPage`
- **business.html:** condensed single-line `Organization` + `WebSite` + `WebPage`
- **residential.html:** full `Organization` + `WebSite` + `WebPage`
- **Service detail pages:** No schema markup currently
- **Missing:** `LocalBusiness` schema, `areaServed`, `geo` — these are priorities for local SEO

### Known SEO Gaps
- No `LocalBusiness` schema type anywhere (critical for local search)
- No explicit service area geo-targeting in schema
- No location keywords in most page titles/descriptions
- Service detail pages have no schema markup at all
- No `service-area.html` landing page or city-specific pages

---

## 9. Service Area (Critical for Local SEO)

> **This is the most important SEO gap.** The business serves the St. Charles, MO and Greater St. Louis metro region but this is barely surfaced on the site.

### Known Service Areas
- **Primary:** St. Charles, MO (city)
- **Secondary:** O'Fallon, Wentzville, Lake St. Louis, St. Peters, Cottleville, Weldon Spring, Chesterfield, Ballwin, Maryland Heights
- **Metro:** Greater St. Louis metro area, MO
- **Phone area code:** 636 (St. Charles County / western St. Louis suburbs)
- **Landing Page:** `service-area.html` provides a dedicated local SEO signal and coverage grid.
- **Implementation:** `LocalBusiness` schema is implemented on `index.html` and `service-area.html` with `areaServed` city lists.

### Target Search Queries (to rank for)
- "IT support near St. Charles MO"
- "computer repair St. Charles MO"
- "managed IT services St. Louis"
- "home computer help St. Charles"
- "IT company near me" (relying on Google Business Profile + schema geo)

---

## 10. CSS Architecture Notes

### Design Philosophy
- Dark theme throughout (graphite/near-black backgrounds)
- Glassmorphism (frosted glass cards via `backdrop-filter: blur`)
- Subtle animated gradients and hover micro-animations
- Consistent `border-radius: 24px–32px` on cards; `border-radius: 999px` on pills/buttons

### How Styles Are Structured
1. `css/brand.css` — global tokens, resets, typography, shared components (buttons, sections, contact grid, footer). Loaded first on all main pages.
2. `components/pill-nav.css` — pill nav styles. Loaded after brand.css. Has its own `:root` block with nav-specific tokens.
3. Page-level `<style>` blocks — each main page has a `<style>` tag in `<head>` for page-specific overrides
4. `css/service.css` — used only by `services/**` pages. Standalone (does not import brand.css)

### Responsive Breakpoints
- `767px` — major mobile breakpoint (nav collapses, layouts stack)
- `480px` — section padding reduces
- `991px` — business.html about-grid goes single column
- `1100px` — about-grid gap reduces
- `640px` — feature items go column layout on mobile
- `400px` / `360px` — ultra-thin nav adjustments

---

## 11. JavaScript Notes

### pill-nav.js (shared nav script)
- IIFE, strict mode
- Detects if inside iframe → adds `is-iframe` to body, exits early (prevents nav in iframe previews)
- Glint effect: mouse position CSS vars (`--mouse-x`, `--mouse-y`) on pill wrapper
- Expansion: adds `is-expanded` class to shell after delay (1200ms landing, 100ms service)
- Hamburger: toggles `open` class on `.pill-mobile-menu`
- Dropdown: clicks toggle `is-open` class
- Sliding indicator: repositions `#nav-indicator` on hover/active
- `pageshow` (bfcache): resets all state when user navigates back

### Chooser JS (inline in index.html)
- `scalePreview(half)` — sizes iframes to fill their half using CSS transform scale
- `injectFlash(color)` — creates a fullscreen color flash overlay with animation
- `selectHalf(half)` — animates selected half to fullscreen, fires `is-docking` on nav pill, navigates after 200ms

---

## 12. Content Patterns & Conventions

### Section Structure (all main pages)
```html
<section class="section [name]" id="[name]">
  <span class="section-label">Category Label</span>
  <h2 class="section-title">Heading <span class="text-gradient-[blue|amber]">Accent</span></h2>
  <!-- content -->
</section>
```

### Contact Section Pattern (used on every page)
4 cards: Email Us, Call Us, Live Chat (Tawk.to), Quick Support (→ quick-support.html)
- Service detail pages only have 3 cards (no Quick Support)

### Footer Pattern (every page)
Logo image → Company name → Tagline → Copyright line

### Service Card Pattern (business.html)
- Lordicon animated icon + service title + description text → links to detail page

### Service Card Pattern (residential.html)
- Lordicon icon + category badge + "Customer problem" quote (h3) + "The Logic Fix" solution paragraph

---

## 13. Deployment & Hosting

- Domain: `locallogicit.com`
- All canonical URLs use `https://locallogicit.com/...`
- No build system — plain HTML/CSS/JS, static files
- No package.json, no node_modules, no bundler
- `robots.txt` allows all crawlers; points to sitemap
- Sitemap covers 19 URLs (all pages currently indexed)

---

## 14. Conventions for AI Agents

If you are an AI agent working on this project, follow these rules:

1. **Preserve the design system.** Always use the CSS tokens from `brand.css`. Do not introduce new color values.
2. **Match the glassmorphism aesthetic.** New UI elements should use `glass-panel` class or equivalent styles.
3. **Poppins is the only font.** Do not add new Google Fonts unless explicitly requested.
4. **Page context matters.** Business pages use blue accent; residential pages use amber accent. Always apply `business-page` or `residential-page` body class as appropriate.
5. **No build tools.** This is static HTML/CSS/JS. Do not introduce npm, bundlers, or frameworks.
6. **Shared nav:** index.html, residential.html, and business.html all share the pill nav. Service detail pages use a simpler nav defined inline in `css/service.css`.
7. **Schema updates go in the `<script type="application/ld+json">` block** in each page's `<head>`. Keep in sync across pages when touching Organization data.
8. **Tawk.to is on every page.** The widget ID is `69ee4a2453f59e1c3596b2ef`, channel `1jn5d37fc`. Do not change it.
9. **Sitemap must be updated** when adding new pages.
10. **Service area is the #1 SEO priority.** Any changes that improve local geo-targeting are high-value.
11. **Always commit to GitHub.** Always commit and push changes to GitHub after finishing a task.

---

## 15. Open Tasks / Known Issues (as of 2026-04-27)

- [x] **Service area / geo SEO addressed** — `service-area.html` created, `LocalBusiness` schema added to index and service area pages.
- [ ] Service detail pages (`services/**`) have no schema markup
- [ ] The `printer-setup.html` residential page is in `sitemap.xml` but not linked from `residential.html` services grid (it has 6 cards, the sitemap has 8 residential pages)
- [ ] `data-backup-recovery.html` also not linked from residential.html services grid (same issue)
- [ ] `voip-phone-systems.html` and `hardware-procurement.html` linked in sitemap but not in business.html services grid (it shows 6 of 8)
- [ ] The `gunmetal_texture.png` asset exists but is not currently used
- [ ] `components/variations/` files appear to be prototype/scratchpad pages, not production
