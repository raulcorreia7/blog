# Plugin Runtime

This blog uses a small plugin runtime for page-level tools.

## Runtime Core

- File: `static/js/content-tools.js`
- Responsibilities:
  - register plugins (`ContentTools.register`)
  - run plugin `init` on DOM ready
  - run `onThemeChange` when `data-theme` changes
  - provide `waitFor` helper for async third-party globals

## Implemented Plugins

### Mermaid

- Runtime: `static/js/mermaid-init.js`
- Loader: ESM from jsDelivr (`mermaid@11/+esm`)
- Behavior:
  - renders `.mermaid` blocks
  - re-renders on theme toggle (dark/light)

### Asciinema

- Runtime: `static/js/asciinema-init.js`
- Assets: jsDelivr CDN (`asciinema-player@3`)
- Behavior:
  - initializes `.asciinema-embed[data-cast-url]`
  - reads shortcode options from data attributes

## Theme Runtime

Theme handling is intentionally separate from plugin runtime:

- `static/js/theme-bootstrap.js`: applies initial theme before paint
- `static/js/theme.js`: toggles dark/light and persists choice

## UI Interactions

- File: `static/js/ui-interactions.js`
- Adds progressive enhancements:
  - scroll progress bar
  - heading anchors
  - code-copy button state
  - entrance stagger animation

Design principle: keep each behavior small and independent, avoid framework coupling.
