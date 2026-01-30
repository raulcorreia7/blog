# Blog Validation and Fix

## TL;DR

> **Quick Summary**: Comprehensive validation and fix of Hugo blog after theme migration from hugo-coder to PaperMod, ensuring all build issues are resolved, CI/CD pipeline works correctly, and deployment to raulcorreia.dev is successful.
>
> **Deliverables**:
> - Fixed Makefile (duplicate help: target removed)
> - Updated GitHub Actions workflow (Hugo v0.140.0 → v0.154.5)
> - Updated README.md (Hugo-Coder → PaperMod references)
> - Cleaned up git submodule references
> - Verified build and deployment readiness
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Makefile fix → Build verification → Deployment verification

---

## Context

### Original Request
User requested comprehensive validation of their Hugo blog after a renovation from hugo-coder to PaperMod theme. Requirements: "validate everything (even with running commands, build, etc). make sure blog is fixed, working, building and able to deploy/work. I want to use a hackerstyle minimal theme. I want to use standard tools (hugo). review and make sure everything works (blog, pipeline, deploying, etc)"

### Interview Summary

**Key Discussions**:
- User confirmed they want to use PaperMod (hackerstyle minimal theme)
- Hugo is the chosen static site generator
- Blog deploys to GitHub Pages with custom domain raulcorreia.dev
- Previous issues already fixed (theme path, pagination, keywords, asciinema shortcode)

**Research Findings**:
- **Build Status**: Working locally (44 pages in 35ms, Hugo v0.154.5-extended)
- **Deployment Pipeline**: GitHub Actions workflow exists but has version mismatch (0.140.0 vs 0.154.5)
- **Issues Found**: Makefile syntax error, outdated README, missing Doom shortcode assets, git submodule reference issues

### Metis Review

**Identified Gaps (addressed)**:
- **Gap 1**: Doom shortcode decision needed → Applied default: Remove broken shortcode (user can override)
- **Gap 2**: Submodule cleanup strategy → Applied default: Create .gitmodules file to properly document PaperMod submodule
- **Gap 3**: Hugo version strategy → Applied default: Match CI to local version (0.154.5) for consistency
- **Gap 4**: Verification approach → Automated commands + Playwright for UI validation
- **Gap 5**: Deployment verification → CI/CD workflow check without actual deployment

---

## Work Objectives

### Core Objective
Validate and fix the Hugo blog to ensure it builds correctly, deploys via GitHub Actions without errors, documentation is accurate, and all features work properly.

### Concrete Deliverables
- Fixed Makefile with working `help` command
- Updated GitHub Actions workflow (Hugo v0.154.5)
- Updated README.md (PaperMod references)
- Clean git configuration (.gitmodules created)
- Verified build process
- Verified deployment pipeline readiness
- Verification evidence (screenshots, build output)

### Definition of Done
- [ ] `make help` command works without errors
- [ ] `make all` builds successfully with no warnings
- [ ] GitHub Actions workflow updated to Hugo v0.154.5
- [ ] README.md references PaperMod instead of Hugo-Coder
- [ ] Git submodule properly documented in .gitmodules
- [ ] Blog can be previewed locally (hugo server)
- [ ] Build output verified (44 pages generated)
- [ ] CI/CD workflow syntax validated

### Must Have
- Makefile functional (all targets working)
- CI/CD workflow version matches local Hugo
- Documentation accurate for current setup
- No build errors or warnings
- Deployment pipeline verified (without actual deployment)

### Must NOT Have (Guardrails)
- Do NOT deploy to production (verification only, no actual gh-pages push)
- Do NOT install npm/yarn packages (blog is pure Hugo)
- Do NOT modify theme files (PaperMod is a git submodule, should remain untouched)
- Do NOT change base URL or domain configuration (raulcorreia.dev)
- Do NOT create new blog posts or content (fix-only scope)
- AI Slop Pattern to avoid: Don't add extensive inline documentation in Makefile - keep it minimal and hackerstyle
- AI Slop Pattern to avoid: Don't over-engineer Doom shortcode fix - remove it instead

---

## Verification Strategy

> Blog is pure Hugo with no test framework. Verification uses automated commands + Playwright for UI validation.

### Test Decision
- **Infrastructure exists**: NO (Hugo has no built-in test framework)
- **User wants tests**: Manual verification (automated commands + Playwright)
- **Framework**: None (Hugo static site generator)

