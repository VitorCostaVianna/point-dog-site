# Redesign do site institucional — Point Dog Pet

Data: 2026-08-13

## Contexto

O site antigo da Point Dog (pet shop + clínica veterinária + banho/tosa, com
26 anos de história e 4 unidades em Belo Horizonte) foi documentado através
de prints de tela do usuário (Home, Serviços, Sobre, Avaliações, Contato).
O pedido é refazer o site do zero com visual moderno/futurista, mantendo
fidelidade ao conteúdo textual e à identidade de marca (nome, logo, cores).

Este é um projeto novo (pasta vazia) — sem código ou site anterior no
repositório.

## Objetivo

Entregar um site institucional estático de 5 páginas, visualmente moderno e
"futurista", fiel ao conteúdo do site antigo, com integrações reais de
WhatsApp/telefone/mapa, sem necessidade de backend ou build step.

## Decisões já validadas com o usuário

- **Stack:** HTML/CSS/JS puro, sem framework, sem build.
- **Estrutura:** páginas separadas (não single-page com âncoras).
- **Paleta "Dark Pet-Tech":** fundo grafite escuro (`#0D1210`/`#141B18`),
  laranja da marca (`#F2762B`) como cor de ação, verde-esmeralda neon
  (`#22C55E`) como contraste, dourado (`#D9A441`) para detalhes, off-white
  (`#F7F5F0`) para texto/superfícies claras.
- **Integrações:** links de WhatsApp (`wa.me`), telefone (`tel:`) e Google
  Maps devem ser funcionais de verdade, usando os números/endereços reais
  capturados nos prints.
- **Imagens:** sem fotografias reais de qualidade disponíveis (só prints em
  baixa resolução das fachadas). Usar ilustração vetorial/SVG e formas em
  gradiente no lugar de fotos, exceto a logo real (`logo-pointdog.webp`),
  usada no header/footer.

## Arquitetura de arquivos

```
site_institucional/
  index.html          (Home)
  servicos.html
  sobre.html
  avaliacoes.html
  contato.html
  css/
    style.css
  js/
    main.js
  assets/
    img/
      logo-pointdog.webp
```

Todas as páginas compartilham o mesmo header (nav) e footer, o mesmo
`style.css` e o mesmo `main.js` (menu mobile, animações on-scroll, ano
dinâmico no footer).

## Inventário de conteúdo por página (fidelidade ao site antigo)

### Home (`index.html`)
- Header fixo: logo, nav (Home/Serviços/Sobre/Avaliações/Contato), CTA
  "Comprar Agora".
- Hero: badge "✨ Seu pet tratado como família", título "Cuidado de
  verdade, *confiança* desde o primeiro banho.", subtítulo, CTAs "Agendar
  no WhatsApp" (wa.me) e "Conhecer Serviços" (→ servicos.html).
- Seção "Tudo para o seu pet": 3 cards — Banho & Tosa Profissional,
  Clínica Veterinária, Pet Shop Completo — cada um com texto e "Saiba
  mais →" para a página de Serviços.
- Seção "Por que somos a escolha nº 1 do bairro?": 4 itens (Tradição de 26
  Anos, Higiene Rigorosa, Produtos Premium, Preços Justos) + bloco visual
  ilustrado ao lado (substitui o grid de fotos do site antigo).
- Seção "Quem ama, recomenda": nota 4.8★/5 no Google, 4 depoimentos em
  destaque (Ana Clara, Ricardo Mendes, Fernanda Costa, Carlos Eduardo),
  link "Ver todas as 532 avaliações no Google →" (→ avaliacoes.html).
- Seção "Nossas Unidades": 4 cards (Horto — unidade completa, Pitangui,
  São Roque, Formosa) com endereço, telefone, horário, CTA.
- Footer completo (ver abaixo).

### Serviços (`servicos.html`)
- Hero de seção: "Nossos Serviços — Excelência e carinho em cada
  detalhe...".
- Bloco 1 — Banho & Tosa: descrição + lista (Banho relaxante, Tosa
  higiênica, Tosa na tesoura, Hidratação profunda) + CTA WhatsApp.
