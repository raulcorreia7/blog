# Draft: Blog Validation and Fix

## User Request
> "validate everything (even with running commands, build, etc). make sure blog is fixed, working, building and able to deploy/work. There was a renovation. I want to use a hackerstyle minimal theme. I want to use standard tools (hugo). review and make sure everything works (blog, pipeline, deploying, etc)"

## Requirements (Confirmed)

### Core Objectives
1. Validate blog builds correctly with `hugo --gc --minify -d public`
2. Verify deployment pipeline (GitHub Actions) works correctly
3. Fix all remaining issues found
4. Ensure documentation is accurate
5. Verify blog can be deployed to raulcorreia.dev

### Technical Constraints
- Framework: Hugo Static Site Generator
- Theme: PaperMod (hackerstyle minimal theme)
- Deployment: GitHub Pages via GitHub Actions
- Domain: raulcorreia.dev (configured in CNAME)

## Issues Already Fixed (Status: ✅ Complete)
1. Theme path: `theme: papermod` (was `theme: PaperMod`)
2. Pagination: `pagination: { pagerSize: 20 }` (was deprecated `paginate: 20`)
3. Keywords: Array format (was string)
4. Asciinema shortcode: Created `/layouts/shortcodes/asciinema.html`

## Issues Identified (Status: 🔄 To Be Addressed)

### 1. Makefile Syntax Error (Priority: MEDIUM)
- File: `/home/rcorreia/projects/blog/makefile`
- Issue: Line 13 has duplicate `help:` target definition
- Impact: `make help` command fails
- Fix Required: Remove duplicate target

### 2. Hugo Version Mismatch (Priority: HIGH)
- File: `.github/workflows/build-hugo-website.yml`
- Issue: Workflow specifies Hugo v0.140.0, local has v0.154.5
- Impact: Builds may differ between local and CI
- Fix Required: Update workflow to use v0.154.5

### 3. Doom Shortcode Missing Assets (Priority: LOW)
- File: `/layouts/shortcodes/doomjs.html`
- Issue: References `/js/jsdos6/` directory that doesn't exist in `static/`
- Impact: Doom game embed won't work if used
- Fix Required: Either add assets or remove shortcode

### 4. Outdated Documentation (Priority: MEDIUM)
- File: `README.md`
- Issue: Still mentions "Hugo-Coder theme" instead of PaperMod
- Impact: Misleading for contributors/cloners
- Fix Required: Update README to reflect current theme

### 5. Git Module Stale Reference (Priority: LOW)
- File: `.gitmodules` (untracked deletion)
- Issue: Contains reference to old hugo-coder submodule
- Impact: No functional impact, but indicates incomplete migration
- Fix Required: Clean up git configuration

## Test Strategy Decision
- **Test Infrastructure**: Manual verification (Hugo has no built-in test framework)
- **Verification Approach**: Automated commands + Playwright for UI validation

## Deliverables
1. All build errors resolved
2. Makefile commands working correctly
3. GitHub Actions workflow updated
4. Documentation accurate (README.md)
5. Clean working tree
6. Deployable artifact (public/)
7. Verification that blog loads correctly

## Open Questions
- Should Doom shortcode be removed or fixed with actual assets?
- Should Hugo version be pinned to specific version or allow latest?

## Context Being Gathered
- Explore agents checking Makefile structure
- Explore agents verifying build process
- Pending: Agent results for comprehensive plan