### Automated Verification (ZERO User Intervention)

> **CRITICAL PRINCIPLE: ZERO USER INTERVENTION**
>
> **NEVER** create acceptance criteria that require:
> - "User manually tests..." / "User opens browser..."
> - "User visually confirms..." / "User checks if it works..."
> - Any step that requires a human to perform an action
>
> **ALL verification MUST be automated and executable by the agent.**

Each TODO includes EXECUTABLE verification procedures:

**By Deliverable Type:**

| Type | Verification Tool | Automated Procedure |
|------|------------------|---------------------|
| **Build/Makefile** | Bash make command | Agent runs make commands, captures output, validates exit codes |
| **Config Files** | Bash grep/hugo | Agent validates config syntax and checks version strings |
| **Documentation** | Bash grep | Agent searches for outdated strings, validates replacements |
| **UI/Blog Preview** | Playwright browser via playwright skill | Agent navigates, takes screenshots, validates DOM elements |
| **CI/CD Workflow** | YAML linter via Bash | Agent validates YAML syntax, checks version strings |

**Evidence Requirements (Agent-Executable):**
- Command output captured and compared against expected patterns
- Screenshots saved to .sisyphus/evidence/ for UI verification
- Exit codes checked (0 = success)
- YAML syntax validation (no parse errors)

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Start Immediately):
├── Task 1: Fix Makefile (duplicate help: target)
├── Task 2: Update GitHub Actions workflow (Hugo version)
└── Task 3: Update README.md (theme references)

Wave 2 (After Wave 1):
├── Task 4: Clean up git submodule references
└── Task 5: Verify build process locally

Wave 3 (After Wave 2):
└── Task 6: Verify deployment pipeline readiness

Critical Path: Task 1 → Task 5 → Task 6
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 5 | 2, 3 |
| 2 | None | 6 | 1, 3 |
| 3 | None | None | 1, 2 |
| 4 | None | None | 1, 2, 3, 5 |
| 5 | 1 | 6 | 2, 3, 4 |
| 6 | 2, 5 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3 | delegate_task(category="quick", load_skills=[], run_in_background=true) |
| 2 | 4, 5 | delegate_task(category="quick", load_skills=[], run_in_background=true) |
| 3 | 6 | delegate_task(category="quick", load_skills=['git-master'], run_in_background=false) |

---

## TODOs

> Implementation + Verification = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [ ] 1. Fix Makefile Duplicate help: Target

  **What to do**:
  - Read makefile at /home/rcorreia/projects/blog/makefile
  - Identify line 13 which incorrectly has `help:` as a target instead of recipe indentation
  - Remove the duplicate `help:` target on line 13 (should be indented recipe, not a new target)
  - Ensure indentation uses tabs (not spaces) for makefile recipe
  - Verify all other targets remain intact (all, clean, watch, public, dependencies, init)

  **Must NOT do**:
  - Do NOT add extensive inline documentation to Makefile (keep it minimal, hackerstyle)
  - Do NOT modify other makefile targets or logic
  - Do NOT convert to Makefile (uppercase) - keep as makefile (lowercase)

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: This is a straightforward text file edit with clear, deterministic change. No specialized skills needed beyond file manipulation.
  - **Skills**: []
    - No specialized skills required - standard file editing suffices.
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed for this task (no git operations required yet)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 5 (build verification depends on fixed Makefile)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `/home/rcorreia/projects/blog/makefile:12-13` - The duplicate help: target that needs fixing
  - `/home/rcorreia/projects/blog/makefile:26-27` - Example of correct recipe indentation (clean target uses tabs)

  **Test References** (testing patterns to follow):
  - None (Hugo has no built-in test framework)

  **Documentation References** (specs and requirements):
  - Makefile syntax: Target lines are unindented, recipe lines start with TAB character

  **External References** (libraries and frameworks):
  - GNU Make manual: https://www.gnu.org/software/make/manual/make.html#Rule-Syntax

  **WHY Each Reference Matters** (explain the relevance):
  - Line 12-13: This is where the bug exists - executor must understand the incorrect structure before fixing
  - Line 26-27: Shows correct indentation pattern (TAB character) that executor should follow

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Bash commands)**:
  ```bash
  # Agent runs:
  make help
  # Assert: Exit code is 0 (success)
  # Assert: Output contains "Usage: make <command>"
  # Assert: Output contains available targets: all, clean, server, watch, public, dependencies

  make all
  # Assert: Exit code is 0 (success)
  # Assert: Output contains "Start building sites" or similar Hugo build message
  # Assert: Exit code 0 means no syntax errors in makefile

  head -15 makefile
  # Assert: Line 12 starts with "help:" (no leading whitespace)
  # Assert: Line 13 does NOT contain "help:" (no duplicate target)
  # Assert: Line 13 starts with TAB character (recipe indentation)
  ```

  **Evidence to Capture**:
  - [ ] Terminal output from `make help` command
  - [ ] Terminal output from `make all` command
  - [ ] First 15 lines of fixed makefile showing proper structure

  **Commit**: YES (groups with Tasks 2, 3)
  - Message: `fix(build): resolve makefile duplicate help target`
  - Files: `makefile`
  - Pre-commit: `make help && make all`

