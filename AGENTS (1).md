# AGENTS.md — GitHub Blog (instruções para o OpenCode)

Leia este arquivo inteiro antes de qualquer alteração.

## 1. Contexto

SPA **GitHub Blog**: perfil do autor + issues de um repositório público como posts, busca com debounce, paginação real e leitura em `/post/:number` com Markdown. Projeto 06 (Recuperação), disciplina SPA. **Individual**: o aluno precisa entender e explicar todo o código; você é mentor/assistente. Sem backend, banco, autenticação nem edição de posts.

**Stack:** React + Vite + TypeScript (`strict`) · Tailwind v4 (+ typography) · Axios · React Router · react-markdown + remark-gfm · date-fns (pt-BR) · Vitest + React Testing Library.

## 2. Documentação (consulte antes de alterar código)

| Documento | Para quê |
|---|---|
| `docs/PRD_SPEC.md` | O que construir (RF, RN, RNF) |
| `docs/TECH_SPEC.md` | Como construir (arquitetura, tipos, serviços, hooks, **design/Figma §12**, testes) |
| `docs/TASKS_SPEC.md` | Ordem de execução; **trabalhe só na tarefa indicada** |
| Figma | `{LINK_DO_FIGMA_PESSOAL}` (referência visual obrigatória) |

Se o código divergir dos SPECs, **pare e avise** em vez de decidir sozinho; mudanças de decisão atualizam os SPECs.

## 3. Arquitetura e convenções

- Fluxo: **page → hook → service → Axios**. Páginas e componentes não chamam Axios; `App.tsx` só tem rotas/layout. Pastas em `TECH_SPEC §4`.
- TypeScript `strict`; proibido `any` (justifique se inevitável). Props tipadas, um componente por arquivo, hooks `useXxx` em `src/hooks`.
- Todo `useEffect` assíncrono usa `AbortController` e limpa no cleanup. Nenhum estado fica em `loading` sem caminho para `success`/`error`.
- Textos da interface em **pt-BR**. Estilo só com Tailwind e tokens do tema; mobile-first.

## 4. Regras inegociáveis

1. Perfil e posts **sempre** vêm da API do GitHub (RN-01).
2. Lista e busca pela Search API com `repo:{owner}/{repo} is:issue`; paginação **no servidor** com `page`/`per_page`; query via `params` do Axios (RN-03/05/06).
3. **Nunca** token, segredo ou header `Authorization` no projeto, README ou `VITE_*` (RN-09).
4. `username` e `repo` só em `src/config/env.ts` (RN-10).
5. Markdown **sem** `rehype-raw` e sem `dangerouslySetInnerHTML`; links externos com `rel="noopener noreferrer"` (RNF-04).
6. Todo erro HTTP passa por `toAppError` e é exibido com retry (RN-08).

## 5. Como trabalhar

- **Uma tarefa pequena por vez** (a próxima pendente do `TASKS_SPEC.md`). Não construa o projeto inteiro de uma vez.
- Antes de codar: diga a tarefa, os arquivos que vai tocar, os critérios de aceite e como testar.
- Explique cada decisão em linguagem simples, para o aluno validar e defender na apresentação.
- Mudanças mínimas: não refatore nem formate fora do escopo. Não instale dependências fora da stack sem pedir. Se estiver ambíguo, pergunte.
- Concluída a tarefa: `npm run build` e `npm test` sem erros, sem `console.log`; liste arquivos alterados, como verificar manualmente e o que foi testado. A validação final é do aluno.
- **Commit** por tarefa, semântico, citando o ID: `feat: adiciona useDebounce e integra na busca (T-10, RF-06)`. Nunca commitar `node_modules`, `.env` com segredos ou tokens.
- Ajude a registrar evidências em `docs/AI_USAGE.md` apenas com o que de fato aconteceu.

## 6. Prompts em ordem

> Cole **um por vez**, revise o resultado antes de aceitar e commite. T-01 e T-18 são manuais. Se o OpenCode sair do escopo: *"Reverta o que está fora da tarefa atual e mantenha apenas o pedido."*

