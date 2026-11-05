# Release review

- [x] All 31 projects have independent cards in ten categories, preserving the owner's Discord taxonomy and existing collection.
- [x] Tokora, smear, memberlist, and serf have homepage spotlight cards and collection markers.
- [x] Thirty public README/manifests reviewed; source-only cards omit unverified registry links.
- [x] Pql uses only its owner-provided name/category, with no private source, description, or repository link.
- [x] Shared public data updates the online CV and two-page A4 PDF; both rendered pages inspected.
- [x] Current role remains anonymous; private records and restricted-term lists remain outside source and Git history.
- [x] Source, build output, PDF text, and metadata passed the private-term scan; public screenshot inspected.
- [x] Astro/TypeScript, production build, static validation, and five regression checks passed locally.
- [x] Responsive previews, light/dark cards, and all ten filters reviewed in the browser.
- [x] Existing repository history is preserved; approved automatic deployment remains enabled.

The [release workflow](https://github.com/al8n/al8n.github.io/actions/workflows/deploy.yml) runs the complete browser matrix and full-history privacy checks before publishing. Completed runs and live route responses provide release evidence. Registry HTML response checks remain unverified because the environment returns HTTP 403.
