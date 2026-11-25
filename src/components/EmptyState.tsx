interface EmptyStateProps {
  term: string
  onClear: () => void
}

export function EmptyState({ term, onClear }: EmptyStateProps) {
  return (
    <div className="bg-post border-border rounded-card border p-8 text-center">
      <h2 className="text-title text-[20px] font-bold leading-[1.6]">
        Nenhum post encontrado
      </h2>
      <p className="text-text mt-2 text-[16px] leading-[1.6]">
        Não encontramos resultados para “{term}”.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="text-brand mt-4 text-[12px] font-bold uppercase tracking-wide hover:underline"
      >
        Limpar busca
      </button>
    </div>
  )
}
