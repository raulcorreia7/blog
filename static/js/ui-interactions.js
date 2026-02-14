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

  function setupScrollProgress() {
    var bar = document.querySelector("[data-scroll-progress]");
    if (!bar) {
      return;
    }

    var root = bar.parentElement;

    function update() {
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        root.classList.add("is-hidden");
        bar.style.transform = "scaleY(0)";
        return;
      }

      var progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      root.classList.remove("is-hidden");
      bar.style.transform = "scaleY(" + progress.toFixed(4) + ")";
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
    setupHeadingAnchors();
    setupCodeCopy();
    setupScrollProgress();
    setupEntranceStagger();
  });
})();
