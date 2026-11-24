# Spec: cards das unidades com foto e redes sociais no rodapé

Pedido do dono (2026-11-24), com referência visual de cards de lojas (foto no topo, etiqueta, nome, endereço, link de contato).

## Decisões do dono
- Sem setas/carrossel: grade de 4 cards.
- Fotos: o dono envia a fachada de cada unidade. Sem foto = card sem área de foto (nada inventado, sem banco de imagens).
- Informações mantidas: nome, endereço e "Fecha às" de cada unidade, e os links de ação atuais.
- Redes: usar só os links que já existem no site (Instagram, Facebook, TikTok, Linktree). Ícones SVG do Simple Icons (CC0), baixados pelo coordenador.

## Escopo
1. `index.html` seção "Nossas unidades": cada unidade vira card com (opcional) foto no topo, etiqueta só no Horto ("Unidade Completa"), nome, endereço, "Fecha às …" e link de ação atual. Foto via `<img>` com `width/height`, `loading="lazy"`, `alt` descrevendo a fachada.
2. Rodapé de TODAS as páginas (`*.html`): bloco "Redes" com 4 ícones-link (Instagram, Facebook, TikTok, Linktree), `target="_blank" rel="noopener"`, nome acessível via `aria-label` e imagem com `alt=""`.
3. A seção "Redes Sociais" de `contato.html` permanece.
4. CSS novo em `css/unidades.css` (carregado por index e demais páginas só se necessário) ou em `css/style.css`, sem sombras/gradientes decorativos; cards não podem parecer template SaaS (hierarquia: foto, nome em destaque, endereço secundário).

## Fora do escopo
Carrossel, setas, novas informações por unidade (serviços, horário de abertura), página por unidade, trocar links das redes.

## Critérios de aceite (o revisor verifica cada um e relata o resultado)
1. 4 cards na Home, mesmos textos/horários/endereços/links de antes (diff de conteúdo só no que é estrutural).
2. Etiqueta "Unidade Completa" só no Horto; nenhuma etiqueta inventada nas outras.
3. Card com foto: imagem com width/height, lazy, alt; sem layout shift (CLS Home <= 0,05 no Lighthouse celular emulado).
4. Card sem foto: layout íntegro, sem espaço vazio estranho.
5. Grade: 4 colunas >= 1000 px, 2 colunas até 1000 px, 1 coluna a 375 px; nada estoura a largura.
6. Rodapé de todas as 5/6 páginas tem os 4 ícones com links corretos (iguais aos de `index.html` sameAs e `contato.html`), `aria-label` presente, alvo de toque >= 40 px, foco visível por teclado.
7. Contraste dos ícones/textos >= 4,5:1 (ícone #221A14 sobre branco).
8. Nenhum emoji, nenhum verde, nenhum "excelência"/frase vaga nova.
9. check-site.mjs ganha checagens: rodapé com os 4 links de redes em todas as páginas; ícones existem; cards de unidade com 4 hrefs corretos.
10. Passa na CI (htmlhint + check-site). Lighthouse Home: acessibilidade 100, SEO 100, CLS <= 0,05.
