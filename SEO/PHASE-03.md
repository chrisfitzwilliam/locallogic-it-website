---
name: seo-master-audit-phase-03
phase: PHASE-03
description: Run security-aware SEO interaction checks, classify findings, defer high-risk items, and produce the final SEO Master Audit report.
---

# PHASE-03 — Security-Aware SEO Checks, Risk Classification, and Final Report

## Purpose

This phase checks how security hardening interacts with SEO visibility and crawler rendering, then produces the final audit report.

Continue only after PHASE-01 and PHASE-02 are complete.

## Operating Rules for This Phase

- Observe security controls only; never modify them.
- Do not relax CSP, TLS, CORS, SRI, WAF, sudo, SSH, IAM, or any deliberate hardening control.
- Do not remove SRI or change pinned third-party script URLs.
- Do not change intentional deny/return rules.
- Do not make canonical, redirect, route, robots, or indexing policy changes without explicit user approval.
- Do not claim ranking, traffic, or indexing outcomes.
- Report verifiable facts only.

## Security-Aware SEO Interaction Checks

### CSP script host coverage

Pull every `<script src=...>` host from rendered HTML and compare each one against the enforced `script-src` directive.

Common hosts to look for:

- `googletagmanager.com`
- `google-analytics.com`
- Search Console verification scripts
- Bing UET
- Hotjar
- Facebook/Meta Pixel
- Maps JavaScript API
- A/B testing tools
- Consent managers

If a host is missing from CSP, report that it may be blocked in browser and crawler renderers. Do not add it to CSP during this audit.

### Tag-manager dependency check

If GTM or another tag manager is blocked by CSP, anything it injects can also be blocked.

SEO-relevant tags must be server-rendered into HTML, not dependent on script injection:

- Canonical tags
- Robots meta tags
- JSON-LD
- Hreflang
- Verification tags

Confirm these are present in the rendered/server HTML independent of tag manager execution.

### HTTPS-only image fields

Check that all image fields use `https://`:

- `og:image`
- `twitter:image`
- JSON-LD `image`

HTTP image URLs can be blocked by strict `img-src` policies or modern mixed-content rules.

### connect-src coverage for SEO-relevant client data

If JSON-LD, sitemap data, verification data, or other SEO-relevant content is fetched client-side from an API, verify the API host is allowed by `connect-src`.

Preferred pattern: SEO-relevant metadata is server-rendered and does not depend on client-side API calls.

### frame-src versus embedded widgets

If the page embeds third-party widgets using iframes, confirm the host is allowed by `frame-src`.

This is not usually direct SEO metadata, but failures can affect page experience, Core Web Vitals, or user behavior measurement.

### Intentional deny/return rules are not soft 404s

Use the intentional 404/403 patterns from PHASE-01.

Examples:

- `wp-config`
- `.env`
- `.git`
- Admin paths
- Known exploit probes

These should not be reported as SEO status-code regressions when they are deliberate protections.

### SRI and pinned external scripts

A version-pinned and SRI-hashed third-party script should fail closed if the upstream file changes. That is correct security behavior.

Audit treatment:

- List pinned dependencies in the final report.
- Include URL and whether an integrity hash is present.
- Do not flag SRI itself as an SEO bug.
- Do not remove or alter SRI.

### Edge versus origin security interaction

Confirm that server-lane checks from PHASE-02 were run through the public edge, not only at origin.

The edge can:

- Add compression
- Override Cache-Control
- Rewrite headers
- Serve stale content
- Add or remove security headers
- Block bots or specific paths

Crawlers see the edge response.

### Referrer-Policy and analytics measurement

Strict policies such as `no-referrer` or `same-origin` can suppress referral data in third-party analytics.

This is not an SEO ranking finding. Report it only as a measurement caveat if the user relies on referral attribution.

### X-Frame-Options versus CSP frame-ancestors

If both are set and differ, note the inconsistency for future drift awareness.

Modern browsers prioritize `frame-ancestors`. Do not remove either header during this audit.

## Security-Aware Checklist

- [ ] Every `<script src>` host is present in CSP `script-src` or documented as intentionally blocked
- [ ] Canonical, robots meta, JSON-LD, and hreflang are server-rendered, not tag-manager-injected
- [ ] All `og:image`, `twitter:image`, and JSON-LD `image` URLs use HTTPS
- [ ] `connect-src` covers any client-side data sources used by SEO-relevant scripts, if any
- [ ] Intentional 404/403 paths are allowlisted and not flagged as soft 404s
- [ ] All server-lane checks were re-run through the CDN/edge, not only at origin
- [ ] SRI-pinned external scripts are logged as pinned dependencies
- [ ] No proposed SEO fix would relax CSP, TLS, SRI, or another security control

## Finding Classification

For each failure or concern, classify it as one of the following:

1. Regression introduced after the original pass
2. Item the original pass deliberately left as TODO
3. Gap neither prior pass covered
4. Deliberate security choice that an SEO-only view could misread as a bug
5. High-risk item requiring explicit user approval
6. No action needed

## High-Risk Items Requiring Explicit User Approval

Never act on these during the audit without explicit approval:

- Canonical policy changes, including cross-domain canonicals
- Trailing-slash policy changes
- Adding or removing redirects, including HTTP-to-HTTPS shape changes
- Route renames or slug changes
- Adding `noindex` to currently indexed URLs
- Removing currently indexed URLs from the sitemap
- Locale URL or hreflang policy changes
- Schema involving prices, availability, ratings, or reviews
- Modifying HTML cache strategy
- Blocking any crawler path in robots.txt or at the server
- Restarting production services
- Certificate or domain changes
- Any change to CSP, TLS configuration, security headers, SRI hashes, pinned script URLs, intentional return rules, or other security controls

## Final Report Requirements

The final report must:

- Separate code-layer, server-origin, server-edge, cross-layer, and security-aware findings.
- Include evidence for every claim.
- List pinned SRI dependencies.
- List intentional 404/403 patterns.
- Identify regressions since prior passes.
- Identify gaps neither prior pass covered.
- Identify conflicts between SEO and security.
- State whether fixes were applied or whether this remained report-only.
- List TODOs requiring user input.
- List high-risk items deferred for approval.
- Avoid ranking, traffic, or indexing promises.

## Final Report Template

```text
=== SEO Master Audit ===

Stack:
  Framework: <next/remix/nuxt/astro/etc>
  Server:    <nginx/apache/node/edge>
  CDN:       <cloudflare/fastly/none>
  Security posture observed: <enforced CSP / TLS floor / SRI / intentional 404s / etc>

Code-layer findings:
  - <file>: <issue or OK + evidence>

Server-layer findings (origin):
  - <area>: <issue or OK + evidence>

Server-layer findings (edge):
  - <area>: <issue or OK + evidence>

Cross-layer findings (code ↔ server):
  - <check>: <pass/fail + detail + evidence>

Security-aware findings (security ↔ SEO):
  - <check>: <pass/fail + detail + evidence>

Pinned external dependencies (SRI):
  - <url>: <integrity hash present, last verified>

Intentional 404/403 paths (allowlisted):
  - <pattern>: <rationale>

Regressions since prior passes:
  - <list or none>

Gaps neither prior pass covered:
  - <list or none>

Conflicts between SEO and security:
  - <list or none — security wins where ambiguous>

Fixes applied this audit:
  - <list or none — report only>

TODOs requiring user input:
  - <list or none>

High-risk items deferred for approval:
  - <list or none>
```

## Final Stop Point

After producing the final report, stop.

Do not continue into implementation unless the user explicitly selects a specific deferred item and approves the change.
