# AGENTS.md

## Purpose

High-signal guide for contributors and coding agents working in this repo.

## Core Commands

- `make dev` - run local server on `http://localhost:1313`
- `make all` - production build to `public/`
- `make stop` - stop local server
- `npm run format` - format repo files
- `npm run format:check` - formatting check

## Architecture Map

- Hugo templates: `layouts/`
- Global shell: `layouts/_default/baseof.html`
- Partials/components: `layouts/partials/`
- Shortcodes: `layouts/shortcodes/`
- Theme CSS entrypoint: `static/css/main.css`
- Design tokens: `static/css/theme/variables.css`
- JS runtime:
  - `static/js/theme-bootstrap.js`
  - `static/js/theme.js`
  - `static/js/ui-interactions.js`
  - `static/js/content-tools.js` (plugin host)

## Conventions

- Keep implementation simple and modular; avoid framework-level complexity.
- Use design tokens before hardcoded values.
- Keep selectors component-scoped (`.nav__*`, `.post-card__*`, etc.).
- Respect `prefers-reduced-motion` for animated interactions.
- Use CDN for third-party browser libraries unless local bundling is explicitly required.

## Plugin Pattern

For Mermaid/Asciinema-like tools:

1. Shortcode outputs minimal semantic HTML with data attributes.
2. Runtime plugin registers in `content-tools.js`.
3. Runtime handles theme changes and idempotent initialization.

## Documentation Rule

When behavior or architecture changes, update in the same PR:

- `README.md` (high-level)
- `docs/*` (implementation details)
- `CHANGELOG.md` (user-facing change summary)
