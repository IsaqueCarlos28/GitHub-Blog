interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <nav aria-label="Paginação" className="mt-12 flex flex-wrap items-center justify-center gap-4">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={!canGoPrevious}
        onClick={() => onPageChange(page - 1)}
        className="border-border bg-post text-brand h-10 rounded-input border px-4 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-span text-[14px] leading-[1.6]">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        aria-label="Próxima página"
        disabled={!canGoNext}
        onClick={() => onPageChange(page + 1)}
        className="border-border bg-post text-brand h-10 rounded-input border px-4 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  )
}
