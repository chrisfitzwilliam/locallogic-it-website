# Local Logic IT — Color Theme Redesign Spec
**Date:** 2026-04-20  
**Status:** Approved in conversation

---

## Overview

Refresh the Local Logic IT website color theme so it feels lighter, more premium, and more clearly split between residential and business audiences without changing the site's structure or removing any existing landing-page motion.

This redesign keeps the current static HTML architecture and updates visual tokens, landing-page treatment, and button polish only.

---

## Goals

1. Lighten the landing page so it no longer feels near-black.
2. Increase visual contrast between residential and business sections.
3. Preserve the current landing-page interaction model and animations.
4. Add a stronger first-impression effect through animated caption-card borders.
5. Keep inner pages clean, professional, and easier to maintain through token updates.

---

## Final Approved Direction

### Palette Direction

Chris selected **Option B — Deep Indigo + Warm Amber**.

| Area | Token | Value | Purpose |
|------|-------|-------|---------|
| Business | Nav / header | `#2C2D6E` | Primary dark business surfaces |
| Business | Accent | `#5B5ECC` | Buttons, links, highlights |
| Business | Body background | `#EEEEFF` | Business page background |
| Residential | Nav / header | `#7A3B10` | Primary dark residential surfaces |
| Residential | Accent | `#D4722A` | Buttons, links, highlights |
| Residential | Body background | `#FFF8F2` | Residential page background |

### Landing Background

Chris selected **L3 Smoke + Rich Accent** as the landing-page background direction.

Use a light smoke-neutral treatment derived from the previously reviewed L3 concept:
- cool neutral smoke on the business side
- warmer smoke neutral on the residential side
- richer accent support from the approved indigo and amber colors

This should feel lighter and more grounded, not pastel or "baby-ish."

---

## Architecture

### Existing Structure Stays the Same

The site remains a static multi-page HTML site with inline CSS and inline JS:

- `index.html`
- `business.html`
- `residential.html`
- `services/business/*.html`
- `services/residential/*.html`

No build step, framework, or file restructuring is introduced.

### Update Strategy

- `index.html` gets the landing-specific visual redesign.
- `business.html` and `residential.html` get token updates plus refined button styling.
- Service detail pages inherit the same token updates as their parent section pages.
- Layout, content structure, and navigation remain unchanged unless required for the approved visual treatment.

---

## Landing Page (`index.html`)

### Keep These Existing Behaviors

Do not remove, replace, or structurally redesign these animations/interactions:

1. `chooser-fade-in`
2. `glow-gold` / `glow-blue`
3. frosted glass overlay blur treatment
4. caption card hover lift
5. arrow fade-in on hover
6. FLIP expand animation on selection
7. header pill flight animation
8. flash overlay feedback on click

The redesign may recolor these behaviors, but it must not remove them.

### Background Treatment

Replace the current near-black landing background (`#07070f`) with an **L3 Smoke + Rich Accent** treatment.

The background should:
- read as a light smoke neutral overall
- support the split-screen residential/business distinction
- preserve strong readability for the frosted overlays and caption cards
- feel premium and modern rather than soft pastel

### Caption Cards

The landing caption cards keep their current position, hover motion, and glass treatment, but change in these ways:

- replace the static border treatment with a **spinning conic-gradient border**
- keep the inner card as the readable frosted-glass content surface
- use an indigo gradient treatment for the business card
- use an amber gradient treatment for the residential card

### Required Color Swaps

Update these existing landing-page color relationships:

- residential glow RGBA values from `rgba(201,123,75, ...)` to `rgba(212,114,42, ...)`
- business glow RGBA values from `rgba(74,128,232, ...)` to `rgba(91,94,204, ...)`
- residential icon/name color from `#DCA07A` to `#E8A870`
- business icon/name color from `#4A80E8` to `#8B8FE8`
- flash and other accent-driven visual feedback should align with the new indigo/amber palette

### Visual Intent

The landing page should now feel:
- lighter
- more premium
- more obviously split between home and business
- high-end but still approachable

---

## Business Pages

### Files

- `business.html`
- `services/business/*.html`

### Approved Direction

Business pages should feel cool, structured, and professional.

Use the new business palette:
- dark indigo for nav/header and major dark surfaces
- indigo accent for buttons, links, and highlight states
- very light indigo-tinted body background

### Implementation Approach

Where the page uses a `:root` token block, update the tokens so existing styles cascade naturally.

The target effect is a business section that feels:
- more modern than the old charcoal/blue mix
- cleaner and more premium
- clearly distinct from residential at first glance

---

## Residential Pages

### Files

- `residential.html`
- `services/residential/*.html`

### Approved Direction

Residential pages should feel warm, confident, and human without becoming rustic or overly soft.

Use the new residential palette:
- dark amber-brown for nav/header and major dark surfaces
- amber accent for buttons, links, and highlight states
- warm off-white page background

### Implementation Approach

Where the page uses a `:root` token block, update the tokens so existing styles cascade naturally.

The target effect is a residential section that feels:
- warmer and more personal than business
- still polished and professional
- clearly separated from the cool indigo business side

---

## Buttons on Inner Pages

### Scope

Applies to:
- `business.html`
- `residential.html`
- service detail pages under both sections

### Approved Direction

Buttons should be:
- clean
- professional
- animated
- sleek

### Interaction Style

Use one shared interaction pattern across inner pages:
- accent-colored button surface
- smooth hover lift
- refined shadow change on hover
- smooth transition timing
- premium polish without looking flashy or playful

### Explicit Decision

The **spinning gradient border effect stays on the landing caption cards only**.

Do **not** extend that animated border treatment to service detail page cards unless a later decision changes scope.

---

## Out of Scope

The following are not part of this redesign:

- content rewrites
- layout rewrites
- new sections or pages
- removing or rebuilding the landing interaction system
- new frameworks, CSS files, or design system abstractions
- adding animated borders across all service cards

---

## Verification Criteria

The redesign is successful when:

1. The landing page keeps every existing animation and transition behavior.
2. The landing page no longer feels near-black.
3. The landing page feels lighter but not pastel.
4. Business pages read clearly as cool indigo/professional.
5. Residential pages read clearly as warm amber/personal.
6. The landing caption cards gain a visible spinning gradient border without harming readability.
7. Inner-page buttons feel smoother and more polished.
8. Mobile and desktop both preserve the intended tone and interaction quality.

---

## Notes

- Auto-deploy behavior remains unchanged after implementation-related commits are pushed to `main`.
- This spec captures the approved visual direction only. Implementation steps belong in a separate plan.
