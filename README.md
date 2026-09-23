# E. Matthew Husband — Quarto website prototype

Scientific-minimal academic website prototype for GitHub Pages.

## Local preview

Install [Quarto](https://quarto.org/) and run:

```bash
quarto preview
```

## Render

```bash
quarto render
```

The rendered site is written to `_site/`.

## Publish

The repository is configured for GitHub Pages using GitHub Actions. The workflow lives at `.github/workflows/publish.yml`.

## Design direction

The site uses a wide, restrained academic layout with serif headings, a minimal sans-serif interface, institutional affiliations in the footer, and a slowly evolving SVG research network. The network is functional as well as conceptual: its three labelled regions link to research filters for Representation, Construction & Inference, and Memory & Knowledge.
