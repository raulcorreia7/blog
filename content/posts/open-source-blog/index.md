+++ 
draft = false
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
asciinema = true
+++

## Intro

{{< figure src="/images/opensource-logo.png">}}
Hello everyone, this is your friendly tinkerer coder writing on **How I Open Sourced my blog**. 
Why suddenly posting such about mundane thing? 

Well, I believe the technical steps taken to develop this blog are very interesting for certain use cases, personal development, documentation for Software Projects, or just tinkering.

Through out this series of posts I will guide the reader on how to setup your own Hugo Blog. We will iterate in many different solutions throughout the series.

This post in will focus on how to get you started, setup some basic plumbing and understand Hugo.

## Resources
This is the general resources needed to have to be able to finish this series of posts.

### Requirements
* Knowledge of web
* Knowledge of command line commands
* Have a repository with pages deployment enabled
* Have Hugo installed

### Recommended reading
* [Hugo Quickstart](https://gohugo.io/getting-started/quick-start/)

### Tools
* Git
* Visual Studio Code
* Github
* [Makefile](https://github.com/raulcorreia7/personal-blog/blob/master/makefile)
* [Hugo](https://gohugo.io/) (extended)
* [hugo-coder](https://github.com/luizdepra/hugo-coder) theme

## Development
It is highly recommended you go through [Hugo QuickStart](#recommended-reading) so you understand what we are reproducing here.
### Summarized Steps
* Create repository
* Create a new project with hugo inside the repository
* Add a theme as a submodule
* Edit configuration file
* Add new post
* Final Build
* Deploy to GitHub pages


### Local Workflow
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


## Steps


### Create Repository
Simply chose your version control provider, in this case I chose **Github**. For the sake of completeness, here is a link to [how to create a repository in github.](https://docs.github.com/en/get-started/quickstart/create-a-repo)

### Create a Project inside the Repository
To create a Hugo Website, you need to browse inside your repository and create a new website in the current directory by running the command :
```shell
hugo new site .
```

{{< asciinema key="hugo-new-site" rows="15" preload="1" autoplay="1" loop="1">}}


### Adding a theme as a submodule

Create a folder where you wish to save your themes, in my case I'm creating `themes/`
Then, add a submodule pointing to themes as your folder where to clone to as such :
```shell
# Add original hugo-coder submodule
git submodule add https://github.com/luizdepra/hugo-coder.git themes/hugo-coder
# Initialize all submodules and clone them recursively
git submodule update --init --recursive
```

### Building Hugo
Building a Hugo website is pretty easy.
Simply run hugo and it will build your website successfully.
```sh
hugo # Build website
```
If we want to Hugo to watch file changes realtime, we launch it by providing the watch command:
```sh
# Build hugo with file changes and preview
# Open localhost:1313 to preview website
hugo -w  
```
### Edit configuration file
Editing our configuration file is one of the hardest tasks to configure `Hugo` accordingly with your `theme`.
My recommendation to have a configuration file properly set is to :
* If using no theme, read the base config file.
* If we are using a theme, copy it from the `theme/your-theme` and find the corresponding configuration file and copy to where hugo website root is located. 

{{< figure src="copy_config.png" caption="Copying a config.toml from the example theme to root folder">}}
After finding our desired config file, edit it as you please.
Finally, build Hugo to validate everything is ok.

### Adding a new post

In the root of our folder, simply run the command:
```sh
hugo new posts/<category>/<file_name>.md
```
This will create a markdown post. Let's open favorite text editor and the created file. This is the fun part, we edit as we please.

### Final build and Deploy

To be able to deploy to Github, we need to enable `Pages`. Read the following [tutorial](https://docs.github.com/en/pages/quickstart)

Create a `gh-pages` branch, save changes, and checkout to it.
In here, we need to delete everything related to source code and just have the website itself.
In the root of your project delete `.git/index` removing all tracked files and run `git clean -fdx` to let git clean everything that is not tracked.


Here is the command:
```sh
rm .git/index
git clean -fdx
```
`Commit` and `Push` these changes to `gh-pages` branch.

After all the changes are pushed, go back to `Pages` Settings in the Repository, and point the `Source` to `gh-pages` like the following image.

{{< figure src="github-pages.png">}}

Switch back to the development branch and build [Hugo](#building-hugo) to get the final website assets. Copy the contents of the `public` folder to someplace. 

Switch to `gh-pages` branch and paste the content of the folder in the root folder of this branch.

After this we should wait a few minutes. We should be able to access our new blog by the website provided in the `Pages` section.


## Conclusion

With this guide, you should have your blog up and running, understand a little bit more on how Hugo works and on how to setup a theme.

If you wish to use my blog as a template, see [Sources](#sources)

## Sources
* [personal blog source code](https://github.com/raulcorreia7/personal-blog)
* [my theme source code](https://github.com/raulcorreia7/hugo-coder)
* [original theme source code](https://github.com/luizdepra/hugo-coder)
