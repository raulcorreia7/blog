---
title: "Installing Docker on Ubuntu 20.10"
date: 2020-12-06T15:36:30Z
description: "How to install Docker on Ubuntu 20.10 (Groovy Gorilla) using the test repository"
draft: false
categories: ["tutorial"]
tags: ["docker", "ubuntu", "linux"]
---

## Ubuntu ❤️ Docker

Hello everyone,

Recently I installed the latest non-LTS version of [Ubuntu 20.10 Groovy Gorilla](https://releases.ubuntu.com/20.10/) and found it a hassle to install Docker using [this tutorial](https://docs.docker.com/engine/install/ubuntu/), specifically the repository setup step.

<!--more-->

### Analysis of the Problem

Analyzing the tutorial, I found a problem in the 3rd point of the **SET UP THE REPOSITORY** step.

```bash
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

### The Error

```bash
    "..
    $(lsb_release -cs) \
    stable"
```

This expands to **groovy stable**, and at the time of writing, it is not supported by the stable Docker community repositories.

### The Fix

The workaround is simply to use the **test** branch of the repository.

```bash
    "..
    $(lsb_release -cs) \
    test"
```

{{< notice info >}}

If you're using a **non-LTS** version of Ubuntu, you likely want fresher or near rolling-release software updates, so using this repository shouldn't be an issue. I'm not responsible for any faults, errors, or breakage.

{{< /notice >}}

### Automated Script

Here's a simple script to set up and automate everything for you.

{{< notice warning >}}

This is fully automated with no user confirmation.

{{< /notice >}}

```bash
# Install needed dependencies
sudo apt install apt-transport-https \
         ca-certificates \
         curl \
         software-properties-common \
         -y

# Download the Docker repository GPG key and add it
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu groovy test" -y

# Install Docker
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

[Here](https://github.com/raulcorreia7/scripts/blob/master/ubuntu/install-docker.sh) is the latest version of the script on my GitHub.

Kind regards,

Raúl
