# Raul Correia Blog

Personal blog built with Hugo and a custom terminal-first theme.

## Live

- https://raulcorreia.dev

## What This Repo Includes

- Custom Hugo layouts (no external theme dependency)
- Modular CSS architecture with shared design tokens
- Lightweight JS modules for theme + UI interactions
- Content plugins for Mermaid and Asciinema
- Global image/diagram zoom overlay with keyboard support
- Adblock-safe site meta fallback that preserves semantic `<footer>` markup
- GitHub Actions pipeline for build, validation, and deploy

## Local Development

Prerequisites: `hugo`, `make`, `git`, `npm`

```bash
make help
make dev
make all
make hooks
```

Create a post:

```bash
hugo new posts/my-post/index.md
```

## Architecture Docs

- `docs/css-architecture.md`
- `docs/ci-cd.md`
- `docs/plugins.md`
- `docs/shortcodes.md`
- `CHANGELOG.md`

## Git Hooks

- Hooks are versioned in `.githooks/`.
- Install locally with:

```bash
make hooks
```

- Current pre-commit hook runs: `npm run lint` (Prettier check).

## CI/CD

- Workflow: `.github/workflows/build-hugo-website.yml`
- Deploy target: GitHub Pages (`gh-pages`)
- Production deploys on `master` pushes; pull requests publish preview deployments
- Pull request previews skip image optimization for faster feedback; optimization runs only for production deploys.
- Production domain: `raulcorreia.dev` (DNS/SSL via Cloudflare)

## License

MIT (`LICENSE.txt`)
