# Spec: títulos e descrições com serviço + localidade (SEO local)

Pedido do dono (2026-11-24): item 5 da lista de melhorias.

## Problema
Os títulos atuais ("Serviços | Point Dog Pet", "Contato | Point Dog Pet", "Sobre | Point Dog Pet") não dizem o que a loja faz nem onde. Quem busca "banho e tosa BH" ou "pet shop Horto" não vê isso no resultado do Google.

## Regra de ouro
Só afirmar o que o site já afirma. Os serviços por unidade são conhecidos apenas para o Horto (Unidade Completa: banho e tosa, clínica veterinária e pet shop). Para Pitangui, São Roque e Formosa o dono ainda não confirmou os serviços: nenhum título ou descrição pode atribuir serviço a elas. Localidade só com nomes que já estão no site (Belo Horizonte, Horto, Pitangui, São Roque, Formosa). Sem "melhor", "nº 1", "excelência", sem preço, sem nota nova.

## Escopo (title, meta description, og:title e og:description de cada página; mantém og:image, canonical e o resto)
Textos propostos (o dono revisa na prévia):
- index.html: title "Point Dog Pet | Banho e tosa, clínica veterinária e pet shop em BH" (máx. ~60 caracteres: se passar, usar "Point Dog Pet | Banho e tosa, veterinário e pet shop em BH"); description: "Banho e tosa, clínica veterinária e pet shop em Belo Horizonte desde 1998, com 4 unidades na cidade." (sem listar Pitangui, São Roque e Formosa: o check proíbe citar essas unidades fora de contato.html, para não atribuir serviço a elas)
- servicos.html: title "Banho e tosa, veterinário e pet shop em BH | Point Dog" (a versão com "clínica veterinária" tinha 62 caracteres e podia ser cortada no Google); description: "Banho e tosa, clínica veterinária (aceita plano PetLove) e pet shop e farmácia em Belo Horizonte. Fale no WhatsApp e agende."
- contato.html: title "Unidades Horto, Pitangui, São Roque e Formosa | Point Dog"; description: "Endereços, telefones e mapa das 4 unidades da Point Dog em Belo Horizonte: Horto, Pitangui, São Roque e Formosa."
- sobre.html: title "Sobre a Point Dog | Pet shop em Belo Horizonte desde 1998"; description: "A história da Point Dog, pet shop de Belo Horizonte desde 1998: banho e tosa, clínica veterinária e produtos para o seu pet."
- avaliacoes.html: title "Avaliações no Google | Point Dog Pet, Belo Horizonte"; description: "4,8 de 5 com 532 avaliações no Google. Veja o que os clientes dizem de cada unidade da Point Dog em Belo Horizonte."
- 404.html: não muda (noindex).

## Fora do escopo
Dados estruturados novos, texto do corpo das páginas, H1 (cada página mantém um h1), serviços por unidade, página por unidade.

## Critérios de aceite
1. Cada página indexável tem title único (<= 62 caracteres) e description única (<= 160 caracteres), sem duplicata entre páginas (check-site).
2. og:title e og:description iguais ao title e à description (check-site).
3. Nenhum título/descrição atribui serviço a Pitangui, São Roque ou Formosa; nenhum termo de superlativo ("melhor", "nº 1", "excelência", "premium") (check-site).
4. Canonical, og:image, robots e JSON-LD inalterados; Lighthouse SEO 100 em todas as páginas; nada mais no diff.
5. O PetLove só aparece na description de Serviços e fala só da clínica.

## Ajustes após a revisão (2026-11-24)
- A exceção de contato.html (pode listar as 4 unidades, pois não atribui serviço) vale para a regra de unidades; superlativos seguem proibidos em todas.
- check-site: title/description vazios falham; só `&amp;` é aceita como entidade (outras escapariam das checagens de texto).
