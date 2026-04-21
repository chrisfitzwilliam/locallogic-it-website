# Local Logic IT Color Theme Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved indigo/amber color redesign across the Local Logic IT site, including the lighter L3 landing treatment, polished inner-page buttons, and landing-only spinning caption borders.

**Architecture:** Keep the current static multi-page HTML structure and update inline CSS in place. Use targeted token swaps for inner pages so existing layout and content stay intact, and make landing-page changes only where required for the approved visual treatment and existing animation preservation.

**Tech Stack:** Static HTML, inline CSS, inline vanilla JavaScript, Git

---

## File Structure

- `index.html` — landing-page background, caption border treatment, glow/icon/flash recoloring
- `business.html` — business root tokens and shared business button polish
- `residential.html` — residential root tokens and shared residential button polish
- `services/business/ai-automation.html`
- `services/business/backup-recovery.html`
- `services/business/cloud-services.html`
- `services/business/cybersecurity.html`
- `services/business/hardware-procurement.html`
- `services/business/it-consulting.html`
- `services/business/managed-it.html`
- `services/business/voip-phone-systems.html` — same business token/button updates as `business.html`
- `services/residential/data-backup-recovery.html`
- `services/residential/device-setup-training.html`
- `services/residential/home-networking.html`
- `services/residential/password-account-help.html`
- `services/residential/pc-repair.html`
- `services/residential/printer-setup.html`
- `services/residential/smart-home-support.html`
- `services/residential/virus-malware-removal.html` — same residential token/button updates as `residential.html`

---

### Task 1: Update the landing-page treatment

**Files:**
- Modify: `index.html`
- Test: inline Python verification command against `index.html`

- [ ] **Step 1: Write the failing test**

```python
from pathlib import Path
html = Path('index.html').read_text(encoding='utf-8')
assert '#07070f' not in html
assert 'caption-wrapper' in html
assert 'spin-border' in html
assert 'rgba(212,114,42,0.22)' in html
assert 'rgba(91,94,204,0.22)' in html
assert '#E8A870' in html
assert '#8B8FE8' in html
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
python - <<'PY'
from pathlib import Path
html = Path('index.html').read_text(encoding='utf-8')
assert '#07070f' not in html
assert 'caption-wrapper' in html
assert 'spin-border' in html
assert 'rgba(212,114,42,0.22)' in html
assert 'rgba(91,94,204,0.22)' in html
assert '#E8A870' in html
assert '#8B8FE8' in html
PY
```
Expected: `AssertionError` because the landing page still has the old dark background and lacks the spinning border wrapper.

- [ ] **Step 3: Write minimal implementation**

```html
<!-- Replace each .half-caption block with a wrapper + inner card -->
<div class="caption-wrapper caption-wrapper--residential">
  <div class="half-caption caption-inner">
    ...existing residential icon/name/subtitle/arrow...
  </div>
</div>

<div class="caption-wrapper caption-wrapper--business">
  <div class="half-caption caption-inner">
    ...existing business icon/name/subtitle/arrow...
  </div>
</div>
```

```css
body {
  font-family: "Manrope", sans-serif;
  background:
    linear-gradient(90deg, #F0F0F4 0%, #F0F0F4 50%, #F4F0EC 50%, #F4F0EC 100%);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
python - <<'PY'
from pathlib import Path
html = Path('index.html').read_text(encoding='utf-8')
assert '#07070f' not in html
assert 'caption-wrapper' in html
assert 'spin-border' in html
assert 'rgba(212,114,42,0.22)' in html
assert 'rgba(91,94,204,0.22)' in html
assert '#E8A870' in html
assert '#8B8FE8' in html
print('landing checks passed')
PY
```
Expected: `landing checks passed`

---

### Task 2: Update top-level business and residential pages

**Files:**
- Modify: `business.html`
- Modify: `residential.html`
- Test: inline Python verification command against both files

- [ ] **Step 1: Write the failing test**

```python
from pathlib import Path
business = Path('business.html').read_text(encoding='utf-8')
residential = Path('residential.html').read_text(encoding='utf-8')
assert '#2C2D6E' in business
assert '#5B5ECC' in business
assert '#EEEEFF' in business
assert '#7A3B10' in residential
assert '#D4722A' in residential
assert '#FFF8F2' in residential
assert 'box-shadow: 0 14px 30px' in business
assert 'box-shadow: 0 14px 30px' in residential
```

---

### Task 3: Update all service detail pages

**Files:**
- Modify: `services/business/*.html`
- Modify: `services/residential/*.html`
- Test: inline Python verification command across both service directories

---

### Task 4: Verify, commit, and push main

**Files:**
- Modify: `docs/superpowers/specs/2026-04-20-locallogic-color-theme-design.md`
- Create: `docs/superpowers/plans/2026-04-20-locallogic-color-theme-redesign.md`
- Verify: all changed HTML files
