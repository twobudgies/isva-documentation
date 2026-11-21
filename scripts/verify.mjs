// Verifies: internal hrefs/anchors, manifest<->files, Mermaid syntax, required module sections/callouts.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window; globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
const mermaid = (await import('mermaid')).default;
const siteJs = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
const manifest = [...siteJs.matchAll(/file: '([^']+)'/g)].map(m => m[1]);
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();
let errors = 0; const err = (m) => { errors++; console.log('ERROR', m); };
for (const f of manifest) if (!htmlFiles.includes(f) && process.env.ALLOW_MISSING !== '1') err(`manifest lists missing file ${f}`);
const ids = {};
for (const f of htmlFiles) ids[f] = new Set([...fs.readFileSync(path.join(root, f), 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
let blocks = 0;
const isModule = f => /^\d\d-/.test(f);
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  if (/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/.test(html)) err(`${f}: nested <a> link (invalid HTML)`);
  if (!/<meta name="viewport"/.test(html)) err(`${f}: missing viewport meta`);
  if (!/assets\/site\.js/.test(html)) err(`${f}: missing site.js`);
  const linkHtml = html.replace(/<base\b[^>]*>/g, '');
  for (const m of linkHtml.matchAll(/(?:href|src)="([^"#][^"]*|#[^"]*)"/g)) {
    const u = m[1]; if (/^(https?:|mailto:|data:)/.test(u)) continue;
    const [p, h] = u.split('#'); const target = p || f;
    if (!fs.existsSync(path.join(root, target))) { err(`${f}: broken link ${u}`); continue; }
    if (h && target.endsWith('.html') && !ids[target]?.has(h)) err(`${f}: missing anchor ${u}`);
  }
  for (const m of html.matchAll(/<pre class="mermaid"[^>]*>([\s\S]*?)<\/pre>/g)) {
    blocks++;
    const src = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    try { await mermaid.parse(src); } catch (e) { err(`${f}: mermaid block #${blocks}: ${String(e.message || e).split('\n').slice(0, 3).join(' | ')}`); }
  }
  if (isModule(f) && !/data-stub="true"/.test(html)) {
    const need = ['beginner', 'arch', 'pitfall', 'saas'];
    for (const c of need) if (!new RegExp(`class="callout ${c}"`).test(html)) err(`${f}: missing ${c} callout`);
    const seq = (html.match(/sequenceDiagram/g) || []).length, flow = (html.match(/flowchart|graph (LR|TD)|stateDiagram/g) || []).length;
    if (seq < 1) err(`${f}: no sequenceDiagram`); if (flow < 1) err(`${f}: no high-level flowchart`);
    if (!/autonumber/.test(html)) err(`${f}: sequence lacks autonumber`);
    if (!/curl /.test(html)) err(`${f}: no curl verification command`);
    if (!/<table/.test(html)) err(`${f}: no mapping table`);
    for (const s of ['zero', 'high', 'low', 'env', 'pitfalls', 'saas-map']) if (!ids[f].has(s)) err(`${f}: missing section id="${s}"`);
  }
}
console.log(`files: ${htmlFiles.length}, mermaid blocks: ${blocks}, errors: ${errors}`);
process.exit(errors ? 1 : 0);
