# Spec: vídeo "scrubbing" na Home

Status: rascunho para aprovação do dono. Nenhum código de produção até aprovar.

## Decisão de direção
A animação principal do site é um **vídeo controlado pela rolagem** (scrubbing): conforme a pessoa rola, o vídeo avança ou volta. Efeito premium com custo baixo no celular, porque é um vídeo comum, sem 3D em tempo real.

Ferramentas: GSAP + ScrollTrigger (liga a rolagem a `video.currentTime`). Sem Lenis, sem Three.js. Escolhidas porque o teste anterior com Lenis, desfoque no cabeçalho e transformações no vídeo deixou a rolagem pesada na máquina do dono.

Fora do escopo desta etapa: 3D em tempo real (Three.js/Spline), animação de cards e fotos, vídeos para redes sociais (HyperFrames), geração por IA (Higgsfield).

## Problema que resolve
A Home precisa passar, em poucos segundos, que a Point Dog cuida bem do pet, sem texto genérico. Um vídeo real que se desenrola com a rolagem mostra isso e leva a pessoa até o botão de WhatsApp.

## Onde entra
Uma seção da Home, após o hero e antes de "Por que a Point Dog", com o vídeo preso na tela (pinned) durante a rolagem e 2 a 3 frases curtas que entram em momentos do vídeo, terminando no CTA "Agendar no WhatsApp".
O hero continua como está (vídeo em loop, sem efeito de rolagem).

## Material (decisão do dono)
Já existem `hero-golden-campo.mp4` (usado no hero) e `hero-banho-tosa.mp4` (sem uso), ambos 1280×720, 24 fps, 10 s, ~2,5 MB.
- Preferência do dono: conteúdo real. Ideal é filmagem real do banho/atendimento. Pendente: o dono diz qual vídeo usar ou envia um novo.
- O arquivo do scrub precisa ser **recodificado com keyframes frequentes** (`ffmpeg -g 1` ou GOP curto), senão a rolagem trava ao voltar. O FFmpeg já está instalado nesta máquina.

## Critérios de aceite
Cada item é verificado e registrado no PR com o resultado medido.

Desempenho
1. Arquivo do scrub ≤ 4 MB, com 1280×720 no máximo. Em telas de celular, servir uma versão ≤ 2 MB ou o plano B (item 6).
2. Rolagem ≥ 55 fps medida no Chrome Performance, no PC e em um celular real, com o dono confirmando que está fluida.
3. Sem layout shift (CLS ≤ 0,05) e LCP da Home não pior que o atual (medir antes e depois no Lighthouse).
4. Sem `backdrop-filter` nem transformações de escala no vídeo; nenhuma biblioteca de rolagem suave.

Comportamento
5. Rolar para baixo avança o vídeo; rolar para cima volta, sem travar nem pular quadros visíveis.
6. Plano B sem scrub (vídeo parado no melhor quadro, texto visível) quando: JS/GSAP não carregar, `prefers-reduced-motion`, ou o vídeo falhar. Todo o texto e o CTA continuam acessíveis.
7. O botão de WhatsApp é visível e clicável ao fim da seção, também no celular (375 px).
8. A seção não bloqueia o resto: a rolagem sai dela normalmente, sem "prender" o usuário.

Conteúdo e qualidade
9. O vídeo usado é filmagem real aprovada pelo dono; nada gerado por IA sem aprovação.
10. Textos curtos e específicos (sem "excelência", "melhor custo-benefício"); revisados pelo dono.
11. Contraste do texto sobre o vídeo ≥ 4,5:1, com `alt`/rótulo acessível e sem som.
12. Passa na CI (`htmlhint` + `check-site.mjs`), que ganha checagens novas: peso do arquivo do scrub e presença do poster.

## Plano de execução (agentes com escopo)
1. **Explorador:** mede peso e tempo de carga atuais da Home (baseline do Lighthouse) e confirma onde a seção entra. Somente leitura.
2. **Designer (`frontend-design`):** propõe o layout da seção, os textos e os momentos do vídeo. Entrega proposta, não código.
3. **Preparo do vídeo:** recodifica o arquivo escolhido para scrub e gera o poster (tarefa separada, com checagem de peso).
4. **Implementador:** só `js/scroll-video.js`, a seção no HTML e o CSS dela.
5. **QA/Revisor (contexto limpo):** roda os critérios 1 a 12, em desktop e 375 px, com e sem movimento reduzido, e relata números.
6. PR pequeno, CI verde, prévia da Vercel aprovada pelo dono, merge.

## Perguntas em aberto
- Qual vídeo usar: `hero-banho-tosa.mp4`, outro já existente, ou um novo de filmagem real?
- Duração e tema: 5 a 8 segundos mostrando o banho, o atendimento ou a fachada?
- Você testa no PC, no celular ou nos dois? (define onde medimos o critério 2)
