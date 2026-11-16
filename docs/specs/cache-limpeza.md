# Spec: cache de CSS/JS e limpeza de mídia (PR 2 de SEO e performance)

## Problema
- `/css/*` e `/js/*` não têm política de cache no `vercel.json` (só `/assets/*`).
- O deploy carrega ~5 MB de vídeo e ~0,8 MB de imagem que nenhuma página usa (confirmado por grep: só `docs/` os cita).

## Escopo
Dentro: `vercel.json`, mover/remover mídia sem uso, `.vercelignore`, `scripts/check-site.mjs` (se preciso), docs que citem os arquivos movidos.
Fora: HTML, CSS, JS de comportamento, vídeos e poster do hero, `og-pointdog.jpg`, logo, WebPs novos (480/800).

## Decisões
- **Substituídos pelos WebP novos, sem uso:** `servico-banho-tosa.jpg`, `servico-clinica.jpg`, `servico-petshop.jpg`, `loja-tradicao-26-anos.webp` → removidos (continuam no histórico do git).
- **Material real da loja e vídeos sem uso:** `loja-1996.webp`, `loja-hoje.webp`, `loja-unidades.webp`, `hero-banho-tosa.mp4`, `hero-golden-campo.mp4` → movidos com `git mv` para `_arquivo/` (fora do deploy via `.vercelignore`), porque podem servir no futuro (página Sobre, novo hero). Nada é perdido.
- Cache: `/css/*` e `/js/*` com `public, max-age=3600, stale-while-revalidate=86400` (os arquivos não têm hash no nome, então não usar `immutable`).

## Critérios de aceite
1. `grep` em html/css/js/xml/json/mjs confirma zero referência aos arquivos removidos ou movidos (docs atualizados para refletir a nova localização ou nota de que foram arquivados).
2. `vercel.json` é JSON válido, mantém o bloco de `/assets/*` e adiciona `/css/*` e `/js/*` com o cache acima.
3. `.vercelignore` contém `_arquivo/`; a pasta `_arquivo/` mantém os 5 arquivos intactos (mesmo hash).
4. As 5 páginas carregam sem 404 (servir local e conferir todos os `src`/`srcset`/`href`/`poster`/`data-src*` com status 200).
5. Peso de `assets/` em produção cai de ~8,5 MB para ≤ 4,8 MB (medir antes e depois).
6. `check-site.mjs` ganha uma checagem: nenhum arquivo em `assets/img` ou `assets/video` sem referência nos HTML/CSS/JS (para evitar nova acumulação), e passa.
7. htmlhint e `node scripts/check-site.mjs` passam.
8. Nada fora do escopo foi tocado.
