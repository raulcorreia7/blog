# Draft: Switch Hugo from Chroma to highlight.js

## User's Goal
Replace Hugo's built-in Chroma syntax highlighting with highlight.js library integration for the Hugo blog project.

## Current Context (Updated)
- Project: Hugo blog (https://github.com/raulcorreia7/blog)
- Current: Chroma configured in config/_default/hugo.toml
  - style: "github"
  - lineNos: true
  - noClasses: false
  - wrapperClass: "highlight"
- Custom CSS: static/css/syntax.css (251 lines of Chroma classes)
- Theme: risotto (v0.4.0)
- Languages used in posts: Python, JavaScript, Shell/Bash
- Dev server: `make watch` → `hugo server -w --buildFuture --buildDrafts --buildExpired`
- Theme structure: head.html loads CSS, no JS currently

## Requirements Stated
1. Switch from Hugo Chroma to highlight.js
2. Configure Hugo to disable Chroma and use highlight.js integration
3. Ensure dev server (make watch) works properly
4. Verify syntax highlighting works on all posts
5. Test complete setup

## Research Findings
### Integration Approach
The standard approach to integrate highlight.js with Hugo:
1. Disable Chroma in Hugo config (set `markup.highlight.noClasses = true` or remove entire highlight section)
2. Override theme's head partial to include highlight.js CDN links
3. Initialize highlight.js with `hljs.highlightAll()` in a script
4. Remove or disable manual syntax.css file

### CDN vs Local
- CDN: Easiest, auto-updates, requires internet
- Local: Faster, no CDN dependency, requires manual updates

### Available highlight.js Themes
Popular themes: GitHub Dark, VS2015, Atom One Dark, Dracula, Tomorrow Night, Solarized Dark

## Open Questions
- [ ] Which highlight.js theme do you prefer? (GitHub Dark matches your current setup)
- [ ] CDN or local hosting preference?
- [ ] Should we keep line numbers? (highlight.js doesn't have native line numbers)
- [ ] Any specific JS loading preferences (async, defer, head vs body)?
