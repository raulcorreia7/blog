(function () {
  var root = document.documentElement;
  var defaultTheme = root.getAttribute("data-theme-default") || "dark";

  if (defaultTheme !== "dark" && defaultTheme !== "light") {
    defaultTheme = "dark";
  }

  var theme = null;
  try {
    theme = localStorage.getItem("theme");
  } catch (error) {
    theme = null;
  }

  if (theme !== "dark" && theme !== "light") {
    theme = defaultTheme;
  }

  root.setAttribute("data-theme-default", defaultTheme);
  root.setAttribute("data-theme", theme);
})();
