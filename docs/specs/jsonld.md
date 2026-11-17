# Spec: JSON-LD por unidade (PR 4 de SEO e performance)

## Problema
Só a home tem JSON-LD. Os 4 `PetStore` não têm telefone, CEP, `@id` nem `url`; o telefone geral está na `Organization`; `areaServed` é uma string solta; não há `sameAs`.

## Escopo
Dentro: bloco JSON-LD em `index.html` (Organization) e em `contato.html` (as 4 unidades), CEP do Horto em `contato.html`, `scripts/check-site.mjs`.
Fora: títulos/descrições, headings, imagens, textos de marketing, CSS, JS, OG/Twitter.

## Decisões do dono
- **CEP do Horto: usar o do Google Maps, `31030-071`** (o site dizia `31030-072`). Para o site ficar consistente com o JSON-LD, trocar também o CEP visível em `contato.html` (e em qualquer outro lugar onde apareça). Mantém-se "Horto" como bairro (não mudar o bairro; o Maps mostra "Sagrada Família", e o dono ainda não decidiu).
- Sem `openingHours` (abertura não existe no site) e sem `AggregateRating`/`review` (avaliações não confirmadas).

## Regras de dados
Nunca inventar. Usar só dados que já estão no site: endereço, CEP e telefone de cada unidade em `contato.html`; redes sociais (`sameAs`) só as URLs que já aparecem no site (Instagram, Facebook, TikTok etc.). Formato de telefone E.164 (`+55-31-...`). Se faltar dado de uma unidade, omitir o campo e listar no relatório.

## Critérios de aceite
1. `index.html` mantém o JSON-LD `Organization` (`@id` `https://www.pointdog.com.br/#org`, nome, url, logo, `foundingDate` 1998, `sameAs` com as redes que já existem no site). Sem os 4 `PetStore` na home. O `telephone` da Organization continua o geral do Horto (3468-3299), apenas se isso for o que o site informa como atendimento.
2. `contato.html` ganha JSON-LD com os 4 `PetStore`, cada um com: `@id` (`https://www.pointdog.com.br/contato.html#<id>` igual ao id da âncora de cada unidade), `name`, `url` (mesma âncora), `image`, `telephone` da unidade, `address` completo (`streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`), `areaServed` como `{"@type":"Place"/"AdministrativeArea"...}` ou string simples coerente com o bairro, e `parentOrganization` apontando para o `@id` da Organization. Telefone e CEP de cada unidade conferem exatamente com o que está visível em `contato.html`.
3. CEP do Horto = `31030-071` no JSON-LD e na página visível; zero ocorrências de `31030-072` no repositório (fora de `docs/`).
4. JSON válido (parse) em cada bloco, sem vírgula sobrando, sem `openingHours`, sem `AggregateRating`, sem `review`.
5. Valida no validador de Schema.org / Rich Results: o validador não consegue ser rodado offline, então verificar com um checador local que cada tipo e propriedade usados existe em schema.org (consultar a documentação de schema.org via WebFetch ou WebSearch para `PetStore`, `PostalAddress`, `Organization`) e relatar o que foi conferido.
6. `check-site.mjs` ganha checagens: todo bloco `application/ld+json` é JSON válido; os 4 `@id` de unidade existem em `contato.html` e cada um aponta para um id de âncora existente; `postalCode` e `telephone` presentes em cada `PetStore`; ausência de `openingHours`, `aggregateRating` e `review`; o CEP do JSON-LD de cada unidade aparece no texto visível da mesma página.
7. htmlhint e `node scripts/check-site.mjs` passam; nada fora do escopo tocado; sem mudança visual.
