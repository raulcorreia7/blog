(function () {
  var SELECTOR = ".asciinema-embed[data-cast-url]";

  function toBool(value) {
    return value === "true" || value === "1";
  }

  function initializePlayers() {
    if (typeof AsciinemaPlayer === "undefined") {
      return false;
    }

    var nodes = document.querySelectorAll(SELECTOR);
    nodes.forEach(function (node) {
      if (node.dataset.initialized === "true") {
        return;
      }

      AsciinemaPlayer.create(node.dataset.castUrl, node, {
        rows: Number(node.dataset.rows || 24),
        autoplay: toBool(node.dataset.autoplay),
        loop: toBool(node.dataset.loop),
        preload: toBool(node.dataset.preload),
      });

      node.dataset.initialized = "true";
    });

    return true;
  }

  if (!window.ContentTools) {
    console.error("[asciinema] ContentTools runtime not found.");
    return;
  }

  window.ContentTools.register({
    name: "asciinema",
    init: function () {
      return window.ContentTools.waitFor(
        function () {
          return typeof AsciinemaPlayer !== "undefined";
        },
        { attempts: 50, delayMs: 100 }
      ).then(function () {
        initializePlayers();
      });
    },
  });
})();
