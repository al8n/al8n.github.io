# Verification record - 2026-11-06

Overview and CV contain no project cards or registry metric requests. The dedicated catalog has 31 project cards across ten categories: the nine categories in the owner's Discord screenshots plus storage engines. Thirty cards link to verified public repositories; pql exposes only its owner-provided name and category.

| Check | Actual result |
| --- | --- |
| Astro and TypeScript diagnostics | Passed: 25 files, zero errors, warnings, or hints |
| Production build | Passed: four prerendered pages, 31 cards, 55 internal references, anchors, JSON-LD, PDF data consistency, and social asset |
| Local regression checks | Passed: ten checks, including exact category membership, one card per project, private-source link omission, selected-project emphasis in Projects, validated totals, cache freshness, and paced API pagination |
| Public PDF | Passed: two A4 pages, 6 links, selectable text; aligned headers, skill columns, right-aligned dates, and corrected frame-padding widths; both pages rasterized and inspected |
| Source/build confidentiality | Passed: privately supplied terms scanned across source/output and PDF text/metadata; no restricted terms logged |
| Manual responsive review | Passed at 1440, 1024, 768, and 390 CSS pixels; no horizontal overflow; mobile dark-mode cards inspected |
| CV performance content | Owner-approved concurrency redesign, thread-per-core/shared-nothing architecture, pre-allocation, mutex-free busy loops, and the supplied p99.9/p99/p90 before-and-after ranges appear in web and PDF; employer remains anonymous and numeric ranges are preserved without derived speedups |
| CV alignment | Heading and body left edges match at 390, 768, 1024, and 1440 CSS pixels; dates align to the role header on desktop, and stack on mobile; tablet CV uses full content width |
| Navigation and detailed CV | Passed manually: Overview to CV to Projects transitions, theme preservation, filtered-project return, four detailed roles and four expertise descriptions; mobile/tablet/laptop views have no horizontal overflow |
| Manual filtering | All ten filters returned correct counts; All projects returned 31; pql has no outbound link; browser reported no warnings/errors |
| Public project evidence | Thirty public, non-archived repositories and their README/root manifests retrieved directly through GitHub |
| Live download totals | Passed in the browser: all 30 public cards populated from the real API; primary-crate mapping confirmed, and no recent-download metric is rendered |
| Download resilience and animation suite | CI tests use controlled API responses to cover cache reuse, missing network, stale cache, real zero counts, category animation, page transitions without reloads, fallback animation, and reduced motion |
| Registry HTML links | The environment returns HTTP 403; live registry response checks remain unverified |
| Automated release checks | Every push runs the full 24-case viewport/theme/page matrix, category/history/no-JS checks, full-history privacy scan, and production build before deployment |

Current release results and screenshots are available in [GitHub Actions](https://github.com/al8n/al8n.github.io/actions/workflows/deploy.yml). Its `browser-review` artifact retains screenshots and the JSON result for seven days. The local executor prevents a separate headless browser process, so the complete automated matrix runs on Ubuntu 24.04 in CI. Local visual checks use the supported browser.

The production build emits an upstream Vite unused-import warning inside Astro's asset helper; there are no application diagnostics. Automatic publication from main is approved and enabled, with Pages configured to use GitHub Actions. The previous automatic deployment passed in [run 42063797966](https://github.com/al8n/al8n.github.io/actions/runs/42063797966); each new release is verified through its own completed run and live-route checks.
