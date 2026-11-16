# Spec: SEO local base (PR 3 de SEO e performance)

## Problema
- As 4 unidades não têm âncora própria; os cards da home apontam todos para `contato.html` sem destino.
- Só o Horto tem "Ver no Mapa" em `contato.html`.
- O rodapé de todas as páginas mostra só o Horto, como se fosse a única loja.
- O endereço do Horto aparece abreviado ("Vasc.") e por extenso; o horário de fechamento aparece em formatos diferentes ("Fecha às 18:00" / "Até 19:00").
- O botão do cabeçalho diz "Comprar Agora", mas envia a mensagem de agendar horário.

## Escopo
Dentro: os 5 HTMLs (blocos de unidades, cards da home, rodapé, cabeçalho), CSS mínimo para o que for novo, `scripts/check-site.mjs`.
Fora: JSON-LD (PR 4), títulos/descrições e hierarquia de headings (PR 8), JS de comportamento, imagens, vídeo, textos de marketing, avaliações.

## Decisões do dono
- Endereço do Horto por extenso: **"R. Dona Nancy de Vasconcelos Gomes, 336 - Horto, Belo Horizonte - MG"** em todos os lugares (inclusive nas URLs de busca do Maps).
- O site tem dois motivos de contato, **agendar** e **comprar**: o cabeçalho passa a oferecer os dois via WhatsApp: "Agendar no WhatsApp" (botão principal, mensagem de agendar horário) e "Pedir produtos" (botão secundário, mensagem de pedir produtos, a mesma já usada no hero). O FAB continua como está.

## Regras de dados
Nunca inventar. Usar apenas endereço, CEP, telefone, horário e serviços que JÁ estão no site (principalmente `contato.html`). Se faltar um dado de alguma unidade, não preencher: deixar de fora e listar no relatório. Padronizar apenas o FORMATO do horário (ex.: "Fecha às 18:00"), sem mudar o dado.

## Critérios de aceite
1. Cada unidade em `contato.html` tem `id` estável: `horto`, `pitangui`, `sao-roque`, `formosa`.
2. Os 4 cards da home linkam para `contato.html#<id>` da unidade certa (conferir unidade por unidade); links de texto distintos e descritivos quando couber, sem mudar o layout dos cards.
3. As 4 unidades em `contato.html` têm botão "Ver no Mapa" no mesmo padrão do Horto, usando as URLs de busca já presentes em `avaliacoes.html` (sem inventar Place ID). Todas com `target="_blank" rel="noopener"`.
4. O endereço do Horto aparece por extenso e idêntico em todas as páginas e URLs (grep: zero "Vasc." restante).
5. O formato do horário de fechamento é o mesmo em home e contato para cada unidade, sem alterar o dado.
6. O rodapé das 5 páginas lista as 4 unidades (nome, endereço e telefone da unidade, só dados existentes) em vez de só o Horto; sem quebrar em 375 px nem no desktop; os dois telefones do Horto (atendimento e banho e tosa) são preservados.
7. O cabeçalho em todas as páginas tem "Agendar no WhatsApp" (principal) e "Pedir produtos" (secundário) com as mensagens corretas; "Comprar Agora" não existe mais. O cabeçalho continua com 85px de altura no desktop, sem quebrar de linha, e no celular o menu aberto mostra os dois.
8. `check-site.mjs` ganha checagens: ids das 4 unidades existem em `contato.html`; todo link `contato.html#x` aponta para um id existente; nenhuma ocorrência de "Vasc." nem de "Comprar Agora".
9. htmlhint e `check-site.mjs` passam. Sem mudança de CLS/LCP perceptível (a validação mede o CLS da home e de contato antes/depois).
10. Nada fora do escopo foi tocado.
