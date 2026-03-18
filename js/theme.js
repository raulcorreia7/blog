(function () {
  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  if (!button) {
    return;
  }

  var valueNode = button.querySelector("[data-theme-value]");
  var defaultTheme = root.getAttribute("data-theme-default") || "dark";
  if (defaultTheme !== "dark" && defaultTheme !== "light") {
    defaultTheme = "dark";
  }

  function normalizeTheme(theme) {
    return theme === "light" || theme === "dark" ? theme : defaultTheme;
  }

  function applyTheme(theme) {
    var nextTheme = normalizeTheme(theme);
    root.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      // Ignore storage failures (private mode, blocked storage).
    }

    if (valueNode) {
      valueNode.textContent = nextTheme;
    }
  }

  applyTheme(root.getAttribute("data-theme"));

  button.addEventListener("click", function () {
    var currentTheme = normalizeTheme(root.getAttribute("data-theme"));
    applyTheme(currentTheme === "light" ? "dark" : "light");
  });
})();
