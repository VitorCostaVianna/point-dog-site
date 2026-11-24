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
const budgets = { 'scrub-produtos-720.mp4': 4e6, 'scrub-produtos-sm-a.mp4': 1.1e6 };
for (const [f, max] of Object.entries(budgets)) {
  const p = join(root, 'assets/video', f);
  if (!existsSync(p)) errors.push(`vídeo ausente: assets/video/${f}`);
  else if (statSync(p).size > max) errors.push(`vídeo acima do limite (${max / 1e6} MB): ${f}`);
}
const idx = readFileSync(join(root, 'index.html'), 'utf8');
// Poster é o LCP: preload com fetchpriority=high, arquivo existente e <= 100 KB
const pre = (idx.match(/<link[^>]*>/g) || []).filter((t) => /rel="preload"/.test(t) && /as="image"/.test(t))[0];
const preHref = pre && pre.match(/href="([^"]+)"/);
if (!pre || !/fetchpriority="high"/.test(pre) || !preHref) errors.push('index.html: falta <link rel="preload" as="image" fetchpriority="high"> do poster');
else {
  const pp = join(root, preHref[1]);
  if (!existsSync(pp)) errors.push(`preload do poster aponta para arquivo ausente: ${preHref[1]}`);
  else if (statSync(pp).size > 100e3) errors.push(`poster acima de 100 KB: ${preHref[1]}`);
  if (!new RegExp(`id="scrub-video"[^>]*poster="${preHref[1]}"`).test(idx)) errors.push('index.html: o preload não é o poster do #scrub-video');
}
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
const idsContato = [...contato.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
for (const id of idsUnidades) {
  const n = idsContato.filter(x => x === id).length;
  if (n !== 1) errors.push(`contato.html: id="${id}" deveria aparecer 1 vez, aparece ${n}`);
}
const mapas = (contato.match(/<a [^>]*href="https:\/\/www\.google\.com\/maps\/search\/[^"]+" target="_blank" rel="noopener">Ver no Mapa<\/a>/g) || []).length;
if (mapas !== idsUnidades.length) errors.push(`contato.html: esperados ${idsUnidades.length} botões "Ver no Mapa" (com target e rel), encontrados ${mapas}`);
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  for (const m of html.matchAll(/href="(?:\.\/|\/)?contato\.html#([^"]*)"/g)) {
    if (!idsContato.includes(m[1])) errors.push(`${page}: âncora sem destino → contato.html#${m[1]}`);
  }
  for (const proibido of ['Vasc.', 'Comprar Agora']) if (html.toLowerCase().includes(proibido.toLowerCase())) errors.push(`${page}: contém "${proibido}"`);
}

// JSON-LD: blocos válidos, unidades em contato.html coerentes com a página (spec jsonld.md)
const ldBlocos = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
const ldNos = o => Array.isArray(o) ? o.flatMap(ldNos) : o && typeof o === 'object' ? [o, ...ldNos(o['@graph'] || [])] : [];
const ldTodos = {};
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  ldTodos[page] = [];
  ldBlocos(html).forEach((txt, i) => {
    try { ldTodos[page].push(JSON.parse(txt)); } catch (e) { errors.push(`${page}: JSON-LD #${i + 1} inválido (${e.message})`); }
  });
  for (const proibido of ['openingHours', 'aggregateRating', 'review']) {
    if (ldBlocos(html).some(b => b.toLowerCase().includes(`"${proibido.toLowerCase()}"`))) errors.push(`${page}: JSON-LD não pode ter ${proibido}`);
  }
}
const textoVisivel = contato.replace(/<script[\s\S]*?<\/script>/g, '');
const lojas = ldNos(ldTodos['contato.html']).filter(n => n['@type'] === 'PetStore');
for (const id of idsUnidades) {
  const alvo = `https://www.pointdog.com.br/contato.html#${id}`;
  const loja = lojas.find(l => l['@id'] === alvo);
  if (!loja) { errors.push(`contato.html: JSON-LD sem PetStore com @id ${alvo}`); continue; }
  if (!idsContato.includes(id)) errors.push(`contato.html: @id ${alvo} sem âncora`);
  const cep = loja.address && loja.address.postalCode;
  if (!cep) errors.push(`contato.html: PetStore ${id} sem postalCode`);
  else if (!textoVisivel.includes(cep)) errors.push(`contato.html: CEP ${cep} de ${id} não aparece no texto visível`);
  if (!loja.telephone) errors.push(`contato.html: PetStore ${id} sem telephone`);
}
if (lojas.length !== idsUnidades.length) errors.push(`contato.html: esperados ${idsUnidades.length} PetStore no JSON-LD, achei ${lojas.length}`);
if (ldNos(ldTodos['index.html']).some(n => n['@type'] === 'PetStore')) errors.push('index.html: PetStore pertence a contato.html');
if (!ldNos(ldTodos['index.html']).some(n => n['@id'] === 'https://www.pointdog.com.br/#org')) errors.push('index.html: JSON-LD sem Organization #org');
if (/31030-?072/.test(textoFontes)) errors.push('CEP antigo 31030-072 ainda presente');
// Telefone do JSON-LD (E.164) precisa existir como tel: visível em contato.html; parentOrganization precisa ter Organization no mesmo bloco
for (const l of lojas) {
  const d = String(l.telephone || '').replace(/\D/g, '');
  if (!d || !contato.includes('href="tel:+' + d + '"')) errors.push('contato.html: telefone ' + l.telephone + ' do JSON-LD não bate com tel: visível');
  if (l.parentOrganization && !ldNos(ldTodos['contato.html']).some(n => n['@id'] === l.parentOrganization['@id'] && n['@type'] === 'Organization')) errors.push('contato.html: parentOrganization sem Organization correspondente no mesmo JSON-LD');
}

// Acessibilidade: níveis de título sem pular e logo decorativo (o nome já está no texto ao lado)
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  let ant = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const n = +m[1];
    if (ant && n > ant + 1) errors.push(`${page}: título h${n} depois de h${ant} (pula nível)`);
    ant = n;
  }
  if (/<img[^>]*logo-pointdog[^>]*alt="Point Dog"/.test(html)) errors.push(`${page}: logo com alt="Point Dog" ao lado do texto "Point Dog"; use alt=""`);
}
// Sem cara de IA: sem emoji nem ✔ no HTML, sem frases sem base, sem verde nos selos
const semEmoji = /[\u{1F300}-\u{1FAFF}\u{2714}\u{2764}]/u;
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  if (semEmoji.test(html)) errors.push(`${page}: emoji/✔ no HTML (use CSS ou texto)`);
  if (/n[ií]vel hospitalar/i.test(html)) errors.push(`${page}: "nível hospitalar" não tem base; reescreva com fatos`);
}
const cssTxt = readFileSync(join(root, 'css/style.css'), 'utf8');
if (/\.(badge|plan-badge)[^{]*\{[^}]*(var\(--green|rgba\(30, ?158)/.test(cssTxt)) errors.push('css: selo (.badge/.plan-badge) não pode usar verde');

if (errors.length) { console.error('✖ Falhas:\n' + errors.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`✔ ${pages.length} páginas validadas`);
