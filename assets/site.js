// Shared site chrome: sidebar, breadcrumb, pager, search, Mermaid rendering. No build step.
export const PAGES = [
  { id: '00', file: 'index.html', title: 'Overview & Roadmap', phase: 'Start Here', branch: 'feat/site-scaffold-and-nav', status: 'done' },
  { id: '01', file: '01-iam-oidc-foundations.html', title: 'IAM & OIDC Foundations', phase: 'Phase 1 — Core ISVA', branch: 'feat/phase1-core-isva', status: 'done' },
  { id: '02', file: '02-webseal-junctions.html', title: 'WebSEAL, Akamai & Junctions', phase: 'Phase 1 — Core ISVA', branch: 'feat/phase1-core-isva', status: 'done' },
  { id: '03', file: '03-aac-federation-runtime.html', title: 'AAC & Federation Runtime', phase: 'Phase 1 — Core ISVA', branch: 'feat/phase1-core-isva', status: 'done' },
  { id: '04', file: '04-lmi-deployment-ops.html', title: 'LMI, Deploy & pdadmin', phase: 'Phase 1 — Core ISVA', branch: 'feat/phase1-core-isva', status: 'done' },
  { id: '05', file: '05-api-protection-definitions.html', title: 'API Protection Definitions', phase: 'Phase 2 — OAuth & OIDC', branch: 'feat/phase2-oauth-oidc', status: 'done' },
  { id: '06', file: '06-oauth-oidc-clients.html', title: 'OAuth/OIDC Clients & PKCE', phase: 'Phase 2 — OAuth & OIDC', branch: 'feat/phase2-oauth-oidc', status: 'done' },
  { id: '07', file: '07-metadata-jwks-discovery.html', title: 'Metadata & JWKS Discovery', phase: 'Phase 2 — OAuth & OIDC', branch: 'feat/phase2-oauth-oidc', status: 'done' },
  { id: '08', file: '08-authsvc-mechanisms-policies.html', title: 'authsvc, Mechanisms & Policies', phase: 'Phase 2 — OAuth & OIDC', branch: 'feat/phase2-oauth-oidc', status: 'done' },
  { id: '09', file: '09-infomap-mapping-rules.html', title: 'InfoMap & Mapping Rules (JS)', phase: 'Phase 3 — Custom Rules & STSUU', branch: 'feat/phase3-custom-rules-stsuu', status: 'done' },
  { id: '10', file: '10-stsuu-session-claims.html', title: 'STSUU & Session Claims', phase: 'Phase 3 — Custom Rules & STSUU', branch: 'feat/phase3-custom-rules-stsuu', status: 'done' },
  { id: '11', file: '11-end-to-end-7-step-flow.html', title: 'End-to-End 7-Step Flow', phase: 'Phase 4 — E2E, Security & Migration', branch: 'feat/phase4-e2e-security-migration', status: 'done' },
  { id: '12', file: '12-security-audit-hardening.html', title: 'Security Audit & Hardening', phase: 'Phase 4 — E2E, Security & Migration', branch: 'feat/phase4-e2e-security-migration', status: 'done' },
  { id: '13', file: '13-verify-saas-migration.html', title: 'Migration to Verify SaaS', phase: 'Phase 4 — E2E, Security & Migration', branch: 'feat/phase4-e2e-security-migration', status: 'done' },
  { id: '14', file: '14-troubleshooting-har-playbook.html', title: 'Troubleshooting & HAR Playbook', phase: 'Operations', branch: 'feat/troubleshooting-and-qa', status: 'done' },
  { id: 'G', file: 'glossary.html', title: 'Glossary (A–Z)', phase: 'Reference', branch: 'feat/ref-glossary-cheatsheet', status: 'done' },
  { id: 'Q', file: 'cheatsheet.html', title: 'Quick Reference', phase: 'Reference', branch: 'feat/ref-glossary-cheatsheet', status: 'done' },
  { id: 'P', file: 'progress.html', title: 'Progress Tracker', phase: 'Operations', branch: 'feat/site-scaffold-and-nav', status: 'done' },
];

const STATUS = { done: '✅', wip: '🚧', todo: '⬜' };
const here = (location.pathname.split('/').pop() || 'index.html');
const idx = PAGES.findIndex(p => p.file === here);
const cur = PAGES[idx] || PAGES[0];

function el(tag, attrs = {}, html = '') {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.innerHTML = html; return e;
}

