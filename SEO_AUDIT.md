# SEO Audit Recommendations

Audit date: 2026-04-30
Site: https://locallogicit.com/
Scope: Report-only SEO master audit recommendations from PHASE-01 through PHASE-03.

No fixes have been applied from this file. Items marked approval required should not be implemented without explicit approval because they affect production behavior, security controls, cache policy, or visible site content.

## Executive Priority

1. Purge or version stale Cloudflare-cached assets.
2. Add missing hub-page cards or links for sitemap-listed service pages.
3. Add intrinsic image sizing and loading attributes where missing.
4. Keep security controls in place; do not relax CSP, SRI, TLS, redirects, robots, or hardening rules for SEO convenience.
5. Review immutable caching strategy for mutable, non-fingerprinted assets before future asset replacements.

## Recommendation 1: Purge Or Version Stale Cloudflare Assets

Priority: High
Classification: Regression introduced after prior passes
Approval required: Yes

Issue:
Cloudflare is serving stale content for two assets while the origin serves current content.

Evidence:
- `/assets/lordicon/lordicon.js`: edge returned `404 text/html` while origin returned `200 application/javascript` with size `333966`.
- `/assets/lordicon/lordicon.js?v=phase3-20260429`: edge returned `200 application/javascript`, confirming the origin asset is available and the unversioned URL is stale at the edge.
- `/assets/og-image.png`: edge returned `200 image/png` with size `518121` while origin returned current `200 image/png` with size `1410686`.
- `/assets/og-image.png?v=phase3-20260429`: edge returned the current `1410686` byte file.

Recommended action:
- Purge the affected Cloudflare cache entries for `/assets/lordicon/lordicon.js` and `/assets/og-image.png`, or introduce versioned asset URLs where appropriate.
- Prefer a durable cache-versioning approach for assets that may change while keeping long-lived immutable caching for truly fingerprinted assets.

Do not:
- Disable Cloudflare broadly.
- Relax security headers or CSP to work around this.
- Change cache policy globally without explicit approval.

## Recommendation 2: Add Missing Hub Links For Service Pages

Priority: High
Classification: Existing site content gap / TODO left from prior pass
Approval required: Yes, because it changes visible navigation/content

Issue:
Four sitemap-listed service detail pages exist and are crawlable, but their parent hub grids do not link to them.

Affected pages:
- `business.html` is missing a hub card/link for `services/business/hardware-procurement.html`.
- `business.html` is missing a hub card/link for `services/business/voip-phone-systems.html`.
- `residential.html` is missing a hub card/link for `services/residential/data-backup-recovery.html`.
- `residential.html` is missing a hub card/link for `services/residential/printer-setup.html`.

Evidence:
- Sitemap contains 21 public URLs.
- The four detail pages returned live `200` responses during the audit.
- Local and live hub-body checks did not find links to the four URLs.

Recommended action:
- Add matching service cards or links to the business and residential hub grids.
- Preserve the current visual system, card style, and link text conventions.
- Do not rename the service URLs.
- Do not remove pages from the sitemap to hide the issue.

## Recommendation 3: Add Missing Image Attributes

Priority: Medium
Classification: Technical SEO / performance gap
Approval required: Usually low-risk, but still changes HTML

Issue:
Several images lack intrinsic `width` and `height` attributes. The quick-support guide image also lacks a `loading` attribute.

Affected local files from final audit verification:
- `index.html`: `assets/logo.png` appears twice without intrinsic sizing.
- `business.html`: `assets/logo.png` lacks intrinsic sizing.
- `residential.html`: `assets/logo.png` lacks intrinsic sizing.
- `service-area.html`: `assets/logo.png` lacks intrinsic sizing.
- `quick-support.html`: `assets/quick-assist-guide.png` lacks intrinsic sizing and loading behavior.

Recommended action:
- Add `width` and `height` attributes that match the rendered or intrinsic image ratio.
- Add `loading="lazy"` to non-critical below-the-fold images.
- Avoid changing visual dimensions unless intentionally approved.

## Recommendation 4: Preserve Server-Rendered SEO Metadata

Priority: Medium
Classification: No action needed currently / preserve pattern
Approval required: No immediate change recommended

Current good state:
- 21 sitemap URLs were checked locally.
- 21 pages have titles.
- 21 pages have meta descriptions.
- 21 pages have canonical links.
- 21 pages have JSON-LD blocks.
- 0 JSON-LD parse errors were found.
- No tag-manager dependency was found for canonical tags, robots meta, JSON-LD, or hreflang.

Recommended action:
- Keep canonical tags, meta descriptions, Open Graph/Twitter tags, and JSON-LD server-rendered in static HTML.
- Do not move SEO-critical metadata behind JavaScript or a tag manager.
- Continue avoiding unverifiable schema claims such as ratings, reviews, prices, availability, credentials, or awards unless backed by real evidence and explicitly approved.

## Recommendation 5: Keep HTTPS-Only Image Fields

Priority: Medium
Classification: No action needed currently / preserve pattern
Approval required: No immediate change recommended

Current good state:
- All `og:image` and `twitter:image` fields use `https://locallogicit.com/assets/og-image.png`.
- No HTTP image metadata fields were found.

Recommended action:
- Keep all Open Graph, Twitter, and JSON-LD image URLs on HTTPS.
- After resolving the Cloudflare stale cache issue, recheck the unversioned OG image URL at the edge.

## Recommendation 6: Preserve Security Controls During SEO Work

