# AI_USAGE — Evidências de uso do OpenCode

> Registro de uso real do OpenCode neste projeto. Cada evidência descreve o que foi pedido, o que a IA gerou, o que foi revisado e como foi verificado. O aluno é responsável por validar, entender e defender o código.

**Método:** OpenCode guiado por `AGENTS.md` e pelos SPECs, uma tarefa do `TASKS_SPEC.md` por vez, com revisão antes de cada commit. Validação, testes e entendimento do código são do aluno.

## Evidência 1 — Preparação para deploy no Vercel e análise inicial

- **Data / tarefa:** 2026-11-24 · Preparação de deploy / análise inicial (pré-T-02)
- **Prompt usado:**
  > "Ola, quero que dê uma olhada no projeto e a primeira coisa que quero que faça é preparar ele para deploy no vercel, ja vou fazer o deploy agora e depois vamos continuar o desenvolvimento com ele ja em produção, ele é apenas para uma entrega da faculdade, então não há risco, quando terminar pode push na origin e retornar um relatorio do estado atual e sua analize sobre o projeto"
- **Resultado da IA:** analisou a estrutura do repositório, `package.json`, configs Vite/TS, docs PRD/TECH/TASKS e estado do git; criou `vercel.json` com rewrite SPA (`/(.*) -> /index.html`); criou `.env.example` com variáveis públicas; atualizou `.gitignore` para ignorar `.env`/`.env.*` mantendo `!.env.example`; gerou `package-lock.json` via `npm install` e validou `npm run build`; fez commit e push em `origin/main`.
- **Ajustes que fiz:** nenhum ajuste manual de código nesta etapa; revisei o relatório e a adequação do rewrite SPA para Vercel/Vite.
- **Como verifiquei:** `npm run build` concluído com sucesso; `git status` limpo após commit; push confirmado para `origin/main` (`5b3614e`).
- **O que consigo explicar:** em uma SPA com React Router, acessar `/post/:number` diretamente no servidor pode dar 404 porque o servidor procura um arquivo físico; o rewrite do Vercel redireciona essas rotas para `index.html`, permitindo que o router do cliente resolva a rota.

## Evidência 2 — Consolidação de documentação e pendências de desenvolvimento

- **Data / tarefa:** 2026-11-24 · Higiene de docs / pré-T-02
- **Prompt usado:**
  > "ok, vamos começar o desenvolvimento, leia @AGENTS.md e faça uma analize completa do projeto e primeiro identifique pendencias para o desenvolvimento do codigo se necessario, me grille" (seguido de confirmações para resolver pendências e informar repo/Figma)
- **Resultado da IA:** leu `AGENTS.md`, `docs/PRD_SPEC.md`, `docs/TECH_SPEC.md`, `docs/TASKS_SPEC.md`; mapeou estado do projeto, tarefas pendentes e riscos (rate limit da Search API, AbortController, paginação no servidor, sem token no cliente); identificou pendências (T-01, Figma, env/config, deps); consolidou `AGENTS (1).md` -> `AGENTS.md` com commit/push (`554cb37`); registrou repo de conteúdo `IsaqueCarlos28/GitHub-Blog` e link do Figma.
- **Ajustes que fiz:** informei o repositório de conteúdo e o link do Figma; decidi resolver pendências antes de iniciar T-02.
- **Como verifiquei:** `git status` confirmou o rename/consolidação; push confirmado em `origin/main`; validação manual das informações fornecidas (username/repo/Figma).
- **O que consigo explicar:** o fluxo `page → hook → service → Axios` separa responsabilidades: a página exibe, o hook controla estado/ciclo de vida, o service monta a chamada HTTP e o Axios executa; isso facilita teste, manutenção e tratamento uniforme de erros.

## Evidência 3 — Criação do conteúdo T-01 (issues do GitHub Blog)

