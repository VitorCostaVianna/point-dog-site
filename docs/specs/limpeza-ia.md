# Spec: tirar a cara de IA (emojis, selos, frase sem base)

Pedido do dono (2026-11-24): reescrever "nível hospitalar", remover emojis dos cards, e os selos verdes (dono sem preferência).

## Escopo
- `index.html`: "Higiene Rigorosa / nível hospitalar" vira "Tudo em um endereço", só com fato do site (Horto = Unidade Completa: banho e tosa, clínica e pet shop). Cards de serviço sem ícone/emoji. Selo do hero: "Seu pet tratado como família" (frase vaga) fica como está (dono pediu para manter), só deixa de ser verde.
- `sobre.html`: sem 🤝 e ❤️.
- `servicos.html` e `.plan-badge`: o "✔" (caractere) vira marcador desenhado em CSS.
- `css/style.css`: `.badge` e `.scrub .badge` de verde para o laranja da marca; remove CSS dos ícones dos cards.

## Fora do escopo
Eyebrows "N.01 —", cards de serviço iguais, "nº 1 do bairro", "melhor custo-benefício", "vacinação importada" (seguem na lista de pendências do dono).

## Critérios de aceite
1. Nenhum emoji nem "✔" nos HTMLs (check-site).
2. Nenhuma ocorrência de "nível hospitalar" (check-site).
3. `.badge` e `.plan-badge` sem verde (check-site).
4. Contraste do selo do hero >= 4,5:1 (laranja-escuro #B04C0D sobre branco 85%).
5. Cards da Home continuam alinhados em desktop e 375 px (conferir na prévia).
