# TECH_SPEC — GitHub Blog

> Referência de requisitos: `PRD_SPEC.md` (RF/RN/RNF) · v1.1

## 1. Arquitetura

SPA client-side, sem backend. Fluxo único: **page → hook → service → Axios → API do GitHub**. Páginas não chamam Axios; componentes não conhecem URLs; services não conhecem React.

## 2. Stack

| Tecnologia | Uso |
|---|---|
| Vite + React + TypeScript (`strict`) | SPA; proibido `any` sem justificativa |
| Tailwind CSS v4 + `@tailwindcss/typography` | Estilo, tema do Figma, `prose` no Markdown |
| Axios | Instância única, `AbortSignal`, timeout |
| React Router | `/`, `/post/:number`, `*`; `useSearchParams` |
| react-markdown + remark-gfm | Corpo do post, **sem** `rehype-raw` |
| date-fns (`pt-BR`) | Data relativa |
| Vitest + React Testing Library | Testes (Axios/serviço mockado com `vi.mock`) |
| OpenCode | Assistente de IA, guiado pelo `AGENTS.md` |

## 3. Decisões

**Busca e lista pela Search API (caminho único).** Sem termo: `q = repo:{owner}/{repo} is:issue`; com termo: `{termo} repo:{owner}/{repo} is:issue`; sempre `sort=created&order=desc&page&per_page`.

| Critério | Search API (escolhida) | `/repos/.../issues` (descartada) |
|---|---|---|
| Pull requests | Excluídos por `is:issue` | Vêm junto; filtrar quebra a contagem |
| Total | `total_count` → paginação exata | Sem total (parsear `Link`) |
| Código | Um caminho | Dois caminhos |
| Rate limit sem token | **10 req/min** | 60 req/h |

Mitigação do limite: debounce, cancelamento de requisições obsoletas, sem refetch automático, mensagem + retry (RF-14).

**Paginação:** `perPage` = 6 (config, sempre < 10); `totalPages = ceil(total_count / perPage)`; nova busca volta à página 1.
**Estado na URL:** `?q=termo&page=2` via `useSearchParams` (Voltar restaura busca e página). O input mantém estado local imediato e só grava `q` após o debounce.

## 4. Estrutura

```
src/
  config/env.ts            # único lugar que lê import.meta.env
  types/{github,errors}.ts
  services/{httpClient,githubApi}.ts
  hooks/{useDebounce,useGitHubUser,useIssues,useIssue}.ts
  utils/{buildSearchQuery,stripMarkdown,formatRelativeDate,toAppError}.ts
  components/{Header,ProfileCard,SearchInput,IssueCard,IssueList,Pagination,
              LoadingState,ErrorState,EmptyState,MarkdownContent}.tsx
  pages/{HomePage,PostPage,NotFoundPage}.tsx
  test/setup.ts
docs/ (PRD_SPEC, TECH_SPEC, TASKS_SPEC, AI_USAGE, screenshots/)
AGENTS.md · README.md · vercel.json | public/_redirects · .env.example
```

## 5. Configuração (RN-09, RN-10)

```ts
export const config = {
  username: import.meta.env.VITE_GITHUB_USERNAME ?? '{username}',
  repo: import.meta.env.VITE_GITHUB_REPO ?? '{repo}',
  perPage: Number(import.meta.env.VITE_POSTS_PER_PAGE ?? 6),
  debounceMs: 500,
} as const;
```

`.env.example` só com valores públicos. **Nunca** token em `VITE_*`.

## 6. Tipos

```ts
export interface GitHubUser {
  login: string; name: string | null; bio: string | null; avatar_url: string;
  html_url: string; followers: number; company: string | null;
}
export interface GitHubIssue {
  id: number; number: number; title: string; body: string | null;
  created_at: string; comments: number; html_url: string; state: 'open' | 'closed';
  user: { login: string; avatar_url: string; html_url: string } | null;
  pull_request?: unknown;
}
export interface SearchIssuesResponse { total_count: number; incomplete_results: boolean; items: GitHubIssue[] }
export interface PaginatedResult<T> { items: T[]; totalCount: number; page: number; perPage: number; totalPages: number }

export type ErrorKind = 'not_found' | 'rate_limit' | 'network' | 'unknown';
export interface AppError { kind: ErrorKind; status?: number; message: string; resetAt?: Date }
```

## 7. Serviços e erros

