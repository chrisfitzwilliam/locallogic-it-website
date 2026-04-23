---
name: Onboarding Timeline Design
description: A horizontal, cinematic onboarding timeline for the business page featuring Canvas-based particle animations.
type: project
---

# Onboarding Timeline Design Spec

## Goal
Create a professional, "cinematic" customer onboarding timeline on the `business.html` page, placed above the service cards. It should communicate the 5 key steps of the Local Logic IT process with high-end visual polish.

## Visual Direction
- **Layout:** Horizontal progress bar with 5 distinct nodes.
- **Cinematic Elements:** 
    - A subtle HTML5 Canvas background behind the timeline featuring a "digital constellation" (slow-moving particles connected by faint lines).
    - SVG path drawing animation for the connecting line.
    - Staggered CSS animations for step entry.
- **Theme:** Charcoal and Blue (matching existing tokens).

## Steps & Content
1. **Analysis & Audit** – We deep-dive into your current infrastructure and security.
2. **Strategy & Planning** – We build a custom roadmap aligned with your business goals.
3. **Design & Architecture** – Designing the specific systems, networks, or automations needed.
4. **Implementation** – Seamlessly deploying the new technology with zero downtime.
5. **Ongoing Optimization** – Continuous monitoring and proactive improvements.

## Technical Architecture

### 1. Structure (HTML)
- A new `<section>` above the `.services` section in `business.html`.
- A `<canvas>` element positioned absolutely behind the content.
- A container for the timeline nodes and labels.

### 2. Styling (CSS)
- Use CSS Variables for colors (already in `business.html`).
- Flexbox/Grid for the horizontal layout.
- Responsive adjustments: Transition to a vertical layout or compact grid on mobile.

### 3. Animation (JavaScript)
- **Canvas Particle System:** A lightweight script to manage 30-50 particles moving slowly.
- **Intersection Observer:** Trigger the entry animations and canvas playback only when the section is in view.
- **SVG Path:** Animate the `stroke-dashoffset` to "draw" the connection between nodes.

## Success Criteria
- The timeline is visually striking but doesn't distract from the primary CTAs.
- The animation is smooth (60fps) and doesn't impact page load performance significantly.
- Fully responsive on mobile and tablet.
