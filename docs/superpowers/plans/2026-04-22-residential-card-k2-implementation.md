# Residential Service Cards K2 Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Architectural Technical Inset" (K2) design for all residential service cards to achieve a sleek, cinematic, and professional look.

**Architecture:** A CSS-driven refactor using absolute positioning for the icon "inset" boxes, enhanced typography with JetBrains Mono for technical metadata, and refined hover transitions for depth.

**Tech Stack:** HTML5, CSS3 (Custom Properties), Lordicon (Animated Icons), Manrope & JetBrains Mono fonts.

---

### Task 1: Update CSS Styles for K2 Design

**Files:**
- Modify: `residential.html` (within `<style>` block)

- [ ] **Step 1: Update CSS variables and card base styles**
Replace the existing `.service-card` and related styles with the new K2 definitions.

```css
/* Update these in the <style> section of residential.html */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px; /* Increased gap for breathing room */
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  position: relative;
  background: #FFF;
  border: 1px solid var(--line);
  border-radius: 24px; /* Increased radius */
  padding: 40px; /* Increased padding */
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 24px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  color: inherit;
  min-height: 420px;
  margin-top: 30px; /* Space for the overlapping icon */
}

.service-card:hover {
  border-color: var(--gold-2);
  box-shadow: 0 40px 80px rgba(44,20,10,0.08);
  transform: translateY(-12px);
}

/* K2 Inset Icon Style */
.card-icon-inset {
  width: 60px;
  height: 60px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -30px;
  left: 40px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02), 0 10px 20px rgba(44,20,10,0.05);
  transition: transform 0.3s ease;
}

.service-card:hover .card-icon-inset {
  transform: scale(1.1) rotate(-5deg);
  border-color: var(--gold);
}

/* Metadata Stack */
.card-meta {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  margin-bottom: 4px;
}

.service-category {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.service-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--muted);
  text-transform: uppercase;
  opacity: 0.7;
}

.card-problem {
  font-size: 1.4rem; /* Slightly larger */
  font-weight: 800;
  color: var(--ink);
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.card-solution {
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.7;
  padding-left: 20px;
  border-left: 1px solid var(--gold-3);
}

.card-solution strong {
  color: var(--ink);
  display: block;
  margin-bottom: 6px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

- [ ] **Step 2: Commit CSS changes**
```bash
git add residential.html
git commit -m "style: implement K2 architectural CSS for residential cards"
```

---

### Task 2: Refactor Service Cards HTML Structure

**Files:**
- Modify: `residential.html` (within `.services-grid` container)

- [ ] **Step 1: Update Card 1 (Home Networking)**
Replace the inner HTML of the first `service-card` link.

```html
<a class="service-card" href="services/residential/home-networking.html">
  <div class="card-icon-inset">
    <lord-icon src="https://cdn.lordicon.com/jezazvlx.json" trigger="loop" colors="primary:#c97b4b,secondary:#2c140a" style="width:40px;height:40px;"></lord-icon>
  </div>
  <div class="card-meta">
    <span class="service-category">Home Networking</span>
    <span class="service-id">CASE_ID: 0xN01R</span>
  </div>
  <h3 class="card-problem">"My computer is running slow, and I need help setting up my home office and Wi-Fi."</h3>
  <p class="card-solution">
    <strong>The Logic Fix</strong>
    We provide expert computer repair, home office setup, and reliable Wi-Fi solutions to keep your home tech running smoothly.
  </p>
</a>
```

- [ ] **Step 2: Update Card 2 (Smart Home)**
```html
<a class="service-card" href="services/residential/smart-home-support.html">
  <div class="card-icon-inset">
    <lord-icon src="https://cdn.lordicon.com/oeotfwsx.json" trigger="loop" colors="primary:#c97b4b,secondary:#2c140a" style="width:40px;height:40px;"></lord-icon>
  </div>
  <div class="card-meta">
    <span class="service-category">Smart Home Integration</span>
    <span class="service-id">CASE_ID: 0xS02R</span>
  </div>
  <h3 class="card-problem">"My smart lights, cameras, and thermostat don't talk to each other and keep dropping offline."</h3>
  <p class="card-solution">
    <strong>The Logic Fix</strong>
    We unify your home using Matter and Thread standards, ensuring every device is responsive, secure, and controllable from a single, simple interface.
  </p>
