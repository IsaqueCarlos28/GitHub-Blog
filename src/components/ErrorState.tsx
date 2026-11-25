import type { AppError } from '../types/errors'

interface ErrorStateProps {
  error: AppError
  onRetry: () => void
}

const titles: Record<AppError['kind'], string> = {
  not_found: 'Conteúdo não encontrado',
  rate_limit: 'Limite de requisições atingido',
  network: 'Erro de conexão',
  unknown: 'Erro inesperado',
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="bg-post border-border rounded-card relative border p-8 text-center"
    >
      <h2 className="text-title text-[20px] font-bold leading-[1.6]">
        {titles[error.kind]}
      </h2>
      <p className="text-text mt-2 text-[16px] leading-[1.6]">{error.message}</p>
      {error.resetAt && (
        <p className="text-span mt-2 text-[14px] leading-[1.6]">
          Tente novamente após {error.resetAt.toLocaleTimeString('pt-BR')}.
        </p>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="text-brand mt-4 text-[12px] font-bold uppercase tracking-wide hover:underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}
