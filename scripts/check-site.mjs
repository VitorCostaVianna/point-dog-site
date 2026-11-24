// Valida o site estático: links/assets locais existem, SEO básico presente.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = process.cwd();
const pages = readdirSync(root).filter(f => f.endsWith('.html'));
const errors = [];

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  // 404.html: servida em qualquer URL, então fica fora do índice (noindex, sem canonical) e usa caminhos absolutos
  const naoIndexada = page === '404.html';
  if (naoIndexada && !html.includes('name="robots" content="noindex"')) errors.push(`${page}: falta noindex`);
  for (const tag of ['<title>', 'name="description"', ...(naoIndexada ? [] : ['rel="canonical"']), 'property="og:image"', 'rel="icon"', 'lang="pt-BR"']) {
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
if (/31030-?071/.test(textoFontes)) errors.push('CEP antigo 31030-071 ainda presente (o do Horto, conforme o Google Maps, é 31030-072)');
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
// Fontes locais: sem Google Fonts (bloqueia a renderização e causa troca de fonte), arquivos existem e são pré-carregados
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) errors.push(`${page}: usa Google Fonts; use assets/fonts (spec fontes-locais.md)`);
  for (const f of ['bricolage-grotesque-latin.woff2', 'figtree-latin.woff2']) {
    if (!new RegExp(`rel="preload"[^>]*href="/?assets/fonts/${f}"[^>]*crossorigin`).test(html)) errors.push(`${page}: falta preload de assets/fonts/${f} (com crossorigin)`);
    if (!existsSync(join(root, 'assets/fonts', f))) errors.push(`fonte ausente: assets/fonts/${f}`);
  }
}

