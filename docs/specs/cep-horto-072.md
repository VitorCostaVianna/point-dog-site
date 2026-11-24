# Spec: CEP do Horto = 31030-072

Decisão do dono (2026-11-24): o CEP do Horto termina em 072, que é o que o Google Maps mostra hoje (Point Dog Pet Shop, R. Dona Nancy de Vasc. Gomes, 336 - Horto, 31030-072). Substitui a decisão anterior (`jsonld.md`: 31030-071), tomada quando o Maps parecia mostrar 071.

## Escopo
- `contato.html`: endereço visível do Horto e `postalCode` do JSON-LD passam a 31030-072.
- `scripts/check-site.mjs`: a regra que proibia o 072 passa a proibir o 071.

## Fora do escopo
Bairro (segue "Horto"), outras unidades, textos antigos em `docs/` (histórico).

## Critérios de aceite
1. Zero ocorrências de 31030-071 em HTML, JS e scripts; o 072 aparece no texto visível e no JSON-LD de contato.html (o check existente exige que o CEP do JSON-LD apareça no texto visível).
2. htmlhint e check-site verdes; diff só em contato.html, check-site.mjs e esta spec.
