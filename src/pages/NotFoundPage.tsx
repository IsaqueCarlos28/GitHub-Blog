import { Link } from 'react-router-dom'
import { Header } from '../components/Header'

export function NotFoundPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto flex w-full max-w-[864px] flex-col items-center px-4 py-20 text-center md:px-6 xl:px-0">
        <p className="font-logo text-brand text-[64px] leading-none">404</p>
        <h1 className="text-title mt-4 text-[24px] font-bold leading-[1.3]">Página não encontrada</h1>
        <p className="text-text mt-2 text-[16px] leading-[1.6]">
          A rota que você tentou acessar não existe.
        </p>
        <Link to="/" className="text-brand mt-6 text-[12px] font-bold uppercase hover:underline">
          &lt; Voltar para a Home
        </Link>
      </main>
    </div>
  )
}