---

- [ ] 2. Update GitHub Actions Workflow Hugo Version

  **What to do**:
  - Read .github/workflows/build-hugo-website.yml
  - Locate line 22 with `hugo-version: '0.140.0'`
  - Update version string to `'0.154.5'` to match local Hugo version
  - Verify workflow YAML syntax is valid after change
  - Ensure all other workflow configuration remains intact

  **Must NOT do**:
  - Do NOT modify other workflow configuration (triggers, deploy settings, etc.)
  - Do NOT change GitHub Actions action versions (peaceiris/actions-hugo@v3, peaceiris/actions-gh-pages@v4)
  - Do NOT modify deploy branch or directory settings

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Simple version string update in YAML file. Deterministic change requiring file editing.
  - **Skills**: []
    - No specialized skills needed - YAML file editing is straightforward.
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed yet (git operations come later in cleanup task)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 6 (deployment verification depends on updated workflow)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `.github/workflows/build-hugo-website.yml:19-24` - Hugo setup step with version configuration
  - `.github/workflows/build-hugo-website.yml:26-27` - Build step using make all

  **Test References** (testing patterns to follow):
  - None (Hugo has no built-in test framework)

  **Documentation References** (specs and requirements):
  - Hugo version in local environment: 0.154.5-extended (from research)
  - GitHub Actions workflow structure for Hugo sites

  **External References** (libraries and frameworks):
  - GitHub Actions Hugo action: https://github.com/peaceiris/actions-hugo
  - Hugo release notes: https://github.com/gohugoio/hugo/releases (verify 0.154.5 exists)

  **WHY Each Reference Matters** (explain the relevance):
  - Line 22: This is where the version mismatch exists - executor must update this specific line
  - Hugo releases: Executor can verify 0.154.5 is a valid release version

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Bash commands)**:
  ```bash
  # Agent runs:
  grep "hugo-version:" .github/workflows/build-hugo-website.yml
  # Assert: Output contains "hugo-version: '0.154.5'" (NOT 0.140.0)

  hugo version
  # Assert: Output contains "0.154.5" (verify local matches CI version)

  # Validate YAML syntax (using python if available, or basic structure check)
  python3 -c "import yaml; yaml.safe_load(open('.github/workflows/build-hugo-website.yml'))" 2>/dev/null || echo "YAML syntax OK"
  # Assert: No syntax errors (exit code 0)

  cat .github/workflows/build-hugo-website.yml | grep -A 5 "Setup Hugo"
  # Assert: Shows updated version in hugo-version field
  ```

  **Evidence to Capture**:
  - [ ] Grep output showing updated Hugo version
  - [ ] Hugo version output from local environment
  - [ ] YAML syntax validation result
  - [ ] Context around "Setup Hugo" step in workflow file

  **Commit**: YES (groups with Tasks 1, 3)
  - Message: `ci(hugo): update workflow to hugo v0.154.5`
  - Files: `.github/workflows/build-hugo-website.yml`
  - Pre-commit: `grep "hugo-version" .github/workflows/build-hugo-website.yml`

---

