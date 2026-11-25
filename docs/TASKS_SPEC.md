# TASKS_SPEC — GitHub Blog

> Plano incremental · Referências: `PRD_SPEC.md`, `TECH_SPEC.md`. Os prompts de cada tarefa estão no `AGENTS.md` (seção "Prompts em ordem").

**Como usar:** execute **em ordem**, uma tarefa por vez. Ao concluir: `npm run build` (e `npm test`) sem erros, conferir no navegador, **um commit semântico** (`feat:`, `fix:`, `test:`, `docs:`…) e marcar o status.
**Definição de pronto:** critério de aceite atendido + verificação feita + commit.
**Legenda:** `[ ]` pendente · `[~]` em andamento · `[x]` concluída.
**Caminho crítico:** T-01 a T-13 e T-17 (perfil, busca paginada, detalhe, docs). Extras só no fim.

| ID | Tarefa | Pré-req. | RF/RN | Critério de pronto | Status |
|---|---|---|---|---|---|
| **T-01** | Criar repositório **público** de conteúdo e abrir **≥ 10 issues autorais** em Markdown (temas sugeridos abaixo) | — | RF-03, RN-02 | `search/issues?q=repo:{u}/{r}+is:issue` retorna `total_count ≥ 10`; sem PRs; 2–3 issues com comentário | [x] |
| **T-02** | Projeto Vite + React + TS (`strict`), Tailwind v4 + typography com tema do Figma (TECH_SPEC §12.1), Git inicial | T-01 | RF-15, RNF-05 | `npm run dev` abre; classes `bg-post`, `text-title`, `font-logo`, `prose` funcionam; build passa | [x] |
| **T-03** | Dependências (`axios`, `react-router-dom`, `react-markdown`, `remark-gfm`, `date-fns`, Vitest + RTL + jsdom), estrutura de pastas, `config/env.ts`, `.env.example` | T-02 | RN-09, RN-10, RNF-05 | `npm test` roda; `config` exporta 4 valores; `.env` no `.gitignore` | [x] |
| **T-04** | Tipos, `httpClient` (sem `Authorization`) e `toAppError` + testes unitários | T-03 | RN-08, RN-09, RF-14 | Tipos compilam; testes de 404, rate limit, rede e desconhecido passam | [x] |
| **T-05** | `buildSearchQuery` e `githubApi` (`getUser`, `searchIssues`, `getIssue`) com `AbortSignal` + testes | T-04 | RF-01/04/05/07/10, RN-03/05/06 | Chamadas reais confirmadas na aba Rede; `q` contém `repo:` e `is:issue` | [x] |
| **T-06** | `LoadingState`, `ErrorState`, `EmptyState` e hook `useGitHubUser` | T-05 | RF-13/14, RN-08 | Estados isolados e tipados; hook termina sempre em `success` ou `error` | [x] |
| **T-07** | `Header`/cover, `ProfileCard`, `HomePage` (perfil) e rota `/` | T-06 | RF-01/02/15/16 | Perfil real na Home; bio nula não quebra; erro simulado mostra retry | [x] |
| **T-08** | `stripMarkdown`, `formatRelativeDate` (+ testes), `IssueCard` e `IssueList` | T-03 | RF-08, RN-07 | Resumo limpo e truncado; "há 3 dias"; card com comentários linka `/post/:n` | [x] |
| **T-09** | `useIssues` e listagem na Home (últimas issues, ordem decrescente) | T-07, T-08 | RF-04, RN-04 | Posts reais com loading/erro/vazio funcionando | [x] |
| **T-10** | `useDebounce`, `SearchInput` e integração com `?q=` na URL; abort de requisição obsoleta | T-09 | RF-05/06/16, RNF-01 | Digitar rápido gera **1** chamada; busca antiga nunca sobrescreve a nova; vazio tratado | [x] |
| **T-11** | `Pagination` (`?page=`, `per_page`=6) + testes T-01, T-02 e T-06 | T-10 | RF-07, RN-05 | 10 issues → 2 páginas; Anterior/Próxima desabilitados nos extremos; testes passam | [x] |
| **T-12** | `useIssue`, `MarkdownContent` e `PostPage` (Voltar, Ver no GitHub, metadados) | T-05 | RF-09/10/11/12, RN-07 | Funciona por clique **e** URL direta; Markdown completo; Voltar preserva busca/página | [x] |
| **T-13** | Rotas finais, `NotFoundPage` + teste T-03 (detalhe) | T-12 | RF-09/16 | URL desconhecida mostra 404 com link; teste passa | [x] |
| **T-14** | Revisão de resiliência (404, rate limit com horário, rede, vazio, retry) + teste T-04 | T-13 | RF-13/14, RN-08 | Cenários simulados (offline, bloqueio, URL inexistente) corretos; teste passa | [x] |
| **T-15** | Fidelidade ao Figma, responsividade (375/768/1280) e acessibilidade (TECH_SPEC §12) | T-13 | RF-15/16, RNF-02/03 | Sem rolagem horizontal; foco visível; teclado completo; Lighthouse sem pendências graves | [ ] |
| **T-16** | `npm run build` + `npm test`; checklist de aceite do PRD §9; atualizar SPECs se algo mudou | T-14, T-15 | todos | Sem erros nem `any`/`console.log`; checklist no README | [ ] |
| **T-17** | Rewrite SPA, deploy (Vercel/Netlify), README final, capturas de tela (Home, busca, detalhe, mobile) | T-16 | RF-09/10 | URL pública funciona **inclusive `/post/N` direto**; ≥ 4 imagens em `docs/screenshots/` | [ ] |
| **T-18** | `AI_USAGE.md` com **≥ 3 evidências reais**; conferir repo (sem segredos/`node_modules`, commits semânticos); ensaiar a demonstração | durante todo o projeto | RN-09 | Evidências preenchidas; repositório público e limpo; demo ensaiada; links entregues no Blackboard | [ ] |

**Extras (somente após T-18):** filtro por labels · skeleton refinado · cache em memória · modo claro/escuro · E2E com Playwright.

## T-01 — Temas sugeridos para as 10 issues (escreva com suas palavras)

1. Por que estudar React vindo do Android (usa o termo "React")
2. `useState` e `useEffect` na prática (código, tabela)
3. Debounce na busca (único post com "debounce")
4. Axios com TypeScript (links, código)
5. Git: commits pequenos e mensagens claras (listas)
6. Organização de projeto front-end em camadas (**título longo**, para testar quebra de linha)
7. Guia de Markdown (listas, citação, tabela, tarefas, código, link — teste de renderização)
8. Props e componentes (termo "React")
9. Responsividade com Tailwind (tabela, opcionalmente uma imagem)
10. Primeiro post: bem-vindo ao blog (**curto**)

Dicas: repetir "React" em 3–4 posts (busca com vários resultados); fechar 1–2 issues; confirmar que `search/issues` mostra `total_count: 10`.

## Roteiro da demonstração (resumo)

1. Perfil real e últimos posts → 2. Busca (aba Rede mostra **1** chamada) e busca sem resultado → 3. Paginação → 4. Abrir post (Markdown, Ver no GitHub, Voltar) e colar `/post/N` direto → 5. 404 e simulação de erro/rate limit → 6. Mobile (375 px) → 7. Explicar hooks, `AbortController`, `toAppError`, Router, TypeScript e as SPECs.

**Perguntas prováveis:** por que `AbortController`? por que Search API e paginação no servidor? como o debounce funciona e por que o cleanup? como o rate limit é detectado? por que Markdown sem HTML bruto? por que `q` e `page` na URL? como usar token com segurança (resposta: só com backend/proxy)?
