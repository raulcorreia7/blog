+++ 
draft = true
date = 2022-04-23T20:27:17+01:00

title = "Open-Sourcing my personal blog"
description = "Here we will talk about my steps on how I open-sourced my blog"
slug = ""

authors = ["Raúl Correia"]
tags = ["blog", "open source", "hugo"]
categories = ["blog", "open source"]
externalLink = ""
series = ["open sourcing blog"]
mermaid = true
+++

## Intro

{{< figure src="/images/opensource-logo.png">}}
Hello everyone, this is your friendly tinkerer coder writing on **How I Open Sourced my blog**. Why suddenly posting such about mundane thing? Well, I believe the technical steps taken to develop this blog are very interesting for certain use cases, like developing technical documentation for Software Projects. 
This will be a series of posts consisting on how I cobbled together this contraption.

## Resources

### Requirements
* Knowledge of web
* Knowledge of command line commands
* Have a repository with pages deployment enabled
* Have Hugo installed

### Recommended reading
* [Hugo Quickstart](https://gohugo.io/getting-started/quick-start/)
* [Github Actions Quickstart](https://docs.github.com/en/actions/quickstart)

### Tools
* Git
* Visual Studio Code
* Github and Github Actions
* [Makefile](https://github.com/raulcorreia7/personal-blog/blob/master/makefile)
* [Hugo](https://gohugo.io/) (Extended)
* [hugo-coder](https://github.com/luizdepra/hugo-coder) theme

## Development

### High level Architecture

## Local flow
{{< mermaid >}}
graph LR;
    style source fill:#bbf
    style repository fill:#f9f
    style build fill:#abc
    style deploy fill:#0f1

    source[Source Code]-- edit -->repository[Website];
    repository -- $ make all --> build[Build Website];
    build -- upload to Github Pages --> deploy[Github Pages];
{{< /mermaid >}}

## Online flow
{{< mermaid >}}
graph LR;
    style source fill:#bbf
    style repository fill:#f9f
    style build fill:#abc
    style deploy fill:#0f1

    source[Source Code]--commit code -->repository[Github Repository];
    repository -- trigger Github Action --> build[Build Website];
    build -- Deploy on success, merging to master? --> deploy[Github Pages];
{{< /mermaid >}}


### Summarized Steps
* Create repository
* Create a new project with hugo inside the repository
* Add submodule for your theme
* Edit configuration file
* Add new post
* Build
* Deploy to GitHub pages


### Steps

#### Create Repository
Simply chose your version control provider, in this case I chose **Github**. For the sake of completeness, here is a link to [how to create a repository in github.](https://docs.github.com/en/get-started/quickstart/create-a-repo)

#### Create a Project inside the repository
To create a Hugo Website, you need to browse inside your repository and create a new website in the current directory:
```shell
$ hugo new site .  
```
### Sources
* [personal blog repository](https://github.com/raulcorreia7/personal-blog)