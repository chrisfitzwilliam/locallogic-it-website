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
    var inset = isNarrow ? 8 : 10;
    return {
      top: isNarrow ? 8 : 7,
      left: inset,
      width: Math.min(isNarrow ? 246 : 284, window.innerWidth - (inset * 2)),
      height: isNarrow ? 54 : 54
    };
  }

  function syncPageInlineStyle(doc) {
    var incomingStyle = doc.head ? doc.head.querySelector('style') : null;
    var currentStyle = document.head ? document.head.querySelector('style') : null;
    if (!incomingStyle || !currentStyle) return;

    currentStyle.textContent = incomingStyle.textContent;
  }

  function animateLandingExit(side) {
    var nav = document.querySelector('.landing-page .nav.is-pill');
    if (!nav || !nav.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return Promise.resolve(null);
    }

    var source = nav.getBoundingClientRect();
    var target = lockedPillRect();
    var sourceCompactLeft = source.left + ((source.width - target.width) / 2);
    var sourceCompactTop = source.top + ((source.height - target.height) / 2);
    var dx = sourceCompactLeft - target.left;
    var dy = sourceCompactTop - target.top;
    var surfaceScaleX = Math.min(1.18, Math.max(1, source.width / target.width));
    var ghost = nav.cloneNode(true);
    var surface = document.createElement('span');
    var pagewash = document.createElement('span');
    var sweep = document.createElement('span');

    clearElementIds(ghost);
    surface.className = 'landing-pill-ghost-surface';
    pagewash.className = 'landing-pill-ghost-pagewash';
    sweep.className = 'landing-pill-ghost-sweep';
    surface.setAttribute('aria-hidden', 'true');
    pagewash.setAttribute('aria-hidden', 'true');
    sweep.setAttribute('aria-hidden', 'true');
    ghost.prepend(sweep);
    ghost.prepend(pagewash);
    ghost.prepend(surface);

    ghost.setAttribute('aria-hidden', 'true');
    ghost.classList.add('landing-pill-ghost', 'landing-pill-ghost--' + side);
    ghost.style.position = 'fixed';
    ghost.style.top = target.top + 'px';
    ghost.style.left = target.left + 'px';
    ghost.style.right = 'auto';
    ghost.style.width = target.width + 'px';
    ghost.style.height = target.height + 'px';
    ghost.style.minHeight = target.height + 'px';
    ghost.style.margin = '0';
    ghost.style.zIndex = '1000';
    ghost.style.pointerEvents = 'none';
    ghost.style.transformOrigin = 'center center';
    ghost.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0)';
    document.body.appendChild(ghost);

    nav.classList.add('is-leaving-landing');
    ghost.classList.add('is-compact');
    ghost.getBoundingClientRect();

    var animation = ghost.animate([
      {
        transform: 'translate3d(' + Math.round(dx) + 'px, ' + Math.round(dy) + 'px, 0) scale(1)',
        filter: 'saturate(1) brightness(1)'
      },
      {
        transform: 'translate3d(' + Math.round(dx * 0.9) + 'px, ' + Math.round((dy * 0.78) - 8) + 'px, 0) scale(1.006)',
        filter: 'saturate(1.04) brightness(1.02)',
        offset: 0.24
      },
      {
        transform: 'translate3d(' + Math.round(dx * 0.48) + 'px, ' + Math.round((dy * 0.34) - 16) + 'px, 0) scale(1.012)',
        filter: 'saturate(1.1) brightness(1.035)',
        offset: 0.62
      },
      {
        transform: 'translate3d(' + Math.round(dx * 0.08) + 'px, -8px, 0) scale(1.008)',
        filter: 'saturate(1.14) brightness(1.035)',
        offset: 0.88
      },
      {
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'saturate(1.08) brightness(1.02)'
      }
    ], {
      duration: 1040,
      easing: 'cubic-bezier(0.34, 0.02, 0.18, 1)',
      fill: 'forwards'
    });

    surface.animate([
      {
        transform: 'scaleX(' + surfaceScaleX.toFixed(3) + ')',
        filter: 'saturate(1) brightness(1)'
      },
      {
        transform: 'scaleX(' + Math.max(1.06, surfaceScaleX * 0.88).toFixed(3) + ')',
        filter: 'saturate(1.08) brightness(1.025)',
        offset: 0.24
      },
      {
        transform: 'scaleX(1.03)',
        filter: 'saturate(1.14) brightness(1.04)',
        offset: 0.58
      },
      {
        transform: 'scaleX(1)',
        filter: 'saturate(1.1) brightness(1.02)'
      }
    ], {
      duration: 900,
      easing: 'cubic-bezier(0.34, 0.02, 0.18, 1)',
      fill: 'forwards'
    });

    pagewash.animate([
      { opacity: 0 },
      { opacity: 0.18, offset: 0.34 },
      { opacity: 0.72, offset: 0.78 },
      { opacity: 0.96 }
    ], {
      duration: 1040,
      easing: 'cubic-bezier(0.22, 0.02, 0.16, 1)',
      fill: 'forwards'
    });

    sweep.animate([
      { opacity: 0, transform: 'translate3d(-150%, 0, 0) skewX(-16deg)' },
      { opacity: 0.7, transform: 'translate3d(-58%, 0, 0) skewX(-16deg)', offset: 0.24 },
      { opacity: 0.9, transform: 'translate3d(42%, 0, 0) skewX(-16deg)', offset: 0.68 },
      { opacity: 0, transform: 'translate3d(150%, 0, 0) skewX(-16deg)' }
    ], {
      duration: 1040,
      easing: 'cubic-bezier(0.22, 0.02, 0.16, 1)',
      fill: 'forwards'
    });

    return animation.finished.catch(function () {}).then(function () {
      ghost.classList.add('is-clicked');
      var clickAnimation = ghost.animate([
        { transform: 'translate3d(0, 0, 0) scale(1)', filter: 'saturate(1.08) brightness(1.02)' },
        { transform: 'translate3d(0, 1px, 0) scale(0.992)', filter: 'saturate(1.18) brightness(1.06)', offset: 0.46 },
        { transform: 'translate3d(0, 0, 0) scale(1)', filter: 'saturate(1.1) brightness(1.025)' }
      ], {
        duration: 180,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'forwards'
      });

      surface.animate([
        { transform: 'scaleX(1) scaleY(1)' },
        { transform: 'scaleX(0.986) scaleY(0.965)', offset: 0.44 },
        { transform: 'scaleX(1) scaleY(1)' }
      ], {
        duration: 180,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'forwards'
      });

      return clickAnimation.finished.catch(function () {}).then(function () {
        return {
          ghost: ghost,
          sourceNav: nav
        };
      });
    });
  }

  function releaseLandingGhost(handoff) {
    if (!handoff || !handoff.ghost) return;

    var ghost = handoff.ghost;
    ghost.classList.add('is-handing-off');

    var fade = ghost.animate([
      { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
      { opacity: 0, transform: 'translate3d(0, 0, 0) scale(0.998)' }
    ], {
      duration: 220,
      easing: 'ease',
      fill: 'forwards'
    });

    fade.finished.catch(function () {}).then(function () {
      ghost.remove();
      if (handoff.sourceNav) handoff.sourceNav.classList.remove('is-leaving-landing');
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

    syncPageInlineStyle(doc);
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
        var handoff = result[1];

        replacePageShell(result[0], targetUrl, {
          pushState: true,
          arrivalSide: side
        });

        window.setTimeout(function () {
          releaseLandingGhost(handoff);
        }, 190);
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
