# Raul Correia Blog

Personal blog built with Hugo and a custom terminal-first theme.

## Live

- https://raulcorreia.dev

## What This Repo Includes

- Custom Hugo layouts (no external theme dependency)
- Modular CSS architecture with shared design tokens
- Lightweight JS modules for theme + UI interactions
- Content plugins for Mermaid and Asciinema
- GitHub Actions pipeline for build, validation, and deploy

## Local Development

Prerequisites: `hugo`, `make`, `git`

```bash
make help
make dev
make all
```

Create a post:

```bash
hugo new posts/my-post/index.md
```

## Architecture Docs

- `docs/css-architecture.md`
- `docs/plugins.md`
- `docs/shortcodes.md`
- `CHANGELOG.md`

## CI/CD

- Workflow: `.github/workflows/build-hugo-website.yml`
- Deploy target: GitHub Pages (`gh-pages`)
- Production domain: `raulcorreia.dev` (DNS/SSL via Cloudflare)

## License

MIT (`LICENSE.txt`)