function tagTables() {
  document.querySelectorAll('.table-wrap table').forEach(t => {
    const hs = [...t.rows[0].cells].map(c => c.textContent.trim().toLowerCase());
    if (hs[0] === 'symptom' && hs.length === 4) t.classList.add('pb4');
    else if (hs[0] === 'step' && hs.length === 5) t.classList.add('pb5');
    else if (hs[0] === '#' && hs.length === 5 && hs[1].startsWith('from')) t.classList.add('steps');
    else if (hs[0] === '#') t.classList.add('numfirst');
    if (hs[0] === 'path' && hs.length === 5) t.classList.add('acl');
  });
}

function buildSidebar() {
  const sb = el('nav', { id: 'sidebar', 'aria-label': 'Documentation navigation' });
  sb.innerHTML = `<a class="brand" href="index.html">ISVA → Verify SaaS Docs</a>
    <div class="sub">Zero-to-hero CIAM / brokered OIDC guide</div>
    <input type="search" id="navFilter" placeholder="Search all pages…  ( / )" aria-label="Filter navigation">`;
  const groups = [...new Set(PAGES.map(p => p.phase))];
  for (const g of groups) {
    const h = el('h4', { 'data-group': g }, g); sb.append(h);
    for (const p of PAGES.filter(x => x.phase === g)) {
      const a = el('a', { class: 'nav' + (p.file === cur.file ? ' active' : ''), href: p.file, 'data-search': (p.id + ' ' + p.title + ' ' + (p.keywords || '')).toLowerCase() },
        `${/^\d\d$/.test(p.id) && p.id !== '00' ? p.id + ' · ' : ''}${p.title}`);
      sb.append(a);
    }
  }
  sb.append(el('div', { class: 'nores' }, 'No matching pages.'));
  document.body.prepend(sb);
}

function buildTopbar() {
  const t = el('div', { id: 'topbar' });
  const grp = cur.phase;
  t.innerHTML = `<button id="menuBtn" aria-label="Toggle menu">☰</button>
    <span><a href="index.html">Home</a> › ${grp} › <strong>${cur.title}</strong></span><span class="grow"></span>
    <button id="themeBtn" title="Toggle theme" aria-label="Toggle theme">◐</button>`;
  document.getElementById('sidebar').after(t);
  document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('menu-open');
  document.getElementById('themeBtn').onclick = () => {
    const r = document.documentElement; const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    const now = r.dataset.theme || (dark ? 'dark' : 'light');
    r.dataset.theme = now === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', r.dataset.theme); } catch (e) {}
    location.reload();
  };
  document.querySelector('main').addEventListener('click', () => document.body.classList.remove('menu-open'));
}