`httpClient`: `baseURL https://api.github.com`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`, `timeout 10000`, **sem** `Authorization`.

| Função | Requisição | Requisitos |
|---|---|---|
| `getUser(username, signal)` | `GET /users/{username}` | RF-01/02 |
| `searchIssues({term,page,perPage}, signal)` | `GET /search/issues` com `params {q, sort:'created', order:'desc', page, per_page}` → `PaginatedResult` | RF-04/05/07, RN-03/05/06 |
| `getIssue(number, signal)` | `GET /repos/{owner}/{repo}/issues/{number}` (se vier `pull_request` → `not_found`) | RF-10 |

`buildSearchQuery(term)`: `trim`, colapsa espaços, acrescenta `repo:{owner}/{repo} is:issue`.

`toAppError` (RF-13/14, RN-08):

| Condição | `kind` | Mensagem |
|---|---|---|
| `axios.isCancel` | ignorado (não é erro) | — |
| Sem `response` (offline/timeout/CORS) | `network` | "Não foi possível conectar. Verifique sua internet e tente novamente." |
| 404 | `not_found` | "Conteúdo não encontrado." |
| 403/429 **e** (`x-ratelimit-remaining === '0'` ou mensagem com "rate limit") | `rate_limit` | "Limite de requisições da API do GitHub atingido…" (+ `resetAt` de `x-ratelimit-reset`) |
| Demais | `unknown` | "Ocorreu um erro inesperado. Tente novamente." |

## 8. Hooks

Padrão: `{ data, status: 'loading'|'success'|'error', error, retry }`.

| Hook | Detalhe |
|---|---|
| `useDebounce<T>(value, delay)` | `setTimeout` + `clearTimeout` no cleanup |
| `useGitHubUser(username)` | `AbortController`; `retry` incrementa `reloadKey` |
| `useIssues({term, page})` | Reexecuta ao mudar `term/page/reloadKey`; abort no cleanup |
| `useIssue(numberParam)` | Valida inteiro positivo (senão `not_found` sem chamar API) |

```ts
useEffect(() => {
  const controller = new AbortController();
  setStatus('loading');
  fetchSomething(controller.signal)
    .then((d) => { setData(d); setStatus('success'); })
    .catch((e) => { if (axios.isCancel(e)) return; setError(toAppError(e)); setStatus('error'); });
  return () => controller.abort();   // resposta antiga nunca sobrescreve a nova
}, [deps, reloadKey]);
```

## 9. Rotas

`/` → `HomePage` (lê `q`/`page`) · `/post/:number` → `PostPage` · `*` → `NotFoundPage`. "Voltar": `navigate(-1)` se houver histórico interno, senão `/`. Em produção o host reescreve qualquer rota para `index.html`.

## 10. Componentes

| Componente | Responsabilidade | RF |
|---|---|---|
| `Header` / cover | Logo "GITHUB BLOG" e fundo decorativo | RF-15 |
| `ProfileCard` | Avatar (alt), nome (fallback `login`), bio, @login, empresa, seguidores, link GITHUB ↗ | RF-02 |
| `SearchInput` | `<label>` real, input controlado, contador `aria-live` | RF-05/16 |
| `IssueCard` / `IssueList` | Título, data relativa, resumo, comentários; `<Link to="/post/{n}">` | RF-08/09 |
| `Pagination` | Anterior/Próxima com `disabled` real, "Página X de Y", `aria-label` | RF-07 |
| `LoadingState` / `ErrorState` / `EmptyState` | `role="status"` / `role="alert"` + retry / limpar busca | RF-13/14 |
| `MarkdownContent` | `react-markdown` + `remark-gfm`; links em nova aba com `rel` seguro; `prose`; código com `overflow-x-auto`; corpo nulo → mensagem | RF-11, RN-07 |

Utilitários: `stripMarkdown(body, 160)` (remove código, imagens, links→texto, marcadores; `null` → "Sem conteúdo."), `formatRelativeDate(iso)` (date-fns `ptBR`, `addSuffix`).

## 11. Rotas de dados ↔ requisitos (rastreabilidade)

| PRD | Onde |
|---|---|
| RF-01/02 | `getUser`, `useGitHubUser`, `ProfileCard` |
| RF-03 | Repositório de conteúdo (fora do código) |
| RF-04/05/07 | `searchIssues`, `buildSearchQuery`, `useIssues`, `Pagination` |
| RF-06 | `useDebounce` |
| RF-08/09 | `IssueCard`, `stripMarkdown`, `formatRelativeDate`, rota `/post/:number` |
| RF-10/11/12 | `getIssue`, `useIssue`, `MarkdownContent`, `PostPage` |
| RF-13/14, RN-08 | `toAppError`, estados, padrão dos hooks |
| RF-15/16 | §12 |
| RN-09/10 | `httpClient`, `.env.example`, `config/env.ts` |
| RNF-01 | `AbortController`, `useDebounce` |

## 12. Design visual (Figma)

Só existe layout **desktop 1440 px** (Home e Detalhe); estados, paginação e mobile abaixo são decisões derivadas dos tokens.

### 12.1 Tokens

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#071422` | Fundo da página |
| `profile` | `#0B1B2B` | Cards de perfil/info e cover |
| `post` | `#112131` | Cards de post e bloco de código |
| `input` | `#040F1A` | Campo de busca |
| `border` | `#1C2F41` | Borda da busca e dos avisos |
| `title` | `#E7EDF4` | Títulos |
| `subtitle` | `#C4D4E3` | Info do perfil |
| `text` | `#AFC2D4` | Corpo e resumo |
| `span` | `#7B96B2` | Data, metadados, contador |
| `label` | `#3A536B` | Placeholder (ver contraste) |
| `brand` | `#3294F8` | Links, botões de texto, logo |
| Código | `#80ABD6` keyword · `#D5DCE3` texto · `#6AD445` valor · `#4F6173` comentário | Bloco de código |
| Cover | glow `#14589C` blur 106px; linhas `rgba(21,98,175,.14/.34)` 3px | Fundo decorativo |

