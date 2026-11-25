# GitHub Blog

Blog pessoal sobre a API pública do GitHub: perfil do desenvolvedor no topo, **issues** de um repositório como **posts**, busca com debounce, paginação real e leitura em Markdown. Projeto 06 (Recuperação) — disciplina SPA.

- 🔗 Aplicação: `{URL_DA_APLICACAO}`
- 🔗 Repositório de conteúdo (issues): `{URL_DO_REPO_DE_POSTS}`
- 🎨 Figma: `{LINK_DO_FIGMA}`

## Funcionalidades

Perfil real do GitHub · lista dos posts mais recentes · busca pela Search API com debounce · paginação no servidor · detalhe em `/post/:number` (funciona por URL direta) · Markdown · loading, erro, 404, vazio e rate limit com "Tentar novamente" · responsivo e acessível.

## Stack

React · Vite · TypeScript · Tailwind CSS · Axios · React Router · react-markdown (+ remark-gfm) · date-fns · Vitest + React Testing Library · OpenCode.

## Como rodar

```bash
git clone {URL_DO_REPOSITORIO} && cd github-blog
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
- [ ] Compila e navega sem erros
- [ ] Perfil real com todos os campos
- [ ] Últimos posts sem busca
- [ ] Busca pela Search API; vazio tratado
- [ ] Debounce evita chamadas excessivas
- [ ] Paginação real
- [ ] Cards com título, data, resumo e comentários
- [ ] `/post/:number` por clique e por URL direta
- [ ] Detalhe com Markdown, link externo e Voltar
- [ ] Loading, erro, 404, rate limit e retry
- [ ] Fiel ao Figma; ok em celular e desktop
- [ ] Publicado e demonstrável

## Capturas de tela

`docs/screenshots/`: `home.png` · `search.png` · `post.png` · `mobile.png`

## Uso de IA

Desenvolvido com **OpenCode**, guiado por `AGENTS.md` e pelos SPECs, em tarefas pequenas revisadas por mim. Evidências em `docs/AI_USAGE.md`.

## Autor

Isaque · `{LINK_DO_GITHUB}`
