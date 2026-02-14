# Changelog

All notable changes to this project are documented in this file.

## [Unreleased] - 2026-02-14

### Added

- Full custom Hugo theme (layouts, partials, and page templates).
- Modular CSS architecture with design tokens and component-scoped styles.
- UI interaction layer (`ui-interactions.js`) for subtle micro-interactions.
- Shared plugin runtime (`content-tools.js`) for page tools.
- Mermaid shortcode + runtime integration using jsDelivr ESM (`mermaid@11`).
- Asciinema shortcode + runtime integration using jsDelivr (`asciinema-player@3`).
- New revamp post documenting domain/theme/CI/CD/performance work.
- Documentation set:
  - `docs/css-architecture.md`
  - `docs/shortcodes.md`
  - `docs/plugins.md`

### Changed

- Default syntax highlighting style set to `tokyonight-night`.
- Header/nav/footer/card layout refined for consistent terminal-first visual hierarchy.
- Theme toggle simplified to dark/light with dark default from config.
- CI/CD pipeline reorganized into lint, build, quality gates, optimization, and deploy stages.
- About page and post templates aligned to the same visual language.
- CSS delivery switched to Hugo Pipes bundling (`resources.Concat | minify | fingerprint`) for single-file loading and cache-safe updates.
- Removed CSS `color-mix()` usage in theme styles to avoid parser warnings and improve browser compatibility.
- Simplified CI jobs by removing redundant checkouts in artifact-only validation steps.
- Extracted CI image optimization into `scripts/optimize-images.sh` and centralized workflow constants/timeouts.
- Main content layout width increased (`--layout-max-width: 860px`) to improve readability on larger displays.
- Footer social links switched to text labels (`:github | :linkedin | :rss`) to match terminal-first language.
- Footer selectors renamed from generic `.footer*` to scoped `.site-footer*` to avoid browser extension cosmetic-filter collisions in production.
- CI pipeline lint step moved into the build job to remove duplicate Node dependency installs.
- Build checkout switched back to shallow clone (removed `fetch-depth: 0`) to reduce runtime.
- PR preview deployments now use the non-optimized site artifact; image optimization runs only for production deploys.
- Mermaid diagrams now fit article width by default and open in the same zoom overlay used by images.
- Added smooth media zoom overlay for article media (click + keyboard), with terminal-style close control (`:close [esc]`).
- Revamp post CI/CD diagram and narrative updated to reflect PR preview deployments and current pipeline flow.
- Added `docs/ci-cd.md` with updated job flow and deploy behavior.

### Removed

- `themes/risotto` submodule dependency.
- Legacy CSS/JS assets from prior theme implementation.
- Local vendored Asciinema player assets (now loaded from CDN).