// Per-page learning aids rendered automatically (objectives, prerequisites, takeaways).
const AIDS = {
  '01': { learn: ['Tell authentication from authorization', 'Read an OAuth 2.0 / OIDC flow and a JWT', 'Explain JWKS and why backends fetch public keys', 'Describe what an identity broker does'], prereq: 'None. Start here.', take: ['AuthN = who you are, AuthZ = what you may do; OIDC adds identity on top of OAuth 2.0.', 'A JWT is signed, not encrypted: never put secrets in claims.', 'The code travels via the browser, the tokens only on the back channel.', 'Validate iss, aud, exp, nonce and signature (via JWKS) on every token.'] },
  '02': { learn: ['Trace a request Akamai → WebSEAL → /mga → runtime', 'Know which layer returns 403 vs 302', 'Read and set ACLs with pdadmin', 'Understand PD-S-SESSION-ID and iv-user / iv-creds'], prereq: 'Module 01', take: ['Two gates protect every public URL: Akamai (network) then WebSEAL (identity/object).', 'Attach ACLs to the exact object (/metadata, /jwks); ACLs inherit downward.', 'iv-user / iv-creds are injected by the junction, never trust them from the internet.', 'LMI :9443 must never be reachable through Akamai.'] },
  '03': { learn: ['Locate the AAC / federation runtime and its endpoints', 'Explain context-based access and obligations', 'Understand why config is a deployed snapshot'], prereq: 'Modules 01–02', take: ['WebSEAL is the gatekeeper; the AAC runtime (Liberty) is the decision maker.', 'Step-up is an obligation returned by a policy, executed via /authsvc.', 'MFA only at csl means ciam must verify the upstream assertion.'] },
  '04': { learn: ['Use LMI safely: stage, deploy, snapshot', 'Turn runtime tracing on and off', 'Run the essential pdadmin checks'], prereq: 'Modules 02–03', take: ['Nothing is live until Deploy Pending Changes.', 'Take a snapshot before every change; roll back if tests fail.', 'Trace logs contain PII and tokens: enable briefly, then purge.'] },
  '05': { learn: ['Read an API Protection Definition', 'Choose safe grant types and token lifetimes', 'Fix the localhost Provider ID (iss)'], prereq: 'Modules 01, 03', take: ['The Provider ID becomes iss; it must equal the external URL.', 'Disable ROPC and Implicit; keep Authorization Code (+PKCE).', 'Changing iss needs a coordinated cut-over with every relying party.'] },
  '06': { learn: ['Register a confidential client correctly', 'Enforce exact redirect_uri matching', 'Generate and verify a PKCE S256 pair'], prereq: 'Module 05', take: ['client_secret authenticates the backend; PKCE binds the code to the login.', 'redirect_uri must match exactly: no wildcards or prefixes.', 'Reject code_challenge_method=plain.'] },
  '07': { learn: ['Fetch and read metadata and JWKS', 'Rotate keys without outages', 'Distinguish Akamai 403 from WebSEAL 302'], prereq: 'Modules 02, 05', take: ['Metadata and JWKS are public by design: open exactly those two paths.', 'Rotate with overlap: publish both keys, wait for caches, then switch.', 'Run curl from the backend host: egress IP matters for Akamai.'] },
  '08': { learn: ['Explain mechanisms vs policies', 'Follow a multi-step login through authsvc', 'Spot the state-passthrough and nested-URL flaws'], prereq: 'Modules 03, 06', take: ['A policy is an ordered list of mechanisms; InfoMap runs custom JavaScript.', 'Each OAuth leg needs its own state and nonce.', 'Encode nested URLs: exactly one ? per URL.'] },
  '09': { learn: ['Read the three Rhino rules line by line', 'Know what each rule may read and write', 'Apply the audit fixes in code'], prereq: 'Modules 08, 10 (STSUU)', take: ['Rules run with runtime privileges: treat all input as hostile and fail closed.', 'Rhino is ES5: no let/const/arrow functions.', 'Generate state2 / nonce2 with SecureRandom and clear them after use.'] },
  '10': { learn: ['Describe the three parts of an STSUU', 'Trace a claim from login to id_token', 'Add a custom claim safely'], prereq: 'Module 09', take: ['Principal → sub; AttributeList → user claims; ContextAttributes → request data.', 'Claim missing from the token is usually a mapping/type problem.', 'Use an explicit claim allowlist.'] },
  '11': { learn: ['Walk all 7 steps with exact URLs, cookies and headers', 'Know what to check in a HAR at each step', 'See the target flow on Verify SaaS'], prereq: 'Modules 01–10', take: ['Steps 1–5 are front channel; step 7 is the only back-channel call.', 'Three independent cookie jars: ciam, csl, portal.', 'Each hop is a place where state, PKCE and encoding can break.'] },
  '12': { learn: ['Understand the five audit findings and their attacks', 'Apply each fix and prove it with a test', 'Use the Akamai / WebSEAL ACL matrix'], prereq: 'Modules 06–11', take: ['Fix order: iss + ROPC, PKCE, state/nonce, encoding, then edge/ACL.', 'Every fix has a curl test; keep the tests as regression checks.', 'Least privilege on /mga: open only what must be public.'] },
  '13': { learn: ['Map every legacy component to Verify SaaS', 'Replace the JS rules with configuration and webhooks', 'Plan a pilot with instant rollback'], prereq: 'Modules 01–12', take: ['The portal change is mostly configuration: issuer, client credentials, endpoints.', 'Keep sub stable or users will duplicate.', 'Run both issuers in parallel during the pilot.'] },
  '14': { learn: ['Triage failures by layer', 'Read a HAR with jq', 'Run the 10-point curl verification suite'], prereq: 'Any module', take: ['Identify the layer first: edge, WebSEAL, runtime, rule, validation.', 'Sanitize HARs before sharing; treat seen tokens as compromised.', 'Run the curl suite from the backend host.'] },
  'G': { learn: ['Look up any term used on this site'], prereq: 'None', take: [] },
  'Q': { learn: ['Find endpoints, headers, errors and commands fast'], prereq: 'None', take: [] },
};

function words() { return (document.querySelector('main').innerText || '').split(/\s+/).length; }

