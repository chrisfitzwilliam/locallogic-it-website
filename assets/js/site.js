(function () {
  var LANDING_REF_WIDTH = 1440;
  var landingTransitionActive = false;

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

  function isSameDocumentHash(url) {
    return url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      Boolean(url.hash);
  }

  function isLandingUrl(url) {
    var path = url.pathname.replace(/\/+$/, '');
    return path === '' || path.endsWith('/index.html') || path === window.location.pathname.replace(/\/index\.html$/, '');
  }

  function isHomeLogoLink(link, url) {
    return Boolean(link.closest('.nav-logo')) && isLandingUrl(url);
  }

  function landingSideFromUrl(url) {
    if (/\/residential\.html$/.test(url.pathname)) return 'residential';
    if (/\/business\.html$/.test(url.pathname)) return 'business';
    return '';
  }

  function fetchDocument(url) {
    return fetch(url.href, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Page request failed: ' + response.status);
        return response.text();
      })
      .then(function (html) {
        return new DOMParser().parseFromString(html, 'text/html');
      });
  }

  function clearElementIds(root) {
    if (!root) return;
    root.removeAttribute('id');
    root.querySelectorAll('[id]').forEach(function (node) {
      node.removeAttribute('id');
    });
  }

  function lockedPillRect() {
    var isNarrow = window.matchMedia('(max-width: 767px)').matches;
    var inset = isNarrow ? 10 : 14;
    return {
      top: isNarrow ? 10 : 12,
      left: inset,
      width: Math.min(isNarrow ? 270 : 306, window.innerWidth - (inset * 2)),
      height: isNarrow ? 58 : 60
    };
  }

  function animateLandingExit(side) {
    var nav = document.querySelector('.landing-page .nav.is-pill');
    if (!nav || !nav.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return Promise.resolve();
    }

    var source = nav.getBoundingClientRect();
    var target = lockedPillRect();
    var ghost = nav.cloneNode(true);
    clearElementIds(ghost);
    ghost.setAttribute('aria-hidden', 'true');
    ghost.classList.add('landing-pill-ghost', 'landing-pill-ghost--' + side);
    ghost.style.position = 'fixed';
    ghost.style.top = source.top + 'px';
    ghost.style.left = source.left + 'px';
    ghost.style.right = 'auto';
    ghost.style.width = source.width + 'px';
    ghost.style.height = source.height + 'px';
    ghost.style.minHeight = source.height + 'px';
    ghost.style.margin = '0';
    ghost.style.zIndex = '1000';
    ghost.style.pointerEvents = 'none';
    ghost.style.transformOrigin = 'top left';
    ghost.style.transform = 'translate3d(0, 0, 0) scale(1)';
    document.body.appendChild(ghost);

    nav.classList.add('is-leaving-landing');

    window.setTimeout(function () {
      ghost.classList.add('is-compact');
    }, 130);

    var dx = target.left - source.left;
    var dy = target.top - source.top;
    var sx = target.width / source.width;
    var sy = target.height / source.height;
    var lift = window.matchMedia('(max-width: 767px)').matches ? 5 : 8;

    var animation = ghost.animate([
      {
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'saturate(1)'
      },
      {
        transform: 'translate3d(' + Math.round(dx * 0.62) + 'px, ' + Math.round(dy - lift) + 'px, 0) scale(' + (sx + 0.08) + ', ' + (sy + 0.05) + ')',
        filter: 'saturate(1.06)',
        offset: 0.72
      },
      {
        transform: 'translate3d(' + Math.round(dx) + 'px, ' + Math.round(dy) + 'px, 0) scale(' + (sx * 0.96) + ', ' + (sy * 0.96) + ')',
        filter: 'saturate(1.12)',
        offset: 0.88
      },
      {
        transform: 'translate3d(' + Math.round(dx) + 'px, ' + Math.round(dy) + 'px, 0) scale(' + sx + ', ' + sy + ')',
        filter: 'saturate(1.04)'
      }
    ], {
      duration: 760,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });

    return animation.finished.catch(function () {}).then(function () {
      ghost.classList.add('is-clicked');
      return new Promise(function (resolve) {
        window.setTimeout(function () {
          ghost.remove();
          nav.classList.remove('is-leaving-landing');
          resolve();
        }, 110);
      });
    });
  }

  function replacePageShell(doc, targetUrl, options) {
    options = options || {};

    var newNav = doc.querySelector('.nav');
    var newMain = doc.querySelector('main');
    var oldNav = document.querySelector('.nav');
    var oldMain = document.querySelector('main');

    if (!newNav || !newMain || !oldNav || !oldMain) {
      window.location.href = targetUrl.href;
      return;
    }

    document.title = doc.title;
    document.body.className = doc.body.className;

    if (options.arrivalSide) {
      document.body.classList.add('is-arriving-from-landing', 'is-arriving-' + options.arrivalSide);
    }

    oldNav.replaceWith(newNav.cloneNode(true));
    oldMain.replaceWith(newMain.cloneNode(true));

    if (options.pushState) {
      history.pushState({ localLogicAjax: true }, doc.title, targetUrl.href);
    }

    initMobileMenus();
    initLandingPage();

    if (options.arrivalSide) {
      runLandingArrival(options.arrivalSide, targetUrl.hash);
    } else {
      scrollToTarget(targetUrl.hash);
    }
  }

  function scrollToTarget(hash) {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    var target = document.querySelector(hash);
    if (target) target.scrollIntoView();
  }

  function runLandingArrival(side, hash) {
    var isKnownSide = side === 'residential' || side === 'business';
    if (!isKnownSide || !document.body.classList.contains(side + '-page')) return;

    sessionStorage.removeItem('fromLanding');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.remove('is-arriving-from-landing', 'is-arriving-' + side, 'has-arrived');
      scrollToTarget(hash);
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('has-arrived');
        window.setTimeout(function () {
          scrollToTarget(hash);
        }, 260);
      });
    });

    window.setTimeout(function () {
      document.body.classList.remove('is-arriving-from-landing', 'is-arriving-' + side, 'has-arrived');
    }, 1250);
  }

  function navigateFromLanding(url, side) {
    if (landingTransitionActive) return;
    landingTransitionActive = true;
    sessionStorage.setItem('fromLanding', side);

    var targetUrl = new URL(url, window.location.href);
    var pageRequest = fetchDocument(targetUrl);
    var exitAnimation = animateLandingExit(side);

    Promise.all([pageRequest, exitAnimation])
      .then(function (result) {
        replacePageShell(result[0], targetUrl, {
          pushState: true,
          arrivalSide: side
        });
      })
      .catch(function () {
        window.location.href = targetUrl.href;
      })
      .finally(function () {
        landingTransitionActive = false;
      });
  }

  function selectLandingHalf(half) {
    var chooser = document.getElementById('chooser');
    if (!chooser || chooser.classList.contains('has-selection')) return;

    var dest = half.dataset.href;
    var side = half.classList.contains('half--residential') ? 'residential' : 'business';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    chooser.classList.add('has-selection', 'selecting-' + side);
    half.classList.add('is-selected', 'is-clicked');
    scaleLandingPreview(half);
    sessionStorage.setItem('fromLanding', side);

    if (reduceMotion) {
      window.location.href = dest;
      return;
    }

    navigateFromLanding(dest, side);
  }

  function scaleLandingPreview(half) {
    var iframe = half.querySelector('.half-preview');
    if (!iframe) return;

    var width = half.offsetWidth;
    var height = half.offsetHeight;
    var scale = width / LANDING_REF_WIDTH;

    iframe.style.width = LANDING_REF_WIDTH + 'px';
    iframe.style.height = Math.ceil(height / scale) + 'px';
    iframe.style.transform = 'scale(' + scale + ')';
  }

  function resetLandingState() {
    var chooser = document.getElementById('chooser');
    if (!chooser) return;

    chooser.classList.remove('has-selection', 'selecting-residential', 'selecting-business');
    document.querySelectorAll('.half').forEach(function (half) {
      half.classList.remove('is-selected', 'is-clicked');
      half.removeAttribute('style');
      scaleLandingPreview(half);
    });

    var nav = document.querySelector('.landing-page .nav');
    if (nav) {
      nav.classList.add('is-pill');
      nav.classList.remove('is-leaving-landing');
    }
  }

  function initLandingPage() {
    if (!document.body.classList.contains('landing-page')) return;

    document.querySelectorAll('.half').forEach(function (half) {
      scaleLandingPreview(half);
      if (half.dataset.localLogicLandingBound === 'true') return;

      half.dataset.localLogicLandingBound = 'true';
      half.addEventListener('click', function () {
        selectLandingHalf(half);
      });
      half.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectLandingHalf(half);
        }
      });
    });
  }

  function initLandingArrival() {
    var side = sessionStorage.getItem('fromLanding');
    var isKnownSide = side === 'residential' || side === 'business';
    if (!isKnownSide || !document.body || !document.body.classList.contains('site-page')) return;

    document.body.classList.add('is-arriving-from-landing', 'is-arriving-' + side);
    runLandingArrival(side, window.location.hash);
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

  var Router = {
    init: function () {
      document.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (!link || !link.href) return;

        var url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (link.hasAttribute('download') || link.target === '_blank') return;
        if (isSameDocumentHash(url)) return;
        if (isHomeLogoLink(link, url)) return;

        var side = landingSideFromUrl(url);
        if (document.body.classList.contains('landing-page') && side) {
          event.preventDefault();
          navigateFromLanding(url.href, side);
        }
      });

      window.addEventListener('popstate', function () {
        window.location.href = window.location.href;
      });
    }
  };

  window.closeMobileMenu = closeAllMobileMenus;
  window.LocalLogicLanding = {
    init: initLandingPage,
    reset: resetLandingState,
    select: selectLandingHalf,
    scalePreview: scaleLandingPreview
  };
  window.LocalLogicTransitions = {
    navigateFromLanding: navigateFromLanding,
    animateLandingExit: animateLandingExit,
    replacePageShell: replacePageShell
  };

  document.addEventListener('DOMContentLoaded', function () {
    Router.init();
    initMobileMenus();
    initLandingArrival();
    initLandingPage();
  });

  window.addEventListener('resize', function () {
    if (document.body.classList.contains('landing-page')) {
      document.querySelectorAll('.half').forEach(scaleLandingPreview);
    }
  });

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) resetLandingState();
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav')) closeAllMobileMenus();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAllMobileMenus();
  });
}());
