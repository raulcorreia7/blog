# CSS Architecture

Theme styles are split into focused modules imported by `static/css/main.css`.

## Design Tokens

Global tokens live in `static/css/theme/variables.css`:

- Colors (`--bg`, `--fg`, `--accent`, etc.)
- Typography scales (`--font-size-*`)
- Layout spacing (`--space-*`, `--layout-*`)
- Reusable geometry (`--radius-*`)
- Heading mark styling (`--heading-mark-*`)
- Interaction tuning (`--card-hover-*`, `--scroll-progress-*`, `--stagger-*`)

Rule: use tokens first; avoid hardcoded values unless scoped to a one-off component.

## Modules

- `static/css/base.css`: reset and global element defaults
- `static/css/layout.css`: page container/header/footer structure
- `static/css/typography.css`: markdown/content typography
- `static/css/header.css`: nav/header and theme toggle
- `static/css/posts.css`: cards, article, and page title styles
- `static/css/footer.css`: footer layout
- `static/css/components.css`: reusable UI blocks (notice, etc.)
- `static/css/interactions.css`: subtle motion and interactive affordances

## Conventions

- Keep selectors component-scoped (`.post-card__*`, `.nav__*`).
- Prefer tokens to raw values.
- Keep module ownership clear (avoid duplicating the same rule across files).
- Respect reduced-motion (`prefers-reduced-motion`) for animations/transitions.
