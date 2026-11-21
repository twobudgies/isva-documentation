# ISVA → IBM Security Verify: Zero-to-Hero CIAM Documentation

Static, build-free documentation site (GitHub Pages) covering a brokered OIDC architecture on IBM Security Verify Access (ISVA 10.x/11.x), its security audit, and the migration path to IBM Security Verify (SaaS).

- Start at [`index.html`](index.html)
- All names/hosts/IDs are sanitized placeholders (`partner_portal`, `ciam`, `csl`, …).
- Diagrams use Mermaid v11 loaded from a CDN.

## Local preview
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Verify before merging
```bash
cd scripts && npm ci && cd .. && node scripts/verify.mjs
```
Checks internal links/anchors, Mermaid syntax, and that every module page has the required sections.

## Deploy
Push to `main`; `.github/workflows/pages.yml` verifies and deploys. Enable **Settings → Pages → Source: GitHub Actions** once.

## License
[MIT](LICENSE). This is unofficial community documentation, not affiliated with or endorsed by IBM; IBM, IBM Security Verify Access and IBM Security Verify are trademarks of International Business Machines Corporation. Contributions are accepted under the same license (see [CONTRIBUTING.md](CONTRIBUTING.md)).
