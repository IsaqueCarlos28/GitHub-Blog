interface LoadingStateProps {
  variant?: 'profile' | 'list'
}

export function LoadingState({ variant = 'list' }: LoadingStateProps) {
  if (variant === 'profile') {
    return (
      <div
        role="status"
        className="bg-profile rounded-card shadow-card relative h-[212px] animate-pulse"
      >
        <span className="sr-only">Carregando perfil...</span>
      </div>
    )
  }

  return (
    <div role="status" className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <span className="sr-only">Carregando publicações...</span>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-post rounded-card h-[260px] animate-pulse"
        />
      ))}
    </div>
  )
}
