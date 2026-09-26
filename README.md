# E. Matthew Husband — full beta

Quarto + GitHub Pages website prototype.

## Top-level navigation
Home · Research · Publications · People · CV

Teaching is intentionally omitted from the top-level site.

## Data
- `publications.bib` is the editable working bibliography and now includes the citable proceedings and other scholarly outputs represented on the current site.
- `publication-metadata.yml` holds website-specific topic labels and current-work placeholders.

## Publishing
`.github/workflows/publish.yml` uses the GitHub Pages artifact deployment workflow. Push to `main` and GitHub Actions will render and deploy the site.

## Assets and remaining checks
- `images/profile.jpg` is the homepage portrait.
- The CV navbar item points directly to `files/matthew-husband-cv.pdf`; add the current PDF at that path before deployment.
- Some publication links can be enriched later with PDFs, DOIs, data, and materials.
- People and bibliography details should be reviewed once more before the public launch.

### v25 animation fixes
- Research animations no longer depend on IntersectionObserver state, so scrolling to a programme after page load cannot leave its animation dormant.
- Expectation distributions now use true slow opacity cross-fades; ambient breathing changes scale only and no longer overrides opacity transitions.
- Meaning in Memory now contrasts a three-feature triangular trace with a four-feature current bundle.
