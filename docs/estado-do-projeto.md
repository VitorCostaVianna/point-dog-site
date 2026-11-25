# Estado do projeto (para retomar o trabalho)

Atualizado em 2026-11-24. Leia antes: `CLAUDE.md` (regras e processo), `docs/melhorias-site.md` (lista priorizada) e `docs/specs/` (uma spec por mudança). Este arquivo envelhece: confirme no código antes de afirmar.

## O que está no ar (`main`)
- Site estático (HTML/CSS/JS, sem build) da Point Dog, pet shop de Belo Horizonte desde 1998, 4 unidades: Horto (Unidade Completa), Pitangui, São Roque e Formosa.
- Design claro, laranja da logo, fontes locais (Bricolage Grotesque e Figtree, `assets/fonts`), sem emojis, sem verde nos selos.
- Hero: vídeo "scrub" controlado pela rolagem (`js/scroll-video.js`, GSAP/ScrollTrigger via CDN). A classe `html.scrub-js` nasce no `<head>` para evitar deslocamento de layout.
- Home: cards de unidades com foto real da fachada, selo PetLove só na Clínica Veterinária (com logo), redes sociais no rodapé de todas as páginas (Instagram, Facebook, TikTok, Linktree), página 404 própria (`404.html`, noindex, caminhos absolutos).
- SEO: títulos/descrições com serviço e localidade, canonical em `www.pointdog.com.br`, JSON-LD (Organization na Home com as 4 redes em `sameAs`; PetStore por unidade em Contato), CEP do Horto 31030-072.
- Medido (Lighthouse celular emulado, Home): SEO 100, acessibilidade 100, CLS ~0,008, LCP ~2,6-2,8 s (é o vídeo do hero).

## Produção e domínio
- Vercel, projeto `point-dog-site`. Cada PR gera prévia (protegida por login: responde 302, o Lighthouse não a alcança; medir local ou em produção). Merge na `main` gera produção (`point-dog-site.vercel.app`). A Vercel serve cache por alguns minutos após o deploy.
- Domínios `www.pointdog.com.br` e `pointdog.com.br` já estão no projeto (o sem `www` redireciona 308 para o `www`). O DNS ainda está na hospedagem antiga (servidores `dns1/dns2.uni5.net`); não há e-mail no domínio (confirmado pelo dono).
- **Troca do DNS (pendente):** no Registro.br, trocar os servidores para `ns1.vercel-dns.com` e `ns2.vercel-dns.com`. Só com o "sim" explícito do dono, com ele logado (a sessão expirou). Antes, rodar Lighthouse/SEO em produção. Cancelar a hospedagem antiga só depois de conferir o site novo no ar. Para voltar atrás: devolver os servidores antigos enquanto a hospedagem ainda estiver ativa.

## Como validar e medir
- `npx --yes htmlhint@1.1.4 "*.html"` e `node scripts/check-site.mjs` (a CI roda os dois). O `check-site` impõe muitas regras: emojis, ordem de títulos, logo decorativo, fontes locais, redes no rodapé, cards de unidades (nome, endereço, horário, foto), PetLove só na clínica, títulos/descrições, 404 etc. Cada mudança verificável deve ganhar uma checagem.
- Servir local: `npx --yes http-server -p 8124 -c-1 .`. Lighthouse: `npx --yes lighthouse@12 <url> --chrome-flags="--headless=new"`.
- Viewport de 375 px: a janela do Chrome da extensão não redimensiona de verdade; use iframe `srcdoc` de mesma origem ou o Lighthouse com emulação de celular.

## Processo obrigatório
Spec em `docs/specs/` e critérios de aceite, Implementador e Revisor em agentes separados (quem implementa não aprova), PR pequeno de um assunto, CI verde, prévia conferida pelo dono, merge só com o "pode dar merge" dele. Relatar com honestidade o que foi e o que não foi medido.

## Armadilhas conhecidas
- Arquivos misturam LF e CRLF: edite de forma cirúrgica, sem reformatar.
- PRs que alteram o `check-site.mjs` conflitam entre si: resolver mantendo os dois lados e rodar de novo.
- `1.png` a `7.png` na raiz do projeto (fora do git) são originais de fotos do dono: nunca versionar (não usar `git add -A`).
- Escapes de regex em scripts gerados (`\s`, `\.`, `\b`) já foram corrompidos duas vezes ao gravar; releia o arquivo depois.

## Pendências que dependem do dono (não resolver sem ele; nunca inventar dado)
1. "Avaliar no Google" por unidade (adiado): 4 links de avaliação do Perfil da Empresa.
2. Frases sem base: "A escolha nº 1 do bairro", "Preços Justos", "Produtos Premium", "pioneiros no agendamento automático", "toalhas esterilizadas individualmente", "Vacinação importada".
3. Título "Excelência e carinho em cada detalhe" (Serviços): precisa de frase concreta.
4. Rótulo dos telefones do Horto e qual número é WhatsApp, por unidade e serviço.
5. Horário completo por unidade e serviços de Pitangui, São Roque e Formosa (nenhum texto pode atribuí-los a elas).
6. Troca do DNS (ver acima).
7. Demais ideias, da mais rápida à mais demorada: `docs/melhorias-site.md`.