function buildAids() {
  const a = AIDS[cur.id]; const main = document.querySelector('main'); if (!a) return;
  const mins = Math.max(2, Math.round(words() / 200));
  const toc = document.getElementById('toc');
  if (toc && a.learn.length) {
    const box = el('div', { class: 'glance' }, `<div class="g-col"><b>🎯 You will learn</b><ul>${a.learn.map(x => `<li>${x}</li>`).join('')}</ul></div>
      <div class="g-col"><b>📚 Prerequisites</b><p>${a.prereq}</p><b>⏱️ Reading time</b><p>≈ ${mins} min</p></div>`);
    toc.before(box);
  }
  if (a.take && a.take.length) {
    const k = el('div', { class: 'callout note takeaways' }, `<div class="ttl">✅ Key takeaways</div><ul>${a.take.map(x => `<li>${x}</li>`).join('')}</ul>`);
    main.append(k);
  }
}

function buildPager() {
  const main = document.querySelector('main');
  const seq = PAGES.filter(p => p.id !== 'P');
  const i = seq.findIndex(p => p.file === cur.file);
  const prev = i > 0 ? seq[i - 1] : null, next = i >= 0 && i < seq.length - 1 ? seq[i + 1] : null;
  if (i < 0) return;
  const d = el('div', { class: 'pager' });
  d.innerHTML = (prev ? `<a class="prev" href="${prev.file}"><small>← Previous</small>${prev.id} · ${prev.title}</a>` : '<span class="ph"></span>') +
    (next ? `<a class="next" href="${next.file}"><small>Next →</small>${next.id} · ${next.title}</a>` : '<span class="ph"></span>');
  main.append(d);
}

function buildToc() {
  const slot = document.getElementById('toc'); if (!slot) return;
  const hs = [...document.querySelectorAll('main h2[id]')];
  slot.className = 'toc';
  slot.innerHTML = '<b>On this page</b><ol>' + hs.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('') + '</ol>';
}


// ---- Full-text search across all pages (client-side, lazy) ----
let INDEX = null;
async function loadIndex() {
  if (INDEX) return INDEX;
  INDEX = [];
  await Promise.all(PAGES.map(async p => {
    try {
      const r = await fetch(p.file); const d = new DOMParser().parseFromString(await r.text(), 'text/html');
      let heading = p.title, hid = '', buf = [];
      const flush = () => { const t = buf.join(' ').replace(/\s+/g, ' ').trim(); if (t) INDEX.push({ p, heading, hid, text: t }); buf = []; };
      d.querySelectorAll('main > *').forEach(n => {
        if (/^H[23]$/.test(n.tagName)) { flush(); heading = n.textContent.replace(/#$/, '').trim(); hid = n.id || ''; }
        else buf.push(n.textContent);
      });
      flush();
    } catch (e) { /* offline or missing */ }
  }));
  return INDEX;
}
function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
async function runSearch(q) {
  const box = document.getElementById('searchResults'); const nav = document.querySelectorAll('#sidebar a.nav, #sidebar h4');
  if (q.length < 2) { box.style.display = 'none'; nav.forEach(n => n.style.display = ''); return; }
  const idx = await loadIndex(); const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = idx.map(e => {
    const h = e.heading.toLowerCase(), t = e.text.toLowerCase(); let s = 0;
    for (const w of terms) { if (!t.includes(w) && !h.includes(w)) return null; s += (h.includes(w) ? 6 : 0) + Math.min(5, t.split(w).length - 1); }
    return { e, s };
  }).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 10);
  nav.forEach(n => n.style.display = 'none');
  box.style.display = 'block';
  box.innerHTML = scored.length ? scored.map(({ e }) => {
    const t = e.text; const i = Math.max(0, t.toLowerCase().indexOf(terms[0]) - 40);
    let sn = esc(t.slice(i, i + 130)); terms.forEach(w => { sn = sn.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return `<a class="res" href="${e.p.file}${e.hid ? '#' + e.hid : ''}"><b>${/^\d\d$/.test(e.p.id) && e.p.id !== '00' ? e.p.id + ' · ' : ''}${e.p.title}</b><span>${esc(e.heading)}</span><small>…${sn}…</small></a>`;
  }).join('') : '<div class="nores" style="display:block">No results. Try fewer or different words.</div>';
}

function wireSearch() {
  const inp = document.getElementById('navFilter');
  inp.insertAdjacentElement('afterend', el('div', { id: 'searchResults', style: 'display:none' }));
  let t; inp.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => runSearch(inp.value.trim()), 120); });
  addEventListener('keydown', e => {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); document.body.classList.add('menu-open'); inp.focus(); }
    if (e.key === 'Escape' && document.activeElement === inp) { inp.value = ''; runSearch(''); inp.blur(); }
  });
}

