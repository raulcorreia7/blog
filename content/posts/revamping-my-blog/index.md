---
title: "Revamping My Blog"
date: 2026-02-02
description: "From unmaintained to fresh: how I modernized my personal blog"
draft: false
categories: ["meta"]
tags: ["hugo", "devops", "cloudflare"]
---

## Introduction

Hello everyone,

This revamp focused on four things that actually matter: domain ownership, maintainability, deployment reliability, and performance.

I did this full revamp with the aid of AI, mainly to move faster on repetitive work while I kept the technical decisions and direction.

The blog was online, but the setup was fragile: CI/CD was failing, the build pipeline was outdated, key dependencies were unmaintained, and the old theme was no longer healthy to keep evolving. I wanted to fix that properly.

## What I Changed

### Domain and Platform Stability

I moved everything to `raulcorreia.dev`, set up Cloudflare as the DNS/SSL layer, and fixed the GitHub Pages custom-domain configuration.

I also corrected Hugo URL settings so local and production now behave the same.

### Theme Rewrite

I had moved across multiple themes over time (LoveIt, then PaperMod, then Risotto), and eventually I settled on rewriting my own.

The goal was to own the code and keep it simple to maintain: cleaner templates, modular CSS, consistent styling, and proper dark/light support.

{{< mermaid >}}
flowchart LR
A[LoveIt] --> B[PaperMod]
B --> C[Risotto]
C --> D[Custom theme rewrite]
{{< /mermaid >}}

### CI/CD Reliability

I refactored the GitHub Actions pipeline to make deployments predictable.

The flow is simple and artifact-driven: one build path, shared checks, then event-based deploy behavior for preview vs production.

The `build` job now runs lint + Hugo build once, uploads the site artifact, and both `html-validate` and `link-check` run from that same output. Pull requests deploy a preview from the non-optimized artifact, while pushes to `master` run image optimization first and deploy the optimized artifact to production.

{{< mermaid >}}
flowchart LR
A[Push or Pull Request] --> B[Build + lint]
B --> C[Upload site artifact]
C --> D[html-validate + link-check]
D --> E{Event type}
E -->|Pull Request| F[Deploy preview from build artifact]
E -->|Push to master| G[Optimize images]
G --> H[Deploy production]
{{< /mermaid >}}

### Performance and Content Quality

I optimized images (**~5MB -> ~1MB**) and cleaned up existing posts so formatting, categories, and content quality are more consistent across the whole blog.

## Result

The outcome is simple: the blog is faster, more stable, easier to maintain, and fully under my control end-to-end.

This revamp removed a lot of hidden technical debt and gave me a cleaner base for future posts.

Kind regards,

Raúl

P.S. I'm really enjoying refactoring and updating tools with AI.
