# Local Logic IT Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing single-page site with three static HTML pages — a yin-yang landing chooser and two audience-specific mini-sites (Residential: Navy/Gold, Business: Charcoal/Electric Blue).

**Architecture:** Three self-contained HTML files with all CSS and JS inline. No build step, no framework, no external JS. Deploy by pushing to `main` on GitHub — the GCP VM auto-pulls within ~1 minute.

**Tech Stack:** HTML5, CSS3 (custom properties, CSS animations, flexbox/grid), vanilla JS (mobile nav toggle, smooth scroll), Google Fonts (Manrope), inline SVG icons.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `index.html` | Replace entirely | Yin-yang landing chooser with animated reveal |
| `residential.html` | Create new | Residential mini-site — Navy + Gold palette |
| `business.html` | Create new | Business mini-site — Charcoal + Electric Blue palette |
| `assets/logo.png` | No change | Existing logo asset |

---

## Task 1: Landing Page — Structure, Tokens, and Yin-Yang Layout

**Files:**
- Replace: `index.html`

This task produces a static (no animation yet) yin-yang split screen. Left half navy, right half charcoal, curved SVG divider in the middle, logo + tagline above. No hover effects yet. Verify visually in a browser.

- [ ] **Step 1: Replace index.html with the yin-yang skeleton**