- [ ] 3. Update README.md Theme References

  **What to do**:
  - Read README.md
  - Search for all occurrences of "Hugo-Coder" or "hugo-coder"
  - Replace with "PaperMod" (case-sensitive: PaperMod)
  - Update acknowledgements section to credit PaperMod theme author (Aditya Telange)
  - Verify link to PaperMod GitHub repository
  - Keep all other README content intact (license, badges, etc.)

  **Must NOT do**:
  - Do NOT change LICENSE, project description, or other metadata
  - Do NOT modify shield badges or links (except theme-specific ones)
  - Do NOT add extensive new sections - keep existing structure
  - Do NOT remove contact information or acknowledgements section

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Straightforward text search-and-replace operation. No complex logic required.
  - **Skills**: []
    - No specialized skills needed - file editing with search/replace is basic.
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed for this task (no git operations required)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: None (standalone documentation task)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `/home/rcorreia/projects/blog/README.md:95` - "Built With" section listing Hugo-Coder theme
  - `/home/rcorreia/projects/blog/README.md:178` - Acknowledgements section crediting Luiz de Prá

  **Test References** (testing patterns to follow):
  - None (documentation update, no tests)

  **Documentation References** (specs and requirements):
  - PaperMod GitHub: https://github.com/adityatelange/hugo-PaperMod
  - PaperMod author: Aditya Telange (not Luiz de Prá who created Hugo-Coder)

  **External References** (libraries and frameworks):
  - PaperMod theme: https://github.com/adityatelange/hugo-PaperMod

  **WHY Each Reference Matters** (explain the relevance):
  - Line 95: Executor must replace "Hugo-Coder" theme reference here
  - Line 178: Executor must update acknowledgements to credit correct theme author

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Bash commands)**:
  ```bash
  # Agent runs:
  grep -i "hugo-coder" README.md
  # Assert: No results (all references replaced)
  # Assert: Exit code 1 (no matches found)

  grep -i "papermod" README.md | head -5
  # Assert: Multiple results found (theme references updated)
  # Assert: Output includes "Built With" section and acknowledgements

  grep "Aditya" README.md
  # Assert: Output exists (new author credited)
  # Assert: Line appears in acknowledgements section

  cat README.md | grep -A 2 "Built With"
  # Assert: Shows PaperMod in theme list
  ```

  **Evidence to Capture**:
  - [ ] Grep results showing no "hugo-coder" references remain
  - [ ] Grep results showing "PaperMod" references added
  - [ ] Acknowledgements section showing updated credit

  **Commit**: YES (groups with Tasks 1, 2)
  - Message: `docs(readme): update theme references to papermod`
  - Files: `README.md`
  - Pre-commit: `grep -i "hugo-coder" README.md` (should return nothing)

---

- [ ] 4. Clean Up Git Submodule References

  **What to do**:
  - Check current git status and submodule configuration
  - Verify themes/papermod is properly initialized as a git submodule
  - Create .gitmodules file documenting the PaperMod submodule with URL
  - Remove any stale references to old hugo-coder submodule from git config if present
  - Stage and verify the .gitmodules file is tracked correctly
  - Ensure submodule URL points to: https://github.com/adityatelange/hugo-PaperMod.git

  **Must NOT do**:
  - Do NOT remove or reinitialize the PaperMod submodule (it's working)
  - Do NOT modify theme files (themes/papermod/ should remain untouched)
  - Do NOT change submodule commit SHA (use current state)
  - Do NOT deinit submodules that are in use

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Git configuration task requiring submodule management. Straightforward git commands.
  - **Skills**: [`git-master`]
    - `git-master`: Domain overlap - this is git-specific configuration task involving submodules, git config, and .gitmodules file management.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not relevant (no UI changes)
    - `playwright`: Not relevant (no browser automation)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: None (standalone git cleanup task)
  - **Blocked By**: None (can start immediately, independent of file edits)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - Git config output from research: `[submodule "themes/papermod"]` with URL `https://github.com/adityatelange/hugo-PaperMod.git`
  - Standard .gitmodules format for Hugo theme submodules

  **Test References** (testing patterns to follow):
  - None (git configuration task, no tests)

  **Documentation References** (specs and requirements):
  - Git submodules documentation: https://git-scm.com/docs/git-submodule
  - .gitmodules file format specification

  **External References** (libraries and frameworks):
  - Git submodules guide: https://git-scm.com/book/en/v2/Git-Tools-Submodules
  - Hugo theme submodule best practices

  **WHY Each Reference Matters** (explain the relevance):
  - Git config: Executor must verify current submodule state before creating .gitmodules
  - Git docs: Executor can reference proper .gitmodules format for documentation

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Bash commands)**:
  ```bash
  # Agent runs:
  test -f .gitmodules
  # Assert: Exit code 0 (file exists)

  cat .gitmodules
  # Assert: Output contains "[submodule \"themes/papermod\"]"
  # Assert: Output contains "url = https://github.com/adityatelange/hugo-PaperMod.git"

  git config --file .gitmodules --list
  # Assert: Shows themes/papermod submodule configuration
  # Assert: No stale hugo-coder references

  git submodule status
  # Assert: themes/papermod shows initialized status
  # Assert: No warning or error messages
  ```

  **Evidence to Capture**:
  - [ ] Contents of .gitmodules file
  - [ ] Git submodule status output
  - [ ] Git config list for .gitmodules

  **Commit**: NO (part of later group commit or standalone)
  - Message: `chore(git): add .gitmodules to document papermod submodule`
  - Files: `.gitmodules`
  - Pre-commit: `git submodule status`

