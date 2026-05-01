---
name: seo-master-audit-run-this-first
description: Master coordinator for the three-phase SEO Master Audit. Start here, then run PHASE-01, PHASE-02, and PHASE-03 in order, stopping after each phase so context can be compacted.
---

# RUN_THIS_FIRST — SEO Master Audit Coordinator

## Purpose

This file coordinates the SEO Master Audit across three smaller phase files:

1. `PHASE-01.md` — Audit setup, scope, inventory, and security context
2. `PHASE-02.md` — Codebase, server, and cross-layer consistency checks
3. `PHASE-03.md` — Security-aware SEO checks, risk classification, and final report

Run the phases in order. Stop after each phase. Summarize the phase output before continuing so the conversation context can be compacted safely.

## Master Rule

This is an audit, not a fresh implementation pass.

Do not make visible content changes, URL changes, redirect changes, indexing policy changes, or security control changes unless the user explicitly approves a specific high-risk item after the final report.

## Phase Sequence

### Step 1 — Run PHASE-01.md

Open and follow `PHASE-01.md`.

Goal:

- Confirm this master audit is appropriate.
- Verify the codebase SEO, server SEO, and security-hardening passes already ran.
- Inventory the stack.
- Record the security posture.
- Identify intentional 404/403 patterns.
- Establish the evidence log.

Required stop:

After PHASE-01, stop and output the PHASE-01 summary. Do not continue until the user says to proceed.

Context compaction summary should include:

- Whether to continue to PHASE-02
- Stack inventory
- Security posture observed
- Intentional deny/return patterns found
- Unknowns for later phases
- Evidence collected

### Step 2 — Run PHASE-02.md

Open and follow `PHASE-02.md` only after the user continues from PHASE-01.

Goal:

- Audit codebase SEO declarations.
- Audit origin server behavior.
- Audit edge/CDN server behavior.
- Run cross-layer consistency checks.
- Identify regressions, gaps, and high-risk deferred items.

Required stop:

After PHASE-02, stop and output the PHASE-02 summary. Do not continue until the user says to proceed.

Context compaction summary should include:

- Code-layer findings
- Server-origin findings
- Server-edge findings
- Cross-layer findings
- Regressions found so far
- Gaps found so far
- High-risk items deferred
- Evidence collected

### Step 3 — Run PHASE-03.md

Open and follow `PHASE-03.md` only after the user continues from PHASE-02.

Goal:

- Run security-aware SEO interaction checks.
- Confirm CSP, SRI, HTTPS image fields, tag-manager dependency, and edge/origin security interactions.
- Classify all findings.
- Produce the final SEO Master Audit report.

Required stop:

After PHASE-03, stop after delivering the final report.

Do not implement deferred fixes unless the user explicitly approves a specific item.

## Context Compaction Protocol

At each phase boundary:

1. Stop work.
2. Produce the phase output using the template in that phase file.
3. Keep only durable facts needed for the next phase:
   - Stack
   - URLs checked
   - Security posture
   - Intentional 404/403 patterns
   - Evidence log summary
   - Findings and classifications
   - Deferred high-risk decisions
4. Ask the user to continue only after the phase summary is complete.

## Global Audit Boundaries

Do not do any of the following unless explicitly approved after the final audit report:

- Change visible body copy, headings, navigation, layouts, or link text
- Add, remove, or rewrite URLs
- Add, remove, or rewrite redirects
- Change canonical policy
- Add `noindex`, `nofollow`, or broad robots blocking
- Remove URLs from sitemap policy
- Change locale or hreflang URL policy
- Modify schema involving prices, availability, reviews, ratings, or credentials
- Restart production services
- Change certificates or domains
- Loosen CSP, TLS, CORS, SRI, WAF, sudo, SSH, IAM, or other security controls

## Evidence Standard

Every claim must be backed by evidence from one of the following:

- File inspection
- Build, lint, or typecheck command
- Curl status/header/body check
- Server config inspection
- CDN/edge response check
- Log check

No assumptions should appear as final findings. Unknowns become TODOs.

## Final Deliverable

The final deliverable is produced in PHASE-03 and must use this structure:

```text
=== SEO Master Audit ===

Stack:
  Framework: <framework>
  Server: <server>
  CDN: <cdn>
  Security posture observed: <summary>

Code-layer findings:
  - <finding or OK>

Server-layer findings (origin):
  - <finding or OK>

Server-layer findings (edge):
  - <finding or OK>

Cross-layer findings (code ↔ server):
  - <finding or OK>

Security-aware findings (security ↔ SEO):
  - <finding or OK>

Pinned external dependencies (SRI):
  - <url/hash or none>

Intentional 404/403 paths (allowlisted):
  - <pattern/rationale or none>

Regressions since prior passes: <list or none>
Gaps neither prior pass covered: <list or none>
Conflicts between SEO and security: <list or none>
Fixes applied this audit: <list or none — report only>
TODOs requiring user input: <list or none>
High-risk items deferred for approval: <list or none>
```