Replace the entire contents of `index.html` with the following:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Local Logic IT — Local Service. Logical Solutions. IT support for home and business." />
  <title>Local Logic IT — Choose Your Service</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    body {
      font-family: "Manrope", sans-serif;
      background: #111;
    }
    a { text-decoration: none; color: inherit; }

    /* ── Header ── */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 0;
      pointer-events: none;
    }
    .header-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-logo img {
      height: 44px;
      width: auto;
    }
    .header-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.02em;
    }
    .header-tagline {
      margin-top: 4px;
      font-size: 0.8rem;
      font-weight: 500;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* ── Chooser ── */
    .chooser {
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
    }

    /* ── Halves ── */
    .half {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      cursor: pointer;
      overflow: hidden;
      transition: filter 0.3s ease;
    }
    .half--residential { background: #15274D; }
    .half--business    { background: #1C1C2E; }

    /* ── SVG Divider ── */
    .divider {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
      width: 120px;
      z-index: 2;
      pointer-events: none;
    }

    /* ── Half content ── */
    .half-icon {
      width: 72px;
      height: 72px;
      opacity: 0.85;
    }
    .half-label {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      text-align: center;
    }
    .half--residential .half-label { color: #C9A96E; }
    .half--business    .half-label { color: #3B82F6; }
    .half-sub {
      font-size: 0.85rem;
      font-weight: 500;
      opacity: 0.6;
      color: #fff;
      text-align: center;
    }

    /* ── Responsive: mobile stacks vertically ── */
    @media (max-width: 767px) {
      html, body { overflow: auto; }
      .chooser { flex-direction: column; height: auto; min-height: 100vh; }
      .half { min-height: 50vh; }
      .divider { display: none; }
    }
  </style>
</head>
<body>

  <header class="header">
    <div class="header-logo">
      <img src="assets/logo.png" alt="Local Logic IT logo" />
      <span class="header-name">Local Logic IT</span>
    </div>
    <p class="header-tagline">Local Service. Logical Solutions.</p>
  </header>

  <div class="chooser" id="chooser">

    <!-- Residential half -->
    <a class="half half--residential" href="residential.html" aria-label="Go to Residential services">
      <!-- House icon -->
      <svg class="half-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10 34L36 10L62 34" stroke="#C9A96E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 28V58H30V44H42V58H54V28" stroke="#C9A96E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="half-label">Home &amp; Family</span>
      <span class="half-sub">Residential IT Support</span>
    </a>

    <!-- Curved SVG divider -->
    <svg class="divider" viewBox="0 0 120 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 0 C20 150, 100 300, 60 450 C20 600, 100 750, 60 900 L120 900 L120 0 Z" fill="#1C1C2E"/>
      <path d="M60 0 C20 150, 100 300, 60 450 C20 600, 100 750, 60 900" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" fill="none"/>
    </svg>

    <!-- Business half -->
    <a class="half half--business" href="business.html" aria-label="Go to Business services">
      <!-- Building icon -->
      <svg class="half-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="12" y="14" width="48" height="44" rx="2" stroke="#3B82F6" stroke-width="4"/>
        <line x1="12" y1="28" x2="60" y2="28" stroke="#3B82F6" stroke-width="4"/>
        <line x1="36" y1="14" x2="36" y2="58" stroke="#3B82F6" stroke-width="4"/>
        <rect x="22" y="36" width="10" height="10" rx="1" fill="#3B82F6" opacity="0.5"/>
        <rect x="40" y="36" width="10" height="10" rx="1" fill="#3B82F6" opacity="0.5"/>
        <rect x="22" y="20" width="10" height="4" rx="1" fill="#3B82F6" opacity="0.4"/>
        <rect x="40" y="20" width="10" height="4" rx="1" fill="#3B82F6" opacity="0.4"/>
      </svg>
      <span class="half-label">Business &amp; Office</span>
      <span class="half-sub">Commercial IT Services</span>
    </a>

  </div>

</body>
</html>
```

- [ ] **Step 2: Verify layout in browser**

Open `index.html` directly in a browser (double-click the file). Confirm:
- Left half is navy blue, right half is dark charcoal
- The curved SVG divider is visible between them
- Logo + tagline appear centered at top in white
- House icon (gold) on left, building icon (blue) on right
- Labels "Home & Family" and "Business & Office" are visible
- Page fills the full viewport

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\DESKTOP\Desktop\LocalLogic\Local Logic IT\locallogic-it-website"
git add index.html
git commit -m "feat: add yin-yang landing chooser layout"
```

---

## Task 2: Landing Page — Animated Entrance

**Files:**
- Modify: `index.html`

Add the CSS rotation reveal animation: on page load, the `.chooser` div spins from 180deg to 0deg over 1.2s with ease-out, then locks in place.

- [ ] **Step 1: Add the animation keyframe and class to index.html**

Inside the `<style>` block in `index.html`, add these rules immediately before the `@media` block:

```css
    /* ── Entrance animation ── */
    @keyframes ying-yang-reveal {
      from { transform: rotate(180deg); opacity: 0; }
      to   { transform: rotate(0deg);   opacity: 1; }
    }
    .chooser {
      animation: ying-yang-reveal 1.2s ease-out forwards;
      transform-origin: center center;
    }
```

- [ ] **Step 2: Verify animation in browser**

Refresh `index.html` in the browser. Confirm:
- On load, the chooser spins in from 180deg to 0deg over ~1.2 seconds
- After animation completes, the layout is stable and does not loop
- Header (logo + tagline) stays fixed above during animation — it should not rotate

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add yin-yang spin-in entrance animation"
```

---

## Task 3: Landing Page — Hover Effects

**Files:**
- Modify: `index.html`

Add hover states: brightness lift on each half + colored glow on the SVG divider edge.

- [ ] **Step 1: Add hover CSS to the style block in index.html**

Inside the `<style>` block, add these rules after the `.half-sub` rule and before the `@keyframes` rule:

```css
    /* ── Hover effects ── */
    .half--residential:hover {
      filter: brightness(1.12);
    }
    .half--business:hover {
      filter: brightness(1.12);
    }
    .half--residential:hover ~ .divider path:first-child {
      filter: drop-shadow(0 0 8px #C9A96E);
    }
    .half--business:hover .divider path:first-child {
      filter: drop-shadow(0 0 8px #3B82F6);
    }
    /* Glow on divider line when either side is hovered */
    .chooser:has(.half--residential:hover) .divider path:last-child {
      stroke: rgba(201,169,110,0.4);
    }
    .chooser:has(.half--business:hover) .divider path:last-child {
      stroke: rgba(59,130,246,0.4);
    }
```

- [ ] **Step 2: Verify hover in browser**

In the browser, hover over each half. Confirm:
- Each half brightens slightly on hover
- The divider edge picks up a faint gold glow when hovering residential, blue glow when hovering business
- Transitions feel smooth (~300ms from the `.half` transition rule already set)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add hover glow effects to landing chooser"
```

---

## Task 4: Residential Page — Nav and Hero

**Files:**
- Create: `residential.html`

Build the Residential mini-site nav and hero sections. Navy + Gold palette. No services or contact sections yet.

- [ ] **Step 1: Create residential.html with nav and hero**

Create `residential.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Local Logic IT residential IT support — PC repair, home networking, device setup, virus removal, and smart home help." />
  <title>Local Logic IT — Residential IT Support</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ── Tokens ── */
    :root {
      --navy:    #15274D;
      --navy-2:  #0e1c38;
      --gold:    #C9A96E;
      --gold-2:  #e8c98a;
      --paper:   #FFFDF8;
      --ink:     #1F2937;
      --muted:   #6B7280;
      --line:    #E5E7EB;
    }

    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: "Manrope", sans-serif; color: var(--ink); background: var(--paper); }
    a { text-decoration: none; color: inherit; }
    img { display: block; max-width: 100%; }

    /* ── Nav ── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--navy);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 64px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-back {
      font-size: 0.8rem;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.04em;
      transition: color 0.2s;
    }
    .nav-back:hover { color: var(--gold); }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nav-logo img { height: 32px; width: auto; }
    .nav-logo-name {
      font-size: 1rem;
      font-weight: 800;
      color: #fff;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
      list-style: none;
    }
    .nav-links a {
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255,255,255,0.7);
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--gold); }

    /* Mobile nav */
    .nav-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px;
    }
    .nav-hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: all 0.3s;
    }
    .nav-mobile-menu {
      display: none;
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      background: var(--navy-2);
      padding: 16px 24px;
      flex-direction: column;
      gap: 16px;
    }
    .nav-mobile-menu.open { display: flex; }
    .nav-mobile-menu a {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .nav-mobile-menu a:hover { color: var(--gold); }

    @media (max-width: 767px) {
      .nav-links { display: none; }
      .nav-hamburger { display: flex; }
      .nav { position: relative; }
    }

    /* ── Hero ── */
    .hero {
      background: linear-gradient(160deg, var(--navy) 0%, var(--navy-2) 100%);
      padding: 100px 32px 80px;
      position: relative;
      overflow: hidden;
      text-align: center;
    }
    /* Decorative circles */
    .hero::before {
      content: "";
      position: absolute;
      top: -80px;
      right: -80px;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      border: 2px solid rgba(201,169,110,0.12);
      pointer-events: none;
    }
    .hero::after {
      content: "";
      position: absolute;
      bottom: -120px;
      left: -100px;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 2px solid rgba(201,169,110,0.08);
      pointer-events: none;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(201,169,110,0.15);
      color: var(--gold);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 24px;
      border: 1px solid rgba(201,169,110,0.3);
    }
    .hero h1 {
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 800;
      color: #fff;
      line-height: 1.15;
      letter-spacing: -0.03em;
      max-width: 700px;
      margin: 0 auto 20px;
    }
    .hero-sub {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.65);
      max-width: 520px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }
    .hero-cta {
      display: inline-block;
      background: var(--gold);
      color: var(--navy);
      font-size: 0.9rem;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 8px;
      transition: background 0.2s, transform 0.15s;
    }
    .hero-cta:hover {
      background: var(--gold-2);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>

  <!-- Nav -->
  <nav class="nav" id="top">
    <div class="nav-left">
      <a class="nav-back" href="index.html">&#8592; Back to Home</a>
      <a class="nav-logo" href="#top">
        <img src="assets/logo.png" alt="Local Logic IT" />
        <span class="nav-logo-name">Local Logic IT</span>
      </a>
    </div>
    <ul class="nav-links">
      <li><a href="#services">Services</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="nav-hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-mobile-menu" id="mobileMenu">
      <a href="#services" onclick="closeMobileMenu()">Services</a>
      <a href="#about" onclick="closeMobileMenu()">About</a>
      <a href="#contact" onclick="closeMobileMenu()">Contact</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-badge">Residential IT Support</div>
    <h1>IT Support That Comes to You</h1>
    <p class="hero-sub">Friendly, no-jargon tech help for your home and family. We come to you — fixing computers, setting up networks, and solving tech problems the simple way.</p>
    <a class="hero-cta" href="#services">See What We Can Help With</a>
  </section>

  <script>
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    function closeMobileMenu() { mobileMenu.classList.remove('open'); }
  </script>

</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `residential.html` in a browser. Confirm:
- Sticky navy nav with gold logo name, links, and "← Back to Home" ghost link
- Hero section shows dark navy gradient background with gold decorative circle accents
- "IT Support That Comes to You" headline is large and white
- Gold CTA button is visible and clickable
- On a narrow window (< 768px), nav links disappear and hamburger appears; clicking hamburger opens mobile menu

- [ ] **Step 3: Commit**

```bash
git add residential.html
git commit -m "feat: add residential page nav and hero"
```

---

## Task 5: Residential Page — Services, About, Contact, Footer

**Files:**
- Modify: `residential.html`

Add the remaining sections: services grid, about, contact, footer.

- [ ] **Step 1: Add styles for remaining sections**

Inside the `<style>` block of `residential.html`, add the following CSS before the closing `</style>` tag:

```css
    /* ── Section shared ── */
    .section {
      padding: 80px 32px;
    }
    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gold);
      text-align: center;
      margin-bottom: 12px;
    }
    .section-heading {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 800;
      text-align: center;
      color: var(--navy);
      letter-spacing: -0.02em;
      margin-bottom: 48px;
    }

    /* ── Services ── */
    .services { background: var(--paper); }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .service-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 28px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
    }
    .service-card:hover {
      border-color: var(--gold);
      box-shadow: 0 8px 32px rgba(201,169,110,0.15);
      transform: translateY(-3px);
    }
    .service-icon {
      width: 44px;
      height: 44px;
      color: var(--gold);
    }
    .service-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--navy);
    }
    .service-desc {
      font-size: 0.875rem;
      color: var(--muted);
      line-height: 1.55;
    }

    /* ── About ── */
    .about {
      background: var(--navy);
      text-align: center;
    }
    .about .section-heading { color: #fff; }
    .about-body {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.7);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.7;
    }
    .about-body strong { color: var(--gold); }

    /* ── Contact ── */
    .contact { background: var(--paper); text-align: center; }
    .contact .section-heading { color: var(--navy); }
    .contact-card {
      display: inline-flex;
      flex-direction: column;
      gap: 16px;
      background: var(--navy);
      border-radius: 20px;
      padding: 36px 48px;
      margin: 0 auto;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 14px;
      color: var(--gold);
      font-size: 1rem;
      font-weight: 600;
    }
    .contact-item svg { width: 22px; height: 22px; flex-shrink: 0; }
    .contact-item a { color: var(--gold); transition: color 0.2s; }
    .contact-item a:hover { color: var(--gold-2); }

    /* ── Footer ── */
    .footer {
      background: var(--navy-2);
      text-align: center;
      padding: 28px 32px;
      color: rgba(255,255,255,0.4);
      font-size: 0.8rem;
    }
    .footer strong { color: var(--gold); font-weight: 700; }

    @media (max-width: 767px) {
      .section { padding: 60px 20px; }
      .contact-card { padding: 28px 24px; }
    }
```

- [ ] **Step 2: Add the remaining HTML sections**

In `residential.html`, add the following HTML immediately after the closing `</section>` tag of the hero (before the `<script>` tag):

```html
  <!-- Services -->
  <section class="section services" id="services">
    <p class="section-label">What We Do</p>
    <h2 class="section-heading">What We Can Help With</h2>
    <div class="services-grid">

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="4" y="8" width="36" height="24" rx="3" stroke="currentColor" stroke-width="2.5"/>
          <line x1="14" y1="36" x2="30" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="32" x2="22" y2="36" stroke="currentColor" stroke-width="2.5"/>
        </svg>
        <span class="service-title">PC Repair</span>
        <p class="service-desc">Slow computers, crashes, hardware faults — we diagnose and fix it, in your home or ours.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 22 C8 14, 36 14, 36 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M13 27 C13 22, 31 22, 31 27" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="22" cy="32" r="3" fill="currentColor"/>
        </svg>
        <span class="service-title">Home Networking</span>
        <p class="service-desc">Wi-Fi dead zones, slow speeds, router setup — we get your whole home connected reliably.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="10" y="6" width="18" height="28" rx="3" stroke="currentColor" stroke-width="2.5"/>
          <line x1="14" y1="30" x2="24" y2="30" stroke="currentColor" stroke-width="2"/>
          <path d="M28 18 L38 12 M28 22 L38 28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="service-title">Device Setup &amp; Training</span>
        <p class="service-desc">New phone, tablet, or laptop? We set it up right and walk you through using it with confidence.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="22" cy="22" r="14" stroke="currentColor" stroke-width="2.5"/>
          <path d="M17 22 L20 25 L27 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="service-title">Virus &amp; Malware Removal</span>
        <p class="service-desc">Pop-ups, slow systems, suspicious activity — we clean and protect your devices thoroughly.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 28 L22 10 L34 28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="16" y="32" width="12" height="6" rx="2" stroke="currentColor" stroke-width="2.5"/>
          <circle cx="30" cy="34" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M33 37 L36 40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="service-title">Smart Home Support</span>
        <p class="service-desc">Smart speakers, cameras, doorbells, thermostats — we install, connect, and show you how.</p>
      </div>

    </div>
  </section>

  <!-- About -->
  <section class="section about" id="about">
    <p class="section-label">Who We Are</p>
    <h2 class="section-heading">Local People, Real Help</h2>
    <p class="about-body">We're a <strong>local IT team</strong> that speaks plain English, shows up on time, and actually fixes the problem. No call centres, no jargon — just friendly, practical support for you and your family. When something goes wrong with your tech, we're the neighbour you call.</p>
  </section>

  <!-- Contact -->
  <section class="section contact" id="contact">
    <p class="section-label">Reach Out</p>
    <h2 class="section-heading">Get in Touch</h2>
    <div class="contact-card">
      <div class="contact-item">
        <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 4h14a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.8"/>
          <path d="M3 5l8 7 8-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <a href="mailto:chris@fitzwilliam.net">chris@fitzwilliam.net</a>
      </div>
      <div class="contact-item">
        <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 4.5C4 3.7 4.7 3 5.5 3h2.2l2 4.5-1.4 1.4a10 10 0 004.8 4.8l1.4-1.4L19 14.3V16.5c0 .8-.7 1.5-1.5 1.5C8.4 18 4 10.6 4 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <span>(555) 000-0000</span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <strong>Local Logic IT</strong> &mdash; Local Service. Logical Solutions. &nbsp;&middot;&nbsp; &copy; 2026 Local Logic IT
  </footer>
```

- [ ] **Step 3: Verify full page in browser**

Reload `residential.html`. Confirm:
- Services grid shows 5 cards, each with a gold-stroke SVG icon, title, and description
- Hovering a service card lifts it slightly and shows a gold border + subtle shadow
- About section has dark navy background with gold-highlighted text
- Contact section shows email and phone in a navy pill card with gold text
- Footer appears at the bottom
- Page scrolls smoothly when clicking nav links

- [ ] **Step 4: Commit**

```bash
git add residential.html
git commit -m "feat: complete residential page services, about, contact, footer"
```

---

## Task 6: Business Page — Full Page

**Files:**
- Create: `business.html`

Build the complete Business mini-site in one task. Same structure as residential but with Charcoal + Electric Blue palette and business-specific content.

- [ ] **Step 1: Create business.html**

Create `business.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Local Logic IT business IT services — managed IT, cybersecurity, backup, AI automation, and cloud services for local businesses." />
  <title>Local Logic IT — Business IT Services</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ── Tokens ── */
    :root {
      --charcoal:   #1C1C2E;
      --charcoal-2: #131320;
      --blue:       #3B82F6;
      --blue-2:     #60A5FA;
      --light:      #F0F4FF;
      --ink:        #1F2937;
      --muted:      #6B7280;
      --line:       #E2E8F0;
    }

    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: "Manrope", sans-serif; color: var(--ink); background: var(--light); }
    a { text-decoration: none; color: inherit; }
    img { display: block; max-width: 100%; }

    /* ── Nav ── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--charcoal);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 64px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.4);
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-back {
      font-size: 0.8rem;
      font-weight: 600;
      color: rgba(255,255,255,0.4);
      letter-spacing: 0.04em;
      transition: color 0.2s;
    }
    .nav-back:hover { color: var(--blue); }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nav-logo img { height: 32px; width: auto; }
    .nav-logo-name {
      font-size: 1rem;
      font-weight: 800;
      color: #fff;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
      list-style: none;
    }
    .nav-links a {
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255,255,255,0.6);
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--blue); }

    /* Mobile nav */
    .nav-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px;
    }
    .nav-hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
    }
    .nav-mobile-menu {
      display: none;
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      background: var(--charcoal-2);
      padding: 16px 24px;
      flex-direction: column;
      gap: 16px;
    }
    .nav-mobile-menu.open { display: flex; }
    .nav-mobile-menu a {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255,255,255,0.75);
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .nav-mobile-menu a:hover { color: var(--blue); }

    @media (max-width: 767px) {
      .nav-links { display: none; }
      .nav-hamburger { display: flex; }
      .nav { position: relative; }
    }

    /* ── Hero ── */
    .hero {
      background: linear-gradient(160deg, var(--charcoal) 0%, var(--charcoal-2) 100%);
      padding: 100px 32px 80px;
      position: relative;
      overflow: hidden;
      text-align: center;
    }
    .hero::before {
      content: "";
      position: absolute;
      top: -80px;
      right: -80px;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      border: 2px solid rgba(59,130,246,0.1);
      pointer-events: none;
    }
    .hero::after {
      content: "";
      position: absolute;
      bottom: -120px;
      left: -100px;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 2px solid rgba(59,130,246,0.06);
      pointer-events: none;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(59,130,246,0.15);
      color: var(--blue);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 24px;
      border: 1px solid rgba(59,130,246,0.3);
    }
    .hero h1 {
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 800;
      color: #fff;
      line-height: 1.15;
      letter-spacing: -0.03em;
      max-width: 700px;
      margin: 0 auto 20px;
    }
    .hero-sub {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.6);
      max-width: 540px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }
    .hero-cta {
      display: inline-block;
      background: var(--blue);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 8px;
      transition: background 0.2s, transform 0.15s;
    }
    .hero-cta:hover {
      background: var(--blue-2);
      transform: translateY(-2px);
    }

    /* ── Section shared ── */
    .section { padding: 80px 32px; }
    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--blue);
      text-align: center;
      margin-bottom: 12px;
    }
    .section-heading {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 800;
      text-align: center;
      color: var(--charcoal);
      letter-spacing: -0.02em;
      margin-bottom: 48px;
    }

    /* ── Services ── */
    .services { background: var(--light); }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .service-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 28px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
    }
    .service-card:hover {
      border-color: var(--blue);
      box-shadow: 0 8px 32px rgba(59,130,246,0.12);
      transform: translateY(-3px);
    }
    .service-icon { width: 44px; height: 44px; color: var(--blue); }
    .service-title { font-size: 1rem; font-weight: 700; color: var(--charcoal); }
    .service-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.55; }

    /* ── About ── */
    .about { background: var(--charcoal); text-align: center; }
    .about .section-heading { color: #fff; }
    .about-body {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.65);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.7;
    }
    .about-body strong { color: var(--blue); }

    /* ── Contact ── */
    .contact { background: var(--light); text-align: center; }
    .contact .section-heading { color: var(--charcoal); }
    .contact-card {
      display: inline-flex;
      flex-direction: column;
      gap: 16px;
      background: var(--charcoal);
      border-radius: 20px;
      padding: 36px 48px;
      margin: 0 auto;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 14px;
      color: var(--blue);
      font-size: 1rem;
      font-weight: 600;
    }
    .contact-item svg { width: 22px; height: 22px; flex-shrink: 0; }
    .contact-item a { color: var(--blue); transition: color 0.2s; }
    .contact-item a:hover { color: var(--blue-2); }

    /* ── Footer ── */
    .footer {
      background: var(--charcoal-2);
      text-align: center;
      padding: 28px 32px;
      color: rgba(255,255,255,0.35);
      font-size: 0.8rem;
    }
    .footer strong { color: var(--blue); font-weight: 700; }

    @media (max-width: 767px) {
      .section { padding: 60px 20px; }
      .contact-card { padding: 28px 24px; }
    }
  </style>
