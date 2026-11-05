# Verification record - 2026-11-05

The expanded catalog has 31 project cards across ten categories: the nine categories in the owner's Discord screenshots plus storage engines. Thirty cards link to verified public repositories; pql exposes only its owner-provided name and category.

| Check | Actual result |
| --- | --- |
| Astro and TypeScript diagnostics | Passed: 24 files, zero errors, warnings, or hints |
| Production build | Passed: four prerendered pages, 31 cards, 49 internal references, anchors, JSON-LD, PDF data consistency, and social asset |
| Local regression checks | Passed: nine checks, including exact category membership, one card per project, private-source link omission, four homepage spotlights, validated totals, cache freshness, and paced API pagination |
| Public PDF | Passed: two A4 pages, 17 links, selectable text; both rasterized pages visually inspected |
| Source/build confidentiality | Passed: privately supplied terms scanned across source/output and PDF text/metadata; no restricted terms logged |
| Manual responsive review | Passed at 1440, 1024, 768, and 390 CSS pixels; no horizontal overflow; mobile dark-mode cards inspected |
| Manual filtering | All ten filters returned correct counts; All projects returned 31; pql has no outbound link; browser reported no warnings/errors |
| Public project evidence | Thirty public, non-archived repositories and their README/root manifests retrieved directly through GitHub |
| Live download totals | Passed in the browser: all 30 public cards populated from the real API; primary-crate mapping confirmed, and no recent-download metric is rendered |
| Download resilience and animation suite | CI tests use controlled API responses to cover cache reuse, missing network, stale cache, real zero counts, animation, and reduced motion |
| Registry HTML links | The environment returns HTTP 403; live registry response checks remain unverified |
| Automated release checks | Every push runs the full 24-case viewport/theme/page matrix, category/history/no-JS checks, full-history privacy scan, and production build before deployment |

Current release results and screenshots are available in [GitHub Actions](https://github.com/al8n/al8n.github.io/actions/workflows/deploy.yml). Its `browser-review` artifact retains screenshots and the JSON result for seven days. The local executor prevents a separate headless browser process, so the complete automated matrix runs on Ubuntu 24.04 in CI. Local visual checks use the supported browser.

The production build emits an upstream Vite unused-import warning inside Astro's asset helper; there are no application diagnostics. Automatic publication from main is approved and enabled, with Pages configured to use GitHub Actions. The previous automatic deployment passed in [run 42043424005](https://github.com/al8n/al8n.github.io/actions/runs/42043424005); each new release is verified through its own completed run and live-route checks.
