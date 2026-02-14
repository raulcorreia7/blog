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
- CI/CD pipeline reorganized into build, checks, optimization (optional), and deploy stages.
- About page and post templates aligned to the same visual language.
- CSS delivery switched to Hugo Pipes bundling (`resources.Concat | minify | fingerprint`) for single-file loading and cache-safe updates.

### Removed

- `themes/risotto` submodule dependency.
- Legacy CSS/JS assets from prior theme implementation.
- Local vendored Asciinema player assets (now loaded from CDN).
