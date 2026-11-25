import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatRelativeDate(iso: string): string {
  return formatDistanceToNow(new Date(iso), {
    addSuffix: true,
    locale: ptBR,
  })
}
