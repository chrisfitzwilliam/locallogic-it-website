# Design Spec: Residential Service Cards - Architectural Technical Inset (K2)

**Date:** 2026-04-22
**Topic:** Residential Service Card UI Update
**Style Direction:** Option K2 (Architectural Technical Inset)

## 1. Overview
The goal is to update the residential service cards on `residential.html` to a "cinematic" and professional style that aligns with the "Local Logic" brand. The chosen direction (K2) emphasizes technical precision and structural depth.

## 2. Visual Design Specification

### 2.1 Card Container
- **Background:** `#FFFFFF` (Solid White)
- **Border:** `1px solid var(--line)` (`#EAD8CC`)
- **Border Radius:** `24px`
- **Padding:** `40px` (internal)
- **Min Height:** `420px` (to ensure uniformity in the grid)
- **Transition:** `all 0.5s cubic-bezier(0.16, 1, 0.3, 1)`

### 2.2 Header Elements (The "Inset")
- **Icon Box:**
  - **Dimensions:** `60px` x `60px`
  - **Position:** `absolute`, `top: -30px`, `left: 40px`
  - **Background:** `var(--paper)` (`#FBF8F5`)
  - **Border:** `1px solid var(--line)`
  - **Border Radius:** `14px`
  - **Shadow:** `inset 0 2px 4px rgba(0,0,0,0.02), 0 10px 20px rgba(44,20,10,0.05)`
  - **Content:** Lordicon (animated), centered.
- **Metadata Stack:**
  - **Margin Top:** `12px` (to clear the inset icon area)
  - **Category Tag:** `var(--gold)` (`#C97B4B`), `0.85rem`, `800` weight, uppercase, `0.1em` letter-spacing.
  - **Technical ID:** `JetBrains Mono` font, `0.65rem`, `var(--muted)`, uppercase (e.g., `CASE_ID: 0x4A22F`).

### 2.3 Body Content
- **Problem Quote:** `1.4rem`, `800` weight, `var(--ink)`, `1.2` line-height.
- **Solution Description:** `0.95rem`, `var(--muted)`, `1.7` line-height.
- **Logic Fix Label:** `0.75rem`, `800` weight, `var(--ink)`, uppercase, `0.1em` letter-spacing.
- **Divider:** `1px solid var(--gold-3)` on the left side of the solution text.

### 2.4 Interactions (Hover State)
- **Transform:** `translateY(-12px)`
- **Shadow:** `0 40px 80px rgba(44,20,10,0.08)` (Deep, soft cinematic shadow)
- **Border:** `border-color: var(--gold-2)` (`#DCA07A`)

## 3. Implementation Details
- Update `residential.html` styles for `.service-card`, `.card-icon-row`, `.service-title`, etc.
- Restructure the HTML inside each `<a>` tag to support the absolute-positioned icon box and the metadata stack.
- Generate unique "Case IDs" for each service card to enhance the technical aesthetic.

## 4. Success Criteria
- The cards feel "sleek and professional" and "cinematic" as per user request.
- The layout is responsive and maintains the `320px` min-width grid.
- Animated Lordicons are preserved and correctly centered in the new inset boxes.