</head>
<body>

  <!-- Nav -->
  <nav class="nav" id="top">
    <div class="nav-left">
      <a class="nav-back" href="index.html">&#8592; Back to Home</a>
      <a class="nav-logo" href="#top">
        <img src="assets/logo.png" alt="Local Logic IT" />
        <span class="nav-logo-name">Local Logic IT</span>
      </a>
    </div>
    <ul class="nav-links">
      <li><a href="#services">Services</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="nav-hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-mobile-menu" id="mobileMenu">
      <a href="#services" onclick="closeMobileMenu()">Services</a>
      <a href="#about" onclick="closeMobileMenu()">About</a>
      <a href="#contact" onclick="closeMobileMenu()">Contact</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-badge">Business IT Services</div>
    <h1>Enterprise-Grade IT. Local Accountability.</h1>
    <p class="hero-sub">Managed IT, cybersecurity, and cloud services delivered by a local team that picks up the phone and shows up when it counts. No tickets into the void.</p>
    <a class="hero-cta" href="#services">See Our Services</a>
  </section>

  <!-- Services -->
  <section class="section services" id="services">
    <p class="section-label">What We Do</p>
    <h2 class="section-heading">What We Offer</h2>
    <div class="services-grid">

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="4" y="8" width="36" height="24" rx="3" stroke="currentColor" stroke-width="2.5"/>
          <line x1="14" y1="36" x2="30" y2="36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="32" x2="22" y2="36" stroke="currentColor" stroke-width="2.5"/>
          <line x1="12" y1="16" x2="32" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="21" x2="24" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="service-title">Managed IT Services</span>
        <p class="service-desc">Proactive monitoring, helpdesk support, and IT management so your team stays productive.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22 6 C10 10, 6 18, 8 28 C10 36, 16 40, 22 40 C28 40, 34 36, 36 28 C38 18, 34 10, 22 6Z" stroke="currentColor" stroke-width="2.5"/>
          <path d="M17 22 L20 25 L27 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="service-title">Backup &amp; Recovery</span>
        <p class="service-desc">Automated backups and tested recovery plans — so a ransomware hit or hardware failure doesn't end your business.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="22" cy="16" r="6" stroke="currentColor" stroke-width="2.5"/>
          <circle cx="10" cy="32" r="4" stroke="currentColor" stroke-width="2.5"/>
          <circle cx="34" cy="32" r="4" stroke="currentColor" stroke-width="2.5"/>
          <line x1="16" y1="20" x2="12" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="28" y1="20" x2="32" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="service-title">AI Automation</span>
        <p class="service-desc">Practical AI tools and workflow automation that save your team time on repetitive tasks.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="8" y="12" width="28" height="20" rx="3" stroke="currentColor" stroke-width="2.5"/>
          <path d="M16 20 L20 24 L28 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="8" y1="8" x2="36" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          <line x1="8" y1="36" x2="36" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
        </svg>
        <span class="service-title">Cybersecurity</span>
        <p class="service-desc">Endpoint protection, email security, staff training, and vulnerability assessments to keep threats out.</p>
      </div>

      <div class="service-card">
        <svg class="service-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 30 C8 22 14 16 22 16 C30 16 36 22 36 30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M4 34 C4 28 12 24 22 24 C32 24 40 28 40 34" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
          <circle cx="22" cy="34" r="4" fill="currentColor" opacity="0.7"/>
        </svg>
        <span class="service-title">Cloud Services</span>
        <p class="service-desc">Microsoft 365, cloud migration, and ongoing cloud management — scalable infrastructure without the overhead.</p>
      </div>

    </div>
  </section>

  <!-- About -->
  <section class="section about" id="about">
    <p class="section-label">Who We Are</p>
    <h2 class="section-heading">Local Team. Real Accountability.</h2>
    <p class="about-body">We're a <strong>local IT partner</strong> — not a faceless helpdesk. We take ownership of your technology so you can focus on running your business. Reliable, responsive, and always reachable. If something breaks, we're on it.</p>
  </section>

  <!-- Contact -->
  <section class="section contact" id="contact">
    <p class="section-label">Reach Out</p>
    <h2 class="section-heading">Get in Touch</h2>
    <div class="contact-card">
      <div class="contact-item">
        <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 4h14a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.8"/>
          <path d="M3 5l8 7 8-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <a href="mailto:chris@fitzwilliam.net">chris@fitzwilliam.net</a>
      </div>
      <div class="contact-item">
        <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 4.5C4 3.7 4.7 3 5.5 3h2.2l2 4.5-1.4 1.4a10 10 0 004.8 4.8l1.4-1.4L19 14.3V16.5c0 .8-.7 1.5-1.5 1.5C8.4 18 4 10.6 4 4.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <span>(555) 000-0000</span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <strong>Local Logic IT</strong> &mdash; Local Service. Logical Solutions. &nbsp;&middot;&nbsp; &copy; 2026 Local Logic IT
  </footer>

  <script>
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    function closeMobileMenu() { mobileMenu.classList.remove('open'); }
  </script>