- Bloco 2 — Clínica Veterinária: descrição + lista (Consultas de rotina,
  Exames laboratoriais, Vacinação importada, Orientação nutricional) +
  "Agendar Clínica Veterinária →".
- Bloco 3 — Pet Shop & Farmácia: descrição + lista (Rações Super Premium,
  Brinquedos interativos, Acessórios de passeio, Farmácia veterinária,
  Camas e roupas) + "Agendar Pet Shop & Farmácia →".

### Sobre (`sobre.html`)
- Hero de seção: "NOSSA HISTÓRIA" + "Paixão por animais, compromisso com
  você".
- "Tradição, inovação e carinho." + parágrafo dos 26 anos / pioneirismo no
  agendamento automático.
- Parágrafo "Aqui, entregamos excelência completa...".
- Dois cards: "Confiança" (Transparência total em todos os procedimentos)
  e "Carinho" (Amor incondicional em cada gesto).
- Citação de destaque: "Cuidar é a nossa forma de amar."

### Avaliações (`avaliacoes.html`)
- Hero de seção: "O que dizem sobre nós" — 4.8★ (532 avaliações no
  Google).
- Grid com os depoimentos capturados nos prints, com nome, selo "Cliente
  Verificado" e tempo relativo.
- Link/CTA final para o Google Reviews.

### Contato (`contato.html`)
- Hero de seção: "Contato — Estamos esperando sua visita."
- Card em destaque: Unidade Horto (badge "Matriz • Completa"), com
  botões "Agendar Horário" (WhatsApp) e "Ver no Mapa" (Google Maps).
- Cards das demais 3 unidades (Pitangui, São Roque, Formosa) com
  endereço, telefone, horário, CTA "Pedir Produto"/"Ver no Mapa".
- Seção "Redes Sociais": Instagram, Facebook, Linktree.

### Footer (compartilhado)
- Logo + texto "Cuidado de verdade para quem você ama. Banho, tosa e
  clínica veterinária com a excelência que seu pet merece."
- Coluna "Navegação": Home, Nossos Serviços, Sobre Nós, (Avaliações,
  Contato).
- Coluna "Contato": endereço da unidade Horto, telefones (Atendimento /
  Banho e Tosa).
- Copyright com ano dinâmico via JS.

## Dados reais para integrações (extraídos dos prints)

| Unidade | Endereço | Telefone(s) | Horário |
|---|---|---|---|
| Horto (matriz) | R. Dona Nancy de Vasc. Gomes, 336 — Horto, BH — 31030-072 | (31) 3468-3299 (Geral) · (31) 3463-1877 (Banho) | Fecha às 18:00 |
| Pitangui (Sagrada Família I) | R. Pitangui, 3003 — Sagrada Família, BH — 31030-210 | (31) 3463-6974 | Fecha às 19:00 |
| São Roque (Sagrada Família II) | R. São Roque, 1231-A — Sagrada Família, BH — 31035-460 | (31) 2552-0043 | Fecha às 19:00 |
| Formosa (Santa Tereza) | R. Formosa, 113A — Santa Tereza, BH — 31014-045 | (31) 3965-0182 | Fecha às 18:00 |

Números de WhatsApp usarão o formato `https://wa.me/55<DDD><número>` a
partir dos telefones acima (removendo formatação).

## Fora de escopo

- Backend, CMS, formulário de contato funcional com envio de e-mail (não
  há servidor).
- Integração real com API do Google Reviews (os depoimentos são
  reproduzidos como conteúdo estático, fiéis aos prints).
- Loja/e-commerce funcional (o botão "Comprar Agora"/"Pedir Produto" pode
  apontar para WhatsApp, já que não há checkout no escopo).

## Testes / verificação

Sem framework de testes automatizado (site estático). Verificação será
manual: abrir cada página no navegador, checar responsividade
(mobile/desktop), links de WhatsApp/telefone/mapa, e legibilidade da
paleta escura (contraste de texto).