</a>
```

- [ ] **Step 3: Update Card 3 (Setup & Training)**
```html
<a class="service-card" href="services/residential/device-setup-training.html">
  <div class="card-icon-inset">
    <lord-icon src="https://cdn.lordicon.com/sobzmbzh.json" trigger="loop" colors="primary:#c97b4b,secondary:#2c140a" style="width:40px;height:40px;"></lord-icon>
  </div>
  <div class="card-meta">
    <span class="service-category">Setup & Training</span>
    <span class="service-id">CASE_ID: 0xT03R</span>
  </div>
  <h3 class="card-problem">"I just bought new tech and I want to make sure it's set up 'the right way' from the start."</h3>
  <p class="card-solution">
    <strong>The Logic Fix</strong>
    We handle the white-glove setup of your new PCs, tablets, or phones and provide 1-on-1 coaching so you can use your tech with total confidence.
  </p>
</a>
```

- [ ] **Step 4: Update Card 4 (AI Setup)**
```html
<a class="service-card" href="services/residential/ai-setup.html">
  <div class="card-icon-inset">
    <lord-icon src="https://cdn.lordicon.com/vjpxzzre.json" trigger="loop" colors="primary:#c97b4b,secondary:#2c140a" style="width:40px;height:40px;"></lord-icon>
  </div>
  <div class="card-meta">
    <span class="service-category">AI & Local LLM Setup</span>
    <span class="service-id">CASE_ID: 0xA04R</span>
  </div>
  <h3 class="card-problem">"I want to use AI for my daily tasks but I don't want my private data training a public model."</h3>
  <p class="card-solution">
    <strong>The Logic Fix</strong>
    We set up private, "on-device" AI models (Local LLMs) that run entirely on your own hardware, giving you powerful assistance with 100% data privacy.
  </p>
</a>
```

- [ ] **Step 5: Update Card 5 (Cybersecurity)**
```html
<a class="service-card" href="services/residential/cybersecurity.html">
  <div class="card-icon-inset">
    <lord-icon src="https://cdn.lordicon.com/fedbzost.json" trigger="loop" colors="primary:#c97b4b,secondary:#2c140a" style="width:40px;height:40px;"></lord-icon>
  </div>
  <div class="card-meta">
    <span class="service-category">Cybersecurity & Privacy</span>
    <span class="service-id">CASE_ID: 0xC05R</span>
  </div>
  <h3 class="card-problem">"I'm worried about identity theft and I can't keep track of all my different passwords."</h3>
  <p class="card-solution">
    <strong>The Logic Fix</strong>
    We move you to a "Passwordless" future with Passkeys, perform deep-level system hardening, and set up advanced DNS filtering to block trackers and malware.
  </p>
</a>
```

- [ ] **Step 6: Update Card 6 (Private Cloud)**
```html
<a class="service-card" href="services/residential/private-cloud.html">
  <div class="card-icon-inset">
    <lord-icon src="https://cdn.lordicon.com/xqdfobxg.json" trigger="loop" colors="primary:#c97b4b,secondary:#2c140a" style="width:40px;height:40px;"></lord-icon>
  </div>
  <div class="card-meta">
    <span class="service-category">Private Cloud & Backup</span>
    <span class="service-id">CASE_ID: 0xP06R</span>
  </div>
  <h3 class="card-problem">"I'm tired of monthly cloud storage fees and I'm scared of losing my photos if a drive fails."</h3>
  <p class="card-solution">
    <strong>The Logic Fix</strong>
    We build a personal "Home Cloud" for your family that backs up every device automatically and lets you access your files from anywhere—with zero monthly fees.
  </p>
</a>
```

- [ ] **Step 7: Commit HTML changes**
```bash
git add residential.html
git commit -m "feat: refactor residential service cards to K2 architectural structure"
```

---

### Task 3: Visual Verification

**Files:**
- Test: `residential.html` (Local browser preview)

- [ ] **Step 1: Verify layout in browser**
Use a tool like Playwright or simply open the file locally to ensure:
1. Icons correctly overlap the top border.
2. Shadow and lift on hover look "cinematic".
3. Grid remains responsive.

- [ ] **Step 2: Clean up temporary design files**
```bash
rm -rf .superpowers/brainstorm/
```