// Lightweight cross-page topic index so the filter can match content keywords (e.g. "pkce", "jwks", "403").
const PAGE_INDEX = {
  'index.html': 'overview roadmap summary architecture',
  '01-iam-oidc-foundations.html': 'authentication authorization oauth oidc jwt jwks reverse proxy broker primer',
  '02-webseal-junctions.html': 'webseal akamai edgesuite tls pdsrv.kdb acl pop pd-s-session-id junction iv-user iv-creds /mga',
  '03-aac-federation-runtime.html': 'aac federation liberty cba risk obligation step-up runtime',
  '04-lmi-deployment-ops.html': 'lmi 9443 deploy pending changes trace logs pdadmin',
  '05-api-protection-definitions.html': 'api protection definition provider id iss localhost ropc grant types token lifetime',
  '06-oauth-oidc-clients.html': 'client registration confidential public redirect_uri pkce s256 secret',
  '07-metadata-jwks-discovery.html': 'metadata jwks discovery key rotation 403 302 unauth acl well-known',
  '08-authsvc-mechanisms-policies.html': 'authsvc mechanism policy infomap workflow mfa',
  '09-infomap-mapping-rules.html': 'javascript rhino rules pre-token post-token infomap partnerLoginRedirect',
  '10-stsuu-session-claims.html': 'stsuu principal attributelist contextattributes claims transformation',
  '11-end-to-end-7-step-flow.html': 'end to end seven step flow code token state nonce',
  '12-security-audit-hardening.html': 'audit hardening state nonce pkce encoding redirect_uri ropc acl matrix',
  '13-verify-saas-migration.html': 'migration saas verify tenant identity sources webhooks attribute mapping access policies',
  '14-troubleshooting-har-playbook.html': 'troubleshooting har curl invalid_grant iss mismatch 403 302 jwt debug',
  'progress.html': 'progress todo status tracker',
  'glossary.html': 'glossary terms definitions acronyms',
  'cheatsheet.html': 'cheat sheet quick reference endpoints errors headers curl pdadmin',
};

