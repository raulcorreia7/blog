---
title: "Open-Sourcing My Personal Blog"
date: 2022-04-23T20:27:17+01:00
description: "A guide on how I open-sourced my blog"
draft: false
categories: ["tutorial"]
tags: ["hugo", "opensource"]
---

## Introduction

{{< figure src="images/opensource-logo.png" alt="Open Source Initiative logo" >}}

Hello everyone, this is your friendly tinkerer and coder writing on **How I Open-Sourced My Blog**.

Why post about such a mundane thing?

Well, I believe the technical steps taken to develop this blog are useful for certain use cases: personal development, documentation for software projects, or just tinkering.

Throughout this series of posts, I will guide you on how to set up your own Hugo blog. We will iterate through many different solutions throughout the series.

This post focuses on getting you started, setting up basic plumbing, and understanding Hugo.

## Resources

These are the resources needed to complete this series of posts.

### Requirements

- Knowledge of web fundamentals
- Knowledge of command line
- A repository with GitHub Pages deployment enabled
- Hugo installed

### Recommended Reading

- [Hugo Quickstart](https://gohugo.io/getting-started/quick-start/)

### Tools

- Git
- Visual Studio Code
- GitHub
- [Hugo](https://gohugo.io/) (extended)
- [hugo-coder](https://github.com/luizdepra/hugo-coder) theme

## Development

It is highly recommended to go through [Hugo QuickStart](#recommended-reading) so you understand what we are reproducing here.

### Summarized Steps

- Create repository
- Create a new Hugo project inside the repository
- Add a theme as a submodule
- Edit configuration file
- Add new post
- Final build
- Deploy to GitHub Pages

### Local Workflow

{{< mermaid >}}
graph LR;
source[Source Code]-- edit -->repository[Website];
repository -- $ hugo --> build[Build Website];
build -- deploy artifacts to gh-branch --> deploy[GitHub Pages];
{{< /mermaid >}}

## Steps

### Create Repository

Simply choose your version control provider—in this case, I chose **GitHub**. For the sake of completeness, here is a link on [how to create a repository in GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo).

### Create a Project Inside the Repository

To create a Hugo website, browse to your repository and create a new website in the current directory by running:

```bash
hugo new site .
```

{{< asciinema key="hugo-new-site" rows="15" preload="1" autoplay="1" loop="1">}}

### Adding a Theme as a Submodule

Create a folder where you wish to save your themes—in my case, I'm creating `themes/`. Then add a submodule pointing to your themes folder:

```bash
# Add original hugo-coder submodule
git submodule add https://github.com/luizdepra/hugo-coder.git themes/hugo-coder
# Initialize all submodules and clone them recursively
git submodule update --init --recursive
```

### Building Hugo

Building a Hugo website is straightforward. Simply run:

```bash
hugo # Build website
```

If you want Hugo to watch for file changes in real-time:

```bash
# Build Hugo with file changes and preview
# Open localhost:1313 to preview website
hugo -w
```

### Edit Configuration File

Editing the configuration file is one of the hardest tasks when configuring Hugo with your theme. My recommendations:

- If not using a theme, read the base config file
- If using a theme, copy the example config from `theme/your-theme` to your Hugo website root
- Depending on the repository name, define `baseURL` as:
  - If public pages repository: `<your_username>.github.io`, use that as your `baseURL`
  - If personal repo: `<your_username>.github.io/<your_reponame>`

After finding your desired config file, edit it as you please. Finally, build Hugo to validate everything is OK.

### Adding a New Post

In the root of your folder, simply run:

```bash
hugo new posts/<category>/<file_name>.md
```

This will create a Markdown post. Open it with your favorite text editor—this is the fun part where you edit as you please.

### Final Build and Deploy

To deploy to GitHub, we need to enable **Pages**. Read the [GitHub Pages tutorial](https://docs.github.com/en/pages/quickstart) and make sure you [edited the configuration file properly](#edit-configuration-file).

Create a `gh-pages` branch, save changes, and check it out. We need to delete everything related to source code and keep only the website itself. In the root of your project:

```bash
rm .git/index
git clean -fdx
```

Commit and push these changes to the `gh-pages` branch.

After pushing, go to **Pages** Settings in the repository and point the **Source** to `gh-pages`.

{{< figure src="github-pages.png" alt="GitHub Pages settings screenshot">}}

Switch back to the development branch and [build Hugo](#building-hugo) to get the final website assets. Copy the contents of the `public` folder somewhere.

Switch to the `gh-pages` branch and paste the content in the root folder.

After this, wait a few minutes. You should be able to access your new blog at the URL provided in the **Pages** section.

**Bonus:** If you have a custom domain, you can configure it in this page.

## Conclusion

With this guide, you should have your blog up and running, understanding a bit more about how Hugo works and how to set up a theme. There will be a follow-up post on how to create your own pipeline for automated deployment.

If you wish to use my blog as a template, see [Sources](#sources).

## Sources

- [Personal blog source code](https://github.com/raulcorreia7/personal-blog)
- [My theme source code](https://github.com/raulcorreia7/hugo-coder)
- [Original theme source code](https://github.com/luizdepra/hugo-coder)
