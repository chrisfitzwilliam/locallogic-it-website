# Plan: Smooth Landing Transition & Pill Expansion

Refine the landing page transition for Local Logic IT to be "butter smooth" by implementing a non-refresh AJAX content swap and orchestrating a professional header pill animation to the top-left corner.

## Context
The current transition uses `window.location.href`, causing a full page refresh and a "blink" that breaks the visual flow. The user wants the header pill to fly to the top-left, "click" into place as the logo, and then expand professionally to reveal the navigation menu on the hub pages.

## Proposed Changes

### 1. Unified Header System (`assets/css/site.css`)
- Merge `.header` (pill) and `.nav` (bar) styles into a single cohesive system.
- Implement state-based classes:
  - `.nav-state-pill`: Floating, centered (landing default).
  - `.nav-state-locked`: Small, moved to top-left (the "click" point).
  - `.nav-state-expanded`: Full width or expanded navigation (hub default).
- Use `cubic-bezier(0.22, 1, 0.36, 1)` for all transitions.
- Ensure the header uses `fixed` positioning consistently during the transition.

### 2. Router & Animation Controller (`assets/js/site.js`)
- Implement a `Router` object to:
  - Intercept internal link clicks and the landing page `.half` selection.
  - Use `fetch()` to load page content asynchronously.
  - Manage the History API (`pushState`) for URL updates.
- Create an `AnimationController` to sequence the transition:
  1. **Shrink & Fly**: Shrink pill to logo-only and animate `left/top` to the top-left corner.
  2. **Content Swap**: Simultaneously fade out old `<main>` and fade in new `<main>` content from the fetched page.
  3. **Click & Expand**: Once "locked" in the top-left, animate the header's width/height/border-radius to become the full navigation bar (or an expanded version).
  4. **Reveals**: Stagger the reveal of nav links (Services, About, Contact).

### 3. Landing Page Refactor (`index.html`)
- Remove the `setTimeout` and `window.location.href` from `selectHalf()`.
- Move the selection logic into `site.js` to be part of the `Router`.
- Update the HTML to ensure the header matches the new unified structure.

### 4. Hub Page Refactor (`business.html`, `residential.html`)
- Align the `.nav` structure with `index.html`'s header to ensure seamless morphing.
- Ensure the brand logo link calls `Router.navigate('index.html')` for the reverse transition.

## Verification Plan
- **Local Preview**: Use `python -m http.server` and navigate between pages.
- **Visual Check**: Verify no page reload occurs (check Network tab in DevTools).
- **Animation Check**: Ensure the pill moves to the top-left and expands smoothly.
- **Back Button**: Test browser back/forward buttons to ensure the `Router` handles `popstate` correctly.
- **Responsiveness**: Verify the transition works on mobile (the pill should still move to a logical top-left/center position).
