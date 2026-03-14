(function () {
  var SELECTOR = ".video-wrapper";
  var plyrPromise = null;

  function loadPlyr() {
    if (!plyrPromise) {
      plyrPromise = import("https://cdn.jsdelivr.net/npm/plyr@3/+esm").then(function (mod) {
        return mod.default;
      });
    }
    return plyrPromise;
  }

  function init() {
    var wrappers = document.querySelectorAll(SELECTOR);
    if (wrappers.length === 0) {
      return;
    }

    loadPlyr()
      .then(function (Plyr) {
        wrappers.forEach(function (wrapper) {
          if (wrapper.dataset.videoInit === "true") {
            return;
          }

          wrapper.dataset.videoInit = "true";

          var video = wrapper.querySelector("video");
          var expandBtn = wrapper.querySelector(".video-expand-btn");

          if (video) {
            var player = new Plyr(video, {
              controls: [
                "play-large",
                "play",
                "progress",
                "current-time",
                "duration",
                "mute",
                "volume",
                "settings",
                "fullscreen",
              ],
              muted: true,
              hideControls: false,
              clickToPlay: true,
              resetOnEnd: false,
              invertTime: true,
              toggleInvert: true,
              ratio: "16:9",
              settings: ["quality", "speed"],
              speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
              keyboard: { focused: true, global: false },
              tooltips: { controls: true, seek: true },
            });

            player.on("ready", function () {
              wrapper.classList.add("loaded");
            });

            wrapper.addEventListener("plyr:init", function () {
              wrapper.classList.add("loaded");
            });

            if (expandBtn) {
              expandBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                var currentScale = parseFloat(wrapper.dataset.videoScale) || 1;
                var newScale = currentScale === 1 ? 1.25 : 1;

                if (newScale === 1) {
                  wrapper.classList.add("contracting");
                  wrapper.addEventListener("animationend", function handler() {
                    wrapper.classList.remove("contracting");
                    wrapper.removeEventListener("animationend", handler);
                  });
                }

                wrapper.dataset.videoScale = newScale;
              });
            }
          }
        });
      })
      .catch(function (error) {
        console.error("[video] Plyr init failed:", error);
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
