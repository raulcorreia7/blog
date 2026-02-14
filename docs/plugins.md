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
  - media zoom overlay for article images and Mermaid SVG outputs
  - entrance stagger animation

Media zoom behavior details:

- binds to `main img` and `.mermaid svg` (including async-rendered diagrams)
- supports mouse, keyboard (`Enter`/`Space`), and close via `Esc`
- uses a shared overlay with terminal-style close affordance (`:close [esc]`)
- respects `prefers-reduced-motion`

Design principle: keep each behavior small and independent, avoid framework coupling.
