import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { config } from '../config/env'
import { searchIssues } from '../services/githubApi'
import type { AppError } from '../types/errors'
import type { GitHubIssue, PaginatedResult } from '../types/github'
import { toAppError } from '../utils/toAppError'

type Status = 'loading' | 'success' | 'error'

interface UseIssuesParams {
  term: string
  page: number
}

interface UseIssuesResult {
  data: PaginatedResult<GitHubIssue> | null
  status: Status
  error: AppError | null
  retry: () => void
}

export function useIssues({ term, page }: UseIssuesParams): UseIssuesResult {
  const [data, setData] = useState<PaginatedResult<GitHubIssue> | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<AppError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => {
    setReloadKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError(null)

    searchIssues({ term, page, perPage: config.perPage }, controller.signal)
      .then((response) => {
        setData(response)
        setStatus('success')
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        setError(toAppError(err))
        setStatus('error')
      })

    return () => {
      controller.abort()
    }
  }, [term, page, reloadKey])

  return { data, status, error, retry }
}
