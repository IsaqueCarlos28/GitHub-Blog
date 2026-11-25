import { describe, expect, it, vi } from 'vitest'

vi.mock('../config/env', () => ({
  config: {
    username: 'octocat',
    repo: 'blog',
    perPage: 6,
    debounceMs: 500,
  },
}))

import { buildSearchQuery } from './buildSearchQuery'

describe('buildSearchQuery', () => {
  it('retorna apenas qualificadores quando o termo está vazio', () => {
    expect(buildSearchQuery('')).toBe('repo:octocat/blog is:issue')
  })

  it('remove espaços extras e mantém o termo', () => {
    expect(buildSearchQuery('  react   hooks  ')).toBe('react hooks repo:octocat/blog is:issue')
  })

  it('preserva caracteres especiais do termo', () => {
    expect(buildSearchQuery('C# & .NET')).toBe('C# & .NET repo:octocat/blog is:issue')
  })
})
