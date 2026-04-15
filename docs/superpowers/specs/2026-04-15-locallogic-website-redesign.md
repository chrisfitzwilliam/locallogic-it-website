# Local Logic IT — Website Redesign Spec
**Date:** 2026-04-15  
**Author:** Chris Fitzwilliam  
**Status:** Approved

---

## Overview

Replace the existing single-page marketing site with a three-page static website featuring a yin-yang style landing chooser that routes visitors to one of two tailored mini-sites: one for Residential customers, one for Business customers. Each mini-site shares the same structural layout but uses a distinct, complementary color palette.

---

## Architecture

**Approach:** Three separate static HTML files. All CSS and JS are inline per file. No build step. No framework. Deploy pipeline unchanged — push to GitHub, VM auto-pulls within ~1 minute.

**File structure:**
```
locallogic-it-website/
├── index.html          ← yin-yang landing chooser
├── residential.html    ← Residential mini-site
├── business.html       ← Business mini-site
└── assets/
    └── logo.png
```

---

## Page 1: Landing Chooser (index.html)

### Layout
- The Local Logic IT logo and tagline ("Local Service. Logical Solutions.") are centered at the top in white, floating above the split.
- The viewport below is split vertically down the center with a curved SVG divider creating a yin-yang feel.
- Left half: Residential. Right half: Business.
- Each half fills the remaining viewport height.

### Animation
- On page load, the entire yin-yang composition performs a single CSS rotation reveal: spins from 180deg to 0deg over ~1.2 seconds with ease-out timing, then locks in place.
- No looping. No user-triggered animation.

### Residential Half (left)
- Background: Navy `#15274D`
- Label: "Home & Family" in Gold `#C9A96E`, bold
- Subtle house icon above the label
- Hover: slight brightness lift + gold glow on the curved SVG edge
- Click: navigates to `residential.html`

### Business Half (right)
- Background: Charcoal `#1C1C2E`
- Label: "Business & Office" in Electric Blue `#3B82F6`, bold
- Subtle building/office icon above the label
- Hover: slight brightness lift + blue glow on the curved SVG edge
- Click: navigates to `business.html`

### Responsive behavior
- On mobile (< 768px): split becomes horizontal (top/bottom) instead of vertical left/right. All other behavior identical.

---

## Page 2: Residential Mini-Site (residential.html)

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#15274D` | Primary backgrounds, nav, hero |
| `--gold` | `#C9A96E` | Accents, headings, CTA highlights |
| `--paper` | `#FFFDF8` | Page background, card backgrounds |
| `--ink` | `#1F2937` | Body text |
| `--muted` | `#6B7280` | Secondary text |

### Sections

**1. Navigation**
- Sticky, navy background, gold logo text and accent links
- Links: Services · About · Contact (smooth-scroll anchors)
- Top-left ghost link: "← Back to Home" returns to `index.html`
- Mobile: hamburger menu

**2. Hero**
- Full-width navy-to-navy-dark gradient background
- Headline: *"IT Support That Comes to You"*
- Subtext: friendly, no-jargon copy emphasizing home visits, device help, and personal service
- Gold CTA button: "See Our Services" scrolls to services section
- Decorative: subtle gold circle accents (matching existing brand aesthetic)

**3. Services**
- White/paper background section
- Section heading: "What We Can Help With"
- 5 service cards in a responsive grid (2 cols on tablet, 1 on mobile, up to 3 on desktop):
  1. PC Repair
  2. Home Networking
  3. Device Setup & Training
  4. Virus & Malware Removal
  5. Smart Home Support
- Each card: icon, title, one-line description, gold accent border on hover

**4. About**
- Short 2–3 sentence paragraph emphasizing local, personal, no-jargon service
- Navy background with gold accent text

**5. Contact**
- Centered section on paper background
- Section heading: "Get in Touch"
- Displays: phone number + chris@fitzwilliam.net (actual values to be confirmed by Chris)
- Styled: gold text on navy pill/card
- No form

**6. Footer**
- Navy background
- Tagline: "Local Service. Logical Solutions."
- Copyright: © 2026 Local Logic IT

---

## Page 3: Business Mini-Site (business.html)

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--charcoal` | `#1C1C2E` | Primary backgrounds, nav, hero |
| `--blue` | `#3B82F6` | Accents, headings, CTA highlights |
| `--light` | `#F0F4FF` | Page background, card backgrounds |
| `--ink` | `#1F2937` | Body text |
| `--muted` | `#6B7280` | Secondary text |

### Sections

**1. Navigation**
- Sticky, charcoal background, electric blue accents
- Links: Services · About · Contact (smooth-scroll anchors)
- Top-left ghost link: "← Back to Home" returns to `index.html`
- Mobile: hamburger menu

**2. Hero**
- Full-width charcoal gradient background
- Headline: *"Enterprise-Grade IT. Local Accountability."*
- Subtext: positions managed services, cybersecurity, and cloud for business clients
- Electric blue CTA button: "See Our Services" scrolls to services section
- Decorative: subtle blue glow/circle accents

**3. Services**
- Light background section
- Section heading: "What We Offer"
- 5 service cards in a responsive grid:
  1. Managed IT Services
  2. Backup & Recovery
  3. AI Automation
  4. Cybersecurity
  5. Cloud Services
- Each card: icon, title, one-line description, blue accent border on hover

**4. About**
- Short 2–3 sentence paragraph emphasizing reliability, accountability, and business continuity
- Charcoal background with blue accent text

**5. Contact**
- Centered section on light background
- Section heading: "Get in Touch"
- Displays: phone number + chris@fitzwilliam.net
- Styled: blue text on charcoal pill/card
- No form

**6. Footer**
- Charcoal background
- Tagline: "Local Service. Logical Solutions."
- Copyright: © 2026 Local Logic IT

---

## Shared Design Principles

- **Font:** Manrope (already in use) — weights 400, 600, 700, 800
- **Border radius:** Generous (12–16px on cards, 8px on buttons)
- **Transitions:** 200–300ms ease on all hover effects
- **Responsive breakpoints:** 768px (tablet), 480px (mobile)
- **Accessibility:** Sufficient color contrast on all text, focus-visible outlines on interactive elements
- **No external JS dependencies** — vanilla JS only for mobile nav toggle and smooth scroll
- **Icons:** Inline SVG only — no external icon library. House, building, and service icons hand-crafted or drawn from simple SVG paths embedded directly in the HTML.

---

## Out of Scope

- Form processing / email backend
- Analytics
- CMS or dynamic content
- Additional pages beyond these three
- SEO beyond existing meta tags

---

## Open Items

- Chris to confirm phone number to display in contact sections
- Chris to confirm any copy changes to service descriptions before launch

---

## Deployment

No changes to the deployment pipeline. After implementation:
1. Commit all three HTML files to `main`
2. Push to GitHub
3. VM auto-pulls within ~1 minute
4. Live at `https://locallogic.fitzwilliam.net`
