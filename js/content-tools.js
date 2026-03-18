(function () {
  var THEME_ATTR = "data-theme";
  var plugins = [];
  var started = false;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function currentTheme() {
    var value = document.documentElement.getAttribute(THEME_ATTR);
    return value === "light" ? "light" : "dark";
  }

  function runPlugin(plugin, hook) {
    var fn = plugin[hook];
    if (typeof fn !== "function") {
      return;
    }

    Promise.resolve()
      .then(function () {
        return fn();
      })
      .catch(function (error) {
        console.error("[content-tools] " + plugin.name + " (" + hook + ") failed:", error);
      });
  }

  function start() {
    if (started) {
      return;
    }

    started = true;

    plugins.forEach(function (plugin) {
      runPlugin(plugin, "init");
    });

    new MutationObserver(function (mutations) {
      var themeChanged = mutations.some(function (mutation) {
        return mutation.type === "attributes" && mutation.attributeName === THEME_ATTR;
      });

      if (!themeChanged) {
        return;
      }

      plugins.forEach(function (plugin) {
        runPlugin(plugin, "onThemeChange");
      });
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: [THEME_ATTR],
    });
  }

  function register(plugin) {
    if (!plugin || typeof plugin.name !== "string" || typeof plugin.init !== "function") {
      throw new Error("Invalid plugin registration.");
    }

    plugins.push(plugin);

    if (started) {
      runPlugin(plugin, "init");
    }
  }

  function waitFor(check, options) {
    var config = options || {};
    var attempts = Number(config.attempts || 50);
    var delayMs = Number(config.delayMs || 100);

    return new Promise(function (resolve, reject) {
      var count = 0;

      function tryNow() {
        count += 1;

        var value = check();
        if (value) {
          resolve(value);
          return;
        }

        if (count >= attempts) {
          reject(new Error("waitFor timeout"));
          return;
        }

        window.setTimeout(tryNow, delayMs);
      }

      tryNow();
    });
  }

  window.ContentTools = {
    currentTheme: currentTheme,
    register: register,
    waitFor: waitFor,
  };

  onReady(start);
})();
