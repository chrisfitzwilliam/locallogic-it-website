# Onboarding Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a cinematic, horizontal onboarding timeline on the business page with a particle constellation background and SVG drawing animations.

**Architecture:** A new HTML section containing a full-bleed `<canvas>` for background particles, an `<svg>` for the connecting line, and a flex container for the 5 process steps. Intersection Observer will trigger animations when scrolled into view.

**Tech Stack:** HTML5 Canvas, SVG, CSS Animations, Intersection Observer API.

---

### Task 1: HTML Structure and Basic Layout

**Files:**
- Modify: `business.html:378` (Insert before the Services section)

- [ ] **Step 1: Insert the Onboarding section HTML**

```html
  <!-- Onboarding Timeline -->
  <section class="section onboarding" id="process">
    <canvas id="onboardingCanvas" class="onboarding-canvas"></canvas>
    <p class="section-label">Our Process</p>
    <h2 class="section-heading">How We Get You Started</h2>
    
    <div class="timeline-wrapper">
      <svg class="timeline-svg" preserveAspectRatio="none">
        <line x1="10%" y1="25" x2="90%" y2="25" class="timeline-line" id="timelineLine" />
      </svg>
      
      <div class="timeline-steps">
        <div class="timeline-step" data-step="1">
          <div class="step-dot">1</div>
          <h3 class="step-title">Analysis & Audit</h3>
          <p class="step-text">We deep-dive into your current infrastructure and security.</p>
        </div>
        <div class="timeline-step" data-step="2">
          <div class="step-dot">2</div>
          <h3 class="step-title">Strategy</h3>
          <p class="step-text">Building a custom roadmap aligned with your business goals.</p>
        </div>
        <div class="timeline-step" data-step="3">
          <div class="step-dot">3</div>
          <h3 class="step-title">Design</h3>
          <p class="step-text">Architecting the specific systems or automations needed.</p>
        </div>
        <div class="timeline-step" data-step="4">
          <div class="step-dot">4</div>
          <h3 class="step-title">Implementation</h3>
          <p class="step-text">Seamless deployment of new technology with zero downtime.</p>
        </div>
        <div class="timeline-step" data-step="5">
          <div class="step-dot">5</div>
          <h3 class="step-title">Optimization</h3>
          <p class="step-text">Continuous monitoring and proactive improvements.</p>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add CSS for the layout**

```css
    /* ── Onboarding ── */
    .onboarding {
      position: relative;
      background: var(--charcoal);
      color: #fff;
      overflow: hidden;
      padding-bottom: 100px;
    }
    .onboarding .section-heading { color: #fff; }
    .onboarding-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.4;
    }
    .timeline-wrapper {
      position: relative;
      max-width: 1100px;
      margin: 60px auto 0;
      padding: 0 40px;
    }
    .timeline-svg {
      position: absolute;
      top: 25px;
      left: 0;
      width: 100%;
      height: 50px;
      z-index: 1;
    }
    .timeline-line {
      stroke: var(--blue);
      stroke-width: 2;
      stroke-dasharray: 1200;
      stroke-dashoffset: 1200;
      opacity: 0.4;
    }
    .timeline-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    .timeline-step {
      flex: 1;
      text-align: center;
      padding: 0 15px;
      opacity: 0;
      transform: translateY(20px);
    }
    .step-dot {
      width: 50px;
      height: 50px;
      background: var(--charcoal);
      border: 2px solid var(--blue);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-weight: 800;
      color: #fff;
      position: relative;
      box-shadow: 0 0 15px rgba(74,128,232,0.2);
    }
    .step-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; }
    .step-text { font-size: 0.875rem; color: rgba(255,255,255,0.6); line-height: 1.6; }

    @media (max-width: 767px) {
      .timeline-steps { flex-direction: column; gap: 40px; }
      .timeline-svg { display: none; }
      .timeline-step { padding: 0; }
    }
```

- [ ] **Step 3: Verify basic appearance**

Run: `ls business.html`
Manual Check: Refresh preview server to see static layout in charcoal section.

- [ ] **Step 4: Commit**

```bash
git add business.html
git commit -m "feat: add onboarding timeline HTML and CSS structure"
```

---

### Task 2: Canvas Particle System

**Files:**
- Modify: `business.html:520` (Inside a new script tag)

- [ ] **Step 1: Implement the Particle class and animation loop**

```javascript
    (function() {
      const canvas = document.getElementById('onboardingCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let particles = [];

      function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      class Particle {
        constructor() {
          this.init();
        }
        init() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.3;
          this.vy = (Math.random() - 0.5) * 0.3;
          this.size = Math.random() * 1.5 + 0.5;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
          ctx.fillStyle = 'rgba(74, 128, 232, 0.4)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      function init() {
        resize();
        particles = [];
        for(let i = 0; i < 40; i++) particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        requestAnimationFrame(animate);
      }

      window.addEventListener('resize', init);
      init();
      animate();
    })();
```

- [ ] **Step 2: Verify particles are moving**

Run: Refresh preview server.
Expected: Subtle blue particles floating in the background of the "Our Process" section.

- [ ] **Step 3: Commit**

```bash
git add business.html
git commit -m "feat: implement canvas particle system for onboarding background"
```

---

### Task 3: Triggering Animations (Intersection Observer)

**Files:**
- Modify: `business.html` (Append to the script)

- [ ] **Step 1: Add Intersection Observer to trigger SVG and Step animations**

```javascript
      const observerOptions = { threshold: 0.3 };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate SVG line
            const line = document.getElementById('timelineLine');
            if (line) {
              line.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
              line.style.strokeDashoffset = '0';
            }
            
            // Staggered step entry
            document.querySelectorAll('.timeline-step').forEach((step, i) => {
              setTimeout(() => {
                step.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
              }, i * 200);
            });
            
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observer.observe(document.querySelector('.onboarding'));
```

- [ ] **Step 2: Add hover glow effect to dots in CSS**

```css
    .step-dot:hover {
      border-color: var(--blue-2);
      box-shadow: 0 0 25px rgba(74,128,232,0.5);
      transform: scale(1.1);
      transition: all 0.3s ease;
    }
```

- [ ] **Step 3: Verify animations trigger on scroll**

Run: Refresh preview server, scroll down.
Expected: The line draws across and steps fade in one-by-one.

- [ ] **Step 4: Commit**

```bash
git add business.html
git commit -m "feat: add intersection observer and staggered animations for onboarding"
```

---

### Task 4: Cleanup

**Files:**
- Delete: `onboarding-mockup.html`
- Delete: `cinematic-variations.html`

- [ ] **Step 1: Remove temporary mockup files**

Run: `rm onboarding-mockup.html cinematic-variations.html`

- [ ] **Step 2: Commit**

```bash
git commit -am "cleanup: remove temporary mockup files"
```
