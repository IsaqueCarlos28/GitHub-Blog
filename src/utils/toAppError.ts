import axios from 'axios'
import type { AppError } from '../types/errors'

function getHeaderValue(
  headers: unknown,
  name: string,
): string | undefined {
  if (!headers || typeof headers !== 'object') return undefined
  const record = headers as Record<string, unknown>
  const value = record[name] ?? record[name.toLowerCase()]
  return typeof value === 'string' ? value : undefined
}

function parseResetAt(headers: unknown): Date | undefined {
  const reset = getHeaderValue(headers, 'x-ratelimit-reset')
  if (!reset) return undefined
  const seconds = Number(reset)
  if (!Number.isFinite(seconds)) return undefined
  return new Date(seconds * 1000)
}

export function toAppError(error: unknown): AppError {
  if (axios.isCancel(error)) {
    throw error
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const headers = error.response?.headers
    const remaining = getHeaderValue(headers, 'x-ratelimit-remaining')
    const message = typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : ''

    if (!error.response) {
      return {
        kind: 'network',
        message: 'Não foi possível conectar. Verifique sua internet e tente novamente.',
      }
    }

    if (status === 404) {
      return {
        kind: 'not_found',
        status,
        message: 'Conteúdo não encontrado.',
      }
    }

    const isRateLimit =
      (status === 403 || status === 429) &&
      (remaining === '0' || message.toLowerCase().includes('rate limit'))

    if (isRateLimit) {
      const resetAt = parseResetAt(headers)
      const resetText = resetAt
        ? ` Tente novamente após ${resetAt.toLocaleTimeString('pt-BR')}.`
        : ''
      return {
        kind: 'rate_limit',
        status,
        message: `Limite de requisições da API do GitHub atingido.${resetText}`,
        resetAt,
      }
    }

    return {
      kind: 'unknown',
      status,
      message: 'Ocorreu um erro inesperado. Tente novamente.',
    }
  }

  return {
    kind: 'unknown',
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  }
}