- **Data / tarefa:** 2026-11-24 · T-01 (RF-03, RN-02)
- **Prompt usado:**
  > "sim, pode criar as 10 issues, você consegue fazer tal coisa?"
- **Resultado da IA:** verificou autenticação do GitHub CLI (`gh auth status`) e criou 10 issues autorais em Markdown no repositório `IsaqueCarlos28/GitHub-Blog`, seguindo os temas sugeridos no `TASKS_SPEC.md`; adicionou comentários em 3 issues (#2, #7, #9); validou o critério pela Search API.
- **Ajustes que fiz:** solicitei a criação e revisei que as issues cobriam os temas/formatos pedidos (React em múltiplos posts, debounce em post único, título longo, guia de Markdown, post curto, comentários).
- **Como verifiquei:** `gh issue create` retornou URLs das issues #1-#10; `gh issue comment` adicionou 3 comentários; consulta `curl.exe` à `https://api.github.com/search/issues?q=repo:IsaqueCarlos28/GitHub-Blog+is:issue&per_page=1` retornou `total_count: 10`, `incomplete_results: false`.
- **O que consigo explicar:** usar issues como posts permite consumir conteúdo real pela API pública do GitHub, com título, corpo Markdown, data, autor e contagem de comentários; a Search API com `is:issue` evita pull requests e fornece `total_count` para paginação no servidor.

## Evidência 4 — T-02: tema Tailwind v4 e limpeza do template

- **Data / tarefa:** 2026-11-24 · T-02 (RF-15, RNF-05)
- **Prompt usado:**
  > "Documente esse plano no repositorio, não precisa restrear pelo git, pode deixar como untracked..." (autorização para implementar o plano com commits semânticos por tarefa)
- **Resultado da IA:** instalou `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/typography`; configurou plugin Tailwind no `vite.config.ts`; aplicou tema TECH_SPEC §12.1 em `src/index.css` (tokens, fontes, body); removeu conteúdo demo de `App.tsx`/`App.css` e ajustou `index.html` para `pt-BR`; provou classes `bg-post`, `text-title`, `font-logo`, `prose` em build e removeu a prova.
- **Ajustes que fiz:** nenhum ajuste manual adicional nesta etapa; revisão do escopo para não antecipar T-03.
- **Como verifiquei:** `npm run build` passou após configuração e após limpeza da prova; warning de ordem de `@import` no CSS foi corrigido.
- **O que consigo explicar:** Tailwind v4 usa `@theme` para expor tokens como classes utilitárias; o plugin typography fornece a classe `prose` para estilizar Markdown/conteúdo rico.

## Evidência 5 — T-03: dependências, estrutura, config e Vitest

- **Data / tarefa:** 2026-11-24 · T-03 (RN-09, RN-10, RNF-05)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** instalou axios, react-router-dom, react-markdown, remark-gfm, date-fns e deps de teste (vitest, RTL, jest-dom, user-event, jsdom); configurou Vitest em `vite.config.ts` com `jsdom` e setup `src/test/setup.ts`; adicionou script `test`; criou `src/config/env.ts` com defaults públicos e tipagem em `src/vite-env.d.ts`; adicionou smoke test de config.
- **Ajustes que fiz:** nenhum ajuste manual adicional; mantido escopo sem criar pastas desnecessárias.
- **Como verifiquei:** `npm run test` (1 teste passando) e `npm run build` passando.
- **O que consigo explicar:** centralizar env em `config/env.ts` evita espalhar `import.meta.env` pelo app e garante que username/repo sejam configuráveis sem hardcode em componentes.

## Evidência 6 — T-04: tipos, httpClient e toAppError

- **Data / tarefa:** 2026-11-24 · T-04 (RN-08, RN-09, RF-14)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `src/types/github.ts` e `src/types/errors.ts` conforme TECH_SPEC §6; `src/services/httpClient.ts` com baseURL, headers Accept/X-GitHub-Api-Version, timeout 10000 e sem Authorization; `src/utils/toAppError.ts` mapeando cancelamento, rede, 404, rate limit e desconhecido; adicionou testes unitários de `toAppError`.
- **Ajustes que fiz:** nenhum ajuste manual adicional; verificação de que não há `any`.
- **Como verifiquei:** `npm run test` (5 testes passando) e `npm run build` passando.
- **O que consigo explicar:** o rate limit é detectado quando status é 403/429 e o header `x-ratelimit-remaining` é `0` ou a mensagem indica rate limit; o `x-ratelimit-reset` (epoch em segundos) é convertido em `Date` para informar quando tentar novamente.

## Evidência 7 — T-05: buildSearchQuery e githubApi

- **Data / tarefa:** 2026-11-24 · T-05 (RF-01/04/05/07/10, RN-03/05/06)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `src/utils/buildSearchQuery.ts` (trim, colapso de espaços, `repo:{owner}/{repo} is:issue`) com testes; criou `src/services/githubApi.ts` com `getUser`, `searchIssues`, `getIssue`, todos aceitando `AbortSignal`, usando `httpClient` e `toAppError`; `searchIssues` usa params `q, sort, order, page, per_page` e retorna `PaginatedResult`; `getIssue` trata `pull_request` como `not_found`.
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` (8 testes passando) e `npm run build` passando. Para confirmar na aba Rede: abrir DevTools > Network, disparar busca/listagem e verificar chamada para `api.github.com/search/issues` com `q` contendo `repo:IsaqueCarlos28/GitHub-Blog is:issue`.
- **O que consigo explicar:** usar `params` do Axios garante encoding correto da query; `AbortSignal` permite cancelar requisições obsoletas e evitar race condition na UI.

## Evidência 8 — T-06: estados de UI e hook useGitHubUser

- **Data / tarefa:** 2026-11-24 · T-06 (RF-13/14, RN-08)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `LoadingState`, `ErrorState` e `EmptyState` com roles/acessibilidade e estilos do TECH_SPEC; criou `useGitHubUser` com `AbortController`, cleanup, `retry` por `reloadKey`, ignorando cancelamento e terminando em `success` ou `error`.
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` e `npm run build` passando; revisão do fluxo de estados do hook.
- **O que consigo explicar:** o `AbortController` cancela a request anterior no cleanup; o hook ignora cancelamento para não tratar aborto como erro de usuário.

## Evidência 9 — T-07: Header, ProfileCard e Home com rota /

- **Data / tarefa:** 2026-11-24 · T-07 (RF-01/02/15/16)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `Header`, `ProfileCard`, `HomePage` e configurou React Router em `App.tsx` com rota `/`; integrou `useGitHubUser` com estados de loading/erro/sucesso; adicionou placeholders de ícones em `src/assets/icons`.
- **Ajustes que fiz:** nenhum ajuste manual adicional; ícones SVG do Figma ainda podem ser substituídos depois.
- **Como verifiquei:** `npm run test` e `npm run build` passando. Verificação manual esperada: Home exibe perfil real; offline no DevTools mostra `ErrorState` e "Tentar novamente" refaz a chamada.
- **O que consigo explicar:** fluxo `page → hook → service → Axios`: `HomePage` chama `useGitHubUser`, o hook controla estado/abort/retry e chama `getUser`, o service usa `httpClient` (Axios) para acessar a API do GitHub e converte erros com `toAppError`.

## Evidência 10 — T-08: utilitários e cards de issue

- **Data / tarefa:** 2026-11-24 · T-08 (RF-08, RN-07)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `stripMarkdown` e `formatRelativeDate` com testes; criou `IssueCard` e `IssueList` com layout responsivo, resumo truncado, data relativa, comentários e link para `/post/:number`.
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` (12 testes passando) e `npm run build` passando.
- **O que consigo explicar:** `stripMarkdown` remove marcações para gerar resumo limpo; `formatRelativeDate` usa `date-fns` com locale pt-BR para exibir tempo relativo.

## Evidência 11 — T-09: listagem de issues na Home

- **Data / tarefa:** 2026-11-24 · T-09 (RF-04, RN-04)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `useIssues` com AbortController/retry e integrou na `HomePage` a seção "Publicações" com contador por `total_count`, `IssueList`, loading, erro e vazio (term='' e page=1).
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` e `npm run build` passando. Verificação manual esperada: Home lista issues reais; erro simulado exibe retry.
- **O que consigo explicar:** `useIssues` reutiliza o mesmo padrão de estado do hook de perfil, mantendo consistência de loading/erro/cancelamento.

## Evidência 12 — T-10: busca com debounce e URL

- **Data / tarefa:** 2026-11-24 · T-10 (RF-05/06/16, RNF-01)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `useDebounce` com teste de fake timers; criou `SearchInput`; integrou busca na `HomePage` usando estado local -> `useDebounce` -> `q` na URL (`useSearchParams`) -> `useIssues`; reset de página ao mudar termo; limpar busca; `EmptyState` com "Limpar busca".
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` e `npm run build` passando. Verificação manual esperada: digitar rápido gera 1 chamada na aba Rede.
- **O que consigo explicar:** fluxo `texto -> debounce -> URL -> hook`: o input atualiza estado local, o debounce espera o usuário parar, o termo normalizado vai para `?q=`, e o `useIssues` reage à mudança de `q` fazendo nova busca; AbortController evita sobrescrever resultado antigo.

## Evidência 13 — T-11: paginação e testes de integração

- **Data / tarefa:** 2026-11-24 · T-11 (RF-07, RN-05)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `Pagination` com `nav` acessível, botões desabilitados nos extremos e ocultação quando `totalPages <= 1`; integrou `?page=` na Home com scroll ao topo da lista; adicionou testes de integração T-01, T-02, T-06 em `HomePage.test.tsx` com RTL, MemoryRouter e mock de `githubApi`.
- **Ajustes que fiz:** nenhum ajuste manual adicional; corrigi guard de `scrollIntoView` para compatibilidade com jsdom e tornei a asserção de T-02 robusta.
- **Como verifiquei:** `npm run test` (16 testes passando) e `npm run build` passando.
- **O que consigo explicar:** a paginação é server-side porque `page/per_page` vão na Search API e `totalPages` vem de `total_count`; a URL guarda `q` e `page`, permitindo compartilhar/restaurar estado.

## Evidência 14 — T-12: detalhe do post com Markdown

- **Data / tarefa:** 2026-11-24 · T-12 (RF-09/10/11/12, RN-07)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `useIssue` (valida número positivo, trata pull_request/not_found), `MarkdownContent` com `react-markdown` + `remark-gfm` sem `rehype-raw` e links seguros, `PostPage` com cabeçalho, metadados, Voltar/Ver no GitHub e conteúdo; adicionou rota `/post/:number`.
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` e `npm run build` passando. Verificação manual esperada: abrir post por clique e por URL direta; Voltar preserva busca/página.
- **O que consigo explicar:** o detalhe busca a issue individual por número, permitindo acesso direto por URL; o Markdown é renderizado sem HTML bruto para reduzir risco de XSS.

## Evidência 15 — T-13: rotas finais e NotFoundPage

- **Data / tarefa:** 2026-11-24 · T-13 (RF-09/16)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** criou `NotFoundPage`, adicionou rota `*` no `App.tsx` e escreveu teste T-03 para `/post/3` validando título, parágrafo, lista, link seguro, bloco de código e body nulo.
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** `npm run test` (18 testes passando) e `npm run build` passando.
- **O que consigo explicar:** a rota `*` captura URLs desconhecidas no SPA e exibe uma 404 amigável com retorno à Home.

## Evidência 16 — T-14: resiliência e teste T-04

- **Data / tarefa:** 2026-11-24 · T-14 (RF-13/14, RN-08)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** revisou Home e PostPage para 404, rate limit com horário, rede, vazio e retry; criou `Resilience.test.tsx` (T-04) cobrindo mensagens corretas e retry refazendo chamada.
- **Ajustes que fiz:** nenhum ajuste manual adicional; tornei asserções de texto/heading robustas em jsdom.
- **Como verifiquei:** `npm run test` (23 testes passando) e `npm run build` passando. Simulação manual: DevTools Offline/rede para erro de rede; bloquear request ou mockar 403 com `x-ratelimit-remaining: 0` para rate limit; acessar `/post/999` para 404.
- **O que consigo explicar:** todos os erros passam por `toAppError`, a UI mostra estado claro com retry, e AbortController evita loading infinito por resposta obsoleta.

## Evidência 17 — T-15: responsividade e acessibilidade

- **Data / tarefa:** 2026-11-24 · T-15 (RF-15/16, RNF-02/03)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** aplicou foco visível global (`:focus-visible`), ajustou uppercase/links de ação, adicionou `break-words` em título do post e revisou padrões de a11y (sr-only label, alt, roles, aria-label, landmarks, h1 único, links seguros, placeholder com `text-span`).
- **Ajustes que fiz:** nenhum ajuste manual adicional; comparação pixel-perfect com Figma e Lighthouse completo ficam como validação manual recomendada.
- **Como verifiquei:** `npm run test` e `npm run build` passando; auditoria de código contra TECH_SPEC §12.4/12.5.
- **O que consigo explicar:** acessibilidade não é só visual; labels, roles, foco e semântica permitem navegação por teclado e leitores de tela.

## Evidência 18 — T-16: validação final e divergências

- **Data / tarefa:** 2026-11-24 · T-16 (todos RF/RN/RNF)
- **Prompt usado:**
  > Continuação autorizada do plano de desenvolvimento (commits semânticos por tarefa).
- **Resultado da IA:** executou `npm run build` e `npm run test`; verificou ausência de `console.log`/`any`/`dangerouslySetInnerHTML`/`rehype-raw`; revisou divergências entre código e SPECs.
- **Ajustes que fiz:** nenhum ajuste de código adicional nesta etapa.
- **Como verifiquei:** build passou (Vite warning de chunk >500kB, sem erro); testes passaram (9 arquivos, 23 testes). `git grep` sem ocorrências de `console.log`, `any`, `dangerouslySetInnerHTML`, `rehype-raw`.
- **Divergências encontradas (propostas mínimas):**
  - `config/env.ts` usa defaults reais (`IsaqueCarlos28`/`GitHub-Blog`) em vez de placeholders `{username}/{repo}` do exemplo da TECH_SPEC §5 — **manter** (mais útil para o projeto; spec pode registrar como implementação concreta).
  - `toAppError` aceita passthrough de `AppError` — **manter** (compatível, simplifica `getIssue` pull_request).
  - `vercel.json` criado antes de T-17 — **manter** (já atende requisito de rewrite SPA).
  - Aviso de chunk >500kB no build — **opcional** otimizar em T-17/T-16.x (não é erro).
  - Validação visual Figma/Lighthouse completa — **pendente validação manual** pelo aluno.

## Evidência 19 — Correção de layout e T-17 (deploy/capturas)

- **Data / tarefa:** 2026-11-24 · Correção de layout + T-17 (RF-09/10)
- **Prompt usado:**
  > "Aqui esta as respostas: 1 - Sim, aqui o Link: https://github-blog-one-flax.vercel.app/ 2 - Configurei já 3-  Pode capturar por conta propria. Eu tambem encontrei um problema no layout... nas paginas das postagens a seção com logo e nome da aplicação ocupa muito espaço, revise o layout das paginas..." (imagem anexada; modelo sem suporte a imagem)
- **Resultado da IA:** adicionou variante `compact` no `Header` e aplicou na `PostPage` para reduzir o espaço do cover; executou build; capturou screenshots com browser local (`home.png`, `search.png`, `post.png`, `mobile.png`) e atualizou README com URL do Vercel e checklist.
- **Ajustes que fiz:** usuário reportou o problema de layout e forneceu URL do Vercel; revisão visual final no Figma/Lighthouse permanece recomendada.
- **Como verifiquei:** `npm run build` passando; screenshots geradas em `docs/screenshots/`; verificação local via navegador em `127.0.0.1:4173`. Observação: `mobile.png` foi capturado como screenshot full-page pelo browser tool disponível (sem emulação de viewport dedicada).
- **O que consigo explicar:** pequenos ajustes de layout devem preservar tokens e hierarquia visual; em páginas de detalhe, reduzir o cover melhora foco no conteúdo.

## Evidência 20 — Correção de sobreposição header/card

- **Data / tarefa:** 2026-11-25 · Correção de layout pós-T-17
- **Prompt usado:**
  > "Ainda esta errado, de uma olhada, a seçao que dis GitHub blog esta sobresaindo por cima das outras seções" (imagem anexada; modelo sem suporte a leitura da imagem)
- **Resultado da IA:** diagnosticou com `browser.evaluate` no ambiente publicado/local: `header` com `position: relative; z-index:auto; height:212` e card sobreposto com `position: static; z-index:auto; top:124` (sobreposição geométrica de 88px). Como o header é posicionado e vem antes no DOM, ele pintava por cima do card estático. Corrigiu adicionando `relative` aos wrappers/cards com margem negativa em `PostPage.tsx` e `HomePage.tsx` (LoadingState/ErrorState já tinham `relative` parcial no working tree).
- **Ajustes que fiz:** nenhum ajuste manual adicional no código; validação visual final no Vercel após redeploy fica com o usuário.
- **Como verifiquei:** `browser.evaluate` após HMR confirmou `card.pos === 'relative'`; `npm run build` e `npm run test` passaram (9 arquivos, 23 testes). Screenshot automatizado do post não pôde ser recapturado neste ambiente (browser screenshot exigiu janela visível).
- **Observação importante:** no Vercel publicado foi observado `GET https://api.github.com/repos/VITE_GITHUB_USERNAME/GitHub-Blog/issues/1 -> 404`, indicando env var `VITE_GITHUB_USERNAME` configurada com valor literal/incorreto. Usuário confirmou correção no Vercel depois.

## Evidência 21 — Recaptura de screenshots após correção

- **Data / tarefa:** 2026-11-25 · T-17 (capturas finais)
- **Prompt usado:**
  > "1 - Ja concertei no vercel 2 - Pode refazer os screenshots necessarios 3 - A revisão visual manual ja passou, falta só as outras etapas, vamos fazer elas"
- **Resultado da IA:** recapturou `docs/screenshots/home.png`, `search.png`, `post.png`, `mobile.png` a partir do ambiente publicado `https://github-blog-one-flax.vercel.app/` após o redeploy/correção.
- **Ajustes que fiz:** nenhum ajuste manual adicional.
- **Como verifiquei:** arquivos atualizados em `docs/screenshots/`; captura feita pelo browser tool contra a URL pública. `mobile.png` segue como captura full-page (limitação do tool sem emulação de viewport dedicada).

## Reflexão final

- **Onde a IA mais ajudou:** acelerar análise de SPECs, preparar configuração de deploy e executar tarefas operacionais repetitivas (criação/validação de issues).
- **Onde precisei revisar:** conferir se as mudanças respeitavam as regras inegociáveis (sem token em `VITE_*`, rewrite SPA, escopo mínimo) e se as evidências descrevem apenas o que aconteceu.
- **O que faria diferente:** registrar evidências imediatamente após cada tarefa de código, com capturas/saídas de teste anexadas ao fluxo de validação.