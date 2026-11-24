# Spec: limpeza de Serviços e cards da Home (itens fáceis da lista de melhorias)

Pedido do dono (2026-11-24): começar pelo PR de limpeza de `docs/melhorias-site.md` (nível 1, itens que não dependem de dado novo).

## Problema
Resíduos de template em `servicos.html` ("// Agendar Clínica Veterinária", etiquetas "Módulo 01/02/03" sem informação), links dos cards da Home que quebram em duas linhas, e foto do Horto com metade de asfalto.

## Escopo
1. `servicos.html`: botão "// Agendar Clínica Veterinária" vira "Agendar Clínica Veterinária →", com a mesma classe de botão do "Agendar Banho & Tosa →" (consistência dos 3 botões da página).
2. `servicos.html`: remover as etiquetas `card-tag` "Módulo 0N" e os `data-label="Módulo 0N"` dos `panel-frame` (nenhuma informação; o título h2 já nomeia o serviço).
3. `index.html`, cards de unidades: os links "Pedir produtos em Pitangui / em São Roque / na Formosa" passam a "Pedir produtos →" (cabe em uma linha; o card já mostra a unidade). Mantém os hrefs. O nome acessível completo é preservado com `aria-label="Pedir produtos em Pitangui"` (idem São Roque e Formosa; deve conter o texto visível). O link do Horto fica como está ("Agendar no Horto →").
4. Foto do Horto (`assets/img/unidade-horto-480.webp` e `-800.webp`): novo recorte 4:3 a partir de `4.png` (raiz do repo, NÃO versionar o original), caixa sugerida (280,230,1080,830), que mantém letreiro, entrada, bandeira e placa do WhatsApp e reduz o asfalto. Mesmo nome de arquivo e dimensões (480x360 e 800x600), WebP qualidade ~80, peso <= 90 KB a 800 px.

## Fora do escopo
Frases sem base, rótulo de telefone do Horto, título "Excelência..." (dependem do dono); páginas por unidade, FAQ, qualquer texto novo. O item "Como chegar" já existe: o botão "Ver no Mapa" aparece nas 4 unidades de `contato.html`.

## Critérios de aceite
1. Nenhum "Módulo 0" em `*.html` e nenhum botão/link com texto iniciado por "//" (check-site).
2. Os 3 botões de ação de `servicos.html` seguem o mesmo padrão ("Agendar ... →" / "Pedir produtos ... →") e as mesmas classes visuais.
3. Cards da Home: os 3 links "Pedir produtos →" cabem em UMA linha em 375, 768 e 1100 px (medir), com `aria-label` contendo o texto visível e hrefs inalterados (`#pitangui`, `#sao-roque`, `#formosa`).
4. Foto do Horto: 4:3, letreiro "POINT DOG" e entrada visíveis, asfalto claramente menor que antes (descrever com captura), arquivos <= 90 KB (800 px), alt continua verdadeiro (ajustar se o que aparece mudou).
5. Sem layout shift novo: CLS da Home <= 0,05 no Lighthouse celular emulado; acessibilidade 100, SEO 100.
6. `htmlhint` e `check-site.mjs` verdes; nada além do escopo mudou (`git diff --stat` só em servicos.html, index.html, css se necessário, check-site.mjs, 2 webp e esta spec).
