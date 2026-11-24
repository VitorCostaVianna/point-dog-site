# Melhorias e alterações identificadas (da mais rápida à mais demorada)

Data: 2026-11-24. Nada aqui foi implementado: cada item só entra com a permissão do dono, em PR próprio, com spec e critérios de aceite (ver `CLAUDE.md`).

**Como ler:** *Dono* = depende de informação que só o dono tem (nunca inventar dado). *Fato* = observado no site/código. *Referência* = ideia vinda da pesquisa de sites concorrentes (Cobasi lida; Petz e PetLove bloquearam o acesso, então o que se diz sobre eles é só opinião).

Fontes: pesquisa de referências (Cobasi, documentação do Google sobre dados de empresa local), revisão do próprio site e as pendências do dono.

---

## Nível 1: minutos a 1 hora (limpeza, sem dado novo)

| # | Melhoria | Por quê | Depende do dono? |
|---|---|---|---|
| 1 | Tirar o resíduo `//` do botão "// Agendar Clínica Veterinária" em `servicos.html` | Fato: parece erro de template | Não |
| 2 | Trocar "Módulo 01/02/03" (etiquetas e `data-label` das fotos em `servicos.html`) por o nome real do serviço | Fato: nomenclatura de template, sem informação | Não |
| 3 | Trocar o título "Excelência e carinho em cada detalhe" (`servicos.html`) por descrição concreta do que a loja faz | Fato: frase vaga, contra a regra do `CLAUDE.md` | Sim (texto) |
| 4 | Reescrever ou remover as frases sem base: "A escolha nº 1 do bairro", "Preços Justos", "Produtos Premium" (Home), "pioneiros no agendamento automático" (`sobre.html`), "toalhas esterilizadas individualmente" (`servicos.html`), "Vacinação importada" | Fato: afirmações que ninguém comprovou; regra "nunca inventar dado" | Sim (confirmar o que é verdade) |
| 5 | Escolher um rótulo único para os telefones do Horto: "Atendimento" (rodapé) x "Geral" (Contato) | Fato: inconsistência já registrada | Sim (qual é qual, qual é WhatsApp) |
| 6 | Cards da Home: textos dos links "Pedir produtos em Pitangui/São Roque" quebram em 2 linhas; usar "Na unidade X" | Pendência antiga, já aprovada como melhoria | Não |
| 7 | Enquadrar melhor a foto do Horto no card (hoje cerca de metade é asfalto) | Revisão do PR de unidades | Não |
| 8 | Medir de verdade o que ficou sem medição: Tab real nos ícones, `srcset` em celular de tela densa, rota `/x/y` da 404 na Vercel (só depois do deploy) | Relatar com honestidade o que foi e não foi medido | Não |

## Nível 2: algumas horas (conteúdo curto, estrutura pequena)

| # | Melhoria | Por quê | Depende do dono? |
|---|---|---|---|
| 9 | Bloco "Como agendar" em 3 passos na página de Serviços (o que mandar no WhatsApp: nome do pet, porte, serviço, unidade) | Referência: reduz mensagens de ida e volta; o objetivo é falar no WhatsApp | Sim (o que a loja pede) |
| 10 | Horário completo por unidade no card e no Contato, incluindo sábado, domingo e feriado | Referência: a Cobasi mostra por dia. Hoje o site só diz "Fecha às" | Sim (horários exatos) |
| 11 | Link "Como chegar" por unidade, abrindo o Maps | Referência: padrão de página de loja | Não (endereços já existem) |
| 12 | "Avaliar no Google" (link direto) em cada unidade | Mais avaliações reais, que é o que a Home promete | Sim (links de avaliação de cada unidade) |
| 13 | Seção "Planos aceitos" na clínica, deixando explícito que o PetLove vale só lá | O PetLove já tem selo; explicar como o tutor usa | Sim (outros convênios? como aciona?) |
| 14 | Títulos e descrições (SEO) com serviço + bairro ("Banho e tosa no Horto, BH") | SEO local | Sim (quais serviços cada unidade tem) |
| 15 | Confirmar qual número é WhatsApp por unidade e por serviço, e conferir o texto pré-preenchido de cada botão | Regra do projeto: mensagem certa para cada serviço | Sim |

## Nível 3: um a poucos dias (conteúdo real, páginas novas)

