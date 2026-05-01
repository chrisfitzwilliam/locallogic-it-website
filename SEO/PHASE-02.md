---
name: seo-master-audit-phase-02
phase: PHASE-02
description: Run codebase, server-origin, server-edge, and cross-layer SEO consistency checks. This phase verifies canonical, sitemap, robots, metadata, status, compression, cache, and asset delivery alignment.
---

# PHASE-02 — Codebase, Server, and Cross-Layer Consistency Checks

## Purpose

This phase performs the core SEO consistency audit across the codebase and server layers. It compares what the code declares against what the live server and edge actually deliver.

Continue only after PHASE-01 is complete and the audit has a recorded stack inventory, security posture, and intentional deny/return context.

## Operating Rules for This Phase

- Remain audit-first and read-only by default.
- Do not change visible page content.
- Do not add redirects, rename routes, change slugs, or change canonical policy.
- Do not introduce `noindex`, `nofollow`, or robots blocking.
- Do not restart production services.
- Do not loosen any security control to make an SEO check pass.
- Back every finding with file, curl, log, or command evidence.

## Codebase Checks

Run the checks that fit the stack and available access.

### Metadata and head tags

Check major routes or templates for:

- One correct `<title>` per major route
- Meta description presence where expected
- Correct viewport tag
- Correct `lang` attribute
- Open Graph tags
- Twitter card tags
- Canonical URL tag
- No duplicate title or canonical tags across major routes
- No accidental `noindex`, `nofollow`, or other risky robots directives

### JSON-LD

Check all structured data blocks:

- JSON-LD parses with `JSON.parse` or equivalent
- Schema types match the existing content and business facts
- No invented addresses, ratings, prices, reviews, awards, or credentials
- URL fields are extractable for live checks in this phase
- Image fields are extractable for live checks in this phase

### Images and static references

Check existing references only:

- Existing `<img>` tags have suitable `alt` attributes where applicable
- Existing images include `width` and `height` where appropriate
- Existing images use `loading="lazy"` where appropriate and safe
- OG image, Twitter image, favicon, and manifest files exist or resolve

### Hreflang, if present

Check:

- Each hreflang set includes self-references
- Each locale variant reciprocates the full set
- Each hreflang URL resolves successfully
- No locale policy changes are introduced

### Code-side validation checklist

- [ ] Build passes
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] No duplicate `<title>` across major routes
- [ ] No duplicate canonical tags across major routes
- [ ] JSON-LD blocks parse successfully
- [ ] Referenced OG/favicon assets exist on disk or resolve live
- [ ] No new `noindex`, `Disallow`, or `nofollow` found unintentionally
- [ ] Hreflang sets are reciprocal and self-referencing, if present
- [ ] No invented business facts in metadata or JSON-LD

## Server-Origin Checks

Run against the origin where safe and available.

Check:

- HTTP to HTTPS enforcement returns 301
- Canonical host redirects consistently to either apex or www
- Redirect chains are one hop where possible
- Key routes return correct status codes
- 404s are real 404s and not soft 404s, excluding intentional deny/return patterns from PHASE-01
- `/robots.txt` returns 200 and `text/plain`
- `/sitemap.xml` returns 200 and XML content type
- HTML and text assets are compressed when requested with `--compressed`
- HTML cache headers are not long-lived static caching
- Static hashed assets are not unnecessarily `no-cache`
- Public CSS, JS, and images are crawlable without auth or bot-blocking
- TTFB/backend response time is recorded for representative routes

## Server-Edge Checks

Run the same server checks against the public URL through the CDN or platform edge.

Crawlers see the edge response, not the private origin response. Record discrepancies between origin and edge, including:

- Status code changes
- Redirect differences
- Compression differences
- Cache-Control overrides
- Header additions/removals
- Stale sitemap or robots responses
- CDN/WAF blocking behavior

## Cross-Layer Consistency Checks

These are the highest-value PHASE-02 checks because individual codebase or server passes cannot fully detect them alone.

### Canonical domain agreement

The host in `<link rel="canonical">` tags must match the host that the server's HTTPS and canonical redirect resolves to.

Failure example: canonical tags point to `https://www.domain.com/x`, but the server redirects `www` to apex. That means every canonical points at a redirect.

Evidence required:

