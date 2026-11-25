import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { PostPage } from './PostPage'

vi.mock('../services/githubApi', () => ({
  getUser: vi.fn(),
  searchIssues: vi.fn(),
  getIssue: vi.fn(),
}))

import { getIssue } from '../services/githubApi'

const mockedGetIssue = vi.mocked(getIssue)

const baseIssue = {
  id: 3,
  number: 3,
  title: 'Post de teste',
  created_at: '2026-11-24T12:00:00Z',
  comments: 2,
  html_url: 'https://github.com/IsaqueCarlos28/GitHub-Blog/issues/3',
  state: 'open' as const,
  user: {
    login: 'isaque',
    avatar_url: 'https://example.com/a.png',
    html_url: 'https://github.com/isaque',
  },
}

describe('PostPage T-03', () => {
  it('renderiza título, parágrafo, lista, link seguro e bloco de código', async () => {
    mockedGetIssue.mockResolvedValue({
      ...baseIssue,
      body: [
        'Parágrafo de teste.',
        '',
        '- Item da lista',
        '',
        '[Link externo](https://example.com)',
        '',
        '```ts',
        'const value = 1',
        '```',
      ].join('\n'),
    })

    render(
      <MemoryRouter initialEntries={['/post/3']}>
        <Routes>
          <Route path="/post/:number" element={<PostPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Post de teste' })).toBeInTheDocument()
    expect(screen.getByText('Parágrafo de teste.')).toBeInTheDocument()
    expect(screen.getByText('Item da lista')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'Link externo' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')

    expect(screen.getByText('const value = 1')).toBeInTheDocument()
  })

  it('mostra mensagem quando body é nulo', async () => {
    mockedGetIssue.mockResolvedValue({
      ...baseIssue,
      body: null,
    })

    render(
      <MemoryRouter initialEntries={['/post/3']}>
        <Routes>
          <Route path="/post/:number" element={<PostPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Este post não possui conteúdo.')).toBeInTheDocument()
  })
})
