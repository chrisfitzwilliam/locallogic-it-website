(function () {
  function setMenuState(button, menu, isOpen) {
    menu.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  function closeAllMobileMenus() {
    document.querySelectorAll('.nav').forEach(function (nav) {
      var button = nav.querySelector('.nav-hamburger');
      var menu = nav.querySelector('.nav-mobile-menu');
      if (button && menu) setMenuState(button, menu, false);
    });
  }

  var Router = {
    init: function () {
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link || !link.href) return;

        var url = new URL(link.href);
        if (url.origin !== window.location.origin) return;
        if (link.hasAttribute('download') || link.target === '_blank') return;

        // Don't intercept if it's just an anchor on the same page
        if (url.pathname === window.location.pathname && url.hash) return;

        e.preventDefault();
        Router.navigate(link.href);
      });

      window.addEventListener('popstate', function () {
        Router.loadPage(window.location.href, true);
      });
    },

    navigate: function (url) {
      if (url === window.location.href) return;
      Router.loadPage(url, false);
    },

    loadPage: function (url, isPopState) {
      var isLanding = url.endsWith('index.html') || url.endsWith('/');
      var side = sessionStorage.getItem('fromLanding');

      // Start transition
      document.body.classList.add('is-transitioning');

      var nav = document.querySelector('.nav');
      if (nav) {
        if (!isLanding) {
          nav.classList.add('is-locked');
          nav.classList.remove('is-pill');
        } else {
          nav.classList.add('is-pill');
          nav.classList.remove('is-locked');
        }
      }

      fetch(url)
        .then(function (response) { return response.text(); })
        .then(function (html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var newMain = doc.querySelector('main');
          var newTitle = doc.title;
          var newBodyClass = doc.body.className;

          if (!isPopState) {
            history.pushState(null, newTitle, url);
          }

          document.title = newTitle;

          // Animate out current content
          var currentMain = document.querySelector('main');
          currentMain.style.opacity = '0';
          currentMain.style.transform = 'translateY(10px)';
          currentMain.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

          setTimeout(function () {
            currentMain.innerHTML = newMain.innerHTML;
            document.body.className = newBodyClass;

            // Re-run initializations
            initMobileMenus();
            if (isLanding) {
              if (typeof initLandingPage === 'function') initLandingPage();
            } else {
              // Expand nav if we are arriving at a hub
              if (nav) {
                nav.classList.remove('is-locked');
                nav.classList.remove('is-pill');
              }
            }

            currentMain.style.opacity = '1';
            currentMain.style.transform = 'none';
            document.body.classList.remove('is-transitioning');

            // Scroll to top or anchor
            var hash = new URL(url).hash;
            if (hash) {
              var target = document.querySelector(hash);
              if (target) target.scrollIntoView();
            } else {
              window.scrollTo(0, 0);
            }
          }, 400);
        });
    }
  };

  function initMobileMenus() {
    document.querySelectorAll('.nav').forEach(function (nav) {
      var button = nav.querySelector('.nav-hamburger');
      var menu = nav.querySelector('.nav-mobile-menu');
      if (!button || !menu || button.dataset.localLogicBound === 'true') return;

      button.dataset.localLogicBound = 'true';
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        setMenuState(button, menu, !menu.classList.contains('open'));
      });

      menu.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    });
  }

  function initLandingArrival() {
    var side = sessionStorage.getItem('fromLanding');
    var isKnownSide = side === 'residential' || side === 'business';
    if (!isKnownSide || !document.body || !document.body.classList.contains('site-page')) return;

    sessionStorage.removeItem('fromLanding');
    if (!document.body.classList.contains(side + '-page')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.classList.add('is-arriving-from-landing', 'is-arriving-' + side);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('has-arrived');
      });
    });

    window.setTimeout(function () {
      document.body.classList.remove('is-arriving-from-landing', 'is-arriving-' + side, 'has-arrived');
    }, 1100);
  }

  window.closeMobileMenu = closeAllMobileMenus;

  document.addEventListener('DOMContentLoaded', function () {
    Router.init();
    initMobileMenus();
    initLandingArrival();
    if (document.body.classList.contains('landing-page')) {
      if (typeof initLandingPage === 'function') initLandingPage();
    }
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav')) closeAllMobileMenus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAllMobileMenus();
  });
}());
