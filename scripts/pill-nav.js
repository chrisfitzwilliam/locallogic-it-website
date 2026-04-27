/* ═══════════════════════════════════════════════════
   Pill Nav — Shared Component Script
   Used by: index.html, residential.html, business.html
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  var shell = document.getElementById('quartz-shell');
  if (!shell) return;

  // ── Iframe Detection ──
  if (window.self !== window.top) {
    document.body.classList.add('is-iframe');
    return; // Skip all nav logic inside iframes
  }

  // ── Core References ──
  var navLinksContainer = document.getElementById('main-nav-links');
  var indicator = document.getElementById('nav-indicator');
  var hamburgerBtn = document.getElementById('pill-hamburger');
  var mobileMenu = document.getElementById('pill-mobile-menu');
  var dropdown = document.getElementById('services-dropdown');
  var isLanding = shell.getAttribute('data-pill-position') === 'center';

  // ── Glint Mouse-Follow ──
  shell.addEventListener('mousemove', function (e) {
    var rect = shell.getBoundingClientRect();
    shell.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
    shell.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
  });

  // ── Expansion ──
  function expandPill() {
    if (window.innerWidth > 767) {
      shell.classList.add('is-expanded');
    }
  }

  if (isLanding) {
    // Landing page: expand after entrance animation completes
    document.body.classList.add('is-loaded');
    setTimeout(expandPill, 1200);
  } else {
    // Service pages: arrive already expanded
    document.body.classList.add('is-loaded');
    // Small delay to let the View Transition settle before expanding
    setTimeout(expandPill, 100);
  }

  // ── Hamburger Toggle ──
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Dropdown Toggle ──
  var dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function (dd) {
    dd.addEventListener('click', function (e) {
      e.stopPropagation();
      // Close other dropdowns
      dropdowns.forEach(function (other) {
        if (other !== dd) other.classList.remove('is-open');
      });
      dd.classList.toggle('is-open');
    });
  });

  document.addEventListener('click', function () {
    dropdowns.forEach(function (dd) {
      dd.classList.remove('is-open');
    });
  });

  // ── Sliding Indicator Logic ──
  if (navLinksContainer && indicator) {
    var triggers = navLinksContainer.querySelectorAll('a, .dropdown-trigger');

    function moveIndicator(target) {
      if (!target) return;
      var rect = target.getBoundingClientRect();
      var parentRect = navLinksContainer.getBoundingClientRect();

      indicator.style.width = rect.width + 'px';
      indicator.style.height = rect.height + 'px';
      indicator.style.left = (rect.left - parentRect.left) + 'px';
      indicator.style.top = (rect.top - parentRect.top) + 'px';
      indicator.style.opacity = '1';
    }

    function updateActiveIndicator() {
      var activeItem = navLinksContainer.querySelector('.active') ||
                       navLinksContainer.querySelector('.dropdown.active .dropdown-trigger');
      if (activeItem) {
        moveIndicator(activeItem.classList.contains('dropdown-trigger') ? activeItem : activeItem);
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('mouseenter', function () { moveIndicator(trigger); });
    });

    navLinksContainer.addEventListener('mouseleave', function () {
      updateActiveIndicator();
    });

    // Wait for expansion animation to finish before positioning indicator
    var indicatorDelay = isLanding ? 1500 : 400;
    setTimeout(updateActiveIndicator, indicatorDelay);
  }

  // ── Back-Button bfcache Restoration ──
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      // Reset landing chooser if present
      var chooser = document.getElementById('chooser');
      if (chooser) {
        chooser.classList.remove('has-selection');
        document.querySelectorAll('.half').forEach(function (h) {
          h.classList.remove('is-selecting');
          h.style.transform = '';
          h.style.transition = '';
          h.style.borderRadius = '';
        });
      }

      // Reset pill state
      shell.classList.remove('is-expanded', 'is-docking');
      shell.style.transform = '';
      shell.style.opacity = '';
      shell.style.left = '';
      shell.style.top = '';

      // Force re-animation
      document.body.classList.remove('is-loaded');
      void document.body.offsetWidth;
      document.body.classList.add('is-loaded');

      if (isLanding) {
        setTimeout(expandPill, 1200);
      } else {
        setTimeout(expandPill, 100);
      }
    }
  });

}());
