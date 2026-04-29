---

name: seo-server-infrastructure
description: Optimize search engine crawlability, indexing, and performance strictly at the server and infrastructure level via SSH. Does not modify application code, metadata, or frontend behavior.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# SEO Server Infrastructure Optimization

## Hard Rules

1. **No codebase edits.** Do not modify application code, templates, metadata, or frontend files.
2. **No UI impact.** Do not change rendered HTML, visible content, layout, or links.
3. **No URL changes without approval.** Do not alter routes, slugs, or introduce redirects unless explicitly approved.
4. **No indexing policy changes.** Do not add/remove `noindex`, `nofollow`, or major crawl directives.
5. **No downtime.** Avoid restarting services unless safe and necessary. Prefer reloads over restarts.
6. **No assumptions.** Do not guess domain, canonical rules, or infrastructure intent.

---

## Scope (Server-Level Only)

* Web server configuration (Nginx, Apache, Node server)
* HTTP response behavior
* Compression and caching
* TLS/HTTPS enforcement
* robots.txt and sitemap accessibility (not contents)
* Log analysis for crawl behavior
* CDN/edge configuration (if present)
* Bot access and crawl efficiency

---

## Core Responsibilities

### 1. HTTP Status Code Integrity

Validate all responses:

* `200` → valid pages
* `404` → missing pages
* `301` → permanent redirects

Fix:

* Soft 404s (200 responses for missing pages)
* Redirect chains (multiple hops)
* Redirect loops

Validation commands:

* `curl -I https://domain.com/page`
* `curl -I -L https://domain.com/page`

---

### 2. HTTPS Enforcement

Ensure:

* HTTP → HTTPS redirect (301)
* No mixed protocol access

Do NOT:

* Modify certificates
* Change domains

---

### 3. Domain Canonicalization

Ensure only one version resolves:

* `https://domain.com`
  OR
* `https://www.domain.com`

Fix using server config only if already implied.

---

### 4. robots.txt Accessibility

Ensure:

* Available at `/robots.txt`
* Returns `200`
* Correct content-type (`text/plain`)

Do NOT:

* Modify rules
* Add/remove Disallow directives

---

### 5. Sitemap Accessibility

Ensure:

* Available at `/sitemap.xml`
* Returns `200`
* Not blocked by server or CDN

Do NOT:

* Modify sitemap contents

---

### 6. Compression & Transfer Optimization

Enable:

* gzip OR brotli

Verify via:

* `curl -I --compressed`

Ensure responses include:

* `Content-Encoding: gzip` or `br`

---

### 7. Caching Headers

Configure:

* Static assets → long cache (`max-age=31536000`)
* HTML → short or no cache

Headers:

* `Cache-Control`
* `ETag` or `Last-Modified`

Do NOT:

* Cache HTML aggressively unless already configured

---

### 8. Time to First Byte (TTFB)

Measure:

* `curl -w "%{time_starttransfer}"`

Investigate:

* slow backend response
* blocking middleware
* misconfigured proxy

Do NOT:

* rewrite application logic

---

### 9. Crawlability of Resources

Ensure bots can access:

* CSS
* JS
* images

Verify:

* No server-level blocking
* No auth restrictions on public assets

---

### 10. Bot Behavior via Logs (if available)

Inspect logs:

* `/var/log/nginx/access.log`
* `/var/log/apache2/access.log`

Identify:

* crawl frequency
* repeated 404s
* heavy bot errors

Do NOT:

* block bots unless malicious and obvious

---

### 11. Redirect Hygiene

Ensure:

* Single-hop redirects only
* No HTTP → HTTPS → WWW chains

Goal:

* One redirect max

---

### 12. CDN / Reverse Proxy (if present)

Validate:

* Correct caching behavior
* Headers preserved
* No HTML caching errors

Check:

* Cloudflare / Fastly / etc.

---

## Workflow

### 1. Identify Stack

Detect:

* Web server (Nginx, Apache, Node)
* Proxy/CDN presence
* SSL setup

### 2. Audit

Run:

* curl checks
* header inspection
* robots/sitemap access
* redirect tracing

### 3. Apply Minimal Fixes

* Config-level only
* No application edits
* No structural changes

### 4. Validate

Re-run all checks
Confirm no regressions

---

## High-Risk (Require Approval)

* Adding redirects
* Changing canonical domain
* Modifying cache strategy for HTML
* Blocking any crawler paths
* Restarting production services

---

## Validation Checklist

* [ ] HTTP → HTTPS enforced
* [ ] Single canonical domain
* [ ] No redirect chains
* [ ] All key routes return correct status
* [ ] robots.txt accessible (200)
* [ ] sitemap.xml accessible (200)
* [ ] Compression enabled
* [ ] Cache headers appropriate
* [ ] No blocked assets
* [ ] No downtime introduced

---

## Final Report Format

```id="srv-report-01"
Server type: <nginx/apache/node>
Changes made: <list>
SEO improvements: <bullets>
Validation results: <pass/fail per check>
Issues found but not fixed: <list>
Assumptions: <list>
High-risk avoided: <list>
```

---

## Notes

* This skill is **strictly infrastructure-level** and must not overlap with application SEO logic.
* It complements a separate code-level SEO system but does not interact with it.
* Priority is **crawlability, correctness, and stability**, not aggressive optimization.

---
