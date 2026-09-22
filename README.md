# E. Matthew Husband — Quarto/GitHub Pages prototype

This is a working prototype for a professional academic website built with Quarto and intended for GitHub Pages.

## Structure

- `index.qmd` — homepage
- `research/index.qmd` — research programme + topic filters
- `publications.qmd` — publications + topic filters
- `people.qmd` — people / prospective researchers
- `teaching.qmd` — teaching
- `cv.qmd` — CV download shell
- `css/site.scss` — main visual system
- `data/` — reserved for structured data later
- `images/` — add your profile image here
- `.github/workflows/publish.yml` — GitHub Pages deployment

## Before publishing

1. Put your preferred profile image at `images/profile.jpg` and replace the placeholder markup in `index.qmd`.
2. Put your current CV at `files/matthew-husband-cv.pdf` (create the `files` directory).
3. Replace `USERNAME` in `_quarto.yml` with the GitHub account/repository URL you will use.
4. Replace placeholder external links for Google Scholar, ORCID, GitHub and OSF.
5. Confirm the People page against the current roster; the prototype deliberately does not invent names that were not available from the public profile.
6. Refine the homepage headline and short research statement after the first browser review.

## Local preview

Install Quarto, then from this directory run:

```bash
quarto preview
```

Build with:

```bash
quarto render
```

The rendered site will appear in `_site/`.

## Design intent

The design is intentionally spare and scholarly: typography-led, white background, muted Oxford-blue accent, no gradients, minimal cards, and no news/blog section. The homepage's research concepts are both an intellectual overview and clickable entry points into the research taxonomy.
