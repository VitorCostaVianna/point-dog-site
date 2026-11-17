# Spec: LCP e vídeo do hero (PR 5 de SEO e performance)

## Problema (medido, Lighthouse mobile local, antes do PR 1)
Home no celular: LCP 4,6 s (depois do PR 1, ~3,4 s), FCP 4,3 s, TBT 500 ms. O elemento de LCP é o `<video id="scrub-video">`. O vídeo de 480p (1,6 MB, 156 quadros) começa a baixar no evento `load` com `preload="auto"` (`js/scroll-video.js`) e disputa a rede com o resto da página. Os dois ramos largos (`data-src-lg` e `data-src-md`) apontam para o mesmo 720p de 2,9 MB.

## Escopo
Dentro: `index.html` (só o hero e o `<head>` da home), `js/scroll-video.js`, `assets/video/` (novas versões reencodadas), `assets/img/scrub-produtos-poster.*` (otimização), `scripts/check-site.mjs`, docs.
Fora: layout/CSS do hero salvo o mínimo, fontes (PR 6), CLS (PR 7), textos, outras páginas.

## Decisões do dono
- Desktop: **mantém o 720p** (sem trocar por 1080p). Remover só o atributo duplicado se for inofensivo.
- Celular: preparar **duas versões** do vídeo para o dono comparar na prévia da Vercel e escolher: **A (conservadora)**: 156 quadros, mais compressão, alvo ≈ 1 MB; **B (agressiva)**: ≈ 94 quadros, alvo ≤ 0,8 MB. Ambas all-intra (`-g 1`), sem áudio, 480 de largura (ou menor, se a moldura do celular permitir). Só a A ou B escolhida entra na produção; a outra fica em `_arquivo/` (fora do deploy). Para a prévia, usar um parâmetro de URL (ex.: `?v=B`) que só existe para teste e é removido antes do merge, ou duas prévias em branches: o implementador escolhe o mais simples e relata.
- Vale para todos os dispositivos: o poster é o LCP e o vídeo só baixa depois do primeiro paint; respeitar `navigator.connection.saveData` (e `effectiveType` 2g/slow-2g): nesses casos, nunca baixar o vídeo (fica o poster estático, plano B já existente).

## Critérios de aceite
1. O `<head>` da home tem `<link rel="preload" as="image" fetchpriority="high">` do poster (com `imagesrcset`/`media` se houver versões por largura) e o poster está otimizado (≤ 100 KB, dimensão adequada; WebP/AVIF se o `<video poster>` aceitar sem prejuízo; senão JPEG otimizado).
2. O poster é o elemento de LCP e baixa cedo (preload); LCP ≤ 2,5 s depende do PR 6 (fontes sem bloqueio); registrar o valor medido. (Corrigido na validação: o CSS do Google Fonts bloqueia a renderização, FCP ≈ 3 s, e o LCP fica ≈ FCP + 0,3 s; ver medição abaixo.)
3. O vídeo só começa a baixar depois do primeiro paint e do `load` (por exemplo `requestIdleCallback`/`setTimeout`), e nunca com `saveData` ou conexão 2g. Com rede lenta ou JS desligado a página continua completa (poster + textos + botões).
4. Peso baixado no carregamento inicial do celular cai: medir bytes transferidos até o `load` (excluindo o vídeo) e o total depois que o vídeo entra; relatar.
5. Versões A e B geradas com ffmpeg, all-intra, sem áudio; relatar tamanho, quadros, resolução. Comparação visual lado a lado do mesmo trecho (capturas) e, se possível, teste de rolagem no navegador (nenhum salto visível). O scrub continua com o mesmo comportamento (`currentTime` ligado à rolagem, 1,5 tela de pista).
6. O hero não ganha layout shift (CLS não pior que `origin/main`); nenhum `backdrop-filter`/escala no vídeo (regras da spec do scrub).
7. `prefers-reduced-motion`, sem JS, erro de vídeo e `saveData` continuam no plano B, sem texto escondido (testar os 4 casos).
8. `check-site.mjs`: o preload do poster existe e aponta para um arquivo existente; os vídeos dentro dos orçamentos novos (`480` ≤ 1,1 MB para a versão escolhida; atualizar o teto quando o dono decidir); o poster ≤ 100 KB.
9. htmlhint e `node scripts/check-site.mjs` passam; nada fora do escopo tocado.

## Observação
O fps da rolagem do scrub só pode ser medido pelo dono no PC e no celular real. O relatório deve dizer isso explicitamente.

## Medição (validação independente, Lighthouse mobile local, 3 rodadas, mediana)
- `origin/main`: LCP 3,68 s (3,72 / 3,42 / 3,68), FCP 3,04 s; poster JPEG 96 KB descoberto tarde (atraso de carga 0,15 a 0,64 s).
- Branch: LCP 3,17 s (3,43 / 3,17 / 2,65), FCP 2,85 s; poster WebP 34 KB com atraso de carga ≈ 0. Render delay (≈ 2,4 a 2,8 s) domina: a pintura espera o CSS do Google Fonts (render-blocking, ~1,0 s). Meta de 2,5 s fica para o PR 6.
- CLS igual à main (0,08 a 0,095, elemento `.hero-actions`).