// CLS do hero: a classe scrub-js nasce no <head> (antes da pintura); regras do hero no celular não podem depender de .is-scrub
if (!/<script>[^<]*classList\.add\("scrub-js"\)/.test(idx)) errors.push('index.html: falta o script inline que define html.scrub-js no <head>');
if (/@media[^{]*max-width: 899px[^{]*\{[^@]*\.scrub\.is-scrub \.scrub-copy[^{]*\{[^}]*(padding|display: none)/.test(cssTxt0())) errors.push('css: regras do hero no celular dependem de .is-scrub (causa CLS); use html.scrub-js');
function cssTxt0() { return readFileSync(join(root, 'css/style.css'), 'utf8'); }
// Sem cara de IA: sem emoji nem ✔ no HTML, sem frases sem base, sem verde nos selos
const semEmoji = /[\u{1F300}-\u{1FAFF}\u{2714}\u{2764}]/u;
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  if (semEmoji.test(html)) errors.push(`${page}: emoji/✔ no HTML (use CSS ou texto)`);
  if (/n[ií]vel hospitalar/i.test(html)) errors.push(`${page}: "nível hospitalar" não tem base; reescreva com fatos`);
}
const cssTxt = readFileSync(join(root, 'css/style.css'), 'utf8');
if (/\.(badge|plan-badge)[^{]*\{[^}]*(var\(--green|rgba\(30, ?158)/.test(cssTxt)) errors.push('css: selo (.badge/.plan-badge) não pode usar verde');

// PetLove: aceito só na clínica veterinária (decisão do dono, 2026-11-24): o selo aparece 1 vez por página e logo após o título da Clínica
for (const page of ['index.html', 'servicos.html']) {
  const html = readFileSync(join(root, page), 'utf8');
  const selos = [...html.matchAll(/<span class="plan-badge">[\s\S]*?<\/span>/g)];
  if (selos.length !== 1) { errors.push(`${page}: esperado 1 selo PetLove (só clínica), achei ${selos.length}`); continue; }
  const titulo = [...html.slice(0, selos[0].index).matchAll(/<h[23][^>]*>([^<]*)<\/h[23]>/g)].pop();
  if (!titulo || !/Clínica/i.test(titulo[1])) errors.push(`${page}: selo PetLove fora da Clínica Veterinária`);
  if (!/<img[^>]*petlove-logo\.webp[^>]*alt="PetLove"/.test(selos[0][0])) errors.push(`${page}: selo PetLove sem o logo (assets/img/petlove-logo.webp, alt="PetLove")`);
}
for (const page of pages) if (/petlove/i.test(readFileSync(join(root, page), 'utf8').replace(/<span class="plan-badge">[\s\S]*?<\/span>/g, '')) && page !== 'index.html' && page !== 'servicos.html') errors.push(`${page}: menciona PetLove fora das páginas previstas`);

// Redes no rodapé de todas as páginas e cards de unidade da Home (spec unidades-cards-e-redes.md)
const redesRodape = { instagram: 'https://www.instagram.com/pointdogpet/', facebook: 'https://www.facebook.com/pointdogpet', tiktok: 'https://www.tiktok.com/@pointdogpet', linktree: 'https://linktr.ee/pointdogpetshop' };
for (const [rede, href] of Object.entries(redesRodape)) if (!existsSync(join(root, 'assets/icons', rede + '.svg'))) errors.push(`ícone ausente: assets/icons/${rede}.svg`);
for (const page of pages) {
  const rod = (readFileSync(join(root, page), 'utf8').match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  for (const [rede, href] of Object.entries(redesRodape)) {
    const a = [...rod.matchAll(/<a\s[^>]*>/g)].map(m => m[0]).find(t => t.includes(`href="${href}"`));
    if (!a) errors.push(`${page}: rodapé sem link de ${rede} (${href})`);
    else {
      if (!/rel="noopener"/.test(a) || !/target="_blank"/.test(a)) errors.push(`${page}: link de ${rede} no rodapé sem target="_blank" rel="noopener"`);
      if (!/aria-label="[^"]+"/.test(a)) errors.push(`${page}: link de ${rede} no rodapé sem aria-label`);
      const li = rod.slice(rod.indexOf(a)).match(/^<a\s[^>]*>\s*(<img[^>]*>)/);
      const prefixo = page === '404.html' ? '/' : '';
      if (!li) errors.push(`${page}: link de ${rede} no rodapé sem <img> do ícone`);
      else {
        if (!/\salt=""/.test(li[1])) errors.push(`${page}: ícone de ${rede} no rodapé deve ter alt=""`);
        if (!li[1].includes(`src="${prefixo}assets/icons/${rede}.svg"`)) errors.push(`${page}: ícone de ${rede} deve usar src="${prefixo}assets/icons/${rede}.svg" (${page === '404.html' ? 'caminho absoluto' : 'caminho relativo'})`);
      }
    }
  }
}
// Cards de unidade da Home: parse por card (do marcador até o próximo card ou o fim da seção), valores exatos
const unEsperadas = [
  { id: 'horto', nome: 'Unidade Horto', end: 'R. Dona Nancy de Vasconcelos Gomes, 336 - Horto, Belo Horizonte - MG', fecha: '18:00', etiqueta: true },
  { id: 'pitangui', nome: 'Unidade Pitangui', end: 'R. Pitangui, 3003 - Sagrada Família, BH', fecha: '19:00' },
  { id: 'sao-roque', nome: 'Unidade São Roque', end: 'R. São Roque, 1231-A - Sagrada Família, BH', fecha: '19:00' },
  { id: 'formosa', nome: 'Unidade Formosa', end: 'R. Formosa, 113A - Santa Tereza, BH', fecha: '18:00' },
];
{
  const ini = idx.indexOf('class="grid-unidades"');
  const fim = idx.indexOf('</section>', ini);
  const partes = ini < 0 ? [] : idx.slice(ini, fim).split(/<div class="card unidade\b[^>]*>/).slice(1);
  if (partes.length !== unEsperadas.length) errors.push(`index.html: esperados ${unEsperadas.length} cards de unidade, achei ${partes.length}`);
  unEsperadas.forEach((u, i) => {
    const c = partes[i] || '';
    const txt = tag => (c.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`)) || [])[1];
    const ps = [...c.matchAll(/<p[^>]*>([^<]*)<\/p>/g)].map(m => m[1].trim());
    if ((txt('h3') || '').trim() !== u.nome) errors.push(`index.html: card ${u.id}: nome esperado "${u.nome}"`);
    if (ps[0] !== u.end) errors.push(`index.html: card ${u.id}: endereço esperado "${u.end}", achei "${ps[0]}"`);
    if (ps[1] !== `Fecha às ${u.fecha}`) errors.push(`index.html: card ${u.id}: esperado "Fecha às ${u.fecha}", achei "${ps[1]}"`);
    if (!new RegExp(`class="card-link" href="contato[.]html#${u.id}"`).test(c)) errors.push(`index.html: card ${u.id}: link de ação deve apontar para contato.html#${u.id}`);
    if (/Unidade Completa/.test(c) !== !!u.etiqueta) errors.push(`index.html: card ${u.id}: etiqueta "Unidade Completa" ${u.etiqueta ? 'ausente' : 'não deveria estar aqui'} (só no Horto)`);
    const img = (c.match(/<img\s[^>]*class="unidade-foto"[^>]*>/) || [])[0];
    if (!img) errors.push(`index.html: card ${u.id}: falta <img class="unidade-foto">`);
    else {
      if (c.indexOf(img) > c.indexOf('<div class="unidade-corpo"')) errors.push(`index.html: card ${u.id}: foto deve vir antes do corpo`);
      for (const at of ['width', 'height']) if (!new RegExp(`[ ]${at}="[0-9]+"`).test(img)) errors.push(`index.html: card ${u.id}: foto sem ${at}`);
      if (!/loading="lazy"/.test(img)) errors.push(`index.html: card ${u.id}: foto sem loading="lazy"`);
      if (!/\salt="[^"]+"/.test(img)) errors.push(`index.html: card ${u.id}: foto sem alt descritivo`);
      const src = (img.match(/\ssrc="([^"]+)"/) || [])[1];
      if (!src || !existsSync(join(root, src))) errors.push(`index.html: card ${u.id}: foto src inexistente (${src})`);
    }
  });
}

// JSON-LD da Home: sameAs com as 4 redes do rodapé
for (const url of ['https://www.instagram.com/pointdogpet/', 'https://www.facebook.com/pointdogpet', 'https://www.tiktok.com/@pointdogpet', 'https://linktr.ee/pointdogpetshop']) {
  const org = ldNos(ldTodos['index.html']).find(n => n['@id'] === 'https://www.pointdog.com.br/#org');
  if (!org || !(org.sameAs || []).includes(url)) errors.push('index.html: JSON-LD Organization sem sameAs ' + url);
}

// Limpeza de template (spec limpeza-servicos-cards.md): sem "Módulo 0N" e sem botão/link com texto iniciado por "//"
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  if (/Módulo 0/.test(html)) errors.push(`${page}: contém "Módulo 0" (etiqueta de template sem informação)`);
  for (const m of html.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (m[2].replace(/<[^>]*>/g, '').trim().startsWith('//')) errors.push(`${page}: ${m[1]} com texto iniciado por "//": ${m[2].trim().slice(0, 40)}`);
  }
}
// Cards da Home: link "Pedir produtos →" com aria-label que contém o texto visível
for (const id of ['pitangui', 'sao-roque', 'formosa']) {
  const a = (idx.match(new RegExp(`<a [^>]*href="contato[.]html#${id}"[^>]*>[^<]*</a>`)) || [''])[0];
  const aria = (a.match(/aria-label="([^"]*)"/) || [])[1] || '';
  if (!/>Pedir produtos →</.test(a)) errors.push(`index.html: card ${id}: texto visível do link deve ser "Pedir produtos →"`);
  if (!aria.includes('Pedir produtos')) errors.push(`index.html: card ${id}: aria-label deve conter "Pedir produtos" (achei "${aria}")`);
}

// Títulos e descrições (spec seo-titulos.md): únicos, dentro do limite, og iguais, sem superlativo, sem serviço atribuído às unidades não confirmadas
{
  const meta = {};
  const decodifica = s => s.replace(/&amp;/g, '&');
  for (const page of pages.filter(p => p !== '404.html')) {
    const html = readFileSync(join(root, page), 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    const ogt = (html.match(/<meta property="og:title" content="([^"]*)"/) || [])[1];
    const ogd = (html.match(/<meta property="og:description" content="([^"]*)"/) || [])[1];
    if (title === undefined || desc === undefined) { errors.push(`${page}: sem title ou description`); continue; }
    meta[page] = { title: decodifica(title), desc: decodifica(desc) };
    if (meta[page].title.length > 62) errors.push(`${page}: title com ${meta[page].title.length} caracteres (máx. 62)`);
    if (meta[page].desc.length > 160) errors.push(`${page}: description com ${meta[page].desc.length} caracteres (máx. 160)`);
    if (ogt !== title) errors.push(`${page}: og:title diferente do title`);
    if (ogd !== desc) errors.push(`${page}: og:description diferente da description`);
    const texto = (meta[page].title + ' ' + meta[page].desc).toLowerCase();
    for (const termo of ['melhor', 'nº 1', 'n° 1', 'excelência', 'premium']) {
      if (texto.includes(termo)) errors.push(`${page}: title/description contém "${termo}"`);
    }
    if (page !== 'contato.html' && /pitangui|s[aã]o roque|formosa/.test(texto)) errors.push(`${page}: title/description cita Pitangui, São Roque ou Formosa (serviços dessas unidades não confirmados)`);
  }
  for (const campo of ['title', 'desc']) {
    const vistos = new Map();
    for (const [page, m] of Object.entries(meta)) {
      if (vistos.has(m[campo])) errors.push(`${page}: ${campo === 'title' ? 'title' : 'description'} igual ao de ${vistos.get(m[campo])}`);
      else vistos.set(m[campo], page);
    }
  }
}

if (errors.length) { console.error('✖ Falhas:\n' + errors.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`✔ ${pages.length} páginas validadas`);
