# Release review

- [x] All 31 projects have independent cards in ten categories, preserving the owner's Discord taxonomy and existing collection.
- [x] Project cards live exclusively in Projects; tokora, smear, memberlist, and serf retain illustrated emphasis within their categories.
- [x] Thirty public README/manifests reviewed; source-only cards omit unverified registry links.
- [x] Pql uses only its owner-provided name/category, with no private source, description, or repository link.
- [x] Shared public data updates the detailed online CV and rebalanced two-page A4 PDF, including role context, technical scope, and education; both rendered pages inspected.
- [x] Owner-approved thread-per-core/shared-nothing concurrency redesign, pre-allocation, mutex-free busy loops, and exact owner-supplied p99.9/p99/p90 outcome ranges are included in the anonymous current role.
- [x] Web CV headers/body aligned, dates separated, tablet reading width restored, and PDF table widths corrected for frame padding.
- [x] Current role remains anonymous; private records and restricted-term lists remain outside source and Git history.
- [x] Source, build output, PDF text, and metadata passed the private-term scan; public screenshot inspected.
- [x] Astro/TypeScript, production build, static validation, and ten regression checks passed locally.
- [x] Responsive previews, light/dark cards, and all ten filters reviewed in the browser.
- [x] Primary-crate total downloads verified against live API data for 30 public cards, with ten-minute caching and fetch timestamps.
- [x] Continuous page transitions and fallback animations, theme color transitions, and interaction feedback respect reduced motion. Browser coverage includes navigation history and control reinitialization.
- [x] Existing repository history is preserved; approved automatic deployment remains enabled.

The [release workflow](https://github.com/al8n/al8n.github.io/actions/workflows/deploy.yml) runs the complete browser matrix and full-history privacy checks before publishing. Completed runs and live route responses provide release evidence. Registry HTML response checks remain unverified because the environment returns HTTP 403.
