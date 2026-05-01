---
name: seo-master-audit-phase-01
phase: PHASE-01
description: Start here for the SEO Master Audit. Establish the audit contract, confirm prerequisite passes, inventory the stack, define scope boundaries, and read the security posture before any cross-layer checks.
---

# PHASE-01 — Audit Setup, Scope, Inventory, and Security Context

## Purpose

This phase starts the SEO Master Audit. It verifies that this is the correct audit to run, confirms the prerequisite SEO and security passes were already completed, inventories the stack, and records the security posture before interpreting any SEO findings.

This is an audit-only phase. Do not implement fresh SEO work, rewrite visible content, change routes, modify redirects, loosen security controls, or restart production services.

## When to Use This Phase

Use this phase when all of the following are true:

- A codebase-level SEO pass has already been completed.
- A server/infrastructure-level SEO pass has already been completed.
- A separate security-hardening pass has already been applied to the same site or server.
- The user wants a once-over to verify consistency, catch regressions, and confirm that codebase, server, and security layers agree.

If any of those prior passes clearly did not happen, stop and report that this master audit is premature.

## Non-Negotiable Audit Rules

1. No fresh changes by default. This is verification, not implementation.
2. No visible body changes. Body copy, navigation, link text, layouts, breadcrumbs, and headings stay untouched.
3. No link or URL changes. Do not add redirects, rename routes, change slugs, or rewrite canonical targets without explicit approval.
4. No invented facts. Addresses, prices, ratings, hours, FAQs, reviews, awards, and credentials must never be fabricated. Missing data becomes a TODO.
5. No risky indexing changes. Do not introduce `noindex`, `nofollow`, `Disallow: /`, or canonical policy shifts without explicit approval.
6. No downtime. Prefer reloads over restarts, and do not bounce production services to verify something a curl check can answer.
7. No security regressions in the name of SEO. Do not loosen CSP, weaken TLS, broaden CORS, remove SRI, expand sudo, or undo deliberate hardening controls.
8. Evidence-based reporting only. Every audit claim must be backed by a curl check, log check, file check, or build/check command.

Default conflict rule: if SEO and security conflict, report the conflict and let the user decide. Security wins while the decision is pending.

## Scope Boundaries

### Codebase Lane — Read-Only by Default

Check only existing SEO-relevant code and metadata:

- `<title>`, meta description, viewport, and `lang`
- Open Graph and Twitter card tags
- Canonical URL tags
- JSON-LD blocks such as Organization, WebSite, Article, Product, and BreadcrumbList
- Existing image `alt` attributes
- Favicon and manifest references
- Existing image `width`, `height`, and `loading="lazy"` attributes
- `hreflang` tags, including reciprocal and self-referencing requirements
- Sitemap and robots content, meaning declared URLs and rules

### Server Lane — Read-Only by Default

Check live delivery and server behavior:

- HTTP status codes, including 200, 301, and 404 integrity
- HTTPS enforcement and HTTP-to-HTTPS 301 redirects
- Domain canonicalization at the redirect layer, such as apex versus www
- `robots.txt` and `sitemap.xml` accessibility, content type, and CDN blocking
- Compression on HTML and text responses
- Cache-Control headers by asset class
- TTFB and backend response time
- Crawlable public CSS, JS, and image assets
- Redirect chain length, with one hop as the target maximum
- CDN/proxy header preservation

### Security Lane — Observe Only, Never Modify

Read the security posture so SEO findings are interpreted correctly:

- Content-Security-Policy, enforced or report-only, and directive allowlists
- TLS protocol floor and cipher selection
- Security headers such as HSTS, XCTO, XFO, Referrer-Policy, and Permissions-Policy
- SRI and pinned URLs on external scripts
- Intentional deny/return rules in the web server, such as `wp-config` returning 404
- CDN/WAF/edge rules
- SSH, sudo, and IAM posture as informational context only

### Out of Scope

Do not touch visible body text, headings, link insertion, route changes, redirect additions, performance rewrites, new components, new pages, new SEO libraries, certificate changes, domain changes, content writing, or security control modifications.

## Required PHASE-01 Workflow

### 1. Confirm prerequisites

Look for evidence that the following already ran:

- Codebase SEO optimization pass
- Server/infrastructure SEO pass
- Independent security-hardening pass

Evidence may include framework metadata helpers, sitemap/robots files, server config files, CDN presence, security-header snippets, enforced CSP, SRI on external scripts, intentional return rules, prior reports, or recent commits.

If any layer was clearly never executed, stop and report that this may be the wrong skill to run.

### 2. Inventory the stack

Record:

- Framework: Next, Remix, Nuxt, Astro, static, WordPress, custom, or unknown
- Server: nginx, Apache, Node, platform edge, or unknown
- CDN/edge: Cloudflare, Fastly, Vercel, Netlify, AWS CloudFront, none, or unknown
- Runtime/build commands available
- Public production URL
- Origin URL or origin access method, if available
- Sitemap URL
- Robots URL
- Security headers present
- CSP status: enforced, report-only, missing, or unknown
- SRI usage on external scripts
- Intentional 404/403 patterns discovered

### 3. Read the security posture first

Before flagging anything as broken, understand what is intentionally restricted.

Examples:

- A 404 on `/wp-config` is a security feature, not an SEO bug.
- A blocked third-party script may be CSP enforcement, not accidental breakage.
- SRI-pinned third-party scripts may fail closed by design if upstream files rotate.
- CDN/WAF bot protections may explain different origin and edge behavior.

Treat the security configuration as authoritative context for interpreting findings.

### 4. Establish the evidence log

Create or update an audit evidence log with these columns or sections:

- Check name
- Layer: codebase, server-origin, server-edge, cross-layer, security-aware
- Command or file inspected
- Result
- Evidence snippet
- Interpretation
- Follow-up phase

### 5. Stop point for context compaction

At the end of PHASE-01, stop and summarize only:

- Whether this master audit is appropriate to continue
- Stack inventory
- Security posture observed
- Intentional 404/403 patterns found so far
- Unknowns that need attention in later phases
- Evidence log location or summary

Do not proceed into PHASE-02 until the user explicitly continues.

## PHASE-01 Output Template

```text
=== SEO Master Audit — PHASE-01 Complete ===

Proceed to PHASE-02: <yes/no>

Prerequisite passes:
  Codebase SEO pass: <confirmed/unclear/missing>
  Server SEO pass:   <confirmed/unclear/missing>
  Security pass:     <confirmed/unclear/missing>

Stack:
  Framework: <next/remix/nuxt/astro/etc/unknown>
  Server:    <nginx/apache/node/edge/unknown>
  CDN:       <cloudflare/fastly/vercel/netlify/none/unknown>
  Public URL: <url>
  Origin access: <available/unavailable/unknown>

Security posture observed:
  CSP: <enforced/report-only/missing/unknown>
  TLS floor: <observed/unknown>
  Security headers: <summary>
  SRI: <present/missing/not applicable/unknown>
  Intentional 404/403 patterns: <list or none found yet>

Evidence collected:
  - <check>: <file/command/result>

Stop reason:
  Context checkpoint before PHASE-02 cross-layer checks.
```