---

- [ ] 5. Verify Build Process Locally

  **What to do**:
  - Clean previous build artifacts (`rm -rf public/`)
  - Run full build with `hugo --gc --minify -d public`
  - Capture build output including page counts and timing
  - Verify no warnings or errors in build log
  - Check that expected pages are generated (posts/, categories/, tags/, about/)
  - Verify index.html exists in public/ directory
  - Confirm CNAME file is present in public/ (for custom domain)

  **Must NOT do**:
  - Do NOT modify content files (posts, pages, etc.)
  - Do NOT change theme configuration
  - Do NOT start local development server (build verification only)

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Build verification task - run Hugo command and capture output. Straightforward execution.
  - **Skills**: []
    - No specialized skills needed - Hugo build command is simple CLI execution.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not relevant (no UI changes)
    - `playwright`: Used later for UI preview, not needed for build verification

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential - depends on Makefile fix)
  - **Parallel Group**: Sequential after Task 1
  - **Blocks**: Task 6 (deployment verification needs successful build)
  - **Blocked By**: Task 1 (Makefile must be fixed first)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - Makefile target at line 32-33: `public:` target with `$(HUGO) $(FLAGS) -d $(DEST)`
  - Research findings: Expected 44 pages generated in ~35ms

  **Test References** (testing patterns to follow):
  - None (build verification task, no tests)

  **Documentation References** (specs and requirements):
  - Hugo build command documentation: https://gohugo.io/commands/hugo/
  - Hugo CLI flags: --gc (garbage collection), --minify (minify HTML/CSS/JS)

  **External References** (libraries and frameworks):
  - Hugo documentation: https://gohugo.io/

  **WHY Each Reference Matters** (explain the relevance):
  - Makefile line 32-33: Executor should understand the build command being run
  - Hugo docs: Executor can verify command flags are correct

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Bash commands)**:
  ```bash
  # Agent runs:
  rm -rf public/ && hugo --gc --minify -d public
  # Assert: Exit code 0 (build succeeded)
  # Assert: Output contains "Pages:" or "total pages" count around 44
  # Assert: No ERROR or FATAL messages in output
  # Assert: Build time < 100ms (as previously observed)

  test -f public/index.html
  # Assert: Exit code 0 (index exists)

  test -f public/CNAME
  # Assert: Exit code 0 (CNAME present for custom domain)

  ls -la public/ | head -20
  # Assert: Shows categories/, posts/, tags/, about/ directories
  # Assert: Shows index.html and sitemap.xml files

  grep -r "ERROR\|FATAL" public/ 2>/dev/null || echo "No errors found"
  # Assert: No error strings in generated files
  ```

  **Evidence to Capture**:
  - [ ] Full Hugo build output with page counts and timing
  - [ ] Directory listing of public/ showing expected structure
  - [ ] Confirmation of CNAME file presence
  - [ ] Search for error strings (should find none)

  **Commit**: NO (verification only, no changes to commit)

---

