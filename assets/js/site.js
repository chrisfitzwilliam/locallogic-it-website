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

  window.closeMobileMenu = closeAllMobileMenus;

  document.addEventListener('DOMContentLoaded', initMobileMenus);
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav')) closeAllMobileMenus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAllMobileMenus();
  });
}());