- Rendered canonical tag sample
- `curl -IL` result for the canonical URL
- Final resolved URL

### Sitemap URL reachability

Every sampled URL listed in `sitemap.xml` should return 200, not 301 or 404.

Evidence required:

- Sitemap URL sample
- Curl status for each sampled URL
- Note whether dynamically generated routes were included

### Sitemap URL canonicalization

Sitemap URLs must use the same scheme and host as canonical tags.

Check for:

- Mixed `http` and `https`
- Mixed apex and www
- Canonical tags pointing to a different preferred host than sitemap URLs

### robots.txt sitemap directive

The `Sitemap:` line in `robots.txt` must point to a URL that returns 200 with an XML content type.

Evidence required:

- `robots.txt` contents or relevant line
- Curl status and content type for the sitemap URL

### Hreflang reciprocity across the live site

If hreflang exists, fetch each variant and confirm reciprocal tags render and resolve to 200.

Do not rely only on source code.

### OG image reachability

Every sampled `og:image` URL should return 200 with an `image/*` content type.

### JSON-LD URL resolution

Fields such as `@id`, `url`, `mainEntityOfPage`, and `image` should resolve to 200 on the live host.

### Sitemap versus noindex contradiction

No URL should be both listed in the sitemap and rendered with `<meta name="robots" content="noindex">`.

This is a direct contradiction: the sitemap asks for indexing while the page refuses it.

### Compression coverage

Verify compression on HTML routes, not only CSS or JS files.

Command pattern:

```bash
curl -I --compressed <html-route>
```

### Cache-Control sanity

Check that:

- HTML responses are not cached for a year
- Static hashed assets are not `no-cache`
- CDN edge behavior matches or intentionally overrides origin behavior

## Combined PHASE-02 Checklist

### Code side

- [ ] Build, lint, and typecheck pass
- [ ] No duplicate `<title>` or canonical across major routes
- [ ] JSON-LD blocks parse successfully
- [ ] Referenced OG/favicon assets exist or resolve
- [ ] No accidental `noindex`, `Disallow`, or `nofollow`
- [ ] Hreflang sets are reciprocal and self-referencing, if present
- [ ] No invented business facts in metadata or JSON-LD

### Server side

- [ ] HTTP to HTTPS enforced with 301
- [ ] Single canonical host at redirect layer
- [ ] No redirect chains beyond one hop unless justified
- [ ] Key routes return correct status codes
- [ ] `/robots.txt` returns 200 and `text/plain`
- [ ] `/sitemap.xml` returns 200 and XML content type
- [ ] Compression enabled for HTML and text assets
- [ ] Cache-Control appropriate per asset class
- [ ] Public CSS, JS, and images are crawlable
- [ ] No downtime introduced

### Cross-layer

- [ ] Canonical tag host matches server's resolved canonical host
- [ ] Sampled sitemap URLs return 200, not 301 or 404
- [ ] Sitemap URLs use the same scheme and host as canonical tags
- [ ] robots.txt `Sitemap:` line resolves 200
- [ ] OG image URLs resolve 200 with image content type
- [ ] JSON-LD URL fields resolve 200
- [ ] No URL is simultaneously in the sitemap and `noindex`-ed in HTML

## Stop Point for Context Compaction

At the end of PHASE-02, stop and summarize only:

- Code-layer findings
- Server-origin findings
- Server-edge findings
- Cross-layer findings
- Regressions identified so far
- Gaps neither prior pass covered
- Items that must be deferred for explicit approval
- Evidence log updates

Do not proceed into PHASE-03 until the user explicitly continues.

## PHASE-02 Output Template

```text
=== SEO Master Audit — PHASE-02 Complete ===

Proceed to PHASE-03: <yes/no>

Code-layer findings:
  - <file/check>: <OK or finding + evidence>

Server-layer findings (origin):
  - <area/check>: <OK or finding + evidence>

Server-layer findings (edge):
  - <area/check>: <OK or finding + evidence>

Cross-layer findings:
  - <check>: <pass/fail + detail + evidence>

Regressions since prior passes:
  - <list or none found yet>

Gaps neither prior pass covered:
  - <list or none found yet>

High-risk items deferred for approval:
  - <list or none>

Stop reason:
  Context checkpoint before PHASE-03 security-aware checks and final report.
```