Tipografia (Google Fonts): **Nunito** 400/700; **Coda** (logo 24px `brand`); **Fira Code** 400 (código). Escalas: Title L 24/1.3 · Title M 20/1.6 · Title S 18/1.6 · Text M 16/1.6 · Text S 14/1.6 · Link 12 bold caixa alta. Raios: card 10, input 6, código 2. Sombra de card: `0 2px 28px rgba(0,0,0,.2)`.

Tema Tailwind v4 (`src/index.css`):

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import url("https://fonts.googleapis.com/css2?family=Coda&family=Fira+Code&family=Nunito:wght@400;700&display=swap");
@theme {
  --color-bg:#071422; --color-profile:#0b1b2b; --color-post:#112131; --color-input:#040f1a;
  --color-border:#1c2f41; --color-title:#e7edf4; --color-subtitle:#c4d4e3; --color-text:#afc2d4;
  --color-span:#7b96b2; --color-label:#3a536b; --color-brand:#3294f8;
  --color-code-keyword:#80abd6; --color-code-plain:#d5dce3; --color-code-value:#6ad445; --color-code-comment:#4f6173;
  --font-sans:"Nunito",system-ui,sans-serif; --font-logo:"Coda",system-ui,sans-serif; --font-mono:"Fira Code",ui-monospace,monospace;
  --radius-card:10px; --radius-input:6px; --radius-code:2px; --shadow-card:0 2px 28px rgba(0,0,0,.2);
}
body { background-color: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
```

### 12.2 Layout (desktop)

- **Container:** `mx-auto w-full max-w-[864px] px-4 md:px-6 xl:px-0`.
- **Cover:** 296 px; logo centralizado (ícone terminal 45×40, gap 20, "GITHUB BLOG").
- **Perfil:** 864×212, `profile`, radius 10, sombra; sobrepõe o cover em 88 px (`-mt-[88px]`). Avatar 148 (radius 8) em `x=40`; nome (Title L), bio (Text M, largura 612) e linha de info (`gap 24`; ícones 18 px + texto `subtitle`: login, empresa, "N seguidores"); link **GITHUB ↗** no canto superior direito (`right 32`, `top 40`).
- **Lista:** 72 px abaixo do perfil: "Publicações" (Title S) à esquerda e contador (Text S `span`) à direita; 12 px → busca (864×50, `input`, borda `border`, radius 6, padding `12px 16px`, placeholder "Buscar conteúdo"); 48 px → grade de cards **416×260**, gap 32, 2 colunas.
- **Card:** `post`, radius 10, padding 32, altura 260; título (Title M) com data relativa (Text S `span`) à direita; resumo (Text M `text`) truncado.
- **Detalhe:** card de info 864×168 (`profile`, sobrepõe o cover): linha superior ‹ VOLTAR (esq.) e VER NO GITHUB ↗ (dir.) em Link style `brand`; título Title L (`top 71`); metadados (`top 110`, `gap 32`) com ícones 18 px em `span`: login, data, "N comentários". Conteúdo logo abaixo, sem fundo, padding `40px 32px`, `gap 24`: texto Text M `text` (links `brand` sublinhados) e bloco de código (`post`, radius 2, padding 16, Fira Code 16).
- **Ícones:** 18 px (GitHub, prédio, pessoas, calendário, balão) e 12 px (link externo, voltar). Exportar SVG do Figma para `src/assets/icons/` (não usar as URLs temporárias do conector).

### 12.3 Decisões fora do Figma

| Item | Decisão |
|---|---|
| **Comentários no card** (RF-08) | Rodapé `mt-auto pt-3` com ícone de balão 16 px + "N comentário(s)" em Text S `span`; resumo `line-clamp-3` (o Figma mostra 4) para caber nos 260 px |
| Card hover/foco | `border border-transparent hover:border-brand` + foco global `focus-visible:outline-2 outline-offset-2 outline-brand` |
| Data no mobile | Acima do título (`order-first sm:order-none`); altura `min-h-[260px]` |
| Loading | Perfil: bloco `h-[212px] bg-profile animate-pulse`; lista: 6 cards-esqueleto na grade; todos `role="status"` + `sr-only` |
| Erro | Cartão `bg-post border border-border rounded-card p-8 text-center`, `role="alert"`, título por `kind`, mensagem, horário de renovação (rate limit) e botão de texto "TENTAR NOVAMENTE" (`brand`, 12 bold, caixa alta). Sem vermelho (fora da paleta) |
| Vazio | Mesmo cartão: "Nenhum post encontrado", "Não encontramos resultados para “{termo}”" e "LIMPAR BUSCA" |
| Contador | `total_count` (não o tamanho da página), "1 publicação"/"N publicações", `aria-live="polite"` |
| Paginação | `nav aria-label="Paginação"`; botões `h-10 rounded-input border border-border bg-post px-4 text-xs font-bold uppercase text-brand`, `disabled:opacity-40 disabled:cursor-not-allowed`; "Página X de Y" em `span`; oculta se `totalPages <= 1`; ao trocar de página, rolar ao topo da lista |
| 404 | "404" em Coda `brand`, título "Página não encontrada", link "‹ VOLTAR PARA A HOME" |
| Busca em foco | `focus:border-brand` + outline `brand`; `<label className="sr-only">` |

### 12.4 Responsividade

| Elemento | < 640 px | ≥ 768 px | Desktop |
|---|---|---|---|
| Cover | `h-[220px]` | `h-[296px]` | 296 |
| Perfil | `-mt-[72px] flex-col gap-6 p-6`; avatar `size-28` | `md:-mt-[88px] md:flex-row md:p-10`; avatar 148 | igual ao Figma |
| Info do perfil / metadados | `flex-wrap gap-x-6 gap-y-2` | — | linha única |
| Grade | `grid-cols-1 gap-6` | `md:grid-cols-2 md:gap-8` | 2 colunas, gap 32 |
| Paginação | botões `flex-1`, texto em linha própria | — | centralizada |
| Detalhe | `p-6`, título `text-xl`, `break-words` | `md:p-8 md:text-2xl` | 168 px |
| Código | `overflow-x-auto` | — | `p-4` |

### 12.5 Acessibilidade e contraste

- `<label>` real na busca; `alt` descritivo no avatar; ícones decorativos `aria-hidden`; uma `<h1>` por página; landmarks `header`/`main`; links externos com `rel="noopener noreferrer"`.
- Contraste (WCAG, calculado dos hex do Figma): placeholder `#3A536B` em `#040F1A` ≈ **2,4:1 ✗** → usar `text-span` (≈ 6,3:1 ✓); comentário de código `#4F6173` em `#112131` ≈ 2,6:1 ✗ (decorativo; clarear se quiser AA); `span` em `post` ≈ 5,3:1 ✓; `brand` em `profile` ≈ 5,6:1 ✓. Confirmar com Lighthouse.

## 13. Testes (RNF-07)

| ID | Cenário | Verifica |
|---|---|---|
| T-01 | Busca com debounce: digitar rápido gera **uma** chamada com `q` correto e `page=1` (fake timers) | RF-05/06, RN-06 |
| T-02 | Paginação: `total_count=10`, `per_page=6` → "Próxima" chama `page=2`; "Anterior" desabilitado na página 1 | RF-07, RN-05 |
| T-03 | Detalhe: `/post/3` renderiza título e Markdown (lista, link com `rel`, código); `body` nulo | RF-09/10/11 |
| T-04 | Falhas: 404, 403 com `x-ratelimit-remaining: 0`, rede; retry refaz a chamada | RF-13/14, RN-08 |
| T-05 | Unitários: `buildSearchQuery`, `toAppError`, `stripMarkdown` | RN-06/07 |
| T-06 | Busca sem resultados mostra `EmptyState` | RF-13 |

Além disso: checklist manual do PRD §9 (registrado no README) e verificação em 375, 768 e 1280 px.

## 14. Deploy

`npm run build` → `dist/`. Vercel ou Netlify com **rewrite SPA obrigatório**: `vercel.json` → `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` ou `public/_redirects` → `/*  /index.html  200`. Variáveis públicas `VITE_GITHUB_USERNAME`, `VITE_GITHUB_REPO`, `VITE_POSTS_PER_PAGE` no painel do host.
