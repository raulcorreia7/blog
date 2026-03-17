---
title: "Building a Theme Browser for Neovim"
date: 2026-03-14
description: "How I built theme-browser.nvim to browse, preview, and install Neovim themes without leaving the editor"
draft: false
categories: ["project"]
tags: ["neovim", "lua", "typescript", "ai"]
---

When I started using Neovim, one of the first things I wanted was to make it feel like mine. That sounded simple: find a theme, add it to my config, and move on.

In practice, trying themes was awkward. I had to leave Neovim, search GitHub or a theme site, edit my config, install the plugin, reload, preview it, and then decide whether it was worth keeping. None of that was hard, but it kept breaking flow.

I built [**theme-browser.nvim**](https://github.com/raulcorreia7/theme-browser.nvim) because theme selection felt like a browser task when it should have felt like an editor task.

## Demo

{{< video src="theme-browser.mp4" >}}

## The Problem

The normal workflow looked like this:

```text
+----------------------+
|       Search         |
+----------+-----------+
           |
           v
+----------------------+
|     Edit config      |
+----------+-----------+
           |
           v
+----------------------+
|       Install        |
+----------+-----------+
           |
           v
+----------------------+
|    Reload / apply    |
+----------+-----------+
           |
           v
+----------------------+
|      Preview         |
+----------+-----------+
           |
           v
+----------------------+
|       Like it?       |
+----------+-----------+
           |
      +----+----+
      |         |
      v         v
+-----------+ +------+
| Try again | | Done |
+-----------+ +------+
```

That is too much friction for something lightweight and visual.

## The Goal

What I wanted was simple:

- Browse themes inside Neovim
- Preview them immediately
- Install them without manual config churn
- Make the result feel native to the user's setup

That became the core idea behind the plugin.

## The Plugin

I started with the Neovim side first: render a list of themes, let the user pick one, and apply it. That worked until I hit the first real problem: themes do not load the same way.

Some expose `setup()`. Some need a custom module entry point. Some are plain `:colorscheme` themes, sometimes with multiple variants.

A few common patterns looked like this:

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

To support more than a handful of themes, I stopped treating them as if they all had the same shape. Instead, each theme carries metadata describing how it should be loaded, and the plugin dispatches to the right strategy at runtime.

```json
{
  "name": "catppuccin-latte",
  "colorscheme": "catppuccin-latte",
  "repo": "catppuccin/nvim",
  "strategy": "colorscheme"
}
```

A simplified version of the runtime logic looks like this:

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

That solved the runtime problem, but it exposed the bigger one: where should that metadata come from, and how do I keep it correct across hundreds of themes?

## The Architecture

That is where the project split in two: a Neovim plugin for interaction, and a separate registry pipeline for discovery and metadata generation.

```text
+----------------------+
|      Picker UI       |
+----------+-----------+
           |
           v
+----------------------+
|    Theme Service     |
+----+------------+----+
     |            |
     v            v
+---------+   +--------+
| Registry |   | Nvim  |
| Adapter  |   |Runtime|
+---------+   +--------+

           ^
           |
+----------------------+
|     themes.json      |
+----------+-----------+
           ^
           |
+----------------------+
|   Registry pipeline  |
+----------------------+
```

The boundary is simple:

- the registry produces artifacts
- the plugin consumes them
- `themes.json` is the contract between both sides

That kept the runtime logic small and made the data pipeline easier to evolve independently.

## Building the Registry

A theme browser is only as good as the data behind it, so I moved discovery into a separate pipeline-driven package.

The registry does a few things:

- Crawls GitHub repositories
- Detects loading strategies
- Discovers variants
- Merges curated overrides
- Emits JSON artifacts for the plugin

I chose a pipeline instead of one large script because it is much easier to debug in pieces. I could run a single stage, inspect intermediate output, cache expensive work, and rerun only what changed.

```text
crawl
  |
  v
detect
  |
  v
merge overrides
  |
  v
build themes.json
  |
  v
validate
```

Each stage is runnable on its own:

```bash
# Debug one repository
tsx tasks/detect.ts --repo folke/tokyonight.nvim
```

And the full workflow can be wrapped in one command:

```bash
tsx tasks/pipeline.ts
```

The pipeline also caches repository metadata, README content, and scan results in SQLite so iteration stays fast enough to be practical.

## Detection and Overrides

The registry tries to answer two questions:

1. How should this theme be loaded?
2. What variants does it actually ship?

The loading strategy is inferred from signals in the README and source code.

| Signal                                 | Strategy    | Score |
| -------------------------------------- | ----------- | ----: |
| `require(...).setup(...)` in README    | setup       |     6 |
| documented module-specific entry point | module      |     6 |
| `:colorscheme` usage                   | colorscheme |     4 |
| `colors/*.vim` with no Lua setup path  | colorscheme |     6 |

Highest score wins.

For variants, the registry scans colorscheme names and related files to enumerate what a theme actually provides, for example:

- `tokyonight-day`
- `tokyonight-moon`
- `catppuccin-latte`
- `catppuccin-mocha`

This sounds straightforward until you deal with real repositories. Naming is inconsistent, documentation is inconsistent, and words like “light” or “dark” are not always reliable.

| Theme/Variant            | Heuristic guess  | Actual       | Why it fails                           |
| ------------------------ | ---------------- | ------------ | -------------------------------------- |
| `nightfox.nvim`          | dark-only signal | mixed family | the name biases the classifier         |
| `arshamiser_light`       | light            | dark         | the name does not match the background |
| `base2tone_morning_dark` | light            | dark         | semantic words are misleading          |

At that point, I had two choices: keep piling on more heuristics, or introduce a second pass for the messy cases. I chose the second.

I used **opencode** as a CLI agent to inspect ambiguous themes and generate override metadata. Those overrides sit on top of the heuristic output and survive future rebuilds.

The split became:

- heuristics for the bulk
- overrides for the awkward edge cases

That kept the system practical without trying to make it magically perfect.

## User Flow

From the user's perspective, the workflow stays small:

```text
:ThemeBrowser
      |
      v
   filter
      |
      v
 select theme
  |    |    |
  |    |    +--> Enter -> apply + install + persist
  |    |
  |    +-------> i -> install and keep browsing
  |
  +------------> p -> preview temporarily
```

That separation matters:

- preview is disposable
- install can be incremental
- persist happens only when the user confirms

## Runtime Behaviour

### Preview

Preview should be fast and disposable. The plugin performs a shallow clone, adds the theme to `runtimepath`, and applies it temporarily.

```bash
git clone --depth 1 https://github.com/folke/tokyonight.nvim
```

### Install

Install should feel native. Instead of inventing a custom plugin mechanism, the plugin writes the entry in the same format the user would normally use:

```lua
{ "folke/tokyonight.nvim" }
```

Then the package manager handles the rest on the next startup.

### Persistence and Restore

Once a theme is chosen, the selection is persisted to a Lua file:

```lua
vim.g.theme_browser_theme = "tokyonight"
```

On startup, the plugin restores it before the UI renders, which makes the tool feel like part of the editor rather than just a preview utility.

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

That keeps the list focused and cuts noise.

## Design Choices

A few choices were deliberate from the start:

| Choice                              | Why                                           |
| ----------------------------------- | --------------------------------------------- |
| Separate registry from plugin       | keeps runtime logic small and focused         |
| Artifact contract via `themes.json` | clean boundary between data generation and UI |
| Pipeline over monolith              | easier to debug, extend, and cache            |
| Heuristics first                    | fast and cheap for the common cases           |
| Overrides second                    | useful where rules become awkward             |
| Native install flow                 | works with existing Neovim habits             |
| Graceful fallback behaviour         | avoids unnecessary dependency friction        |

The project was built for my own workflow first, especially with `lazy.nvim`, but the structure leaves room to support broader setups later.

## What I Learned

The interesting part of this project was not just building a Neovim picker. It was everything required to make the picker simple: discovering themes, normalising loading behaviour, identifying variants, and deciding where automation stops and curated data starts.

Supporting a small curated set of themes is easy. Supporting the wider GitHub ecosystem is harder, because repositories are inconsistent, metadata is incomplete, and naming is all over the place.

The balance that worked here was straightforward:

- code for the predictable parts
- heuristics for the repetitive parts
- an agent for the ugly edge cases

That was enough to turn an annoying manual workflow into something usable.

## What's Next

A few obvious next steps remain:

- automate registry releases
- improve CI around artifact generation
- support more plugin manager setups
- possibly move the registry behind a small hosted service later

Right now the release process is still manual:

```bash
pnpm pipeline
git add artifacts/
gh release create v1.0.0
```

That works, but it is one of the next places where more automation makes sense.

## Closing Thoughts

I built this because I wanted to find a theme I like without leaving Neovim.

The picker is the visible part, but the real work was behind it: discovering themes, figuring out how they load, identifying variants, and keeping that process maintainable.

The result is a tool that lets me browse, preview, and install themes from inside the editor without breaking flow, which is exactly what I wanted.

## References

**Theme discovery**

- [GitHub neovim-theme topic](https://github.com/topics/neovim-theme)
- [vimcolorschemes.com](https://vimcolorschemes.com)
- [dotfyle](https://dotfyle.com/neovim/colorscheme/top)

**UI references**

- [lazy.nvim](https://github.com/folke/lazy.nvim)
- [nui.nvim](https://github.com/MunifTanjim/nui.nvim)
- [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim)

**Theme implementation references**

- [catppuccin/nvim](https://github.com/catppuccin/nvim)
- [lush.nvim](https://github.com/rktjmp/lush.nvim)

**Project**

- [theme-browser.nvim](https://github.com/raulcorreia7/theme-browser.nvim)
- [theme-browser-monorepo](https://github.com/raulcorreia7/theme-browser-monorepo)
