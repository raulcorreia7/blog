# Raul Correia Personal Blog

Personal blog built with Hugo and the Risotto theme.

## Demo

[https://raulcorreia.dev](https://raulcorreia.dev)

## Built With

* [Hugo](https://gohugo.io/) - Static site generator
* [Risotto theme](https://github.com/joeroe/risotto) - Hugo theme
* [Visual Studio Code](https://code.visualstudio.com/) - Editor

## Getting Started

### Prerequisites

* hugo
* make
* git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/raulcorreia7/blog.git
   cd blog
   ```

2. Initialize submodules
   ```bash
   make dependencies
   ```

3. Build the site
   ```bash
   make all
   ```

## Usage

See all available make commands:
```bash
make help
```

Run development server:
```bash
make watch
```

Build and run in development mode:
```bash
make dev
```

## Deployment

The blog is automatically deployed to GitHub Pages via CI/CD. See `.github/workflows/build-hugo-website.yml` for configuration.

### Custom Domain

The blog uses the custom domain `raulcorreia.dev`. See `CLOUDFLARE_SETUP.md` for Cloudflare DNS configuration.

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

Raúl Correia - [@raul_correia](https://twitter.com/raul_correia)

LinkedIn: [https://linkedin.com/in/raul-correia/](https://linkedin.com/in/raul-correia/)
