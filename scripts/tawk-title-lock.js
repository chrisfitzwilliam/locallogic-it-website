(function () {
  var fixedTitle = document.title;
  var titleElement = document.querySelector('title');
  var restoring = false;

  function restoreTitle() {
    if (!fixedTitle || document.title === fixedTitle || restoring) return;
    restoring = true;
    document.title = fixedTitle;
    window.setTimeout(function () {
      restoring = false;
    }, 0);
  }

  if (titleElement && window.MutationObserver) {
    var observer = new MutationObserver(restoreTitle);
    observer.observe(titleElement, { childList: true, characterData: true, subtree: true });
  }

  window.addEventListener('focus', restoreTitle);
  window.setInterval(restoreTitle, 1000);

  function installTawkGuards(api) {
    if (!api) return;
    var previousOnLoad = api.onLoad;
    if (previousOnLoad && previousOnLoad.__localLogicTitleGuard) return;

    api.onLoad = function () {
      if (typeof previousOnLoad === 'function') previousOnLoad();
      if (typeof api.minimize === 'function') api.minimize();
      restoreTitle();
    };
    api.onLoad.__localLogicTitleGuard = true;

    api.onChatMaximized = function () {
      restoreTitle();
      if (!window.LocalLogicTawkUserOpen && typeof api.minimize === 'function') {
        api.minimize();
      }
      window.LocalLogicTawkUserOpen = false;
    };
    api.onChatMinimized = restoreTitle;
    api.onChatHidden = restoreTitle;
    api.onUnreadCountChanged = restoreTitle;
  }

  window.LocalLogicOpenTawk = function () {
    window.LocalLogicTawkUserOpen = true;
    window.Tawk_API = window.Tawk_API || {};
    if (typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.maximize();
    }
    restoreTitle();
  };

  window.LocalLogicInstallTawkGuards = installTawkGuards;
  window.Tawk_API = window.Tawk_API || {};
  installTawkGuards(window.Tawk_API);
}());