### Prompt 0 — contexto (uma vez por sessão)
```text
Atue como mentor de React, TypeScript e Tailwind neste projeto GitHub Blog. Leia AGENTS.md, docs/PRD_SPEC.md, docs/TECH_SPEC.md e docs/TASKS_SPEC.md. Mapeie componentes, dependências técnicas e riscos de uso da API do GitHub. Planeje apenas a próxima tarefa pequena, com critérios de aceite e testes. Não construa o projeto inteiro de uma vez; explique cada decisão para eu validá-la.
```

### T-02 — Projeto e tema
```text
Tarefa T-02. Crie o projeto com Vite + React + TypeScript (template react-ts) na raiz atual, com "strict": true; remova o conteúdo de demonstração. Instale e configure Tailwind CSS v4 para Vite e @tailwindcss/typography. Aplique em src/index.css o tema da TECH_SPEC §12.1 (cores, fontes Nunito/Coda/Fira Code, raios, sombra; fundo do body e fonte padrão). Prove com uma classe de teste em App.tsx e depois remova. Não crie outras pastas nem instale outras dependências.
Critério: `npm run dev` abre; bg-post, text-title, font-logo e prose funcionam; build passa.
```

### T-03 — Dependências, estrutura e config
```text
Tarefa T-03. Instale axios, react-router-dom, react-markdown, remark-gfm, date-fns e, para testes, vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event e jsdom (configure Vitest no vite.config.ts com jsdom e setup em src/test/setup.ts; script "test"). Crie a estrutura de pastas da TECH_SPEC §4 apenas com o necessário agora, src/config/env.ts conforme TECH_SPEC §5 (tipando import.meta.env em vite-env.d.ts) e .env.example só com valores públicos; confirme .env no .gitignore.
Critério: `npm test` executa; config exporta username, repo, perPage e debounceMs; build passa.
```

### T-04 — Tipos, HTTP e erros
```text
Tarefa T-04. Crie src/types/github.ts e src/types/errors.ts exatamente como na TECH_SPEC §6; src/services/httpClient.ts (Axios: baseURL, headers Accept e X-GitHub-Api-Version, timeout 10000, SEM Authorization); e src/utils/toAppError.ts seguindo a tabela da TECH_SPEC §7 (cancelamento identificável e não tratado como erro; mensagens em pt-BR; resetAt a partir de x-ratelimit-reset). Escreva testes unitários de toAppError: 404, 403 com x-ratelimit-remaining 0, sem resposta (rede) e desconhecido.
Critério: sem any; testes passam. Explique como o rate limit é detectado.
```

### T-05 — Serviços da API
```text
Tarefa T-05. Crie src/utils/buildSearchQuery.ts (trim, colapsar espaços, acrescentar `repo:{owner}/{repo} is:issue`) e src/services/githubApi.ts com getUser, searchIssues e getIssue, todas com AbortSignal, conforme TECH_SPEC §7. searchIssues usa GET /search/issues com params { q, sort: 'created', order: 'desc', page, per_page } e retorna PaginatedResult (totalPages = ceil(total_count / perPage)); getIssue trata resposta com pull_request como not_found. Erros saem convertidos por toAppError. Escreva testes unitários de buildSearchQuery (vazio, espaços extras, caracteres especiais). Não crie hooks nem componentes.
Critério: testes passam; explique como confirmar as chamadas na aba Rede.
```

### T-06 — Estados e hook do perfil
```text
Tarefa T-06. Crie LoadingState (esqueleto, role="status", texto sr-only), ErrorState (recebe AppError e onRetry; role="alert"; título por kind; horário de renovação se houver resetAt; botão "TENTAR NOVAMENTE") e EmptyState (term e onClear) seguindo TECH_SPEC §12.3; e src/hooks/useGitHubUser.ts no padrão da TECH_SPEC §8 (status, data, error, retry, AbortController com cleanup, ignora cancelamento). Não integre em páginas ainda.
Critério: componentes isolados e tipados; todo caminho do hook termina em success ou error.
```