- [ ] 6. Verify Deployment Pipeline Readiness

  **What to do**:
  - Validate GitHub Actions workflow YAML syntax is correct
  - Verify Hugo version in workflow matches local (0.154.5)
  - Check that workflow uses correct build command (`make all`)
  - Verify deploy condition targets correct branch (`master`)
  - Confirm deploy directory is set to `./public`
  - Verify CNAME parameter is set to `raulcorreia.dev`
  - Check that `make all` target exists in Makefile
  - Verify all workflow steps are properly ordered (checkout → setup → build → deploy)
  - Ensure workflow triggers are correct (push to master, pull requests)

  **Must NOT do**:
  - Do NOT trigger actual GitHub Actions workflow run
  - Do NOT deploy to GitHub Pages (verification only)
  - Do NOT modify GitHub Secrets or repository settings
  - Do NOT create or modify gh-pages branch

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Workflow verification task - check YAML syntax and configuration. Simple validation.
  - **Skills**: [`git-master`]
    - `git-master`: Domain overlap - GitHub Actions workflow is git-based configuration, and executor may need to check git branch references, workflow files, and ensure proper integration with git workflows.
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not relevant (no UI changes)
    - `playwright`: Not relevant (no browser automation needed)

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential - depends on Tasks 2 and 5)
  - **Parallel Group**: Sequential after Wave 2
  - **Blocks**: None (final verification task)
  - **Blocked By**: Task 2 (workflow must be updated), Task 5 (build must work)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `.github/workflows/build-hugo-website.yml:1-36` - Complete workflow file
  - Makefile target at line 32-33: `public:` target that workflow calls via `make all`
  - CNAME file content: `raulcorreia.dev`

  **Test References** (testing patterns to follow):
  - None (workflow verification task, no tests)

  **Documentation References** (specs and requirements):
  - GitHub Actions workflow syntax: https://docs.github.com/en/actions
  - GitHub Actions Hugo action: https://github.com/peaceiris/actions-hugo
  - GitHub Actions Pages action: https://github.com/peaceiris/actions-gh-pages

  **External References** (libraries and frameworks):
  - GitHub Actions docs: https://docs.github.com/en/actions

  **WHY Each Reference Matters** (explain the relevance):
  - Workflow file: Executor must verify all steps are correctly configured
  - Makefile: Executor must confirm workflow calls existing make target
  - CNAME: Executor must verify workflow parameter matches actual domain

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Bash commands)**:
  ```bash
  # Agent runs:
  python3 -c "import yaml; yaml.safe_load(open('.github/workflows/build-hugo-website.yml'))" 2>/dev/null && echo "YAML valid"
  # Assert: Exit code 0 (valid YAML syntax)

  cat .github/workflows/build-hugo-website.yml | grep "hugo-version"
  # Assert: Output contains "0.154.5" (not 0.140.0)

  cat .github/workflows/build-hugo-website.yml | grep "Deploy" -A 5
  # Assert: Shows "if: \${{ github.ref == 'refs/heads/master' }}"
  # Assert: Shows "publish_dir: ./public"
  # Assert: Shows "cname: raulcorreia.dev"

  cat makefile | grep "^all:"
  # Assert: Output exists (all target present)

  cat makefile | grep "^public:"
  # Assert: Output exists (public target present)

  cat .github/workflows/build-hugo-website.yml | grep "run: make all"
  # Assert: Output exists (workflow calls correct make target)
  ```

  **Evidence to Capture**:
  - [ ] YAML syntax validation result
  - [ ] Hugo version in workflow
  - [ ] Deploy step configuration (branch, directory, CNAME)
  - [ ] Makefile targets existence check
  - [ ] Workflow build command confirmation

  **Commit**: NO (verification only, no changes to commit)

---

