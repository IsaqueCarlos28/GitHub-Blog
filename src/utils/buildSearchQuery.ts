import { config } from '../config/env'

export function buildSearchQuery(term: string): string {
  const normalized = term.trim().replace(/\s+/g, ' ')
  const qualifier = `repo:${config.username}/${config.repo} is:issue`
  return normalized ? `${normalized} ${qualifier}` : qualifier
}
