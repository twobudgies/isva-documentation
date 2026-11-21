# Contributing

Thanks for improving this documentation. It is a static site: plain HTML, one shared stylesheet and script, Mermaid diagrams from a CDN. No build step.

## Ground rules
- **Placeholders only.** Use `partner_portal`, `partner_portal_backend`, `ciam`, `csl`, `PartnerLink_OIDC_Test`, `<partner_portal_clientid>`, `<tenant>`. Never commit real hostnames, client IDs/secrets, tokens, cookies or HAR files.
- **Be honest about confidence.** If you are not sure a menu name, path, class or attribute type matches every version, mark it `VERIFY` / "verify on your appliance". The levels are defined on the [FAQ page](faq.html#status).
- **Every module page keeps the same six sections** (ids `zero`, `high`, `low`, `env`, `pitfalls`, `saas-map`), a flowchart, an autonumbered sequence diagram, a `curl` check, a table and the four callouts. `scripts/verify.mjs` enforces this.

## Workflow
1. Branch from `main`: `git checkout -b fix/short-description` (do not commit to `main`).
2. Preview: `python3 -m http.server 8000` then open http://localhost:8000.
3. Verify: `cd scripts && npm ci && cd .. && node scripts/verify.mjs` (links, anchors, Mermaid syntax, template checks, nested links).
4. Optional browser check (macOS + Chrome): `scripts/render-check.sh`.
5. Open a pull request; merge with a merge commit.

## Diagrams
Mermaid in `<pre class="mermaid">`. Avoid raw `;` in sequence messages (use `#59;`), keep labels short, and prefer a left-to-right flowchart with few nodes. Long sequence messages wrap automatically; diagrams scale to the page width but never below about 65% of their natural size.

## Reporting problems
Use the "Correction or doubt" issue form. Include product/version and how you verified it, without secrets.
