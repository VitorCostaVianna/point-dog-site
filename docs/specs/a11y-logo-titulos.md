# Spec: duas falhas de acessibilidade do Lighthouse

Problema (Lighthouse, produção): `image-redundant-alt` (logo com alt "Point Dog" ao lado do texto "Point Dog", Home e Contato) e `heading-order` (títulos do rodapé em h4 depois de h2, em contato.html).

## Escopo
- Logo do cabeçalho e do rodapé com `alt=""` (decorativo; o nome está no texto ao lado).
- Títulos do rodapé "Navegação" e "Unidades": h4 -> h3 em todas as páginas (mesmo visual, seletor CSS `.footer-grid h3`).

## Fora do escopo
Outras mudanças de visual ou de ordem de títulos no corpo das páginas.

## Critérios de aceite
1. Lighthouse acessibilidade 100 em Contato e Sobre (medido: 100/100).
2. check-site falha se um título pular nível ou se o logo voltar com alt "Point Dog".
3. Rodapé com a mesma aparência (conferir na prévia).
