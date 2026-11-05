# Verification record — 2026-11-05

| Check | Actual result |
| --- | --- |
| Astro and TypeScript diagnostics | Passed: 22 files, zero errors, warnings, or hints |
| Standard Astro production build | Passed: four prerendered pages with correct root routes and trailing slashes |
| Static content/asset validation | Passed: 16 projects, 47 internal references, single page headings, anchors, JSON-LD, PDF data consistency, and 1200 × 630 social asset |
| Local regression checks | Passed: 3 tests covering project identities/categories, anonymous current role and overlapping dates, escaped HTML and safe structured data |
| Public PDF | Passed: two A4 pages, 18 link annotations, selectable text; both rasterized pages visually inspected |
| Source/build confidentiality | Passed for privately supplied employer-name variants across source and output, plus extracted PDF text and metadata |
| Legacy remote history | Passed known-term matching: 4 earlier commits and 11 distinct text/PDF blobs inspected through GitHub; earlier commits preserved |
| Manual browser review | Passed: 1440px desktop overview, 1024px laptop overview, 768px tablet CV, and 390px mobile projects/CV; no horizontal overflow at reviewed views |
| Interactive manual checks | Passed: theme change persisted between pages; Storage filter displayed four projects; navigation and CV rendered correctly; browser reported no warnings/errors |
| Complete browser matrix | Passed in [GitHub Actions](https://github.com/al8n/al8n.github.io/actions/runs/42031135798): 24 page/viewport/theme combinations plus persistence, filters, keyboard, PDF, print, 404, and no-JS checks |
| Local headless browser suite | Executor prevented launching a separate browser process; manual checks used the supported in-app browser |
| Public project sources | All 16 public, non-archived repositories and their root Cargo manifests/READMEs retrieved directly through GitHub |
| Crates.io HTML links | Environment returned HTTP 403; registry-page checks remain a publication follow-up |
| Deployment | Not enabled; explicit public-content approval remains required |

The production build emits an upstream Vite unused-import warning inside Astro's own asset helper; the build completes successfully. There are no application diagnostics.

The `browser-review` artifact in GitHub Actions retains the full browser screenshots and JSON result report for seven days. The linked completed run verifies the application source; later documentation-only changes do not alter its behavior. The repository variable `PUBLIC_CONTENT_APPROVED` is not enabled. The existing legacy Pages task failed and skipped deployment; its build-source setting has not been changed.