- [ ] 7. Optional: Preview Blog Locally (Playwright Verification)

  **What to do**:
  - Start Hugo development server with `hugo server -D --port 1313`
  - Wait for server to start (typically 1-2 seconds)
  - Use Playwright to navigate to http://localhost:1313
  - Verify homepage loads successfully (HTTP 200)
  - Take screenshot of homepage
  - Check that blog post titles appear on homepage
  - Navigate to a blog post page
  - Verify post content loads and renders correctly
  - Take screenshot of blog post page
  - Check for theme elements (header, footer, navigation)
  - Verify dark/light mode toggle works (if present)
  - Stop Hugo server after verification

  **Must NOT do**:
  - Do NOT modify any content or theme files during preview
  - Do NOT deploy or push changes (local preview only)
  - Do NOT leave Hugo server running after verification

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `visual-engineering`
    - Reason: This task requires browser automation and UI verification. Playwright skill is essential for navigating, taking screenshots, and validating DOM elements.
  - **Skills**: [`dev-browser`]
    - `dev-browser`: Domain overlap - this is exactly what dev-browser is for: browser automation, navigating websites, taking screenshots, and verifying UI elements interactively.
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not relevant (no git operations)
    - `frontend-ui-ux`: Not needed (no UI changes, only verification)

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential - depends on successful build)
  - **Parallel Group**: Sequential after Task 5
  - **Blocks**: None (optional verification task)
  - **Blocked By**: Task 5 (build must succeed before server can start)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - Makefile watch target at line 29-30: `hugo server -w $(DEV_FLAGS)` (similar to server command needed)
  - Config.yml: Base URL https://raulcorreia.dev (local server uses localhost)
  - Research findings: Blog has 3 posts in /content/posts/

  **Test References** (testing patterns to follow):
  - None (browser-based verification, no tests)

  **Documentation References** (specs and requirements):
  - Hugo server documentation: https://gohugo.io/commands/hugo_server/
  - PaperMod theme: https://github.com/adityatelange/hugo-PaperMod (theme structure)

  **External References** (libraries and frameworks):
  - Playwright docs: https://playwright.dev/
  - PaperMod demo: https://adityatelange.github.io/hugo-PaperMod/

  **WHY Each Reference Matters** (explain the relevance):
  - Makefile: Executor can see correct Hugo server command format
  - Config: Executor knows base URL vs localhost distinction
  - PaperMod demo: Executor can verify expected theme elements (header, navigation, etc.)

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **Automated Verification (Playwright via dev-browser skill)**:
  ```typescript
  // Agent executes via Playwright browser automation:
  // Step 1: Start Hugo server (background)
  hugo server -D --port 1313 > /dev/null 2>&1 &
  HUGO_PID=$!
  sleep 3

  // Step 2: Navigate to homepage
  Navigate to: http://localhost:1313

  // Step 3: Verify homepage loads
  Assert: HTTP status is 200
  Assert: Page title contains "Raul" or "Correia"
  Assert: At least one blog post link is visible

  // Step 4: Take screenshot
  Screenshot: .sisyphus/evidence/blog-homepage.png

  // Step 5: Navigate to first blog post
  Click: First blog post link in posts list
  Wait: Page load complete (network idle)

  // Step 6: Verify post content
  Assert: Post title is visible
  Assert: Post content (paragraphs) are visible
  Assert: No broken images or error messages

  // Step 7: Take screenshot
  Screenshot: .sisyphus/evidence/blog-post-page.png

  // Step 8: Check theme elements
  Assert: Header/navigation is visible
  Assert: Footer is visible
  Assert: Dark/light mode toggle (if present) is clickable

  // Step 9: Stop server
  kill $HUGO_PID
  ```

  **Evidence to Capture**:
  - [ ] Terminal output from Hugo server start
  - [ ] Screenshot of homepage (.sisyphus/evidence/blog-homepage.png)
  - [ ] Screenshot of blog post page (.sisyphus/evidence/blog-post-page.png)
  - [ ] Playwright navigation and assertion results

  **Commit**: NO (verification only, no changes to commit)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1, 2, 3 (grouped) | `fix(build): resolve makefile and ci issues, update docs` | makefile, .github/workflows/build-hugo-website.yml, README.md | `make help && make all` |
| 4 | `chore(git): add .gitmodules for papermod` | .gitmodules | `git submodule status` |
| 5, 6, 7 (verification) | No commit (verification only) | N/A | N/A |

---

## Success Criteria

### Verification Commands
```bash
# Build verification
make all
# Expected: Exit code 0, 44 pages generated

# Workflow verification
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/build-hugo-website.yml'))"
# Expected: No syntax errors

# Documentation verification
grep -i "hugo-coder" README.md
# Expected: No results (exit code 1)

# Git submodule verification
test -f .gitmodules && git submodule status
# Expected: .gitmodules exists, papermod initialized
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Makefile help command works
- [ ] Build succeeds without errors
- [ ] CI/CD workflow updated to Hugo v0.154.5
- [ ] README.md updated to PaperMod references
- [ ] Git submodule properly documented
- [ ] Deployment pipeline verified
- [ ] Screenshots captured (if Playwright verification performed)
