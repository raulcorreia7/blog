(function () {
  var SELECTOR = ".video-wrapper";

  function init() {
    document.querySelectorAll(SELECTOR).forEach(function (wrapper) {
      if (wrapper.dataset.videoInit === "true") {
        return;
      }

      wrapper.dataset.videoInit = "true";
      wrapper.classList.add("loaded");
    });
  }

  if (!window.ContentTools) {
    console.error("[video] ContentTools runtime not found.");
    return;
  }

  window.ContentTools.register({
    name: "video",
    init: init,
    onThemeChange: function () {},
  });
})();
