---
name: seo-codebase-optimization
description: Improve site search visibility via codebase-only changes (metadata, structured data, robots, sitemap, alt text, canonicals). Never modifies links, navigation, layout, copy, or UI elements. Never invents business facts.
---

# SEO Codebase Optimization

## Hard Rules

1. **No UI changes.** Do not edit visible copy, navigation, link text, anchor targets, layouts, components, breadcrumbs, headings, or any rendered element a user sees. Metadata only.
2. **No link changes.** Do not add, remove, or rewrite internal links, redirects, rewrites, route slugs, or canonical targets that alter URLs.
3. **No invented facts.** Never fabricate addresses, phones, prices, ratings, reviews, awards, FAQs, hours, or credentials. If data isn't in the repo or provided by user → leave a `TODO`.
4. **No risky indexing changes.** Do not add `noindex`, `nofollow`, `Disallow: /`, or canonical rewrites without explicit user request.
5. **Evidence-based only.** All metadata/schema must reflect content already visible on the page or in trusted project data.

## Scope (allowed edits)

- `<title>`, meta description, viewport, lang
- Open Graph + Twitter card tags
- Canonical URLs (only if domain is already configured in env/config)
- `robots.txt`, `sitemap.xml` / framework equivalents
- JSON-LD structured data (Organization, WebSite, Article, Product, BreadcrumbList — **only when fields are verifiable**)
- `alt` attributes on existing `<img>` tags (descriptive, not keyword-stuffed)
- Favicon/manifest references when assets exist
- `width`/`height`/`loading="lazy"` on images (no layout shift)
- `hreflang` only if localized pages already exist

## Out of Scope

Visible text, headings, link insertion, breadcrumb UI, route changes, redirects, performance rewrites, new components, new pages, library installs beyond what's needed, content writing.

## Workflow

1. **Inspect first.** Identify framework, routing, existing metadata pattern, sitemap/robots setup, env vars for domain. Do not edit until mapped.
2. **Use framework-native APIs.** Next.js `metadata`/`generateMetadata`/`sitemap.ts`/`robots.ts`; Remix `meta`; Nuxt `useSeoMeta`; SvelteKit `<svelte:head>`; Astro frontmatter. No new SEO libraries.
3. **Match existing conventions.** Reuse helpers, types, and patterns already in the repo.
4. **Minimal diffs.** Prefer shared layout/template edits over per-page changes. One purpose per file change.
5. **Validate.** Run existing `build`, `lint`, `typecheck`. Verify JSON-LD parses. Confirm no duplicate titles introduced.
6. **Summarize.** List files changed, intent, assumptions, TODOs.

## Metadata Defaults

- Title: `Page Topic | Brand` — unique per page, ≤60 chars when feasible.
- Description: summarize visible content, ≤155 chars, no exaggeration.
- OG image: reference only paths that exist in the repo.
- Canonical: absolute URL using existing domain env var. If no domain config exists → leave TODO, do not guess.

## Structured Data Rules

- JSON-LD only. No microdata/RDFa retrofits.
- Required fields only. Omit optional fields rather than guess.
- **Never** add: `aggregateRating`, `review`, `priceValidUntil`, `availability`, `FAQPage`, `LocalBusiness` address/hours, `HowTo` — unless data is explicitly present in repo/CMS or provided by user.
- One primary entity per page. No conflicting/duplicate schema blocks.

## Sitemap & Robots

- Sitemap: include public canonical routes from actual route data (filesystem, CMS, content collections). Do not invent URLs.
- Exclude: admin, account, dashboard, checkout, preview, draft, staging, search-result, and existing `noindex` routes.
- `robots.txt`: preserve all existing rules. Add sitemap reference if missing. Never broaden `Disallow`.

## Image Alt Text

- Edit `alt=""` attributes only — do not add/remove/move `<img>` elements.
- Describe the image for a user who cannot see it. ≤125 chars.
- Decorative/icon images: `alt=""` (empty, intentional).
- Skip if alt is already present and reasonable.

## High-Risk — Require Explicit User Approval

Canonical policy changes, trailing-slash changes, route renames, redirect additions, `noindex` additions, sitemap exclusions of currently-indexed URLs, locale URL changes, schema involving prices/ratings/availability.

## Validation Checklist (run before finishing)

- [ ] Build succeeds
- [ ] Lint/typecheck pass
- [ ] No duplicate `<title>` or canonical across major routes
- [ ] All JSON-LD blocks are valid JSON
- [ ] Referenced OG/favicon assets exist
- [ ] No new `noindex`/`Disallow`/`nofollow` introduced unintentionally
- [ ] No visible UI/text/link changes in diff

## Final Report Format

```
Changed files: <list>
SEO improvements: <bullets>
Validation: <pass/fail per check>
Assumptions: <list>
TODOs (need user input): <list>
Not done (out of scope / high-risk): <list>
```

Do not claim ranking, traffic, or indexing outcomes.
