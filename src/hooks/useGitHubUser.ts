import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getUser } from '../services/githubApi'
import type { AppError } from '../types/errors'
import type { GitHubUser } from '../types/github'
import { toAppError } from '../utils/toAppError'

type Status = 'loading' | 'success' | 'error'

interface UseGitHubUserResult {
  data: GitHubUser | null
  status: Status
  error: AppError | null
  retry: () => void
}

export function useGitHubUser(username: string): UseGitHubUserResult {
  const [data, setData] = useState<GitHubUser | null>(null)
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

    getUser(username, controller.signal)
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
  }, [username, reloadKey])

  return { data, status, error, retry }
}
