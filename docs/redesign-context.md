# Contexto do redesign — Point Dog Pet

Registro de decisões e estado atual do redesign visual, para retomar detalhes depois. Não é um spec formal — é um resumo de trabalho.

## Por que este redesign aconteceu

A primeira versão do site (commits `f5f091b`..`09c4320`) seguiu o spec original
(`docs/superpowers/specs/2026-08-13-site-institucional-redesign-design.md`) mas o
resultado final ficou "praticamente o mesmo site" dos prints antigos — mesmo
layout, mesma estrutura de seções, cards genéricos com ícone em quadrado,
seções alternando fundo claro/escuro (padrão de template comum).

O usuário pediu para refazer layout e tipografia mantendo a paleta de cores já
aprovada. A segunda passada (mesmo dia, via `superpowers:brainstorming` +
visual companion) resultou no sistema atual.

## Sistema de design atual

**Tipografia** (trocou Playfair Display + Inter):
- `Fraunces` — títulos (serifa editorial, itálico pro destaque em laranja)
- `Space Grotesk` — corpo de texto
- `JetBrains Mono` — eyebrows, labels, nav, botões secundários (`// Conhecer Serviços`)

**Paleta** (mantida do spec original, não mudou):
- Grafite `#0D1210` / `#141B18`, laranja `#F2762B`, verde-esmeralda `#22C55E`,
  dourado `#D9A441`, off-white `#F7F5F0`.

**Layout**: fundo escuro contínuo do início ao fim de cada página — **sem**
mais alternância clara/escura entre seções (isso era parte do problema
"genérico"). `.section` e `.section-alt` só variam entre `--bg-dark` e
`--bg-dark-2`, ambos escuros.

**Componentes-chave** (`css/style.css`):
- `.card` — painel com borda fina (`--border-soft`), sem sombra, ponto verde
  de "sinal" no canto (`::after`), hover levanta e borda fica laranja. Usado
  em todos os cards do site (serviços, avaliações, unidades, valores).
- `.card-tag` — label mono pequeno acima do título (ex: "Módulo 01",
  "Unidade 02", "Valor 01") — substitui o antigo ícone emoji em quadrado.
- `.panel-frame` — painel de ilustração/foto (substitui as antigas
  `.blob-frame`). Aceita `data-label` (mostrado como tag mono no canto) e,
  opcionalmente, uma `<img class="panel-photo">` + classe `.has-photo` no
  container pra aplicar o gradiente escuro por cima (senão usa `<span
  class="glyph">emoji</span>` como placeholder).
- `.hero-video` — hero com `<video>` de fundo, scrim em gradiente, conteúdo
  por cima. Usado só na Home.
- `.hero-simple` — hero sem vídeo para páginas internas (Serviços, Sobre,
  Avaliações, Contato).
- `.fab` — botão flutuante fixo (bottom-right, todas as páginas) com o
  mascote cachorro em SVG (rabo abanando via CSS) linkando pro WhatsApp.
  Essa é a assinatura visual recorrente do site.
- `.grid-3` / `.grid-4` — grids de cards com `gap: 20px`, cada item mantém
  seu próprio `border-radius`/borda (component `.card`). *Correção
  2026-08-13: `.grid-4` antes usava um truque de grid com `gap:1px` que
  "fundia" os 4 cards numa faixa única sem separação — corrigido para gap
  normal.*

## Assets usados

- `assets/video/hero-banho-tosa.mp4` — vídeo do hero da Home (golden
  retriever em luz dourada), fornecido pelo usuário. Cortado nos primeiros
  1.5s via JS (`js/main.js`, não via re-encode — não há ffmpeg disponível
  nesta máquina): o vídeo pula pra `data-trim-start` no load e, ao terminar
  (`ended`), volta pra esse ponto em vez do frame 0.
- `assets/img/loja-tradicao-26-anos.webp` — foto "então e agora" da fachada
  do Horto, usada no painel "26 anos" da Home (seção "Por que a Point Dog").
- `assets/img/loja-unidades.webp` — colagem com fotos das 4 unidades,
  usada no painel da página Sobre.
- `assets/img/logo-pointdog.webp` — logo real (mascote cartoon laranja,
  contorno preto, orelhas caídas) — referência de estilo pro SVG do mascote
  no `.fab`.
