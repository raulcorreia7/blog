(function () {
  var CONFIG = {
    STORAGE_KEY: "vim-mode-activated",
    SEARCH_SCOPE: "main.page__body",
    SCROLL_AMOUNT: 100,
    KEY_BUFFER_TIMEOUT: 1500,
    ANIMATION_DURATION: 600,
    LINK_HINT_KEYS: "asdfghjklqwertyuiopzxcvbnm",
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function createState() {
    return {
      activated: false,
      searchOpen: false,
      helpOpen: false,
      linkHintsOpen: false,
      linkHintsBuffer: "",
      keyBuffer: "",
      keyBufferTimer: null,
      search: {
        matches: [],
        currentMatchIndex: -1,
        lastQuery: "",
        originalNodes: [],
      },
      linkHints: {
        hints: [],
        elements: [],
      },
    };
  }

  var state = createState();

  function KeyBuffer() {
    var buffer = "";
    var timer = null;

    function push(key) {
      buffer += key;
      if (buffer.length > 10) {
        buffer = buffer.slice(-10);
      }
      resetTimer();
    }

    function resetTimer() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(clear, CONFIG.KEY_BUFFER_TIMEOUT);
    }

    function clear() {
      buffer = "";
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function endsWith(str) {
      return buffer.endsWith(str);
    }

    return { push: push, clear: clear, endsWith: endsWith };
  }

  var keyBuffer = KeyBuffer();

  function Animation() {
    function createGlow(type) {
      var glow = document.createElement("div");
      glow.className = "vim-" + type + "-glow";
      document.body.appendChild(glow);
      return glow;
    }

    function createRipple() {
      var ripple = document.createElement("div");
      ripple.className = "vim-activation-ripple";
      document.body.appendChild(ripple);
      return ripple;
    }

    function activate() {
      if (reduceMotion) {
        return;
      }

      var glow = createGlow("activation");
      var ripple = createRipple();

      requestAnimationFrame(function () {
        glow.classList.add("vim-activation-glow--active");
        ripple.classList.add("vim-activation-ripple--active");
      });

      setTimeout(function () {
        glow.classList.add("vim-activation-glow--fade");
        setTimeout(function () {
          glow.remove();
          ripple.remove();
        }, 300);
      }, CONFIG.ANIMATION_DURATION);
    }

    function deactivate() {
      if (reduceMotion) {
        return;
      }

      var glow = createGlow("deactivation");
      var ripple = createRipple();

      requestAnimationFrame(function () {
        ripple.classList.add("vim-activation-ripple--active");
        glow.classList.add("vim-deactivation-glow--active");
      });

      setTimeout(function () {
        ripple.classList.add("vim-activation-ripple--reverse");
        glow.classList.add("vim-deactivation-glow--fade");
        setTimeout(function () {
          glow.remove();
          ripple.remove();
        }, 400);
      }, 200);
    }

    return { activate: activate, deactivate: deactivate };
  }

  var animation = Animation();

  function Toast() {
    function show(message) {
      hide();

      var toast = document.createElement("div");
      toast.className = "vim-toast";
      toast.textContent = message;
      document.body.appendChild(toast);

      requestAnimationFrame(function () {
        toast.classList.add("vim-toast--visible");
      });

      setTimeout(function () {
        toast.classList.remove("vim-toast--visible");
        setTimeout(function () {
          toast.remove();
        }, 200);
      }, 2500);
    }

    function hide() {
      var existing = document.querySelector(".vim-toast");
      if (existing) {
        existing.remove();
      }
    }

    return { show: show, hide: hide };
  }

  var toast = Toast();

  function Badge() {
    function create() {
      var badge = document.createElement("div");
      badge.className = "vim-badge";
      badge.innerHTML =
        '<span class="vim-badge__mode">vim</span>' +
        '<button type="button" class="vim-badge__action" data-action="search">/</button>' +
        '<button type="button" class="vim-badge__action" data-action="help">?</button>';
      return badge;
    }

    function show() {
      if (document.querySelector(".vim-badge")) {
        return;
      }

      var badge = create();
      document.body.appendChild(badge);

      requestAnimationFrame(function () {
        badge.classList.add("vim-badge--visible");
      });
    }

    function hide() {
      var badge = document.querySelector(".vim-badge");
      if (badge) {
        badge.classList.remove("vim-badge--visible");
        setTimeout(function () {
          badge.remove();
        }, 200);
      }
    }

    return { show: show, hide: hide };
  }

  var badge = Badge();

  function HeaderButton() {
    function update() {
      var btn = document.querySelector("[data-vim-toggle]");
      var valueEl = btn && btn.querySelector("[data-vim-value]");
      if (btn && valueEl) {
        btn.dataset.vimActive = state.activated ? "true" : "false";
        valueEl.textContent = state.activated ? "[on]" : "[off]";
      }
    }

    return { update: update };
  }

  var headerButton = HeaderButton();

  function Search() {
    function createOverlay() {
      var container = document.createElement("div");
      container.id = "vim-search-overlay";
      container.className = "vim-search-overlay";

      var inner = document.createElement("div");
      inner.className = "vim-search-overlay__inner";

      var prefix = document.createElement("span");
      prefix.className = "vim-search-overlay__prefix";
      prefix.textContent = "/";

      var input = document.createElement("input");
      input.type = "text";
      input.className = "vim-search-overlay__input";
      input.placeholder = "search in page";
      input.setAttribute("aria-label", "Search");
      input.autocomplete = "off";
      input.spellcheck = false;

      var count = document.createElement("span");
      count.className = "vim-search-overlay__count";
      count.id = "vim-search-count";

      var hint = document.createElement("span");
      hint.className = "vim-search-overlay__hint";
      hint.textContent = "[esc]";

      inner.appendChild(prefix);
      inner.appendChild(input);
      inner.appendChild(count);
      inner.appendChild(hint);
      container.appendChild(inner);

      return container;
    }

    function open() {
      if (state.searchOpen || !state.activated) {
        return;
      }

      state.searchOpen = true;

      var overlay = createOverlay();
      document.body.appendChild(overlay);

      requestAnimationFrame(function () {
        overlay.classList.add("vim-search-overlay--visible");
        var input = overlay.querySelector(".vim-search-overlay__input");
        if (state.search.lastQuery) {
          input.value = state.search.lastQuery;
        }
        input.focus();
      });
    }

    function close(clearFlag) {
      var overlay = document.querySelector("#vim-search-overlay");
      if (!overlay) {
        return;
      }

      overlay.classList.remove("vim-search-overlay--visible");
      state.searchOpen = false;

      if (clearFlag) {
        clearMatches();
        state.search.lastQuery = "";
      }

      setTimeout(function () {
        overlay.remove();
      }, 150);
    }

    function getTextNodes(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          var parent = node.parentElement;
          if (!parent) {
            return NodeFilter.FILTER_REJECT;
          }
          var tag = parent.tagName.toLowerCase();
          if (
            tag === "script" ||
            tag === "style" ||
            tag === "noscript" ||
            tag === "textarea" ||
            tag === "input" ||
            parent.classList.contains("vim-match") ||
            parent.closest(".vim-search-overlay") ||
            parent.closest(".vim-badge") ||
            parent.closest(".vim-help-overlay") ||
            parent.closest(".vim-link-hint")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      var nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }
      return nodes;
    }

    function clearMatches() {
      state.search.matches = [];
      state.search.currentMatchIndex = -1;
      state.search.originalNodes.forEach(function (data) {
        if (data.parent && data.node && data.wrapper) {
          data.parent.replaceChild(data.node, data.wrapper);
        }
      });
      state.search.originalNodes = [];
    }

    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function perform(query) {
      clearMatches();

      var countEl = document.querySelector("#vim-search-count");
      if (!query.trim()) {
        if (countEl) {
          countEl.textContent = "";
        }
        return;
      }

      var scope = document.querySelector(CONFIG.SEARCH_SCOPE);
      if (!scope) {
        return;
      }

      var textNodes = getTextNodes(scope);
      var regex = new RegExp("(" + escapeRegex(query) + ")", "gi");
      var matchIndex = 0;

      textNodes.forEach(function (textNode) {
        var text = textNode.textContent;
        if (!regex.test(text)) {
          return;
        }

        regex.lastIndex = 0;

        var parent = textNode.parentNode;
        var wrapper = document.createElement("span");
        wrapper.className = "vim-match-wrapper";
        parent.replaceChild(wrapper, textNode);

        state.search.originalNodes.push({
          parent: parent,
          node: textNode,
          wrapper: wrapper,
        });

        var lastIndex = 0;
        var match;
        while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            wrapper.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }

          var mark = document.createElement("mark");
          mark.className = "vim-match";
          mark.dataset.index = String(matchIndex);
          mark.textContent = match[0];
          wrapper.appendChild(mark);

          state.search.matches.push(mark);
          matchIndex++;
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
          wrapper.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
      });

      if (countEl) {
        var count = state.search.matches.length;
        countEl.textContent = count > 0 ? count + " match" + (count !== 1 ? "es" : "") : "no match";
      }

      if (state.search.matches.length > 0) {
        navigate(0);
      }
    }

    function navigate(index) {
      if (state.search.matches.length === 0) {
        return;
      }

      state.search.matches.forEach(function (m) {
        m.classList.remove("vim-match--current");
      });

      var normalized =
        ((index % state.search.matches.length) + state.search.matches.length) %
        state.search.matches.length;
      state.search.currentMatchIndex = normalized;

      var match = state.search.matches[normalized];
      match.classList.add("vim-match--current");
      match.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }

    function next() {
      if (state.search.matches.length === 0) {
        return;
      }
      navigate(state.search.currentMatchIndex + 1);
    }

    function prev() {
      if (state.search.matches.length === 0) {
        return;
      }
      navigate(state.search.currentMatchIndex - 1);
    }

    function handleInput(e) {
      state.search.lastQuery = e.target.value;
      perform(e.target.value);
    }

    return {
      open: open,
      close: close,
      next: next,
      prev: prev,
      clearMatches: clearMatches,
      handleInput: handleInput,
    };
  }

  var search = Search();

  function Help() {
    function createOverlay() {
      var overlay = document.createElement("div");
      overlay.id = "vim-help-overlay";
      overlay.className = "vim-help-overlay";

      var inner = document.createElement("div");
      inner.className = "vim-help-overlay__inner";

      var title = document.createElement("h2");
      title.className = "vim-help-overlay__title";
      title.textContent = "Keyboard Shortcuts";

      var list = document.createElement("ul");
      list.className = "vim-help-overlay__list";

      var shortcuts = [
        { key: "/", action: "Search in page" },
        { key: ":", action: "Search in page" },
        { key: "n", action: "Next match" },
        { key: "N", action: "Previous match" },
        { key: "j", action: "Scroll down" },
        { key: "k", action: "Scroll up" },
        { key: "f", action: "Open link" },
        { key: "?", action: "Show this help" },
        { key: "Esc", action: "Close / Clear" },
      ];

      shortcuts.forEach(function (s) {
        var li = document.createElement("li");
        li.className = "vim-help-overlay__item";

        var kbd = document.createElement("kbd");
        kbd.className = "vim-help-overlay__key";
        kbd.textContent = s.key;

        var desc = document.createElement("span");
        desc.className = "vim-help-overlay__action";
        desc.textContent = s.action;

        li.appendChild(kbd);
        li.appendChild(desc);
        list.appendChild(li);
      });

      var hint = document.createElement("p");
      hint.className = "vim-help-overlay__hint";
      hint.textContent = "Press Esc or ? to close";

      inner.appendChild(title);
      inner.appendChild(list);
      inner.appendChild(hint);
      overlay.appendChild(inner);

      return overlay;
    }

    function open() {
      if (state.helpOpen || !state.activated) {
        return;
      }

      state.helpOpen = true;

      var overlay = createOverlay();
      document.body.appendChild(overlay);

      requestAnimationFrame(function () {
        overlay.classList.add("vim-help-overlay--visible");
      });
    }

    function close() {
      var overlay = document.querySelector("#vim-help-overlay");
      if (!overlay) {
        return;
      }

      overlay.classList.remove("vim-help-overlay--visible");
      state.helpOpen = false;

      setTimeout(function () {
        overlay.remove();
      }, 200);
    }

    function toggle() {
      if (state.helpOpen) {
        close();
      } else {
        open();
      }
    }

    return { open: open, close: close, toggle: toggle };
  }

  var help = Help();

  function LinkHints() {
    function getHintText(index) {
      var keys = CONFIG.LINK_HINT_KEYS;
      var text = "";
      var i = index;
      do {
        text = keys[i % keys.length] + text;
        i = Math.floor(i / keys.length) - 1;
      } while (i >= 0);
      return text;
    }

    function getClickableElements() {
      var scope = document.querySelector(CONFIG.SEARCH_SCOPE);
      if (!scope) {
        return [];
      }

      var elements = [];
      var selectors = [
        "a[href]",
        "button:not([disabled])",
        'input[type="submit"]',
        'input[type="button"]',
      ];

      selectors.forEach(function (sel) {
        scope.querySelectorAll(sel).forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            elements.push(el);
          }
        });
      });

      return elements;
    }

    function createHint(element, index) {
      var rect = element.getBoundingClientRect();
      var hint = document.createElement("div");
      hint.className = "vim-link-hint";
      hint.style.top = rect.top + window.scrollY + "px";
      hint.style.left = rect.left + window.scrollX + "px";
      hint.textContent = getHintText(index);
      hint.dataset.index = String(index);
      return hint;
    }

    function open() {
      if (state.linkHintsOpen || !state.activated) {
        return;
      }

      var elements = getClickableElements();
      if (elements.length === 0) {
        toast.show("No links found");
        return;
      }

      state.linkHintsOpen = true;
      state.linkHintsBuffer = "";
      state.linkHints.elements = elements;
      state.linkHints.hints = [];

      elements.forEach(function (el, index) {
        var hint = createHint(el, index);
        document.body.appendChild(hint);
        state.linkHints.hints.push(hint);
        el.classList.add("vim-link-hint-target");
      });
    }

    function close() {
      state.linkHintsOpen = false;
      state.linkHintsBuffer = "";

      state.linkHints.hints.forEach(function (hint) {
        hint.remove();
      });
      state.linkHints.hints = [];

      state.linkHints.elements.forEach(function (el) {
        el.classList.remove("vim-link-hint-target");
      });
      state.linkHints.elements = [];
    }

    function handleKey(key) {
      if (!state.linkHintsOpen) {
        return false;
      }

      if (key === "Escape") {
        close();
        return true;
      }

      if (key === "Backspace") {
        state.linkHintsBuffer = state.linkHintsBuffer.slice(0, -1);
        updateHighlights();
        return true;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        state.linkHintsBuffer += key.toLowerCase();
        updateHighlights();

        var match = findMatch();
        if (match) {
          match.click();
          close();
        } else if (!hasPossibleMatch()) {
          close();
        }
        return true;
      }

      return true;
    }

    function updateHighlights() {
      state.linkHints.hints.forEach(function (hint, index) {
        var text = getHintText(index);
        if (text.startsWith(state.linkHintsBuffer)) {
          hint.classList.add("vim-link-hint--match");
          hint.classList.remove("vim-link-hint--no-match");
        } else {
          hint.classList.remove("vim-link-hint--match");
          hint.classList.add("vim-link-hint--no-match");
        }
      });
    }

    function findMatch() {
      for (var i = 0; i < state.linkHints.elements.length; i++) {
        if (getHintText(i) === state.linkHintsBuffer) {
          return state.linkHints.elements[i];
        }
      }
      return null;
    }

    function hasPossibleMatch() {
      for (var i = 0; i < state.linkHints.elements.length; i++) {
        if (getHintText(i).startsWith(state.linkHintsBuffer)) {
          return true;
        }
      }
      return false;
    }

    return { open: open, close: close, handleKey: handleKey };
  }

  var linkHints = LinkHints();

  function Scroll() {
    function down() {
      window.scrollBy({ top: CONFIG.SCROLL_AMOUNT, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function up() {
      window.scrollBy({ top: -CONFIG.SCROLL_AMOUNT, behavior: reduceMotion ? "auto" : "smooth" });
    }

    return { down: down, up: up };
  }

  var scroll = Scroll();

  function VimMode() {
    function activate() {
      if (state.activated) {
        return;
      }

      state.activated = true;

      try {
        sessionStorage.setItem(CONFIG.STORAGE_KEY, "true");
      } catch (e) {}

      animation.activate();
      badge.show();
      headerButton.update();
      document.body.classList.add("vim-mode-active");
      toast.show("Vim mode • / search • f links • ? help");
    }

    function deactivate() {
      if (!state.activated) {
        return;
      }

      state.activated = false;
      search.clearMatches();

      try {
        sessionStorage.removeItem(CONFIG.STORAGE_KEY);
      } catch (e) {}

      animation.deactivate();
      badge.hide();
      headerButton.update();
      document.body.classList.remove("vim-mode-active");
      toast.show("Vim mode off");
    }

    function toggle() {
      if (state.activated) {
        deactivate();
      } else {
        activate();
      }
    }

    return { activate: activate, deactivate: deactivate, toggle: toggle };
  }

  var vimMode = VimMode();

  function isEditable(element) {
    if (!element) {
      return false;
    }
    var tag = element.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") {
      return true;
    }
    if (element.isContentEditable) {
      return true;
    }
    return false;
  }

  function handleKeydown(e) {
    var isModKey = e.ctrlKey || e.metaKey || e.altKey;

    if (state.linkHintsOpen) {
      if (linkHints.handleKey(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    if (!isModKey && e.key.length === 1 && !state.searchOpen && !state.helpOpen) {
      keyBuffer.push(e.key);
      if (keyBuffer.endsWith(":vim")) {
        keyBuffer.clear();
        vimMode.toggle();
        return;
      }
    }

    if (state.searchOpen) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        search.close(true);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        var input = document.querySelector(".vim-search-overlay__input");
        if (input) {
          state.search.lastQuery = input.value;
          search.handleInput({ target: input });
        }
        search.close(false);
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (e.shiftKey) {
          search.prev();
        } else {
          search.next();
        }
        return;
      }

      return;
    }

    if (!state.activated) {
      return;
    }

    if (state.helpOpen) {
      if (e.key === "Escape" || (e.key === "?" && e.shiftKey)) {
        e.preventDefault();
        help.close();
      }
      return;
    }

    if (isEditable(e.target)) {
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      search.clearMatches();
      state.search.lastQuery = "";
      return;
    }

    if ((e.key === "/" && !e.shiftKey) || (e.key === ":" && !e.shiftKey)) {
      if (!isModKey) {
        e.preventDefault();
        search.open();
      }
    } else if (e.key === "n" && !e.shiftKey && !isModKey) {
      e.preventDefault();
      search.next();
    } else if ((e.key === "N" || (e.key === "n" && e.shiftKey)) && !isModKey) {
      e.preventDefault();
      search.prev();
    } else if (e.key === "j" && !e.shiftKey && !isModKey) {
      e.preventDefault();
      scroll.down();
    } else if (e.key === "k" && !e.shiftKey && !isModKey) {
      e.preventDefault();
      scroll.up();
    } else if (e.key === "f" && !e.shiftKey && !isModKey) {
      e.preventDefault();
      linkHints.open();
    } else if (e.key === "?" && e.shiftKey && !isModKey) {
      e.preventDefault();
      help.toggle();
    }
  }

  function init() {
    try {
      state.activated = sessionStorage.getItem(CONFIG.STORAGE_KEY) === "true";
    } catch (e) {
      state.activated = false;
    }

    headerButton.update();

    if (state.activated) {
      badge.show();
      document.body.classList.add("vim-mode-active");
    }

    document.addEventListener("keydown", handleKeydown, true);

    document.addEventListener("input", function (e) {
      if (e.target.classList.contains("vim-search-overlay__input")) {
        search.handleInput(e);
      }
    });

    document.addEventListener("click", function (e) {
      if (state.searchOpen && e.target.id === "vim-search-overlay") {
        search.close(false);
      }
      if (state.helpOpen && e.target.id === "vim-help-overlay") {
        help.close();
      }

      var vimToggle = e.target.closest("[data-vim-toggle]");
      if (vimToggle) {
        e.preventDefault();
        vimMode.toggle();
      }

      var badgeAction = e.target.closest(".vim-badge__action");
      if (badgeAction) {
        var action = badgeAction.dataset.action;
        if (action === "search") {
          search.open();
        } else if (action === "help") {
          help.toggle();
        }
      }
    });
  }

  if (!window.ContentTools) {
    console.error("[vim-search] ContentTools runtime not found.");
    return;
  }

  window.ContentTools.register({
    name: "vim-search",
    init: init,
    onThemeChange: function () {},
  });
})();
