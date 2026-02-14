# CI/CD Workflow

The pipeline is defined in `.github/workflows/build-hugo-website.yml`.

## Trigger Model

- `push` on `master`: production path
- `pull_request`: preview path

## Job Flow

1. `build`
   - Checks out source.
   - Installs Node dependencies.
   - Runs `npm run lint`.
   - Builds the Hugo site via `make all`.
   - Uploads `public/` as `hugo-site` artifact.
2. `html-validate` and `link-check`
   - Run from the build artifact.
3. `optimize-assets` (production only)
   - Runs only on `master` pushes.
   - Optimizes image assets and uploads `hugo-site-optimized`.
4. Deploy
   - `deploy` (master push): deploys optimized artifact to `gh-pages`.
   - `deploy-preview` (PR): deploys non-optimized artifact to `preview/<PR_NUMBER>`.

## Rationale

- Linting is executed inside the build job to avoid duplicate dependency installs.
- PR previews use unoptimized artifacts to reduce feedback time.
- Production deploy keeps image optimization enabled for final site performance.
