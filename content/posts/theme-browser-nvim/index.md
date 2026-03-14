---
title: "Building a Theme Browser for Neovim"
date: 2026-03-14
description: "How I built theme-browser.nvim to browse, preview, and install Neovim themes without leaving the editor"
draft: false
categories: ["project"]
tags: ["neovim", "lua", "typescript", "ai"]
---

---

When I started using Neovim, one of the first things I wanted to do was make it feel like mine. That should have been simple: find a theme that I like, add it to my config, and move on.

In practice, it was awkward. Every time I wanted to try a theme, I had to leave Neovim, search GitHub or a theme site, edit my config, install the plugin, reload, preview it, and then decide whether it was worth keeping. That loop got old quickly.

What bothered me was not that the workflow was technically difficult. It was that it constantly broke flow. Theme selection felt like a browser task when it should have felt like an editor task. I built this because I just wanted to find a theme I like in my editor.

## The Problem

The normal workflow for trying a theme looked something like this:

```text
+------------------- PROBLEM FLOW -------------------+

                    +--------+
                    | Search |
                    +--------+
                         |
                         v
                 +---------------+
                 | Edit config   |
                 +---------------+
                         |
                         v
                   +-----------+
                   | Install   |
                   +-----------+
                         |
                         v
                   +-----------+
                   | Apply     |
                   +-----------+
                         |
                         v
                   +-----------+
                   | Preview   |
                   +-----------+
                         |
                         v
                   +-----------+
                   | Like it?  |
                   +-----+-----+
                         |
                    +----+----+
                    |         |
                   no        yes
                    |         |
                    v         v
            +---------------+ +------+
            | Search again  | | Done |
            +---------------+ +------+

+----------------------------------------------------+
```

Nothing there is especially hard. It is just too much friction for something that is supposed to be lightweight and visual. Every iteration means leaving Neovim, opening a browser, modifying config, restarting, checking, and undoing. Theme selection was already possible; the real goal was to make it feel native.

## The Goal

What I wanted was straightforward:

- browse themes from inside Neovim
- preview them immediately
- install them without manual config churn
- make the result feel native to the user's setup

