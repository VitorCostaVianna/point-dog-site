# Spec: fontes locais e CLS do hero

Problema: o Lighthouse da Home (celular emulado) dava perf 83-86, CLS 0,095 (meta spec scrub: <= 0,05) e FCP ~2,9 s. O CSS do Google Fonts bloqueava a renderização (~1 s) e os botões do hero deslocavam quando o scrub ligava.

## Escopo
- Bricolage Grotesque (600-800) e Figtree (400-700), só o subconjunto latino (cobre o português), em `assets/fonts/*.woff2` (licença OFL), com `@font-face` em `css/style.css`, `font-display: swap` e `<link rel="preload">` em todas as páginas.
- Remove `preconnect` e CSS do Google Fonts.
- CLS do hero: as regras do hero no celular (esconder o parágrafo, padding) passam a depender de `html.scrub-js`, definida por um script inline no `<head>` antes da pintura, e não de `.is-scrub` (que o JS adiciona depois). Sem JS, movimento reduzido ou economia de dados, a classe não existe e o texto continua inteiro. Se GSAP falhar, `fallback()` remove a classe.

## Fora do escopo
Mudar fontes, pesos ou tipografia; latin-ext/vietnamita; mexer no vídeo.

## Critérios de aceite (medidos no Lighthouse, celular emulado, Home, servidor local)
1. CLS <= 0,05. Medido: 0,095 -> 0,008.
2. FCP menor que antes. Medido: ~2,9 s -> 1,2-1,8 s.
3. Sem requisição a fonts.googleapis.com / gstatic (check-site).
4. Fontes existem e são pré-carregadas com crossorigin em todas as páginas (check-site).
5. Visual da tipografia igual ao anterior (conferir na prévia).
Observação: o TBT varia entre rodadas (150 a 1900 ms) pelo carregamento do GSAP via CDN; não é causado por esta mudança.
