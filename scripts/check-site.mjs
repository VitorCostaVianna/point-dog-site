// Valida o site estático: links/assets locais existem, SEO básico presente.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = process.cwd();
const pages = readdirSync(root).filter(f => f.endsWith('.html'));
const errors = [];

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  for (const tag of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:image"', 'rel="icon"', 'lang="pt-BR"']) {
    if (!html.includes(tag)) errors.push(`${page}: falta ${tag}`);
  }
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${page}: deve ter exatamente um <h1>`);
  for (const img of html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)) errors.push(`${page}: <img> sem alt: ${img[0].slice(0, 60)}`);
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    if (!existsSync(join(root, dirname(page), ref))) errors.push(`${page}: referência quebrada → ${ref}`);
  }
}
for (const f of ['sitemap.xml', 'robots.txt', 'vercel.json']) if (!existsSync(join(root, f))) errors.push(`arquivo ausente: ${f}`);

if (errors.length) { console.error('✖ Falhas:\n' + errors.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`✔ ${pages.length} páginas validadas`);
