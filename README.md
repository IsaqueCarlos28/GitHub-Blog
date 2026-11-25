# GitHub Blog

Blog pessoal sobre a API pública do GitHub: perfil do desenvolvedor no topo, **issues** de um repositório como **posts**, busca com debounce, paginação real e leitura em Markdown. Projeto 06 (Recuperação) — disciplina SPA.

- 🔗 Aplicação: https://github-blog-one-flax.vercel.app/
- 🔗 Repositório de conteúdo (issues): https://github.com/IsaqueCarlos28/GitHub-Blog/issues
- 🎨 Figma: https://www.figma.com/design/UwueQLrlNptAEGtSh2ruHm/GitHub-Blog--Community---Copy---Copy-?node-id=0-1&t=w6hJkpqs6AfNQI1W-1

## Funcionalidades

Perfil real do GitHub · lista dos posts mais recentes · busca pela Search API com debounce · paginação no servidor · detalhe em `/post/:number` (funciona por URL direta) · Markdown · loading, erro, 404, vazio e rate limit com "Tentar novamente" · responsivo e acessível.

## Stack

React · Vite · TypeScript · Tailwind CSS · Axios · React Router · react-markdown (+ remark-gfm) · date-fns · Vitest + React Testing Library · OpenCode.

## Como rodar

```bash
git clone https://github.com/IsaqueCarlos28/GitHub-Blog.git && cd GitHub-Blog
npm install
cp .env.example .env     # ajuste username e repo
npm run dev
```

| Variável pública | Descrição |
|---|---|
| `VITE_GITHUB_USERNAME` | Usuário do GitHub dono do perfil e do repositório |
| `VITE_GITHUB_REPO` | Repositório cujas issues são os posts |
| `VITE_POSTS_PER_PAGE` | Posts por página (< 10; padrão 6) |

> Nenhum token é usado nem deve ser adicionado: o app consome só a API pública.

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm test`.

## Arquitetura

`page → hook → service → Axios → API do GitHub`. Pastas: `config`, `types`, `services`, `hooks`, `utils`, `components`, `pages` (detalhes na `TECH_SPEC`).

| Uso | Requisição |
|---|---|
| Perfil | `GET /users/{username}` |
| Lista e busca | `GET /search/issues?q={termo} repo:{user}/{repo} is:issue&sort=created&order=desc&page=&per_page=` |
| Detalhe | `GET /repos/{user}/{repo}/issues/{number}` |

**Decisões:** Search API para lista e busca (exclui PRs e dá `total_count`; limite de 10 req/min mitigado com debounce, cancelamento e retry) · busca e página na URL · `AbortController` em todos os hooks · Markdown sem HTML bruto · sem token no cliente.

## Documentação

[`PRD_SPEC`](./docs/PRD_SPEC.md) · [`TECH_SPEC`](./docs/TECH_SPEC.md) (inclui design/Figma) · [`TASKS_SPEC`](./docs/TASKS_SPEC.md) · [`AGENTS.md`](./AGENTS.md) · [`AI_USAGE`](./docs/AI_USAGE.md)

## Testes e validação

Automatizados: busca com debounce, paginação, detalhe com Markdown, falhas (404 / rate limit / rede / retry), lista vazia e utilitários.

Manual (preencher ao final):
- [x] Compila e navega sem erros
- [x] Perfil real com todos os campos
- [x] Últimos posts sem busca
- [x] Busca pela Search API; vazio tratado
- [x] Debounce evita chamadas excessivas
- [x] Paginação real
- [x] Cards com título, data, resumo e comentários
- [x] `/post/:number` por clique e por URL direta
- [x] Detalhe com Markdown, link externo e Voltar
- [x] Loading, erro, 404, rate limit e retry
- [x] Fiel ao Figma; ok em celular e desktop (revisão visual/manual realizada)
- [x] Publicado e demonstrável

## Capturas de tela

`docs/screenshots/`: `home.png` · `search.png` · `post.png` · `mobile.png`

## Uso de IA

Desenvolvido com **OpenCode**, guiado por `AGENTS.md` e pelos SPECs, em tarefas pequenas revisadas por mim. Evidências em `docs/AI_USAGE.md`.

## Autor

Isaque · https://github.com/IsaqueCarlos28
