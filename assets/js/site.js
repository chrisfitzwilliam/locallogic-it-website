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
    initMobileMenus();
    initLandingArrival();
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav')) closeAllMobileMenus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAllMobileMenus();
  });
}());