</body>
</html>
```

- [ ] **Step 2: Verify full page in browser**

Open `business.html` in a browser. Confirm:
- Sticky charcoal nav with electric blue accents and "← Back to Home"
- Hero shows dark charcoal gradient with blue circle accents
- "Enterprise-Grade IT. Local Accountability." headline is white and large
- Electric blue CTA button visible
- Services grid shows 5 cards with blue-stroke SVG icons
- Hovering a card shows blue border + blue shadow
- About section is charcoal with blue-highlighted text
- Contact card on light background, email + phone in blue on charcoal
- Footer is deep charcoal

- [ ] **Step 3: Commit**

```bash
git add business.html
git commit -m "feat: add complete business mini-site"
```

---

## Task 7: Cross-Page Verification and Phone Number Update

**Files:**
- Modify: `residential.html` (update phone number)
- Modify: `business.html` (update phone number)
- Modify: `index.html` (verify navigation links work both ways)

- [ ] **Step 1: Update the phone number placeholder**

In both `residential.html` and `business.html`, find:
```html
        <span>(555) 000-0000</span>
```
Replace with the actual phone number Chris confirms. If not yet confirmed, leave as-is and note it as a pending update.

- [ ] **Step 2: Full navigation flow test**

Open `index.html` in a browser and test all navigation paths:
1. Landing loads with spin animation ✓
2. Click "Home & Family" → goes to `residential.html` ✓
3. Click "← Back to Home" in residential nav → returns to `index.html` ✓
4. Click "Business & Office" → goes to `business.html` ✓
5. Click "← Back to Home" in business nav → returns to `index.html` ✓
6. On each mini-site, click "Services", "About", "Contact" nav links → page smooth-scrolls ✓
7. Click each CTA button in hero → smooth-scrolls to services ✓

- [ ] **Step 3: Mobile responsive check**

Resize browser to < 768px and verify:
- Landing page splits top/bottom (residential on top, business on bottom)
- Both mini-site navs show hamburger button; clicking opens mobile menu
- Service cards stack to single column
- Contact card padding doesn't overflow

- [ ] **Step 4: Final commit and push to deploy**

```bash
git add index.html residential.html business.html
git commit -m "feat: complete Local Logic IT website redesign — yin-yang chooser, residential + business mini-sites"
git push origin main
```

Wait ~1 minute, then visit `https://locallogic.fitzwilliam.net` to confirm the live site shows the new yin-yang landing page.

---

## Self-Review Notes

- **Spec coverage:** All spec requirements covered — yin-yang layout ✓, animated entrance ✓, Navy/Gold residential ✓, Charcoal/Blue business ✓, 5 services each ✓, contact with email+phone ✓, no form ✓, "← Back to Home" link ✓, mobile responsive ✓, inline SVG icons ✓, Manrope font ✓
- **Open items from spec:** Phone number uses placeholder `(555) 000-0000` — Task 7 Step 1 handles this update once Chris confirms the number
- **Type consistency:** CSS variable names consistent across all tasks (`--navy`, `--gold`, `--charcoal`, `--blue`)
- **No placeholders in code steps:** All HTML/CSS is complete and copy-pasteable
