\# Task: Execute SEO Audit Remediations 1–3



You have full access to the LocalLogicIT codebase and server. Execute the three

actionable items from the SEO audit dated 2026-04-30. Do not touch anything

outside this scope.



\## Scope



\### Task A — Add missing hub links (audit Recommendation 2)

Four service detail pages are in the sitemap and return 200, but their parent

hub pages do not link to them. Add cards/links on the hubs.



\- On `business.html`, add hub cards linking to:

&#x20; - `services/business/hardware-procurement.html`

&#x20; - `services/business/voip-phone-systems.html`

\- On `residential.html`, add hub cards linking to:

&#x20; - `services/residential/data-backup-recovery.html`

&#x20; - `services/residential/printer-setup.html`



Requirements:

\- Match the existing card markup, class names, icon pattern, and copy style

&#x20; used by the other cards on the same page. Read the surrounding cards first

&#x20; and mirror them exactly.

\- Pull card titles and descriptions from the `<title>` and meta description of

&#x20; each target page so wording stays consistent with the destination.

\- Do not rename URLs. Do not modify the four target pages. Do not edit the

&#x20; sitemap.



\### Task B — Add missing image attributes (audit Recommendation 3)

Add intrinsic sizing and, where appropriate, lazy loading. Do not change

rendered dimensions.



\- `index.html`: both `assets/logo.png` instances — add `width` and `height`.

\- `business.html`, `residential.html`, `service-area.html`: `assets/logo.png` —

&#x20; add `width` and `height`.

\- `quick-support.html`: `assets/quick-assist-guide.png` — add `width`,

&#x20; `height`, and `loading="lazy"`.



Read the actual image dimensions from the files in `assets/` (e.g. with

`identify` or `file`) and use those exact intrinsic values. Do not guess.



\### Task C — Cloudflare cache purge (audit Recommendation 1)

Purge stale edge cache for exactly these two paths:



\- `/assets/lordicon/lordicon.js`

\- `/assets/og-image.png`



Use a targeted purge (single-file purge by URL). Do not purge everything. Do

not modify cache rules, page rules, or workers. Do not change cache headers

in the codebase.



After purge, verify edge and origin agree:

\- `lordicon.js` should return 200 `application/javascript` at the edge with the

&#x20; same byte size as origin (origin was 333966 bytes at audit time).

\- `og-image.png` should return 200 `image/png` at the edge with the current

&#x20; origin size (1410686 bytes at audit time — confirm against current origin).



\## Hard prohibitions (from the audit's high-risk deferred list)



Do NOT, under any circumstance, do any of the following — even if it would

"help" SEO:



\- Modify CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,

&#x20; Permissions-Policy, or any other security header.

\- Modify SRI attributes, TLS config, WAF rules, or redirect behavior

&#x20; (HTTP→HTTPS, www→apex, trailing slash).

\- Modify canonical tags, robots.txt, sitemap.xml, or hreflang.

\- Add `noindex` to any page or remove pages from the sitemap.

\- Convert intentional 404/403 responses (`/.env`, `/.git/config`,

&#x20; `/wp-config.php`, `/admin`, `/services/business/`) to 200s.

\- Add JSON-LD claims for ratings, reviews, prices, availability, credentials,

&#x20; awards, or any business fact not already present and verifiable.

\- Move SEO metadata behind JavaScript or a tag manager.

\- Restart production services or touch certificates/DNS.

\- Do a broad Cloudflare purge or change global cache rules.



\## Required output



Before committing or pushing anything, produce a report with:



1\. A diff summary for every file touched (paths + line counts).

2\. The exact image dimensions you read for each `<img>` you modified, and the

&#x20;  command/method you used to read them.

3\. For each new hub card: the exact href, title, and description text added,

&#x20;  and the destination page's `<title>` and meta description for comparison.

4\. Verification results:

&#x20;  - `curl -I` against each of the four service URLs confirming 200.

&#x20;  - `curl -I` against the two purged Cloudflare URLs from a fresh request

&#x20;    showing fresh `cf-cache-status` and matching content-length to origin.

&#x20;  - A grep confirming the four new hrefs are present in the rendered HTML of

&#x20;    `business.html` and `residential.html`.

5\. A `git diff --stat` and a confirmation that no files outside the scope

&#x20;  above were modified.



Stop and ask me before pushing if any verification step fails or if you find

a condition the audit didn't anticipate (e.g., the hub pages have changed

structure, or an image file is missing).