In other words, less context switching, less ceremony, and less throwaway config editing. That became the core idea behind [**theme-browser.nvim**](https://github.com/raulcorreia7/theme-browser.nvim).

## Start with the Plugin

I started with the Neovim side first. The initial idea was simple: render a list of themes, let the user pick one, and apply it. That worked right up until I hit the first real problem: **themes do not load the same way**.

Some expose `setup()`. Some are module-driven and need a custom entry point. Some are plain `:colorscheme` themes, sometimes with multiple variants. There was no single loading path I could rely on.

Here are the kinds of patterns I kept running into:

```lua
-- setup()
require("tokyonight").setup({})
vim.cmd.colorscheme("tokyonight")
```

```lua
-- custom entry point
require("some_theme").apply(...)
```

```lua
-- plain colorscheme / variant
vim.cmd.colorscheme("catppuccin-latte")
```

If the plugin was going to support more than a handful of themes, I needed to stop treating them as if they were all shaped the same. So I used an adapter-style approach: each theme carries metadata describing how it should be loaded, and the plugin dispatches to the right strategy at runtime.

```json
{
  "name": "catppuccin-latte",
  "colorscheme": "catppuccin-latte",
  "repo": "catppuccin/nvim",
  "strategy": "colorscheme"
}
```

That metadata does not live in the plugin itself. It comes from the registry artifact, `themes.json`. The registry is the source of truth, and the plugin consumes it.

```lua
-- simplified metadata derived from registry/themes.json
{ name = "tokyonight",       colorscheme = "tokyonight",       strategy = "setup" }
{ name = "some_theme",       colorscheme = "some_theme",       strategy = "module" }
{ name = "catppuccin-latte", colorscheme = "catppuccin-latte", strategy = "colorscheme" }

local function apply(entry)
  if entry.strategy == "setup" then
    require(entry.module).setup({})
    vim.cmd.colorscheme(entry.colorscheme)
  elseif entry.strategy == "module" then
    require(entry.module).apply(entry)
  else
    vim.cmd.colorscheme(entry.colorscheme)
  end
end
```

That solved the runtime problem, but it exposed the bigger one: **where does that metadata come from, and how do I keep it correct across hundreds of themes?** I did not want to hand-maintain a giant list of themes, variants, and loading strategies because that would become stale almost immediately.

## Designing the Picker

Before building the UI, I looked at tools that already felt good inside Neovim.

| Plugin                                                             | What I took from it                        |
| ------------------------------------------------------------------ | ------------------------------------------ |
| [lazy.nvim](https://github.com/folke/lazy.nvim)                    | direct picker flow and practical plugin UX |
| [nui.nvim](https://github.com/MunifTanjim/nui.nvim)                | floating windows and popup primitives      |
| [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) | filtering and fuzzy-search patterns        |

I did not want to invent new interaction patterns for the sake of it. The picker should feel familiar, not novel. The result was intentionally small: live filtering, instant preview, status indicators, minimal assumptions about the user's setup, and graceful fallback behaviour where possible.

I kept the boundaries clean on purpose:

```text
+--------------------------- PLUGIN ---------------------------+

                    +----------------------+
                    |      Picker UI       |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    Theme Service     |
                    +----------+-----------+
                               |
           +-------------------+-------------------+
           |                                       |
           v                                       v
   +----------------------+               +------------------+
   |   Registry Adapter   |               |  Neovim runtime |
   +----------------------+               +------------------+

+-------------------------------------------------------------+
```

And in practice:

```text
+--------------------------- PLUGIN ---------------------------+

                    +----------------------+
                    |      Picker UI       |
                    |----------------------|
                    | - popup              |
                    | - filter/search      |
                    | - keymaps            |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    Theme Service     |
                    |----------------------|
                    | - preview            |
                    | - install            |
                    | - persist            |
                    | - restore            |
                    +----------+-----------+
                               |
           +-------------------+-------------------+
           |                                       |
           v                                       v
   +----------------------+               +----------------------+
   |   Registry Adapter   |               |   Neovim runtime    |
   |----------------------|               |----------------------|
   | - load themes.json   |               | - runtimepath       |
   | - parse metadata     |               | - colorscheme       |
   | - expose entries     |               | - active theme      |
   +----------------------+               +----------------------+

+-------------------------------------------------------------+
```

The responsibilities are simple. The **Picker UI** handles rendering and interaction. The **Theme Service** owns the workflow: preview, install, persist, and restore. The **Registry Adapter** loads and interprets `themes.json`. The **Neovim runtime** is where the theme is actually applied.

That separation made the plugin easier to reason about, easier to test, and easier to change without everything collapsing together. The plugin part became manageable pretty quickly. The data part did not.

## Build the Registry

Once the plugin existed, the next problem was obvious: a theme browser is only as good as the data behind it.

I did not want a manually curated catalog because that would be too much maintenance for too little payoff. I also did not want one giant script that did everything badly. So I split the registry into a separate pipeline-driven package.

The registry does a few things:

- crawls GitHub repositories
- detects how themes load
- discovers variants
- merges curated overrides
- emits JSON artifacts for the plugin to consume

The most important design decision was keeping the plugin and registry loosely coupled. The registry produces artifacts. The plugin consumes them.

```text
+----------------------------- REGISTRY -----------------------------+

     +---------+    +--------+    +--------+    +--------------------+
     | Crawl   | -> | Detect | -> | Merge  | -> | build themes.json  |
     +---------+    +--------+    +--------+    +--------------------+

+-------------------------------------------------------------------+

                        produces github artifact
                                 |
                                 v

                        +----------------------+
                        |     themes.json      |
                        +----------------------+

                                 ^
                                 |
                        consumes from github

+------------------------------ PLUGIN ------------------------------+

     +----------------+    +----------------+    +------------------+
     |RegistryAdapter | -> | Theme Service  | -> | Neovim runtime   |
     +--------+-------+    +--------+-------+    +------------------+
              |
              v
     +----------------+
     |   Picker UI    |
     +----------------+

+-------------------------------------------------------------------+
```

That boundary ended up being one of the most important parts of the project. The registry owns discovery, classification, and artifact generation. The plugin owns interaction, preview, installation, and restore. `themes.json` is the contract between both sides.

This means I can evolve the detection pipeline without hardcoding new behaviour into the UI every time a theme behaves differently.

A simplified version of the consumption path looks like this:

```lua
local registry = require("theme-browser.registry")
local themes = registry.load("themes.json")

for _, theme in ipairs(themes) do
  -- theme.name
  -- theme.repo
  -- theme.strategy
  -- theme.module
end
```

That may look like a small detail, but it changed the shape of the whole project. Once the plugin stopped owning the metadata, it became much easier to scale.

## Why a Pipeline

I wanted something I could debug in pieces, not a monolith and not a single command that either worked or did not. A pipeline gave me a much better development loop: run one stage in isolation, inspect intermediate output, cache expensive work, and rerun only the part I am changing.

```text
+------------------------- PIPELINE ---------------------------+

   +-------------+    +-------------------+    +------------------+
   | GitHub crawl| -> | Detect strategies | -> | Merge overrides  |
   +-------------+    | and variants      |    +--------+---------+
                      +-------------------+             |
                                                        v
                                               +------------------+
                                               | Bundle themes    |
                                               | .json            |
                                               +--------+---------+
                                                        |
                                                        v
                                               +------------------+
                                               | Validate         |
                                               +------------------+

+-------------------------------------------------------------+
```

Each stage is a standalone CLI task:

```bash
# Debug one repository
tsx tasks/detect.ts --repo folke/tokyonight.nvim
```

I kept each stage runnable on its own while building it because that made debugging much easier. Once the pipeline was stable enough, I added a task that wraps the whole workflow into one command:

```bash
tsx tasks/pipeline.ts
```

That made development much easier. I could focus on one broken theme at a time, inspect the output, fix detection, and only then run the full build.

The pipeline caches repository metadata, README content, and scan results in SQLite. That was not a nice-to-have. It was necessary. Without caching, iterating on the registry quickly becomes annoying. With caching, I only re-fetch repositories that changed, which keeps the feedback loop fast enough to be practical.

## Detection Heuristics

The registry tries to answer two main questions:

1. **How should this theme be loaded?**
2. **What variants does it actually ship?**

The loading strategy is inferred from signals in the README and the source code.

| Signal                                 | Strategy    | Score |
| -------------------------------------- | ----------- | ----: |
| `require(...).setup(...)` in README    | setup       |     6 |
| documented module-specific entry point | module      |     6 |
| `:colorscheme` usage                   | colorscheme |     4 |
| `colors/*.vim` with no Lua setup path  | colorscheme |     6 |

Highest score wins.

For variants, the registry scans for colorscheme names and related files, and tries to enumerate what the theme actually provides:

- `tokyonight-day`
- `tokyonight-moon`
- `catppuccin-latte`
- `catppuccin-mocha`

That sounds straightforward until you deal with real repositories. Naming is inconsistent, documentation is inconsistent, and "light" or "dark" is not always obvious from the name.

A few examples:

| Theme/Variant            | Heuristic guess  | Actual       | Why it fails                           |
| ------------------------ | ---------------- | ------------ | -------------------------------------- |
| `nightfox.nvim`          | dark-only signal | mixed family | the name biases the classifier         |
| `arshamiser_light`       | light            | dark         | the name does not match the background |
| `base2tone_morning_dark` | light            | dark         | semantic words are misleading          |

This was the real insight. The problem was only partly a UI problem. It was also a data problem, and more than anything, a maintenance problem.

Building the picker was the easy part. What does not scale is the manual work behind it: going through repositories, finding every variant, figuring out what the theme actually looks like, and classifying it correctly as dark or light. That is the part I wanted to remove.

## LLM-Assisted Overrides

At that point, I had two options: keep adding more heuristics until the logic became brittle and ugly, or introduce a second pass for the difficult cases. I chose the second.

I used **opencode** as a CLI agent to inspect ambiguous themes and generate override metadata. These overrides sit on top of the heuristic output and survive future rebuilds.

```text
+---------------------- OVERRIDE FLOW ------------------------+

   +------------+    +-------------------+    +-----------+
   | Heuristics | -> | Ambiguous results | -> | Agent     |
   +------+-----+    +-------------------+    +-----+-----+
          |                                          |
          +-------------> +---------------+ <--------+
                         | override JSON  |
                         +-------+--------+
                                 |
                                 v
                         +---------------+
                         | Merge final   |
                         | registry      |
                         +---------------+

+------------------------------------------------------------+
```

In practice, it looks like this:

1. run heuristics
2. identify ambiguous or low-confidence results
3. feed README, source, and detection output to the agent
4. generate override JSON
5. merge overrides during the build

This was not “use AI because AI”. It was a practical boundary. I did not use an LLM to replace the pipeline. I used it to reduce the manual cleanup for the awkward cases the heuristics could not classify reliably.

The heuristics are good at scale and handle the repetitive cases cheaply. The agent is useful where rules start getting awkward: palette analysis, background inference, per-variant inspection, weird repository layouts, and unusual loading conventions.

So the split became clear: **heuristics for the bulk, LLM-assisted overrides for the messy edges**. That was the right trade-off for this project. Not fully automatic. Not perfect. Just maintainable.

## How It Works

{{< video src="theme-browser.mp4" >}}

From the user's perspective, the flow is small, but there are a few different paths through it. You can filter, move through the list, preview a theme temporarily and return to the editor, install a theme and keep browsing, or confirm the current selection and both apply and persist it.

```text
+-------------------------------- USER FLOW ---------------------------------+

                        +----------------+
                        | :ThemeBrowser  |
                        +--------+-------+
                                 |
                                 v
                        +----------------+
                        |   Theme list   |
                        +---+--------+---+
                            |        |
                +-----------+        +-------------------+
                |                                        |
                v                                        v
        +---------------+                        +----------------+
        | /: filter     |                        | next / prev    |
        +-------+-------+                        +-------+--------+
                |                                        |
                +-------------------+--------------------+
                                    |
                                    v
                           +-------------------+
                           | update selection  |
                           +---------+---------+
                                     |
                                     v
                                +---------+
                                |  list   |
                                +---------+

        +---------------+       +----------------+       +----------------------+
        | p: preview    |       | i: install     |       | Enter                |
        +-------+-------+       +--------+-------+       +----------+-----------+
                |                        |                          |
                v                        v                          v
        +---------------+       +----------------+       +----------------------+
        | apply temp    |       | install        |       | apply + install      |
        +-------+-------+       +--------+-------+       | + persist            |
                |                        |               +----------+-----------+
                v                        |                          |
        +---------------+                +-------> back to list     v
        | editor        |                                   +------------------+
        +---------------+                                   | save theme/config|
                                                            +---------+--------+
                                                                      |
                                                                      v
                                                                +-----------+
                                                                |  editor   |
                                                                +-----------+

+---------------------------------------------------------------------------+
```

That becomes:

1. run `:ThemeBrowser`
2. filter with `/`
3. move through themes with next and previous
4. press `p` to preview temporarily and return to the editor
5. press `i` to install a theme and keep browsing
6. press `Enter` to apply, install, persist, and go back to the editor

That separation matters because preview is disposable, install can be incremental, and persist only happens when the user confirms. This keeps the picker fast while still making the final action feel native.

## Runtime Behaviour

### Preview

Preview should be fast and disposable. The plugin performs a shallow clone, adds the theme to `runtimepath`, and applies it temporarily.

```bash
git clone --depth 1 https://github.com/folke/tokyonight.nvim
```

That makes trialling a theme cheap.

### Install

Install should feel native. Instead of inventing a custom plugin mechanism, the plugin writes the entry in the same format the user would normally use:

```lua
{ "folke/tokyonight.nvim" }
```

Then the package manager handles the rest on the next startup. That was important to me because I did not want the plugin to fight the user's existing setup. I wanted it to integrate with it cleanly.

### Persistence and Restore

Once a theme is chosen, the selection is persisted to a Lua file:

```lua
vim.g.theme_browser_theme = "tokyonight"
```

On startup, the plugin restores it before the UI renders. That small detail matters because it changes the feel of the tool. It stops feeling like a temporary preview utility and starts feeling like part of the editor.

## Blacklists

Not everything belongs in the browser.

Some themes are better filtered out:

- built-in Neovim themes
- distro-specific defaults
- themes that are technically present but not useful in a general picker

The plugin also supports a user blacklist:

```lua
require("theme-browser").setup({
  blacklist = { "default", "blue", "my-custom-theme" }
})
```

That keeps the list more useful and cuts noise.

## Design Choices

A few choices were deliberate from the start:

| Choice                              | Why                                           |
| ----------------------------------- | --------------------------------------------- |
| Separate registry from plugin       | keeps runtime logic small and focused         |
| Artifact contract via `themes.json` | clean boundary between data generation and UI |
| Pipeline over monolith              | easier to debug, extend, and cache            |
| Heuristics first                    | fast and cheap for the common cases           |
| LLM overrides second                | useful where rules become awkward             |
| Native install flow                 | works with existing Neovim habits             |
| Graceful fallback behaviour         | avoids unnecessary dependency friction        |

The project was built for my own workflow first, especially with `lazy.nvim`, but the structure leaves room to support broader setups later.

## What This Taught Me

The interesting part of this project was not just building a Neovim plugin. It was everything needed to make the plugin simple: discovering themes, normalising how they load, identifying variants, and deciding where automation stops and curated data starts.

That is also why tools like this are rare. It is easy to support a small curated set of themes. It is much harder to support the wider GitHub ecosystem, where repositories are inconsistent, metadata is incomplete, and naming is all over the place.

Trying to do that manually is not maintainable. Automation is what makes it possible.

For this project, the balance that worked was simple: code for the predictable parts, heuristics for the repetitive parts, and an agent for the ugly edge cases. That was enough to turn an annoying manual workflow into something usable.

## What's Next

A few obvious next steps remain:

- automate registry releases
- improve CI around artifact generation
- support more plugin management setups
- possibly run the registry from a self-hosted service later

Right now the release process is still manual:

```bash
pnpm pipeline
git add artifacts/
gh release create v1.0.0
```

That works, but it is one of the next places where more automation makes sense.

## References

**Theme discovery:**

- [GitHub neovim-theme topic](https://github.com/topics/neovim-theme)
- [vimcolorschemes.com](https://vimcolorschemes.com)
- [dotfyle](https://dotfyle.com/neovim/colorscheme/top)

**UI references:**

- [lazy.nvim](https://github.com/folke/lazy.nvim)
- [nui.nvim](https://github.com/MunifTanjim/nui.nvim)
- [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim)

**Theme implementation references:**

- [catppuccin/nvim](https://github.com/catppuccin/nvim)
- [lush.nvim](https://github.com/rktjmp/lush.nvim)

**Project:**

- [theme-browser.nvim](https://github.com/raulcorreia7/theme-browser.nvim)
- [theme-browser-monorepo](https://github.com/raulcorreia7/theme-browser-monorepo)

## Closing Thoughts

I built this because I just wanted to find a theme I like in my editor.

The interesting part was not the picker itself. It was everything needed to make the picker simple: discovering themes, figuring out how they load, identifying variants, and keeping that process maintainable.

The result is a tool that lets me browse, preview, and install themes from inside Neovim without breaking flow, which is all I wanted in the first place.