### T-07 — Perfil na Home
```text
Tarefa T-07. Crie Header (cover 296px com logo, glow e linhas decorativas conforme TECH_SPEC §12.2), ProfileCard (avatar com alt, nome com fallback para login, bio com fallback, @login, empresa, seguidores, link GITHUB ↗ em nova aba com rel seguro) e HomePage com Header + ProfileCard + estados do useGitHubUser; configure o React Router em App.tsx só com "/". Use main/header e uma única h1. Os SVGs de ícones estarão em src/assets/icons (se faltarem, use placeholders e avise).
Critério: perfil real na Home; com DevTools offline aparece ErrorState e o botão refaz a chamada. Explique o fluxo page → hook → service.
```

### T-08 — Utilitários e cards
```text
Tarefa T-08. Crie src/utils/stripMarkdown.ts (remove blocos de código, imagens, links [t](u) → t, marcadores #, *, _, >, listas; colapsa espaços; trunca ~160 chars com "…"; null/vazio → "Sem conteúdo."), src/utils/formatRelativeDate.ts (date-fns, ptBR, addSuffix) com testes; e IssueCard/IssueList conforme TECH_SPEC §12.2/12.3 (card inteiro é <Link to={`/post/${number}`}>, título 2 linhas, data, resumo line-clamp-3, rodapé com comentários no singular/plural, hover com borda brand; grade 1 coluna no mobile e 2 a partir de md). Não integre na Home ainda.
```

### T-09 — Listagem na Home
```text
Tarefa T-09. Crie src/hooks/useIssues.ts ({ term, page } → status, data PaginatedResult, error, retry; AbortController com cleanup) e integre na HomePage: sem termo, mostra as últimas issues (ordem decrescente) com IssueList, título "Publicações" e contador baseado em total_count, usando LoadingState (6 esqueletos), ErrorState e EmptyState. Ainda sem busca nem paginação (term='' e page=1).
Critério: posts reais; erro simulado mostra ErrorState com retry.
```

### T-10 — Busca com debounce
```text
Tarefa T-10. Crie src/hooks/useDebounce.ts (genérico, setTimeout com clearTimeout) com teste de fake timers, e SearchInput (label sr-only "Buscar conteúdo", placeholder text-span, foco com borda brand). Integre na HomePage: texto em estado local → useDebounce(config.debounceMs) → grava `q` com useSearchParams → useIssues; mudar o termo reseta page para 1; limpar volta às últimas issues; sem resultado mostra EmptyState com "Limpar busca". Garanta que a resposta de uma busca antiga nunca sobrescreve a nova (abort + ignorar cancelamento).
Critério: digitar rápido gera UMA chamada à Search API (aba Rede). Explique o fluxo texto → debounce → URL → hook.
```

### T-11 — Paginação e testes
```text
Tarefa T-11. Crie Pagination conforme TECH_SPEC §12.3 (nav aria-label, "Anterior"/"Próxima" com aria-label e disabled real, "Página X de Y", oculta se totalPages <= 1) e integre com `page` na URL e perPage de config (6); ao trocar de página, role ao topo da lista. Escreva testes de integração (Vitest + RTL, githubApi mockado, MemoryRouter): T-01 debounce com uma só chamada e q correto; T-02 com total_count=10 e perPage=6 "Próxima" busca page=2 e "Anterior" está desabilitado na página 1; T-06 busca sem resultados mostra EmptyState.
Critério: `npm test` passa.
```

### T-12 — Detalhe do post
```text
Tarefa T-12. Crie src/hooks/useIssue.ts (valida inteiro positivo, senão not_found sem chamar a API; getIssue com AbortController e retry), MarkdownContent (react-markdown + remark-gfm, SEM rehype-raw; links em nova aba com rel seguro; prose; blocos de código com overflow-x-auto; body nulo → "Este post não possui conteúdo.") e PostPage em /post/:number com card de info (Voltar com navigate(-1) ou "/" se não houver histórico, Ver no GitHub, título h1, autor, data relativa, comentários) e conteúdo, conforme TECH_SPEC §12.2. 404 do post mostra "Post não encontrado" com link para a Home.
Critério: funciona por clique e por URL direta; Voltar preserva busca e página.
```

