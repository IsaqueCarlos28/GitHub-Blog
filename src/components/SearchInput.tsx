interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="search-posts" className="sr-only">
        Buscar conteúdo
      </label>
      <input
        id="search-posts"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar conteúdo"
        className="bg-input border-border text-text placeholder:text-span focus:border-brand focus:outline-brand h-[50px] w-full rounded-input border px-4 py-3 text-[16px] leading-[1.6] focus:outline focus:outline-1"
      />
    </div>
  )
}
