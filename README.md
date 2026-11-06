# Al Liu — personal engineering website

A static personal site for Rust systems engineering and open-source infrastructure. Includes a personal overview, a dedicated 31-project collection across 10 categories, a detailed public CV, a two-page public A4 résumé, and a custom 404 page. No backend, analytics, or remote fonts. Projects supports grid, list, and category views. The default puts the maintainer’s four picks first and orders the remaining projects by total downloads. Public cards show primary-crate downloads and GitHub repository stars.

![Homepage preview](docs/preview-home.jpg)

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
  data/projects.ts            Typed projects, categories, selected projects
  components/render.ts        Shared escaped static page components
  scripts/navigation.ts       Category history through Astro’s client router
  layouts/BaseLayout.astro    Astro document layout
  pages/                      Overview, projects, CV, 404
public/
  styles.css                  Shared responsive, theme, and print styles
  theme-init.js, site.js       System theme, persisted overrides, print action
  projects.js                 Project layouts, sorting, and category filters
  downloads.js                Public crates.io totals and browser cache
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
- Add projects to `src/data/projects.ts`; verify the repository README and crate identity first. Categories and totals are derived from the data. Selected-project flags keep tokora, smear, memberlist, and serf visually prominent within Projects. Overview and CV do not duplicate the catalog. A project without a public repository URL renders a source-unavailable card, without an outbound link.
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

## Project metrics and motion

Cards on the Projects page show the primary crate's total downloads across all versions. `caches-rs` maps to `caches`; other cards use the configured crate or project name. Workspace packages are not summed. Pql has no registry metric or request.

`public/downloads.js` reads the public al8n account listing (`user_id=119762`, up to 100 crates per page), paces pagination to at most one request per second, and stores validated totals locally for ten minutes. It needs no credentials or backend. Switching categories makes no request. Counts are checked on page load when the cache expires, with the fetch time displayed; upstream batch processing and CDN caching mean these are not second-by-second counters. When the API is unreachable, the cards retain cached counts or the published snapshot and its date.

GitHub stars come from the public owner repository listing, matched by full repository name and cached for one hour. Both counters are rendered in the initial HTML. Refresh the published fallback with `node scripts/snapshot-project-metrics.mjs`. Browser refreshes update both the displayed count and its sort order.

Astro ClientRouter provides continuous page transitions with an animated fallback for browsers without native View Transitions. Category changes retain a short fade and vertical movement. Theme colors, navigation, links, cards, and buttons also transition. All motion respects reduced-motion settings. Theme, filter, download, and print controls reinitialize after page swaps; category history uses the same router, preserving browser back/forward behavior and the toolbar position.

The browser suite also checks navigation without document reloads, the non-native animation fallback, theme persistence after swaps, and returning to a filtered Projects page. It uses deterministic registry responses for rendering, cache, outage, zero-count, and transition checks. Real API/CORS data is checked separately in the browser; synthetic test totals are not evidence of current registry counts.

## Confidentiality

The public CV uses aligned experience headers and right-aligned date metadata, with stacked metadata on mobile. PDF table widths account for the ReportLab frame padding so skill labels, role headers, and body paragraphs share their left edge.

Only the public CV belongs in this repository. Current employment uses the approved anonymous employer description. Private recruiting résumés and internal materials must remain outside this checkout and Git history. Search exclusions and robots directives do not make published files private.

Before a release, supply `PRIVATE_CONTENT_DENYLIST` as a private JSON array of restricted names, aliases, and identifying terminology. Do not put its values in a tracked file, command documentation, workflow YAML, or commit message. Use a private shell session or GitHub Actions secret. Run:

```sh
npm run verify:privacy
```

The script scans source, documentation, generated HTML/CSS/JS/JSON/XML, SVG assets, extracted PDF text and metadata, and local Git revisions. It does not print matched confidential strings. It fails closed if the private denylist is absent. If needed, set `PDF_PYTHON` to a Python interpreter with `pypdf` installed. Raster assets require visual review; a text scan is not OCR or a guarantee against indirect disclosure. The four legacy commits and eleven distinct text/PDF blobs were reviewed before replacement; no known employer-name variants were found. CI checks the full fetched Git history on every run.

## Automatic deployment

Production target: **https://al8n.github.io/**.

Every push to `main` automatically runs the Astro/TypeScript check, regression tests, reproducible PDF generation, privacy/history scan, and the full browser suite. A successful run uploads `dist/` and deploys it through GitHub Pages. Pull requests run verification without publishing. The workflow can also be started manually from the Actions tab.

Current configuration:

- GitHub Pages build source: **GitHub Actions** (`workflow`).
- Repository variable `PUBLIC_CONTENT_APPROVED`: `true`, enabled after the owner's public-deployment approval.
- Repository secret `PRIVATE_CONTENT_DENYLIST`: configured privately; never add its values to source.
- Verification runner: Ubuntu 24.04 with pinned Node and package dependencies.

Set `PUBLIC_CONTENT_APPROVED` to `false` to pause publication while keeping verification active. Public content must continue to satisfy the confidentiality rules above.

After a deployment, verify `/`, `/projects/`, `/cv/`, `/resume.pdf`, and a missing route. The workflow's completed deployment and the live responses are the release evidence. Screenshots and the browser report are retained for seven days in the run's `browser-review` artifact.

The Astro site is `https://al8n.github.io`, with no repository base prefix. Page routes use trailing slashes, and `404.html` is emitted at the root. Keep the Pages source set to Actions so the old automatic Jekyll build does not process the source tree.

## Design previews and account totals

Compare Studio, Terminal, and Editorial at /designs/. Each preview provides Overview, Projects, and CV pages with shared public content. Preview pages are marked noindex.

The account summary adds stars across all public repositories owned by al8n (including forks) and downloads across all crates listed for crates.io user 119762, across all versions. It is independent of the 30 public project cards. Both APIs are fully paginated. The initial HTML includes a checked-date snapshot, refreshed by the existing browser caches. Run `node scripts/snapshot-project-metrics.mjs` to refresh the project and account snapshots together.
