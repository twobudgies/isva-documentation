# TODO — ISVA → Verify SaaS Documentation

Legend: `[x]` done · `[ ]` not started. `main` is protected: all work lands via feature branches merged with `git merge --no-ff` after `node scripts/verify.mjs` passes.

## Phase 0 — `feat/site-scaffold-and-nav`
- [x] Shared CSS (`assets/site.css`): light/dark, callouts, responsive
- [x] Shared JS (`assets/site.js`): sidebar, filter, breadcrumb, prev/next, Mermaid v11 + expand/zoom
- [x] `index.html` (Page 0) with architecture + 7-step diagrams
- [x] `progress.html` tracker
- [x] GitHub Actions Pages workflow (`.github/workflows/pages.yml`)
- [x] `scripts/verify.mjs` (links, anchors, Mermaid syntax, module template checks)
- [x] Stub pages 01–14 so navigation resolves
- [x] README

## Phase 1 — `feat/phase1-core-isva`
- [x] 01 IAM & OIDC foundations
- [x] 02 WebSEAL, Akamai & junctions
- [x] 03 AAC & federation runtime
- [x] 04 LMI, deployment & pdadmin

## Phase 2 — `feat/phase2-oauth-oidc`
- [x] 05 API protection definitions
- [x] 06 OAuth/OIDC clients & PKCE
- [x] 07 Metadata & JWKS discovery
- [x] 08 authsvc, mechanisms & policies

## Phase 3 — `feat/phase3-custom-rules-stsuu`
- [x] 09 InfoMap & mapping rules (annotated JS)
- [x] 10 STSUU & session claims

## Phase 4 — `feat/phase4-e2e-security-migration`
- [x] 11 End-to-end 7-step flow
- [x] 12 Security audit & hardening
- [x] 13 Migration to Verify SaaS

## Phase 5 — `feat/troubleshooting-and-qa`
- [ ] 14 Troubleshooting & HAR playbook
- [ ] Final QA: all hrefs, Mermaid syntax, sidebar state, responsive layout across 16 HTML files
