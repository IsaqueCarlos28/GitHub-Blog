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

## Reflexão final

- **Onde a IA mais ajudou:** acelerar análise de SPECs, preparar configuração de deploy e executar tarefas operacionais repetitivas (criação/validação de issues).
- **Onde precisei revisar:** conferir se as mudanças respeitavam as regras inegociáveis (sem token em `VITE_*`, rewrite SPA, escopo mínimo) e se as evidências descrevem apenas o que aconteceu.
- **O que faria diferente:** registrar evidências imediatamente após cada tarefa de código, com capturas/saídas de teste anexadas ao fluxo de validação.