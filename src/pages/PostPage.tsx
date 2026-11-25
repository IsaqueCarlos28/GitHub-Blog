import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { Header } from '../components/Header'
import { LoadingState } from '../components/LoadingState'
import { MarkdownContent } from '../components/MarkdownContent'
import { useIssue } from '../hooks/useIssue'
import { formatRelativeDate } from '../utils/formatRelativeDate'

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PostPage() {
  const { number } = useParams<{ number: string }>()
  const navigate = useNavigate()
  const { data, status, error, retry } = useIssue(number)

  function handleBack() {
    const idx = window.history.state?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-[864px] px-4 pb-8 md:px-6 xl:px-0">
        {status === 'loading' && (
          <>
            <h1 className="sr-only">Carregando post</h1>
            <div className="mx-auto -mt-[72px] w-full max-w-[864px] md:-mt-[88px]">
              <LoadingState variant="profile" />
            </div>
          </>
        )}

        {status === 'error' && error && error.kind === 'not_found' && (
          <section className="bg-profile rounded-card shadow-card mx-auto -mt-[72px] w-full max-w-[864px] p-8 text-center md:-mt-[88px]">
            <h1 className="text-title text-[24px] font-bold leading-[1.3]">Post não encontrado</h1>
            <p className="text-text mt-2 text-[16px] leading-[1.6]">
              O post que você tentou acessar não existe ou foi removido.
            </p>
            <Link to="/" className="text-brand mt-4 inline-block text-[12px] font-bold uppercase hover:underline">
              Voltar para a Home
            </Link>
          </section>
        )}

        {status === 'error' && error && error.kind !== 'not_found' && (
          <>
            <h1 className="sr-only">Erro ao carregar post</h1>
            <div className="mx-auto -mt-[72px] w-full max-w-[864px] md:-mt-[88px]">
              <ErrorState error={error} onRetry={retry} />
            </div>
          </>
        )}

        {status === 'success' && data && (
          <>
            <section className="bg-profile rounded-card shadow-card mx-auto -mt-[72px] w-full max-w-[864px] p-6 md:-mt-[88px] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-brand inline-flex items-center gap-2 text-[12px] font-bold uppercase hover:underline"
                >
                  <span aria-hidden>&lt;</span> Voltar
                </button>
                <a
                  href={data.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand inline-flex items-center gap-2 text-[12px] font-bold uppercase hover:underline"
                >
                  VER NO GITHUB
                  <ExternalLinkIcon />
                </a>
              </div>

              <h1 className="text-title mt-5 break-words text-[20px] font-bold leading-[1.3] md:text-[24px]">
                {data.title}
              </h1>

              <div className="text-span mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[16px] leading-[1.6]">
                <span className="inline-flex items-center gap-2">
                  <GitHubIcon />
                  {data.user?.login ?? 'Desconhecido'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon />
                  {formatRelativeDate(data.created_at)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CommentIcon />
                  {data.comments} {data.comments === 1 ? 'comentário' : 'comentários'}
                </span>
              </div>
            </section>

            <article className="px-2 py-10 md:px-8">
              <MarkdownContent body={data.body} />
            </article>
          </>
        )}
      </main>
    </div>
  )
}