Priority: High
Classification: Deliberate security choice that SEO-only views could misread as bugs
Approval required: Yes for any change

Current good state:
- CSP is present at edge and origin.
- HSTS is present.
- `X-Content-Type-Options: nosniff` is present.
- `X-Frame-Options: SAMEORIGIN` is present.
- CSP `frame-ancestors 'self'` aligns with `X-Frame-Options: SAMEORIGIN`.
- `Referrer-Policy: strict-origin-when-cross-origin` is present.
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` is present.
- SRI is present on pinned external scripts/styles where used.

Recommended action:
- Do not relax CSP, TLS, SRI, redirects, WAF behavior, robots policy, intentional deny rules, or security headers for SEO-only reasons.
- Treat changes to CSP, TLS, SRI, redirect policy, cache policy, and intentional 404/403 rules as high-risk and approval-gated.

## Recommendation 7: Keep CSP Host Coverage Aligned With Actual Dependencies

Priority: Low to Medium
Classification: Security-aware maintenance item
Approval required: Yes for CSP changes

Current state:
- Used script hosts: `self`, `unpkg.com`.
- Used style hosts: `self`, `fonts.googleapis.com`, `unpkg.com`.
- No iframes were found in public sitemap pages.
- No client-side fetch/XHR dependency was found for SEO-critical data.
- CSP currently allows additional hosts such as `challenges.cloudflare.com`, `cdn.lordicon.com`, `embed.tawk.to`, and `*.tawk.to`.

Recommended action:
- Leave CSP unchanged during SEO remediation unless there is a separate approved security cleanup.
- If future cleanup is desired, review whether currently allowed but unused hosts are still needed for security, bot challenge, support chat, or future production behavior before removing them.

## Recommendation 8: Preserve Intentional 404 And 403 Behavior

Priority: Medium
Classification: Deliberate security choice that should not be reported as SEO regression
Approval required: Yes for route/status-code changes

Allowlisted probe or non-site paths observed:
- `/.env`: returned `404`.
- `/.git/config`: returned `404`.
- `/wp-config.php`: edge returned `403`; origin returned `404`.
- `/admin`: returned `404`.
- `/services/business/`: returned `404` because the directory URL has no index page.

Recommended action:
- Do not convert these paths to soft `200` responses.
- Do not add them to the sitemap.
- Do not loosen deny/return rules for exploit-probe paths.

## Recommendation 9: Monitor Referrer Policy As An Analytics Caveat Only

Priority: Low
Classification: Measurement caveat, not an SEO ranking issue
Approval required: Yes for policy change

Issue:
`Referrer-Policy: strict-origin-when-cross-origin` can limit full referral-path data in some analytics workflows.

Recommended action:
- Keep the current policy unless the business has a specific measurement requirement that justifies a privacy/security review.
- Do not classify this as an SEO defect.

## Recommendation 10: Maintain Sitemap, Robots, Canonical, And Redirect Discipline

Priority: Medium
Classification: No action needed currently / preserve pattern
Approval required: Yes for policy changes

Current good state:
- `/robots.txt` returned `200 text/plain` at edge and origin.
- `/sitemap.xml` returned `200 text/xml` at edge and origin.
- Public sitemap URLs returned `200` during prior phase checks.
- Canonicals point to the apex `https://locallogicit.com/` host.
- HTTP and `www` redirect to apex in one hop during prior phase checks.

Recommended action:
- Do not change canonical policy, trailing-slash policy, route names, sitemap membership, robots directives, or redirect shape without explicit approval.
- If a URL policy change is ever needed, handle it as a separate migration with pre/post checks.

## High-Risk Deferred Items

Do not implement any of these without explicit user approval:
- Cloudflare cache purge or global cache-rule changes.
- HTML cache strategy changes.
- CSP, TLS, CORS, SRI, WAF, sudo, SSH, IAM, or security-header changes.
- Redirect changes, including HTTP-to-HTTPS or `www` to apex behavior.
- Canonical policy changes.
- Route renames, slug changes, or trailing-slash policy changes.
- Adding `noindex` to currently indexed URLs.
- Removing currently indexed URLs from the sitemap.
- Blocking crawler paths in robots.txt or at the server.
- Schema involving prices, availability, ratings, reviews, credentials, awards, or other unverifiable business claims.
- Production service restarts.
- Certificate or domain changes.

## Suggested Implementation Order After Approval

1. Purge or version `/assets/lordicon/lordicon.js` and `/assets/og-image.png`, then verify edge and origin agree.
2. Add the four missing hub-page cards or links and verify local/live link presence.
3. Add safe image attributes and verify pages still render correctly on desktop and mobile.
4. Re-run the SEO metadata sweep across all sitemap URLs.
5. Re-run edge and origin checks for sitemap, robots, headers, canonical samples, and affected assets.

## Verification Commands Used In Final Audit Snapshot

Representative checks included:
- Local metadata count across 21 sitemap URLs.
- Live HTML checks for canonical and JSON-LD on `/`, `/business.html`, `/service-area.html`, and `/services/business/managed-it.html`.
- Edge versus origin checks for `/assets/lordicon/lordicon.js`, `/assets/og-image.png`, `/robots.txt`, and `/sitemap.xml`.
- Security header sample from `https://locallogicit.com/`.
- Git diff check confirming the audit itself had not changed tracked site files before this recommendation document was created.

## Status

This file records recommendations only. No SEO, routing, cache, security, or visible-content fixes have been applied by this document.