### T-13 — Rotas finais e teste do detalhe
```text
Tarefa T-13. Finalize as rotas em App.tsx ("/", "/post/:number", "*") com NotFoundPage conforme TECH_SPEC §12.3 e layout comum. Escreva o teste T-03: rota /post/3 com MemoryRouter e getIssue mockado verificando título, parágrafo, item de lista, link com rel seguro e bloco de código; inclua body nulo.
Critério: URL desconhecida mostra a 404; teste passa.
```

### T-14 — Resiliência
```text
Tarefa T-14. Revise Home e PostPage para 404, rate limit (com horário de renovação), rede e vazio, todos com "Tentar novamente" funcional e sem loading infinito; liste como simular cada cenário (DevTools offline, bloquear request, URL inexistente) e corrija o que faltar sem mudar o escopo. Escreva o teste T-04: 404, 403 com x-ratelimit-remaining=0 e erro de rede mostram a mensagem correta e o retry refaz a chamada (Home e PostPage).
```

### T-15 — Figma, responsividade e acessibilidade
```text
Tarefa T-15. Compare Home e Detalhe com o Figma e ajuste cores, tipografia, espaçamentos, raios e sombras apenas com tokens/classes Tailwind (liste cada ajuste). Aplique a responsividade da TECH_SPEC §12.4 (375, 768, 1280) sem rolagem horizontal e com títulos longos quebrando bem. Faça auditoria de acessibilidade (TECH_SPEC §12.5): label na busca, alt do avatar, foco visível, role="alert"/"status", aria-label na paginação, uma h1 por página, landmarks, contraste (placeholder com text-span) e navegação completa por teclado. Liste problemas e correções. Não altere lógica.
```

### T-16 — Validação
```text
Tarefa T-16. Rode `npm run build` e `npm test`; corrija erros de tipo, avisos, `any` e `console.log` indevidos e mostre a saída. Depois compare o código final com os três SPECs, liste todas as divergências e proponha as edições mínimas nos documentos (sem reescrever o que continua correto). Não invente resultados.
```

### T-17 — Deploy, README e capturas
```text
Tarefa T-17. Crie a configuração de rewrite SPA para [Vercel: vercel.json | Netlify: public/_redirects] (qualquer rota → /index.html) e explique por que sem isso /post/N dá 404 em acesso direto; liste as variáveis públicas a configurar no host (sem token). Revise o README.md com base no projeto real (scripts, estrutura, decisões, links), preservando os placeholders que eu ainda preencherei e listando-os. Não invente URLs nem resultados de teste.
```

### Prompts de apoio
**Bug**
```text
Estou com este erro: [erro e comportamento esperado]. Antes de alterar código, explique a causa provável com base no que o código faz; depois proponha a menor correção e como confirmar. Não refatore fora disso.
```
**Entender o código (para a apresentação)**
```text
Explique o arquivo [caminho] como se eu fosse apresentá-lo ao professor: responsabilidade, fluxo de dados, por que foi escrito assim e 3 perguntas prováveis com respostas curtas.
```
**Revisão como QA**
```text
Revise a tarefa [T-xx] como QA: critérios do TASKS_SPEC, RF/RN do PRD_SPEC, casos de borda (nulos, lista vazia, erro, rede lenta) e acessibilidade. Liste problemas por gravidade, sem corrigir ainda.
```
**Evidência para AI_USAGE.md**
```text
Resuma esta interação para docs/AI_USAGE.md: prompt usado, objetivo, resultado (arquivos), o que precisei ajustar e como verifiquei. Escreva apenas o que de fato aconteceu.
```