async function renderMermaid() {
  const pres = [...document.querySelectorAll('pre.mermaid')];
  if (!pres.length) return;
  for (const pre of pres) {
    const wrap = pre.closest('.diagram') || (() => { const d = el('div', { class: 'diagram' }); pre.replaceWith(d); d.append(pre); return d; })();
    const tools = el('div', { class: 'dtools' }, '<button type="button" class="expand" title="Open full-screen">⤢ Expand</button>');
    wrap.prepend(tools);
  }
  const dark = (document.documentElement.dataset.theme === 'dark') ||
    (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  try {
    const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs');
    mermaid.initialize({
      startOnLoad: false, theme: dark ? 'dark' : 'default', securityLevel: 'loose',
      sequence: { useMaxWidth: true, mirrorActors: false, wrap: true, width: 150, messageFontSize: 13 },
      flowchart: { useMaxWidth: true, htmlLabels: true }, themeVariables: { fontSize: '14px' },
    });
    await mermaid.run({ nodes: pres });
  } catch (e) {
    pres.forEach(p => { const n = el('div', { class: 'callout pitfall' }, '<div class="ttl">Diagram could not load</div>Mermaid is fetched from the jsDelivr CDN; check connectivity. Raw diagram source is shown below.'); p.before(n); p.style.whiteSpace = 'pre'; p.style.textAlign = 'left'; });
    console.error(e);
  }
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-label': 'Diagram viewer' },
    '<div class="bar"><button data-z="-">－</button><button data-z="+">＋</button><button data-z="0">100%</button><button data-z="x">✕ Close</button></div><div class="stage"></div>');
  document.body.append(modal);
  let scale = 1, base = 1000; const stage = modal.querySelector('.stage');
  const apply = () => { const s = stage.querySelector('svg'); if (s) { s.setAttribute('width', Math.round(base * scale)); s.style.maxWidth = 'none'; } };
  modal.addEventListener('click', e => {
    const z = e.target.dataset && e.target.dataset.z; if (!z) return;
    if (z === 'x') modal.classList.remove('open'); else { scale = z === '+' ? scale * 1.25 : z === '-' ? scale / 1.25 : 1; apply(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
  // Keep text legible: shrink to fit, but never below ~65% of natural size (then scroll sideways)
  document.querySelectorAll('.diagram').forEach(w => {
    const svg = w.querySelector('svg'); if (!svg) return;
    const vb = (svg.getAttribute('viewBox') || '').split(/[ ,]+/).map(Number); if (vb.length !== 4) return;
    const natural = vb[2], avail = w.clientWidth - 24;
    if (natural > avail) {
      const target = Math.max(avail, Math.round(natural * 0.65));
      svg.style.maxWidth = 'none'; svg.style.width = target + 'px'; svg.style.height = 'auto';
      if (target > avail) w.classList.add('scrolls');
    }
  });
  const open = (wrap) => {
    const svg = wrap.querySelector('svg'); if (!svg) return;
    stage.innerHTML = ''; const c = svg.cloneNode(true); c.removeAttribute('style');
    const vb = (svg.getAttribute('viewBox') || '').split(/[ ,]+/).map(Number);
    base = vb.length === 4 ? vb[2] : svg.getBoundingClientRect().width;
    c.setAttribute('width', base); c.removeAttribute('height'); stage.append(c); scale = 1; apply(); modal.classList.add('open');
  };
  document.querySelectorAll('.diagram').forEach(w => {
    const b = w.querySelector('.expand'); if (b) b.addEventListener('click', () => open(w));
    const svg = w.querySelector('svg'); if (svg) svg.addEventListener('click', () => open(w));
    w.append(el('div', { class: 'hint' }, (w.classList.contains('scrolls') ? 'Scroll sideways to pan · ' : '') + 'Click the diagram or “Expand” for full size · Esc to close'));
  });
}

function decorate() {
  document.querySelectorAll('main h2, main h3').forEach(h => {
    if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
    h.append(el('a', { class: 'anchor', href: '#' + h.id, 'aria-label': 'Link to this section' }, '#'));
  });
  const bar = el('div', { id: 'readbar' }); const top = el('button', { id: 'toTop', type: 'button', 'aria-label': 'Back to top' }, '↑ Top');
  document.body.append(bar, top);
  top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  const upd = () => { const d = document.documentElement; const p = d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight); bar.style.width = (p * 100) + '%'; top.classList.toggle('show', d.scrollTop > 600); };
  addEventListener('scroll', upd, { passive: true }); upd();
}

function addCopyButtons() {
  document.querySelectorAll('pre:not(.mermaid)').forEach(pre => {
    const b = el('button', { type: 'button', style: 'position:absolute;top:6px;right:6px;font-size:.7rem;padding:2px 8px;border-radius:6px;border:1px solid #334;background:#1e293b;color:#cbd5e1;cursor:pointer' }, 'Copy');
    b.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(pre.innerText.replace(/Copy$/, '')); b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1200); };
    pre.append(b);
  });
}

function fillProgress() {
  const bar = document.getElementById('overallBar'); const txt = document.getElementById('overallTxt');
  const mods = PAGES.filter(p => /^\d\d$/.test(p.id) && p.id !== '00');
  const done = mods.filter(p => p.status === 'done').length;
  if (bar) bar.style.width = Math.round(done / mods.length * 100) + '%';
  if (txt) txt.textContent = `${done} of ${mods.length} learning modules complete`;
  const tb = document.getElementById('progressRows');
  if (tb) tb.innerHTML = PAGES.map(p => `<tr><td>${p.id}</td><td><a href="${p.file}">${p.title}</a></td><td>${p.phase}</td><td><code>${p.branch}</code></td><td><span class="badge ${p.status}">${STATUS[p.status]} ${p.status}</span></td></tr>`).join('');
  const rd = document.getElementById('readRows');
  if (rd) {
    let read = {}; try { read = JSON.parse(localStorage.getItem('read') || '{}'); } catch (e) {}
    rd.innerHTML = mods.map(p => `<label style="display:block"><input type="checkbox" data-f="${p.file}" ${read[p.file] ? 'checked' : ''}> ${p.id} · ${p.title}</label>`).join('');
    rd.addEventListener('change', e => { read[e.target.dataset.f] = e.target.checked; try { localStorage.setItem('read', JSON.stringify(read)); } catch (x) {} });
  }
}

try { const t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
tagTables(); buildAids(); buildSidebar(); buildTopbar(); buildPager(); buildToc(); wireSearch(); addCopyButtons(); fillProgress(); decorate();
renderMermaid();