- Um segundo vídeo (`point_dog_hero_videp.mp4`, vertical, cachorro correndo
  n'água) foi enviado pelo usuário mas **ainda não foi usado** — decisão
  adiada ("não usar por enquanto").

## Atualização 2026-08-14 — pivô para tema claro

O usuário testou o tema escuro (`0D1210`/`141B18`) rodando o site localmente e
não gostou ("o dark ficou ruim"). Pediu tema claro com fundo branco,
mantendo o laranja como cor de marca (por causa da logo) — não o verde dos
prints antigos do site original (rejeitado explicitamente: "mudando a
paleta do verde que não combina").

**O que mudou:**
- Tokens em `css/style.css` renomeados e invertidos: `--bg-dark`→`--bg`
  (`#FFFFFF`), `--bg-dark-2`→`--bg-2` (`#FBF3EA`, creme), `--text-light`→
  `--text` (`#221A14`). `--gold`/`--green-glow` escurecidos para contraste
  em fundo claro (`#A8720F` / `#12804A`). Laranja/gold/verde mantidos como
  família de acento.
- Novo token `--text-on-dark` (`#F7F5F0`) e `--scrim` (`#0D1210`) para
  conteúdo que ainda precisa de um scrim escuro fixo (hero em vídeo, overlay
  de foto no `.panel-frame.has-photo`) — esses **não** seguem o tema, são
  fixos porque cobrem vídeo/foto real, não a página.
- `.hero-video`: texto e `.badge`/`.btn-secondary` dentro do hero têm
  overrides explícitos (`.hero-video h1`, `.hero-video .badge`,
  `.hero-video .btn-secondary`) porque o scrim continua escuro por trás do
  vídeo, mesmo com o resto do site claro.
- `.card` ganhou fundo branco + sombra suave (`--shadow-card`) em vez do
  fundo quase-transparente do tema escuro, já que cards brancos com sombra
  é o padrão visual dos prints antigos.
- Novo componente `.card-icon-badge` + `.card-icon-ghost`: ícone pequeno em
  badge colorido + versão grande e translúcida do mesmo ícone vazando pelo
  canto do card — replica o padrão dos 3 cards de serviço do site antigo
  ("Tudo para o seu pet"). Usado só nos 3 cards de serviço da Home
  (`index.html`); os outros cards do site (avaliações, unidades) mantêm o
  `.card-tag` de texto.
- `sobre.html`: painel de foto trocado de `loja-unidades.webp` (colagem das
  4 unidades) para `loja-tradicao-26-anos.webp` (fachada hoje + 1996,
  mesma imagem já usada na Home) — replica o layout de duas fotos
  empilhadas dos prints antigos. Cards de valor (Confiança/Carinho) trocaram
  o `.card-tag` por emoji (🤝 ❤️), também vindo dos prints antigos.
- `assets/img/loja-unidades.webp` ficou sem uso após essa troca (não foi
  apagado — decisão do usuário se quer remover).

**Preferência confirmada:** manter elementos de layout/composição dos
prints antigos do site (dois-fotos, ícone+desenho-fantasma no card), mas
sempre recolorindo para a paleta laranja/dourado atual — nunca reintroduzir
o verde como cor primária.

## Pendências / possíveis próximos ajustes

- Painéis da página Serviços (Banho & Tosa, Clínica Veterinária, Pet Shop)
  ainda usam emoji como glyph (🛁🩺🦴) em vez de foto real — não foi pedido
  ainda, mas é candidato natural se surgirem mais fotos.
- Vídeo vertical (cachorro na água) sem uso definido.
- Responsividade mobile não foi re-verificada visualmente após os últimos
  ajustes (grid-4 e fotos) — vale conferir em ~390px de largura.
- Durante a sessão de QA, a ferramenta de automação do navegador apresentou
  um bug de navegação automática entre páginas (não relacionado ao código do
  site) — se algo parecer inconsistente numa checagem futura, prefira
  verificar por `curl`/leitura de arquivo antes de assumir bug real.

## Preferências do usuário (ver memória)

- Prefere elementos de design "assinatura" ligados a algo real do negócio
  (fotos/vídeos reais, função de conversão) em vez de metáforas abstratas
  bonitas mas sem relação com o contexto (ex.: rejeitou um painel estilo
  "monitor de sinais vitais" por não ter nada a ver com pet shop).
- É um site institucional focado em conversão — CTAs (WhatsApp) devem ser
  reforçados pelas decisões de design, não só estética.
