import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'
import { PostPage } from './PostPage'

vi.mock('../services/githubApi', () => ({
  getUser: vi.fn(),
  searchIssues: vi.fn(),
  getIssue: vi.fn(),
}))

import { getIssue, getUser, searchIssues } from '../services/githubApi'

const mockedGetUser = vi.mocked(getUser)
const mockedSearchIssues = vi.mocked(searchIssues)
const mockedGetIssue = vi.mocked(getIssue)

const mockUser = {
  login: 'octocat',
  name: 'The Octocat',
  bio: 'Bio',
  avatar_url: 'https://example.com/avatar.png',
  html_url: 'https://github.com/octocat',
  followers: 10,
  company: 'GitHub',
}

const mockIssue = {
  id: 3,
  number: 3,
  title: 'Post',
  body: 'Conteúdo',
  created_at: '2026-11-24T12:00:00Z',
  comments: 0,
  html_url: 'https://github.com/IsaqueCarlos28/GitHub-Blog/issues/3',
  state: 'open' as const,
  user: { login: 'octocat', avatar_url: 'https://example.com/a.png', html_url: 'https://github.com/octocat' },
}

const networkError = {
  kind: 'network' as const,
  message: 'Não foi possível conectar. Verifique sua internet e tente novamente.',
}

const rateLimitError = {
  kind: 'rate_limit' as const,
  status: 403,
  message: 'Limite de requisições da API do GitHub atingido. Tente novamente após 10:00:00.',
  resetAt: new Date('2026-11-24T13:00:00Z'),
}

const notFoundError = {
  kind: 'not_found' as const,
  status: 404,
  message: 'Conteúdo não encontrado.',
}

describe('T-04 Resiliência', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Home: erro de rede mostra mensagem e retry refaz chamada', async () => {
    const user = userEvent.setup()
    mockedGetUser.mockRejectedValueOnce(networkError).mockResolvedValueOnce(mockUser)
    mockedSearchIssues.mockResolvedValue({
      items: [mockIssue],
      totalCount: 1,
      page: 1,
      perPage: 6,
      totalPages: 1,
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Não foi possível conectar. Verifique sua internet e tente novamente.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByText('The Octocat')).toBeInTheDocument()
    expect(mockedGetUser).toHaveBeenCalledTimes(2)
  })

  it('Home: rate limit mostra mensagem e retry refaz chamada', async () => {
    const user = userEvent.setup()
    mockedGetUser.mockResolvedValue(mockUser)
    mockedSearchIssues
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValueOnce({ items: [mockIssue], totalCount: 1, page: 1, perPage: 6, totalPages: 1 })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Limite de requisições da API do GitHub atingido/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect((await screen.findAllByText('Post')).length).toBeGreaterThan(0)
    expect(mockedSearchIssues).toHaveBeenCalledTimes(2)
  })

  it('PostPage: 404 mostra mensagem correta', async () => {
    mockedGetIssue.mockRejectedValueOnce(notFoundError)

    render(
      <MemoryRouter initialEntries={['/post/999']}>
        <Routes>
          <Route path="/post/:number" element={<PostPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Post não encontrado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voltar para a Home/i })).toBeInTheDocument()
  })

  it('PostPage: rate limit mostra mensagem e retry refaz chamada', async () => {
    const user = userEvent.setup()
    mockedGetIssue.mockRejectedValueOnce(rateLimitError).mockResolvedValueOnce(mockIssue)

    render(
      <MemoryRouter initialEntries={['/post/3']}>
        <Routes>
          <Route path="/post/:number" element={<PostPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText(/Limite de requisições da API do GitHub atingido/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect((await screen.findAllByRole('heading', { name: 'Post' })).length).toBeGreaterThan(0)
    expect(mockedGetIssue).toHaveBeenCalledTimes(2)
  })

  it('PostPage: erro de rede mostra mensagem e retry refaz chamada', async () => {
    const user = userEvent.setup()
    mockedGetIssue.mockRejectedValueOnce(networkError).mockResolvedValueOnce(mockIssue)

    render(
      <MemoryRouter initialEntries={['/post/3']}>
        <Routes>
          <Route path="/post/:number" element={<PostPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Não foi possível conectar. Verifique sua internet e tente novamente.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect((await screen.findAllByRole('heading', { name: 'Post' })).length).toBeGreaterThan(0)
    expect(mockedGetIssue).toHaveBeenCalledTimes(2)
  })
})
