import { describe, expect, it } from 'vitest'
import { stripMarkdown } from './stripMarkdown'

describe('stripMarkdown', () => {
  it('retorna mensagem para corpo nulo ou vazio', () => {
    expect(stripMarkdown(null)).toBe('Sem conteúdo.')
    expect(stripMarkdown('   ')).toBe('Sem conteúdo.')
  })

  it('remove markdown e colapsa espaços', () => {
    const body = '# Título\n\nTexto com **negrito**, [link](https://exemplo.com) e ![alt](img.png).\n\n- item 1\n- item 2'
    expect(stripMarkdown(body)).toBe('Título Texto com negrito, link e alt. item 1 item 2')
  })

  it('trunca com reticências', () => {
    const body = 'a'.repeat(200)
    expect(stripMarkdown(body, 20)).toBe(`${'a'.repeat(20)}…`)
  })
})
