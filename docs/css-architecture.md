# CSS Architecture

Theme styles are split into focused modules in `assets/css/` and bundled by Hugo Pipes into a single fingerprinted output file.

## Design Tokens

Global tokens live in `assets/css/theme/variables.css`:

- Colors (`--bg`, `--fg`, `--accent`, etc.)
- Typography scales (`--font-size-*`)
- Layout spacing (`--space-*`, `--layout-*`)
- Reusable geometry (`--radius-*`)
- Heading mark styling (`--heading-mark-*`)
- Interaction tuning (`--card-hover-*`, `--scroll-progress-*`, `--stagger-*`)

Current layout baseline:

- `--layout-max-width: 860px`

Rule: use tokens first; avoid hardcoded values unless scoped to a one-off component.

## Modules

- `assets/css/base.css`: reset and global element defaults
- `assets/css/layout.css`: page container/header/footer structure
- `assets/css/typography.css`: markdown/content typography
- `assets/css/header.css`: nav/header and theme toggle
- `assets/css/posts.css`: cards, article, and page title styles
- `assets/css/footer.css`: footer layout
- `assets/css/components.css`: reusable UI blocks (notice, etc.)
- `assets/css/interactions.css`: subtle motion and interactive affordances

Key ownership notes:

- Mermaid framing/sizing is defined in `assets/css/posts.css`
- Hover cues, zoom overlay, and interaction motion live in `assets/css/interactions.css`
- `static/js/ui-interactions.js` includes a site-meta fallback that replaces a hidden `<footer>` with an equivalent `div[role="contentinfo"]`.

## Build Output

- Bundling happens in `layouts/partials/head.html` with Hugo Pipes (`resources.Concat | minify | fingerprint`).
- Pages load one local stylesheet (`/css/main.min.<hash>.css`) instead of a CSS `@import` chain.
- Theme bootstrap script is inlined in `layouts/partials/head.html` to apply theme before first paint without an extra network request.
- Google Fonts stylesheet is loaded non-blocking (preload + onload swap + noscript fallback).

## Conventions

- Keep selectors component-scoped (`.post-card__*`, `.nav__*`).
- Footer area selectors intentionally avoid `footer` naming and use `.site-meta*` to reduce browser cosmetic-filter collisions.
- Prefer tokens to raw values.
- Keep module ownership clear (avoid duplicating the same rule across files).
- Respect reduced-motion (`prefers-reduced-motion`) for animations/transitions.