| # | Melhoria | Por quê | Depende do dono? |
|---|---|---|---|
| 16 | FAQ curto (o que levar, aceita PetLove, qual unidade faz o quê, horários) | Busca por dúvida e menos mensagens repetidas. Só com respostas confirmadas | Sim (todas as respostas) |
| 17 | Avaliações reais do Google (com unidade e data) no lugar dos depoimentos de exemplo | O `CLAUDE.md` pede trocar antes de divulgar. Em 2026-11-17 o dono decidiu manter os de exemplo, então só se ele pedir | Sim (decisão e textos) |
| 18 | Página própria por unidade (Horto, Pitangui, São Roque, Formosa) com endereço, horário, telefones, serviços, foto, mapa | Referência: padrão da Cobasi e recomendação do Google. Risco: 4 páginas quase iguais viram conteúdo duplicado; cada uma precisa de algo real e diferente | Sim (serviços e horários de cada unidade) |
| 19 | Dados estruturados mais completos por unidade (`geo`, `openingHoursSpecification`, `image`, `url` da página da unidade) | Referência: documentação do Google. Não usar `aggregateRating` nem `review` com as avaliações do próprio negócio | Sim (horários) |
| 20 | Equipe e bastidores com foto e vídeo reais (quem dá o banho, quem atende na clínica) | Prova social; a página Sobre hoje é só texto | Sim (fotos e autorização) |
| 21 | Antes e depois de tosa, com autorização do tutor | Prova social | Sim (fotos e consentimento) |
| 22 | Fontes e imagens: estender o cuidado de desempenho às páginas internas (Lighthouse de Serviços, Sobre, Avaliações, Contato em celular) | Hoje só a Home foi medida com rigor | Não |

## Nível 4: semanas ou fora do site (estratégico)

| # | Melhoria | Por quê | Depende do dono? |
|---|---|---|---|
| 23 | Perfil da Empresa no Google de cada unidade: categorias, horário, fotos, link de avaliação | Maior ganho de busca local; não é código do site | Sim (acesso aos perfis) |
| 24 | Rotina para pedir avaliação ao cliente após o atendimento (link direto, no WhatsApp) | Mais avaliações reais. Sem brinde por avaliação positiva | Sim |
| 25 | Guias e blog curtos ("quando vacinar", "quanto dura uma tosa") | SEO local. Só vale com autoria e revisão de veterinário; texto genérico é o que o dono não quer | Sim (veterinário revisa) |
| 26 | Agendamento online próprio | Só se o dono tiver sistema de agenda. Hoje o foco é WhatsApp | Sim |
| 27 | Trocar o DNS do domínio para a Vercel e cancelar a hospedagem antiga | Já preparado: domínios cadastrados na Vercel. Falta login no Registro.br e o "sim" do dono; cancelar a Uni5 só depois de conferir o site no ar | Sim |

---

## O que NÃO copiar dos concorrentes
- Carrinho de compras/e-commerce (o pedido é por WhatsApp e o site é estático).
- Programas de fidelidade, clube e assinatura sem sistema por trás.
- Banners de promoção e urgência, e frases vagas ("o melhor", "excelência").
- Estatísticas de agências de SEO sem fonte; prêmios e selos decorativos.
- Pop-ups e chat flutuante que escondem o botão de WhatsApp.

## Perguntas abertas para o dono
1. Quais números têm WhatsApp, por unidade e por serviço?
2. Horário completo de cada unidade (incluindo sábado, domingo e feriado)?
3. Quais serviços Pitangui, São Roque e Formosa oferecem de verdade?
4. Os 4,8 e as 532 avaliações continuam atualizados? Qual a nota por unidade?
5. "Entrega grátis" e "vídeo do banho" (citados nos depoimentos) existem de verdade?
6. Há outros convênios além do PetLove?
7. Há fotos e vídeos reais da equipe e dos serviços, com autorização dos tutores?
8. Há regra municipal ou do conselho (CRMV) que o site precise cumprir? A pesquisa viu uma notícia sobre novas regras para pet shops em BH, mas não conseguiu ler o conteúdo.
9. Interesse em agendamento online ou continuar só com WhatsApp?
10. Quem tem acesso ao Perfil da Empresa de cada unidade?

## Limites da pesquisa
Petz e PetLove bloquearam o acesso (403) e não foram lidos; não foram encontrados sites oficiais de pet shops regionais de BH que servissem de referência. O que se diz sobre eles é opinião, não fato observado.
