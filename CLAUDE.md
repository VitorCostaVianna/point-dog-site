# Point Dog — site institucional

Site estático (HTML/CSS/JS puro, sem build) de um pet shop de Belo Horizonte, no ar desde 1998.
Produção: Vercel (`point-dog-site`), domínio final `https://www.pointdog.com.br/` (ainda não apontado).
Repositório: `VitorCostaVianna/point-dog-site`. A `main` é protegida: só entra via PR com a CI `validate` verde.

## Comandos
- Validar (igual à CI): `npx --yes htmlhint@1.1.4 "*.html"` e `node scripts/check-site.mjs`
- Servir local: `npx --yes http-server -p 8124 -c-1 .`
- Deploy: automático pela Vercel (PR gera prévia; merge na `main` gera produção).

## Como trabalhar (obrigatório)
Velocidade não é o objetivo. Nada de implementar direto a partir de um pedido solto.

1. **Entender e especificar.** Antes de codar, escrever (no PR ou em `docs/specs/`) o problema, o escopo e o que fica de fora.
2. **Critérios de aceite.** Lista verificável, por exemplo: "rolagem ≥ 55 fps no celular médio", "nenhum layout shift", "funciona com `prefers-reduced-motion`", "CTA do WhatsApp visível sem rolar no mobile". Sem critério, não há "pronto".
3. **Agentes especializados, cada um com escopo definido.** Usar o `Agent` com instruções fechadas, não "faça o site melhor":
   - *Explorador* (somente leitura): mapeia o que existe e onde mexer.
   - *Designer*: propõe a direção visual (ver "Design"), sem tocar no código de produção.
   - *Implementador*: executa só o que a spec e os critérios pedem.
   - *QA/Revisor*: contexto limpo, tenta quebrar a entrega contra os critérios (viewport desktop e 375px, teclado, movimento reduzido, desempenho).
   O implementador não aprova o próprio trabalho.
4. **Testes antes de dizer que terminou.** Rodar a validação, abrir no navegador (desktop e mobile), medir desempenho de verdade (Lighthouse/Performance, não "pareceu bom"). Ao mudar algo verificável, adicionar a checagem em `scripts/check-site.mjs`. Usar `superpowers:verification-before-completion`.
5. **PR pequeno, um assunto por vez.** Branch → PR → CI verde → prévia da Vercel conferida pelo dono → merge. Nunca commitar na `main`.
6. **Relatar com honestidade** o que foi medido e o que não foi (ex.: "testei só no desktop").

### Quando usar `/loop`
- Esperar CI/deploy da Vercel ficar verde (checagem a cada poucos minutos, sem ficar consultando).
- Ciclos de ajuste com critério numérico (ex.: reduzir peso/tempo de carga até bater a meta), parando quando o critério for atendido ou ao não haver mais ganho.
- Não usar para tarefas de uma vez só.

## Design
- Invocar a skill `frontend-design` (e `design:design-critique` / `design:accessibility-review` na revisão) antes de mexer em visual.
- **Não pode ter cara de IA/template:** sem gradientes genéricos, sem grade simétrica de cards idênticos, sem emoji como ícone, sem badges decorativos, sem textos vagos ("excelência", "o melhor custo-benefício"). Preferir foto e vídeo reais da loja, tipografia com hierarquia clara e composições assimétricas com propósito.
- Efeito só se servir a uma decisão do cliente. Animação é acabamento, não conteúdo; deve degradar bem (sem JS, `prefers-reduced-motion`, celular fraco).
- Preferência já confirmada: ativos reais e relevância literal acima de metáfora visual abstrata.
- Identidade: laranja da logo, tema claro. Não reintroduzir verde como cor principal. Contexto em `docs/redesign-context.md`.

## O que importa para o cliente (conferir em toda mudança)
- Quem chega quer **falar no WhatsApp** (Agendar banho/vet, Pedir produtos): CTA claro e rápido, texto da mensagem certo para cada serviço.
- **Informação correta por unidade:** endereço, horário de fechamento e telefone das 4 unidades (Horto, Pitangui, São Roque, Formosa) e qual serviço cada uma oferece (Horto é a "Unidade Completa").
- **Aceita plano PetLove** em banho e vet. **Desde 1998.** Não escrever "26 anos".
- Avaliações reais do Google, indicando a unidade. Hoje há depoimentos de exemplo; trocar por reais antes de divulgar.
- Funcionar bem no celular, carregar rápido, aparecer no Google (SEO local).

## Regras
- Nunca inventar dado (nota, depoimento, horário, preço, telefone). Se não souber, perguntar.
- Manter `www.pointdog.com.br` nos canonicals e Open Graph; ajustar só se o domínio mudar.
- Ações externas (criar repo, publicar, DNS, apontar domínio) só com confirmação do dono.
