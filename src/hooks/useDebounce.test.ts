import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('atualiza o valor apenas após o delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } },
    )

    rerender({ value: 'ab', delay: 500 })
    rerender({ value: 'abc', delay: 500 })

    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('abc')
  })
})
