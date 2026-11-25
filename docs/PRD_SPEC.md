# PRD_SPEC — GitHub Blog

> Projeto 06 (Recuperação) · Disciplina SPA · Autor: Isaque · v1.1

## 1. Contexto e objetivo

As **issues** de um repositório do GitHub têm título, data, autor, comentários e corpo em Markdown: a estrutura de um post. O **GitHub Blog** transforma um repositório público em blog pessoal: perfil do autor no topo, issues como posts, busca paginada e leitura completa em rota própria, **sem backend**.

**Objetivo do produto:** SPA que consome a API pública do GitHub para mostrar perfil, listar posts, buscar com paginação e ler o post completo.
**Objetivo acadêmico:** consolidar componentes, hooks, TypeScript, Axios, React Router, Markdown, responsividade, acessibilidade, Git e uso crítico de IA (OpenCode).
**Sucesso:** os três fluxos centrais funcionam com dados reais (perfil, busca paginada, detalhe), ≥ 10 issues autorais, app publicada, docs entregues, nota ≥ 7,1.

## 2. Escopo

**Dentro:** Home (perfil, busca, grade, paginação), detalhe `/post/:number`, 404, consumo da API do GitHub, estados de loading/erro/vazio/rate limit, layout fiel ao Figma e responsivo, repositório de conteúdo com ≥ 10 issues.
**Fora:** backend, banco, autenticação/token, criar/editar posts, comentários na aplicação (só contagem e link), IA dentro do produto.
**Extras (só depois dos obrigatórios):** filtro por labels, cache da última resposta, modo claro/escuro, E2E.

## 3. Fluxos

**Principal:** Home → (opcional) digitar busca → lista filtrada/paginada → clicar no card → `/post/:number` → Voltar (busca e página preservadas).

| Cenário | Comportamento |
|---|---|
| Busca sem resultado | "Nenhum post encontrado" + limpar busca |
| Erro de rede | Mensagem + **Tentar novamente** |
| Rate limit (403/429) | Mensagem do limite (+ horário de renovação) + retry |
| Acesso direto a `/post/42` | Issue buscada individualmente |
| `/post/999` inexistente | "Post não encontrado" + link para Home |
| URL desconhecida | 404 da aplicação |
| Campo nulo (bio/nome) | Fallback textual |

## 4. Requisitos funcionais

| ID | Requisito | Aceite |
|---|---|---|
| RF-01 | Consumir perfil via `GET /users/{username}` | Dados reais na Home |
| RF-02 | Exibir avatar, nome, bio, @login, empresa, seguidores e link do perfil | Todos os campos; nulos com fallback |
| RF-03 | Repositório público do blog com issues | **≥ 10 issues autorais** em Markdown |
| RF-04 | Listar as issues mais recentes com busca vazia | Ordem decrescente de criação |
| RF-05 | Busca textual via Search API | Termo consultado na API, não em lista local |
| RF-06 | Debounce na busca (400–600 ms) | Sem chamada por tecla; nova busca volta à página 1 |
| RF-07 | Paginação de posts e resultados | Anterior/Próxima; `per_page` < 10 prova 2+ páginas |
| RF-08 | Cards de issue | Título, data relativa, resumo (3 linhas) e nº de comentários |
| RF-09 | Detalhe em `/post/:number` | Navega sem reload |
| RF-10 | Issue via `GET /repos/{owner}/{repo}/issues/{number}` | Funciona também por acesso direto |
| RF-11 | Corpo em Markdown | Títulos, listas, links, código, tabela |
| RF-12 | Cabeçalho do post e retorno | Título, autor, data, comentários, "Ver no GitHub", "Voltar" |
| RF-13 | Loading, erro HTTP e vazio | Cada consulta com estado claro e retry |
| RF-14 | Tratar rate limit da API | Mensagem compreensível; sem chamadas repetitivas |
| RF-15 | Interface responsiva com Tailwind, fiel ao Figma | Usável em celular, tablet e desktop, sem rolagem horizontal |
| RF-16 | Acessibilidade e navegação SPA | Nomes acessíveis, label na busca, foco visível, 404 tratado |

## 5. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | Perfil e posts vêm da API do GitHub; dados fixos não substituem chamadas |
| RN-02 | Usar repositório público do autor com ≥ 10 issues |
| RN-03 | Busca usa `is:issue` (nunca pull requests) |
| RN-04 | Lista inicial e busca usam a Search API (`repo:{owner}/{repo} is:issue`, ordem decrescente); estratégia justificada na TECH_SPEC §3 |
| RN-05 | Paginação **no servidor** (`page`/`per_page`); Anterior/Próxima desabilitados nos extremos |
| RN-06 | Query montada via `params` do Axios, com `trim` e espaços colapsados |
| RN-07 | Resumo sem Markdown cru; corpo ausente com mensagem; links externos com `rel="noopener noreferrer"` |
| RN-08 | Distinguir 404, rate limit, rede e vazio; nenhuma falha deixa loading infinito |
| RN-09 | Nenhum token no código, README, repositório ou `VITE_*`; app funciona sem token |
| RN-10 | `username` e `repo` em um único módulo de configuração |

## 6. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | Debounce e cancelamento de requisições obsoletas; busca antiga nunca sobrescreve a nova |
| RNF-02 | Layouts validados em ~375, 768 e 1280/1440 px |
| RNF-03 | Label real, foco visível, `alt` no avatar, `role="alert"` em erros, contraste AA |
| RNF-04 | Sem segredos no cliente; Markdown sem HTML bruto |
| RNF-05 | Estrutura em camadas (`pages`, `components`, `hooks`, `services`, `types`, `utils`, `config`); TypeScript `strict` |
| RNF-06 | Respeitar o limite da API pública (Search: 10 req/min; core: 60/h) |
| RNF-07 | ≥ 3 cenários de teste (busca/paginação, detalhe, falhas); build sem erros |
| RNF-08 | TECH_SPEC e TASKS_SPEC referenciam estes IDs |
| RNF-09 | Interface e datas em pt-BR |

## 7. Interface

Referência visual obrigatória: protótipo do Figma. Tokens, medidas, estados e regras responsivas estão na **TECH_SPEC §12**. Telas: Home (cover → perfil → "Publicações" + contador → busca → grade de cards → paginação) e Detalhe (cover → card de info com Voltar/Ver no GitHub, título e metadados → conteúdo em Markdown).

## 8. Riscos

| Risco | Mitigação |
|---|---|
| Rate limit durante a demonstração | Debounce, abort, mensagem + retry; ensaiar antes |
| Indexação tardia de issues novas na Search API | Criar as issues com antecedência |
| `/post/:number` dar 404 em produção | Rewrite SPA para `index.html` no deploy |
| Código de IA sem compreensão | Tarefas pequenas, revisão a cada commit, `AI_USAGE.md` |
| Prazo curto | Priorizar os três fluxos; extras por último |

## 9. Critérios de aceite

1. Projeto inicia, navega e compila sem erros.
2. Perfil real com todos os campos (RF-01/02).
3. Home lista os últimos posts sem busca (RF-04).
4. Busca pela Search API com debounce e vazio tratado (RF-05/06/13).
5. Paginação real funcionando (RF-07, RN-05).
6. Card abre `/post/:number`, inclusive por URL direta (RF-09/10).
7. Detalhe com cabeçalho, Markdown, link externo e retorno (RF-11/12).
8. Loading, erro, 404, rate limit e retry tratados (RF-13/14).
9. Fiel ao Figma e funcional em celular e desktop (RF-15/16).
10. Docs, testes, capturas e evidências de IA no repositório; app publicada e demonstrável.
