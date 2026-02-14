(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ICONS = {
    idle: '<i class="fa-regular fa-copy far" aria-hidden="true"></i>',
    copied: '<i class="fa-solid fa-check fas" aria-hidden="true"></i>',
    error: '<i class="fa-solid fa-xmark fas" aria-hidden="true"></i>',
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        var didCopy = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!didCopy) {
          reject(new Error("execCommand returned false"));
          return;
        }

        resolve();
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  }

  function renderFontAwesomeIcons(root) {
    if (
      !window.FontAwesome ||
      !window.FontAwesome.dom ||
      typeof window.FontAwesome.dom.i2svg !== "function"
    ) {
      return;
    }

    window.FontAwesome.dom.i2svg({
      node: root || document.body,
    });
  }

  function setCopyState(button, state) {
    var nextState = state === "copied" || state === "error" ? state : "idle";
    var label = "Copy code block";
    if (nextState === "copied") {
      label = "Copied";
    } else if (nextState === "error") {
      label = "Copy failed";
    }

    button.dataset.copyState = nextState;
    button.innerHTML = ICONS[nextState];
    button.setAttribute("aria-label", label);
    button.title = label;
    renderFontAwesomeIcons(button);
  }

  function setupHeadingAnchors() {
    var headings = document.querySelectorAll(
      ".article__content h2[id], .article__content h3[id], .article__content h4[id]"
    );
    headings.forEach(function (heading) {
      if (heading.querySelector(".heading-anchor")) {
        return;
      }

      var anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = "#" + heading.id;
      anchor.setAttribute("aria-label", "Copy section link");
      anchor.textContent = "#";
      heading.appendChild(anchor);
    });
  }

  function setupCodeCopy() {
    var blocks = document.querySelectorAll(".article__content pre");
    blocks.forEach(function (block) {
      if (block.dataset.copyReady === "true") {
        return;
      }

      var code = block.querySelector("code");
      if (!code) {
        return;
      }

      block.dataset.copyReady = "true";

      var button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      setCopyState(button, "idle");
      block.appendChild(button);

      var timeout = null;
      button.addEventListener("click", function () {
        copyText(code.innerText || code.textContent || "")
          .then(function () {
            setCopyState(button, "copied");
          })
          .catch(function () {
            setCopyState(button, "error");
          })
          .finally(function () {
            if (timeout) {
              window.clearTimeout(timeout);
            }

            timeout = window.setTimeout(function () {
              setCopyState(button, "idle");
            }, 1400);
          });
      });
    });
  }

  function setupMediaZoom() {
    var main = document.querySelector("main");
    if (!main) {
      return;
    }

    var overlay = document.createElement("div");
    overlay.className = "media-zoom-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var inner = document.createElement("div");
    inner.className = "media-zoom-overlay__inner";

    var closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "media-zoom-overlay__close";
    closeButton.setAttribute("aria-label", "Close zoomed media");

    var closePrefix = document.createElement("span");
    closePrefix.className = "media-zoom-overlay__close-prefix";
    closePrefix.textContent = ":close";

    var closeKey = document.createElement("span");
    closeKey.className = "media-zoom-overlay__close-key";
    closeKey.textContent = "[esc]";

    closeButton.appendChild(closePrefix);
    closeButton.appendChild(closeKey);

    var frame = document.createElement("div");
    frame.className = "media-zoom-overlay__frame";

    inner.appendChild(closeButton);
    inner.appendChild(frame);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    var activeSource = null;
    var lastFocused = null;
    var closeTimer = null;

    function resetAfterClose() {
      overlay.classList.remove("media-zoom-overlay--visible");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("media-zoom-open");
      frame.textContent = "";

      if (activeSource) {
        activeSource.setAttribute("aria-expanded", "false");
      }

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }

      activeSource = null;
      lastFocused = null;
      closeTimer = null;
    }

    function closeZoom() {
      if (!overlay.classList.contains("media-zoom-overlay--visible")) {
        return;
      }

      overlay.classList.remove("media-zoom-overlay--open");

      if (closeTimer) {
        window.clearTimeout(closeTimer);
      }

      if (reduceMotion) {
        resetAfterClose();
        return;
      }

      closeTimer = window.setTimeout(resetAfterClose, 220);
    }

    function openZoom(source) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      lastFocused = document.activeElement;
      activeSource = source;
      frame.textContent = "";

      var clone = source.cloneNode(true);
      clone.classList.remove("media-zoomable");
      clone.removeAttribute("data-media-zoom-ready");
      clone.removeAttribute("role");
      clone.removeAttribute("tabindex");
      clone.removeAttribute("aria-label");
      clone.removeAttribute("aria-expanded");
      frame.appendChild(clone);

      overlay.classList.add("media-zoom-overlay--visible");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("media-zoom-open");
      source.setAttribute("aria-expanded", "true");

      window.requestAnimationFrame(function () {
        overlay.classList.add("media-zoom-overlay--open");
      });

      closeButton.focus({ preventScroll: true });
    }

    function bindTarget(target) {
      if (target.dataset.mediaZoomReady === "true") {
        return;
      }

      target.dataset.mediaZoomReady = "true";
      target.setAttribute("tabindex", "0");
      target.setAttribute("aria-label", "Open zoomed image");
      target.setAttribute("aria-expanded", "false");
    }

    function bindTargets() {
      main.querySelectorAll("img, .mermaid svg").forEach(bindTarget);
    }

    bindTargets();

    new MutationObserver(function () {
      bindTargets();
    }).observe(main, {
      childList: true,
      subtree: true,
    });

    main.addEventListener("click", function (event) {
      var target = event.target.closest("img, .mermaid svg");
      if (!target || target.dataset.mediaZoomReady !== "true") {
        return;
      }

      event.preventDefault();
      openZoom(target);
    });

    main.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      var target = event.target;
      if (!target || target.dataset.mediaZoomReady !== "true") {
        return;
      }

      event.preventDefault();
      openZoom(target);
    });

    closeButton.addEventListener("click", closeZoom);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeZoom();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeZoom();
      }
    });
  }

  function setupScrollProgress() {
    var bar = document.querySelector("[data-scroll-progress]");
    var thumb = document.querySelector("[data-scroll-progress-thumb]");
    if (!bar) {
      return;
    }

    var root = bar.parentElement;
    var rootComputedStyle = window.getComputedStyle(document.documentElement);
    var markerOffset = 0;
    var railHeight = 0;
    var targetProgress = 0;
    var currentProgress = 0;
    var isAnimating = false;

    function toPixels(value) {
      if (!value) {
        return 0;
      }

      var normalized = String(value).trim();
      if (normalized.endsWith("px")) {
        return parseFloat(normalized) || 0;
      }

      if (normalized.endsWith("rem")) {
        var rem = parseFloat(normalized) || 0;
        var rootFontSize = parseFloat(rootComputedStyle.fontSize) || 16;
        return rem * rootFontSize;
      }

      return parseFloat(normalized) || 0;
    }

    function measureRail() {
      markerOffset = toPixels(
        window.getComputedStyle(root).getPropertyValue("--scroll-marker-offset")
      );
      railHeight = Math.max(0, root.clientHeight - markerOffset * 2);
    }

    function applyProgress(progress) {
      root.classList.toggle("is-start", progress <= 0.001);
      root.classList.toggle("is-end", progress >= 0.999);
      bar.style.transform = "scaleY(" + progress.toFixed(4) + ")";
      if (thumb) {
        thumb.style.top = (markerOffset + railHeight * progress).toFixed(2) + "px";
      }
    }

    function animateProgress() {
      var delta = targetProgress - currentProgress;
      if (Math.abs(delta) <= 0.001) {
        currentProgress = targetProgress;
        applyProgress(currentProgress);
        isAnimating = false;
        return;
      }

      currentProgress += delta * 0.18;
      applyProgress(currentProgress);
      window.requestAnimationFrame(animateProgress);
    }

    function update() {
      measureRail();
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        root.classList.add("is-hidden");
        root.classList.add("is-start");
        root.classList.remove("is-end");
        targetProgress = 0;
        currentProgress = 0;
        bar.style.transform = "scaleY(0)";
        if (thumb) {
          thumb.style.top = markerOffset + "px";
        }
        return;
      }

      targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      root.classList.remove("is-hidden");

      if (!isAnimating) {
        isAnimating = true;
        window.requestAnimationFrame(animateProgress);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function setupEntranceStagger() {
    if (reduceMotion) {
      return;
    }

    var nodes = [];
    document.querySelectorAll(".post-card").forEach(function (node) {
      nodes.push(node);
    });
    document.querySelectorAll(".article__content > *").forEach(function (node) {
      nodes.push(node);
    });

    if (!nodes.length) {
      return;
    }

    nodes.forEach(function (node, index) {
      node.classList.add("stagger-item");
      node.style.setProperty("--stagger-delay", Math.min(index * 45, 360) + "ms");
    });

    document.body.classList.add("stagger");
    window.requestAnimationFrame(function () {
      document.body.classList.add("stagger--ready");
    });

    window.setTimeout(function () {
      document.body.classList.remove("stagger");
      document.body.classList.remove("stagger--ready");
    }, 900);
  }

  onReady(function () {
    renderFontAwesomeIcons(document.body);
    setupHeadingAnchors();
    setupCodeCopy();
    setupMediaZoom();
    setupScrollProgress();
    setupEntranceStagger();
  });
})();
