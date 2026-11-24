# Spec: página 404

Pedido do dono (2026-11-24): uma 404 "bem bacana".

## Escopo
`404.html` + `css/404.css`. A Vercel serve `404.html` com status 404 em qualquer URL inexistente. Visual: "404" grande em laranja (único elemento de destaque), título direto, a foto real da fachada do Horto (literal, sem metáfora), botão para o início e WhatsApp, links para Serviços, Unidades e Avaliações.

## Fora do escopo
Ilustração/animação, busca no site, 404 por idioma.

## Critérios de aceite
1. Carrega CSS, imagens e links corretos em URL aninhada (`/a/b/c`): caminhos absolutos (check-site).
2. `noindex`, sem canonical, fora do sitemap (check-site).
3. Um único `<h1>`; "404" decorativo com `aria-hidden`.
4. Sem JS obrigatório; sem animação.
5. Layout em 1 coluna em até 900 px; botão do início e WhatsApp visíveis sem rolar a 375 px (conferir na prévia).
6. Lighthouse SEO/acessibilidade sem falhas novas.

Nota: na 404 o rodapé usa títulos h2 (a página só tem o h1), com o mesmo visual.
