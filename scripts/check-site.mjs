// Valida o site estático: links/assets locais existem, SEO básico presente.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
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
  // Imagens: width/height, lazy (exceto primeira tela: logo do cabeçalho ou data-eager) e srcset existente
  const header = (html.match(/<header[\s\S]*?<\/header>/) || [''])[0];
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const nome = tag.slice(0, 70);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) errors.push(`${page}: <img> sem width/height: ${nome}`);
    const eager = /\sdata-eager\b/.test(tag) || header.includes(tag);
    const lazy = /\sloading="lazy"/.test(tag);
    if (!eager && !lazy) errors.push(`${page}: <img> abaixo da dobra sem loading="lazy": ${nome}`);
    if (eager && lazy) errors.push(`${page}: <img> da primeira tela com lazy: ${nome}`);
    const ss = tag.match(/\ssrcset="([^"]+)"/);
    if (ss) for (const item of ss[1].split(',')) {
      const u = item.trim().split(/\s+/)[0];
      if (!existsSync(join(root, dirname(page), u))) errors.push(`${page}: srcset quebrado → ${u}`);
    }
  }
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    if (!existsSync(join(root, dirname(page), ref))) errors.push(`${page}: referência quebrada → ${ref}`);
  }
}
for (const f of ['sitemap.xml', 'robots.txt', 'vercel.json']) if (!existsSync(join(root, f))) errors.push(`arquivo ausente: ${f}`);

// Vídeo do scrub: peso por versão e poster (critérios 1 e 12 da spec)
const budgets = { 'scrub-produtos-720.mp4': 4e6, 'scrub-produtos-480.mp4': 2.5e6 };
for (const [f, max] of Object.entries(budgets)) {
  const p = join(root, 'assets/video', f);
  if (!existsSync(p)) errors.push(`vídeo ausente: assets/video/${f}`);
  else if (statSync(p).size > max) errors.push(`vídeo acima do limite (${max / 1e6} MB): ${f}`);
}
const idx = readFileSync(join(root, 'index.html'), 'utf8');
if (/<video[^>]*id="scrub-video"/.test(idx) && !/id="scrub-video"[^>]*poster=/.test(idx)) errors.push('index.html: #scrub-video sem poster');

// Mídia sem referência: evita acumular arquivos que o deploy carrega sem uso
const fontes = [...pages, ...['css', 'js'].flatMap(d => existsSync(join(root, d)) ? readdirSync(join(root, d)).map(f => join(d, f)) : [])];
const textoFontes = fontes.map(f => readFileSync(join(root, f), 'utf8')).join('\n');
// Exige o caminho inteiro (assets/img/nome.ext) e fim de nome logo depois, para que um arquivo
// cujo nome é pedaço de outro (ex.: "480.webp" dentro de "loja-tradicao-480.webp") não passe.
const citado = caminho => {
  for (let i = textoFontes.indexOf(caminho); i !== -1; i = textoFontes.indexOf(caminho, i + 1)) {
    if (!/[\w.-]/.test(textoFontes[i + caminho.length] || '')) return true;
  }
  return false;
};
const listar = dir => readdirSync(join(root, dir), { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? listar(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
for (const dir of ['assets/img', 'assets/video']) {
  for (const caminho of listar(dir)) {
    if (!citado(caminho)) errors.push(`mídia sem referência em html/css/js: ${caminho} (mover para _arquivo/ ou remover)`);
  }
}

// SEO local: ids das unidades, âncoras para contato.html, texto proibido
const contato = readFileSync(join(root, 'contato.html'), 'utf8');
const idsUnidades = ['horto', 'pitangui', 'sao-roque', 'formosa'];
for (const id of idsUnidades) if (!contato.includes(`id="${id}"`)) errors.push(`contato.html: falta id="${id}"`);
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  for (const m of html.matchAll(/href="contato\.html#([^"]+)"/g)) {
    if (!contato.includes(`id="${m[1]}"`)) errors.push(`${page}: âncora sem destino → contato.html#${m[1]}`);
  }
  for (const proibido of ['Vasc.', 'Comprar Agora']) if (html.includes(proibido)) errors.push(`${page}: contém "${proibido}"`);
}

if (errors.length) { console.error('✖ Falhas:\n' + errors.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`✔ ${pages.length} páginas validadas`);
