(function () {
  var SELECTOR = ".mermaid";
  var sourceByNode = new WeakMap();
  var renderQueue = Promise.resolve();
  var mermaidPromise = null;

  function currentMermaidTheme() {
    return window.ContentTools.currentTheme() === "light" ? "default" : "dark";
  }

  function loadMermaid() {
    if (!mermaidPromise) {
      mermaidPromise = import("https://cdn.jsdelivr.net/npm/mermaid@11/+esm").then(function (mod) {
        return mod.default;
      });
    }

    return mermaidPromise;
  }

  function restoreDiagramSources() {
    document.querySelectorAll(SELECTOR).forEach(function (node) {
      if (!sourceByNode.has(node)) {
        sourceByNode.set(node, node.textContent || "");
      }

      node.textContent = sourceByNode.get(node);
      node.removeAttribute("data-processed");
    });
  }

  function renderMermaid() {
    if (!document.querySelector(SELECTOR)) {
      return Promise.resolve();
    }

    return loadMermaid().then(function (mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: currentMermaidTheme(),
      });

      restoreDiagramSources();

      return mermaid.run({ querySelector: SELECTOR });
    });
  }

  function scheduleRender() {
    renderQueue = renderQueue
      .then(function () {
        return renderMermaid();
      })
      .catch(function (error) {
        console.error("[mermaid] render failed:", error);
      });

    return renderQueue;
  }

  if (!window.ContentTools) {
    console.error("[mermaid] ContentTools runtime not found.");
    return;
  }

  window.ContentTools.register({
    name: "mermaid",
    init: scheduleRender,
    onThemeChange: scheduleRender,
  });
})();
