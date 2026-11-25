import { describe, expect, it } from 'vitest'
import { config } from './env'

describe('config', () => {
  it('exporta username, repo, perPage e debounceMs', () => {
    expect(config.username).toBeTypeOf('string')
    expect(config.repo).toBeTypeOf('string')
    expect(config.perPage).toBeTypeOf('number')
    expect(config.debounceMs).toBeTypeOf('number')
  })
})
