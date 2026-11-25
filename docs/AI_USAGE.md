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

## Reflexão final

- **Onde a IA mais ajudou:** acelerar análise de SPECs, preparar configuração de deploy e executar tarefas operacionais repetitivas (criação/validação de issues).
- **Onde precisei revisar:** conferir se as mudanças respeitavam as regras inegociáveis (sem token em `VITE_*`, rewrite SPA, escopo mínimo) e se as evidências descrevem apenas o que aconteceu.
- **O que faria diferente:** registrar evidências imediatamente após cada tarefa de código, com capturas/saídas de teste anexadas ao fluxo de validação.