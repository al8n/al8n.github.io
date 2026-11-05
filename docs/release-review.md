# Release review

## Implementation and source review

- [x] Public overview, projects, CV, and 404 implemented.
- [x] Six featured libraries and all 16 requested projects included.
- [x] Shared public records supply the online CV and reproducible two-page A4 résumé.
- [x] Current employer represented anonymously, with general responsibilities only.
- [x] No private résumé, internal document, private metrics, or confidential term list included in source.
- [x] Source and static output checked using privately supplied restricted terms.
- [x] PDF text, links, metadata, and rendered page layout inspected.
- [x] Standard Astro production build, Astro/TypeScript check, internal validation, and local regression tests passed.
- [x] Light/dark themes, filtering, navigation, and representative desktop/tablet/mobile views inspected in a real browser.
- [x] All 16 public repository READMEs and root Cargo manifests retrieved and reviewed.
- [x] Existing private repository, default branch, and old history inspected; replacement preserves earlier commits.
- [x] New deployment workflow skipped publication as intended; the legacy Pages task also skipped deployment. Public-content approval remains required.

## Before public publication

- [x] Complete browser matrix passed in [GitHub Actions](https://github.com/al8n/al8n.github.io/actions/runs/42031135798); screenshots are retained in its `browser-review` artifact.
- [ ] Recheck crates.io page access from an unrestricted browser; the development environment received HTTP 403.
- [ ] Obtain explicit owner approval of public pages, CV, résumé, and social preview.
- [ ] Repeat the history/content privacy check with any additional private aliases or internal identifiers supplied by the owner.
- [ ] Review raster assets and indirect disclosure risks. Automated matching cannot prove absence of all indirect disclosures.
- [ ] Set Pages source to GitHub Actions and enable `PUBLIC_CONTENT_APPROVED` only after approval.
- [ ] Run the deployment and verify the live overview, project collection, CV, PDF, and missing-route behavior.

Local headless browser processes were unavailable under executor restrictions, so the complete automated matrix runs in GitHub Actions. The real-browser manual checks and the standard Astro build have passed. Public deployment has not been attempted.
