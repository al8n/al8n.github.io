# Al Liu — personal engineering website

A static personal site for Rust systems engineering and open-source infrastructure. Includes an overview, 16-project collection, public CV, two-page public A4 résumé, and a custom 404 page. No backend, analytics, remote fonts, or runtime API requests.

## Start locally

Requires Node.js 22.18+ (24 LTS recommended). From this directory:

```sh
npm ci
npm run dev
```

Visit the printed local URL. Theme selection cycles through system, light, and dark and persists locally. All content and category navigation remain usable without JavaScript.

```sh
npm run check
npm test
npm run build
npm run preview
```

The dependency lockfile is included. Use `npm ci` to reproduce the dependency graph. The Astro compiler, TypeScript check, production build, and local regression checks have passed. Browser review screenshots and the complete browser suite also run in GitHub Actions.

### Offline build

The same TypeScript render functions and public data also support a dependency-free static build:

```sh
npm run build:offline
npm run preview:offline
```

This works with Node 22.18+ without `npm install`. It produces the same page bodies and metadata as the Astro wrappers. It is an optional alternative to the verified Astro build. Both preview commands serve only on loopback; opening a listening socket must be allowed by your local environment.

## Source map

```text
src/
  data/profile.ts             Identity, public summary, expertise, education
  data/experience.ts          Public professional history
  data/projects.ts            Typed projects, categories, featured selection
  components/render.ts        Shared escaped static page components
  layouts/BaseLayout.astro    Astro document layout
  pages/                      Overview, projects, CV, 404
public/
  styles.css                  Shared responsive, theme, and print styles
  theme-init.js, site.js       System theme, persisted overrides, print action
  projects.js                 Progressive category filtering
  resume.pdf                  Sanitized public résumé
  favicon.svg                 Local identity asset
  social-preview.png          Local 1200 × 630 social preview
  sitemap.xml, robots.txt      Public discovery
scripts/                      PDF generation, builds, verification, browser QA
.github/workflows/deploy.yml   Verification and gated GitHub Pages deployment
docs/                         Content sources, verification status, release review
```

Public content is escaped before interpolation into static HTML. The small shared render module lets Astro, PDF data export, and offline checks consume the same typed records. There are no interactive framework components or hydration bundles.

## Edit content

- Update profile, contact links, skills, and education in `src/data/profile.ts`.
- Update roles, actual overlapping dates, and public responsibilities in `src/data/experience.ts`.
- Add projects to `src/data/projects.ts`; verify the repository README and crate identity first. Categories and totals are derived from the data. The featured order is set at the end of that file.
- Shared structure and copy live in `src/components/render.ts`; presentation lives in `public/styles.css`.
- Project descriptions and scope decisions are recorded in [docs/content-sources.md](docs/content-sources.md).
- Rebuild and regenerate the public PDF after a content change. Never edit the PDF independently of its data. The build compares `resume-data.sha256` against the shared CV records and refuses a stale PDF.

## Reproduce the PDF and social image

Use a Python 3.12 virtual environment with the pinned dependencies:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r scripts/requirements.txt
npm run resume
python scripts/generate-social.py
npm run build
```

Add `.venv/` to local ignored state (already included in `.gitignore`). The PDF uses ReportLab standard fonts, selectable text, clickable URLs, and safe metadata. Its generator asserts two A4 pages. The social image generator uses local system fonts with a portable fallback. The generated PDF and image are committed public assets; Python is not needed to serve the site.

## Verification

```sh
npm test
npm run verify
npm run verify:links
npx playwright install chromium
npm run preview
# In a second terminal:
npm run test:browser
```

The browser suite checks the three main pages at 1440, 1024, 768, and 390 CSS pixels in light and dark modes, plus theme persistence, system theme, filtering, back navigation, keyboard focus, PDF serving, print styling, 404 responses, and no-JavaScript content. It writes screenshots to ignored `tmp/qa/`. Tests are not considered passed until they actually run.

`verify:links` makes network requests and distinguishes unverified links from successful responses. Cached search results and repository inspection do not prove every live URL responds today.

## Confidentiality

Only the public CV belongs in this repository. Current employment uses the approved anonymous employer description. Private recruiting résumés and internal materials must remain outside this checkout and Git history. Search exclusions and robots directives do not make published files private.

Before a release, supply `PRIVATE_CONTENT_DENYLIST` as a private JSON array of restricted names, aliases, and identifying terminology. Do not put its values in a tracked file, command documentation, workflow YAML, or commit message. Use a private shell session or GitHub Actions secret. Run:

```sh
npm run verify:privacy
```

The script scans source, documentation, generated HTML/CSS/JS/JSON/XML, SVG assets, extracted PDF text and metadata, and local Git revisions. It does not print matched confidential strings. It fails closed if the private denylist is absent. If needed, set `PDF_PYTHON` to a Python interpreter with `pypdf` installed. Raster assets require visual review; a text scan is not OCR or a guarantee against indirect disclosure. The four legacy commits and eleven distinct text/PDF blobs were reviewed before replacement; no known employer-name variants were found. CI checks the full fetched Git history on every run.

## Deploy after approval

The replacement source is maintained in the private `al8n/al8n.github.io` repository. GitHub Pages remains disabled until the owner approves public content. See [docs/release-review.md](docs/release-review.md) for the release checklist.

1. Review the public pages, PDF, and generated assets. Obtain the owner's explicit approval of public content.
2. Review the complete Git history before changing repository visibility. The legacy files were replaced in a normal commit, preserving earlier commits for rollback.
3. Run `npm ci` and pass Astro, browser, external-link, and privacy checks. Inspect the `browser-review` artifact from GitHub Actions; it contains all viewport/theme screenshots.
4. Add `PRIVATE_CONTENT_DENYLIST` as a GitHub Actions repository secret. Add the repository variable `PUBLIC_CONTENT_APPROVED` with value `true` only after content approval. Missing approval prevents artifact upload and deployment; missing private terms fails the confidentiality check.
5. Set repository Settings → Pages → Source to GitHub Actions. Use the `github-pages` environment; configure required reviewer protection if desired.
6. Push the reviewed content to `main` or run the prepared workflow. It verifies the site before the official Pages artifact and deployment actions run.
7. Verify `https://al8n.github.io/`, `/projects/`, `/cv/`, `/resume.pdf`, and a missing route. A configured workflow alone is not evidence of a successful deployment.

The Astro site is `https://al8n.github.io`, with no repository base prefix. Page routes use trailing slashes, and `404.html` is emitted at the root.
