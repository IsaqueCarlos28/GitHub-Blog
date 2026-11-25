import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

vi.mock('../services/githubApi', () => ({
  getUser: vi.fn(),
  searchIssues: vi.fn(),
  getIssue: vi.fn(),
}))

import { getUser, searchIssues } from '../services/githubApi'

const mockedGetUser = vi.mocked(getUser)
const mockedSearchIssues = vi.mocked(searchIssues)

const mockUser = {
  login: 'octocat',
  name: 'The Octocat',
  bio: 'Bio',
  avatar_url: 'https://example.com/avatar.png',
  html_url: 'https://github.com/octocat',
  followers: 10,
  company: 'GitHub',
}

function makeIssue(number: number) {
  return {
    id: number,
    number,
    title: `Issue ${number}`,
    body: `Body ${number}`,
    created_at: '2026-11-24T12:00:00Z',
    comments: number,
    html_url: `https://github.com/IsaqueCarlos28/GitHub-Blog/issues/${number}`,
    state: 'open' as const,
    user: null,
  }
}

describe('HomePage integração', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockedGetUser.mockResolvedValue(mockUser)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('T-01: busca com debounce gera uma chamada com q correto e page=1', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    mockedSearchIssues.mockResolvedValue({
      items: [makeIssue(1)],
      totalCount: 1,
      page: 1,
      perPage: 6,
      totalPages: 1,
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>,
    )

    await screen.findByText('Issue 1')
    mockedSearchIssues.mockClear()

    mockedSearchIssues.mockResolvedValue({
      items: [makeIssue(2)],
      totalCount: 1,
      page: 1,
      perPage: 6,
      totalPages: 1,
    })

    const input = screen.getByLabelText('Buscar conteúdo')
    await user.type(input, 'react')

    await vi.advanceTimersByTimeAsync(500)

    await waitFor(() => {
      expect(mockedSearchIssues).toHaveBeenCalledTimes(1)
    })

    expect(mockedSearchIssues).toHaveBeenCalledWith(
      expect.objectContaining({ term: 'react', page: 1, perPage: 6 }),
      expect.any(AbortSignal),
    )
  })

  it('T-02: paginação com total_count=10 navega para page=2 e desabilita Anterior na página 1', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    mockedSearchIssues.mockImplementation(async ({ page }) => ({
      items: [makeIssue(page)],
      totalCount: 10,
      page,
      perPage: 6,
      totalPages: 2,
    }))

    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>,
    )

    await screen.findByText('Issue 1')
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Próxima página' }))

    const pageTwoItems = await screen.findAllByText('Issue 2')
    expect(pageTwoItems.length).toBeGreaterThan(0)
    expect(mockedSearchIssues).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, perPage: 6 }),
      expect.any(AbortSignal),
    )
  })

  it('T-06: busca sem resultados mostra EmptyState', async () => {
    mockedSearchIssues.mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      perPage: 6,
      totalPages: 0,
    })

    render(
      <MemoryRouter initialEntries={['/?q=naoexiste&page=1']}>
        <HomePage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Nenhum post encontrado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpar busca' })).toBeInTheDocument()
  })
})
