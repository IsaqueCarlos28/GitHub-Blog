import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { toAppError } from './toAppError'

function makeResponse(
  status: number,
  headers: Record<string, string> = {},
  data: unknown = {},
): AxiosResponse {
  return {
    status,
    statusText: '',
    headers,
    config: {} as InternalAxiosRequestConfig,
    data,
  }
}

describe('toAppError', () => {
  it('converte 404 em not_found', () => {
    const error = new AxiosError('Not found', 'ERR_BAD_REQUEST', undefined, undefined, makeResponse(404))
    const appError = toAppError(error)

    expect(appError.kind).toBe('not_found')
    expect(appError.status).toBe(404)
    expect(appError.message).toBe('Conteúdo não encontrado.')
  })

  it('converte 403 com x-ratelimit-remaining 0 em rate_limit', () => {
    const error = new AxiosError(
      'rate limit',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      makeResponse(403, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1716500000' }),
    )
    const appError = toAppError(error)

    expect(appError.kind).toBe('rate_limit')
    expect(appError.status).toBe(403)
    expect(appError.message).toContain('Limite de requisições da API do GitHub atingido.')
    expect(appError.resetAt).toBeInstanceOf(Date)
  })

  it('converte erro sem resposta em network', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK')
    const appError = toAppError(error)

    expect(appError.kind).toBe('network')
    expect(appError.message).toBe(
      'Não foi possível conectar. Verifique sua internet e tente novamente.',
    )
  })

  it('converte erro desconhecido em unknown', () => {
    const appError = toAppError(new Error('boom'))

    expect(appError.kind).toBe('unknown')
    expect(appError.message).toBe('Ocorreu um erro inesperado. Tente novamente.')
  })
})
