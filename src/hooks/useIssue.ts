import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getIssue } from '../services/githubApi'
import type { AppError } from '../types/errors'
import type { GitHubIssue } from '../types/github'
import { toAppError } from '../utils/toAppError'

type Status = 'loading' | 'success' | 'error'

interface UseIssueResult {
  data: GitHubIssue | null
  status: Status
  error: AppError | null
  retry: () => void
}

export function useIssue(numberParam: string | undefined): UseIssueResult {
  const [data, setData] = useState<GitHubIssue | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<AppError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => {
    setReloadKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const parsed = Number(numberParam)
    const isValid = Number.isInteger(parsed) && parsed > 0

    if (!isValid) {
      setData(null)
      setError({
        kind: 'not_found',
        status: 404,
        message: 'Conteúdo não encontrado.',
      })
      setStatus('error')
      return
    }

    const controller = new AbortController()
    setStatus('loading')
    setError(null)

    getIssue(parsed, controller.signal)
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
  }, [numberParam, reloadKey])

  return { data, status, error, retry }
}
