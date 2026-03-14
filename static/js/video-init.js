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
          if (!video) {
            return;
          }

          var player = new Plyr(video, {
            ratio: "16:9",
            controls: [
              "play-large",
              "play",
              "progress",
              "current-time",
              "mute",
              "volume",
              "settings",
              "fullscreen",
            ],
            muted: true,
            autoplay: false,
            loop: { active: false, showToggle: false },
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
            keyboard: { focused: true, global: false },
            tooltips: { controls: true, seek: true },
            loadSprite: true,
            iconPrefix: "plyr",
            blankVideo: "",
            quality: {
              default: 576,
              options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
            },
            disableContextMenu: true,
            hideControls: true,
            resetOnEnd: false,
            invertTime: true,
            toggleInvert: true,
            clickToPlay: true,
          });
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
