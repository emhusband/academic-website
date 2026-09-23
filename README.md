# E. Matthew Husband — Quarto/GitHub Pages prototype

A working prototype for a professional academic website built with Quarto and intended for GitHub Pages.

## Structure

- `index.qmd` — homepage
- `research/index.qmd` — research programme + topic filters
- `publications.qmd` — publications + topic filters
- `people.qmd` — prospective researchers / collaborations
- `teaching.qmd` — teaching
- `cv.qmd` — CV download shell
- `css/site.scss` — visual system
- `js/research-filters.js` — client-side topic filters
- `images/` — profile image placeholder
- `files/` — CV PDF placeholder
- `.github/workflows/publish.yml` — GitHub Pages deployment

## Deployment

The repository uses the GitHub Pages artifact deployment workflow: Quarto renders to `_site`, GitHub uploads the rendered artifact, and `actions/deploy-pages` publishes it. There is no `gh-pages` branch.

## Before final publishing

1. Replace `images/profile-placeholder.svg` with the preferred profile photograph, updating the reference in `index.qmd` if needed.
2. Add the current CV at `files/matthew-husband-cv.pdf`.
3. Replace/update external links as needed; Google Scholar, ORCID and GitHub are seeded with confirmed public profiles.
4. Confirm the People page against current Oxford / St Hugh's listings.
5. Select the final set of highlighted publications and research tags.
6. Refine homepage and research-page wording after browser review.

## Local preview

Install Quarto, then from the project directory run:

```bash
quarto preview
```

Build with:

```bash
quarto render
```

The rendered site appears in `_site/`.
