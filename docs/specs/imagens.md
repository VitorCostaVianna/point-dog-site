# Spec: otimização de imagens (PR 1 de SEO e performance)

## Problema
As `<img>` não têm `width`/`height` (risco de layout shift), nenhuma tem `loading="lazy"`, não há `srcset` e as fotos de serviço são JPEG pesados (até 1024x1024, 275 KB). O Lighthouse mobile estimou 158 a 262 KiB de economia por página.

## Escopo
Dentro: as imagens em uso (`loja-tradicao-26-anos.webp`, `servico-banho-tosa.jpg`, `servico-clinica.jpg`, `servico-petshop.jpg`, `logo-pointdog.webp`), os 5 HTMLs, `scripts/check-site.mjs`.

Fora: vídeo e poster do hero, fontes, JS, CSS de layout (só ajustar se a troca de formato exigir), remoção de arquivos não usados (PR 2), `og-pointdog.jpg` e favicon (PR 10), textos e alts.

## Critérios de aceite
1. Toda `<img>` tem `width` e `height` iguais à proporção real do arquivo servido, e o CSS mantém a aparência atual (sem imagem esticada).
2. Toda `<img>` abaixo da dobra tem `loading="lazy"` e `decoding="async"`. A logo do cabeçalho e qualquer imagem visível na primeira tela NÃO tem `lazy`.
3. As 3 fotos de serviço e a foto da loja são servidas em WebP, com `srcset` e `sizes` em pelo menos 2 larguras (por exemplo 480 e 800 px), e `src` de reserva. Os JPEGs originais em uso são substituídos; arquivos que deixarem de ser referenciados NÃO são apagados neste PR.
4. Peso total das imagens em uso na home e em `servicos.html` cai pelo menos 40% frente à main (medir e registrar antes e depois).
5. Qualidade visual: comparar cada imagem nova com o original em captura de tela (desktop e 375 px); sem artefatos visíveis, `object-position` preservado.
6. Os `alt` não mudam.
7. CLS da home e de `servicos.html` não piora (Lighthouse, antes e depois).
8. `scripts/check-site.mjs` ganha checagens: toda `<img>` com `width` e `height`; toda `<img>` com `loading="lazy"` exceto as marcadas como primeira tela (`data-eager` ou a logo do cabeçalho); `srcset` apontando para arquivos existentes.
9. CI local verde: `npx --yes htmlhint@1.1.4 "*.html"` e `node scripts/check-site.mjs`.

## Execução
Implementador (escopo fechado, só o que está acima) → validador/corretor independente mede cada critério e corrige falhas → PR → CI → prévia da Vercel conferida pelo dono → merge.
