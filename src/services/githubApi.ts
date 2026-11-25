import { config } from '../config/env'
import type { AppError } from '../types/errors'
import type { GitHubIssue, GitHubUser, PaginatedResult, SearchIssuesResponse } from '../types/github'
import { buildSearchQuery } from '../utils/buildSearchQuery'
import { toAppError } from '../utils/toAppError'
import { httpClient } from './httpClient'

export async function getUser(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubUser> {
  try {
    const response = await httpClient.get<GitHubUser>(`/users/${username}`, { signal })
    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}

interface SearchIssuesParams {
  term: string
  page: number
  perPage: number
}

export async function searchIssues(
  { term, page, perPage }: SearchIssuesParams,
  signal?: AbortSignal,
): Promise<PaginatedResult<GitHubIssue>> {
  try {
    const response = await httpClient.get<SearchIssuesResponse>('/search/issues', {
      params: {
        q: buildSearchQuery(term),
        sort: 'created',
        order: 'desc',
        page,
        per_page: perPage,
      },
      signal,
    })

    const { total_count, items } = response.data
    return {
      items,
      totalCount: total_count,
      page,
      perPage,
      totalPages: Math.ceil(total_count / perPage),
    }
  } catch (error) {
    throw toAppError(error)
  }
}

export async function getIssue(
  number: number,
  signal?: AbortSignal,
): Promise<GitHubIssue> {
  try {
    const response = await httpClient.get<GitHubIssue>(
      `/repos/${config.username}/${config.repo}/issues/${number}`,
      { signal },
    )

    if (response.data.pull_request) {
      const notFound: AppError = {
        kind: 'not_found',
        status: 404,
        message: 'Conteúdo não encontrado.',
      }
      throw notFound
    }

    return response.data
  } catch (error) {
    throw toAppError(error)
  }
}
