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
  { id: '11', file: '11-end-to-end-7-step-flow.html', title: 'End-to-End 7-Step Flow', phase: 'Phase 4 — E2E, Security & Migration', branch: 'feat/phase4-e2e-security-migration', status: 'todo' },
  { id: '12', file: '12-security-audit-hardening.html', title: 'Security Audit & Hardening', phase: 'Phase 4 — E2E, Security & Migration', branch: 'feat/phase4-e2e-security-migration', status: 'todo' },
  { id: '13', file: '13-verify-saas-migration.html', title: 'Migration to Verify SaaS', phase: 'Phase 4 — E2E, Security & Migration', branch: 'feat/phase4-e2e-security-migration', status: 'todo' },
  { id: '14', file: '14-troubleshooting-har-playbook.html', title: 'Troubleshooting & HAR Playbook', phase: 'Operations', branch: 'feat/troubleshooting-and-qa', status: 'todo' },
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

function buildSidebar() {
  const sb = el('nav', { id: 'sidebar', 'aria-label': 'Documentation navigation' });
  sb.innerHTML = `<a class="brand" href="index.html">ISVA → Verify SaaS Docs</a>
    <div class="sub">Zero-to-hero CIAM / brokered OIDC guide</div>
    <input type="search" id="navFilter" placeholder="Filter pages & topics…" aria-label="Filter navigation">`;
  const groups = [...new Set(PAGES.map(p => p.phase))];
  for (const g of groups) {
    const h = el('h4', { 'data-group': g }, g); sb.append(h);
    for (const p of PAGES.filter(x => x.phase === g)) {
      const a = el('a', { class: 'nav' + (p.file === cur.file ? ' active' : ''), href: p.file, 'data-search': (p.id + ' ' + p.title + ' ' + (p.keywords || '')).toLowerCase() },
        `${p.id === 'P' || p.id === '00' ? '' : p.id + ' · '}${p.title}<span class="st" title="${p.status}">${STATUS[p.status]}</span>`);
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

function wireSearch() {
  const inp = document.getElementById('navFilter');
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    let any = false;
    document.querySelectorAll('#sidebar a.nav').forEach(a => {
      const hit = !q || a.dataset.search.includes(q) || (PAGE_INDEX[a.getAttribute('href')] || '').includes(q);
      a.style.display = hit ? '' : 'none'; any = any || hit;
    });
    document.querySelectorAll('#sidebar h4').forEach(h => {
      let n = h.nextElementSibling, vis = false;
      while (n && n.tagName === 'A') { if (n.style.display !== 'none') vis = true; n = n.nextElementSibling; }
      h.style.display = vis ? '' : 'none';
    });
    document.querySelector('#sidebar .nores').style.display = any ? 'none' : 'block';
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
      sequence: { useMaxWidth: false, mirrorActors: false, wrap: false, width: 170, messageFontSize: 13 },
      flowchart: { useMaxWidth: false, htmlLabels: true }, themeVariables: { fontSize: '14px' },
    });
    await mermaid.run({ nodes: pres });
  } catch (e) {
    pres.forEach(p => { const n = el('div', { class: 'callout pitfall' }, '<div class="ttl">Diagram could not load</div>Mermaid is fetched from the jsDelivr CDN; check connectivity. Raw diagram source is shown below.'); p.before(n); p.style.whiteSpace = 'pre'; p.style.textAlign = 'left'; });
    console.error(e);
  }
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-label': 'Diagram viewer' },
    '<div class="bar"><button data-z="-">－</button><button data-z="+">＋</button><button data-z="0">100%</button><button data-z="x">✕ Close</button></div><div class="stage"></div>');
  document.body.append(modal);
  let scale = 1; const stage = modal.querySelector('.stage');
  const apply = () => { const s = stage.querySelector('svg'); if (s) { s.style.transform = `scale(${scale})`; s.style.transformOrigin = 'top left'; } };
  modal.addEventListener('click', e => {
    const z = e.target.dataset && e.target.dataset.z; if (!z) return;
    if (z === 'x') modal.classList.remove('open'); else { scale = z === '+' ? scale * 1.25 : z === '-' ? scale / 1.25 : 1; apply(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
  document.querySelectorAll('.diagram .expand').forEach(b => b.addEventListener('click', () => {
    const svg = b.closest('.diagram').querySelector('svg'); if (!svg) return;
    stage.innerHTML = ''; const c = svg.cloneNode(true); c.removeAttribute('style'); stage.append(c); scale = 1; modal.classList.add('open');
  }));
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
  const mods = PAGES.filter(p => /^\d+$/.test(p.id) && p.id !== '00');
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
buildSidebar(); buildTopbar(); buildPager(); buildToc(); wireSearch(); addCopyButtons(); fillProgress();
renderMermaid();
