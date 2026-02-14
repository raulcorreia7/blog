# Books Section

The site includes a dedicated `books` section for reading notes and highlights.

## Content Structure

- Section index: `content/books/_index.md`
- Individual entries: `content/books/<slug>/index.md`
- Archetype: `archetypes/books.md`

Create a new entry:

```bash
hugo new books/my-book/index.md
```

## Front Matter

Expected fields for each book entry:

- `title`: book title
- `date`: publish date used for ordering
- `description`: short summary shown in card list
- `author`: book author
- `status`: reading state (`to-read`, `reading`, `finished`, etc.)
- `genres`: list of tags displayed on cards
- `draft`: Hugo draft toggle

## Templates

- List page: `layouts/books/list.html`
- Card partial: `layouts/partials/book-card.html`

The list template uses shared card styling (`.post-card`) to keep visual consistency with posts while showing book-specific metadata.
