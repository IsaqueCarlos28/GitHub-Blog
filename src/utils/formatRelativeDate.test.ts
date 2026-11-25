import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatRelativeDate } from './formatRelativeDate'

describe('formatRelativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-24T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formata data relativa em pt-BR com sufixo', () => {
    const result = formatRelativeDate('2026-11-21T12:00:00Z')
    expect(result).toContain('há')
    expect(result.toLowerCase()).toContain('dia')
  })
})
