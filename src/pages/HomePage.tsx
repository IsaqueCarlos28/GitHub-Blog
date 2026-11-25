import { ErrorState } from '../components/ErrorState'
import { Header } from '../components/Header'
import { LoadingState } from '../components/LoadingState'
import { ProfileCard } from '../components/ProfileCard'
import { config } from '../config/env'
import { useGitHubUser } from '../hooks/useGitHubUser'

export function HomePage() {
  const { data, status, error, retry } = useGitHubUser(config.username)

  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-[864px] px-4 pb-8 md:px-6 xl:px-0">
        {status === 'loading' && (
          <>
            <h1 className="sr-only">GitHub Blog</h1>
            <div className="mx-auto -mt-[72px] w-full max-w-[864px] md:-mt-[88px]">
              <LoadingState variant="profile" />
            </div>
          </>
        )}

        {status === 'error' && error && (
          <>
            <h1 className="sr-only">GitHub Blog</h1>
            <div className="mx-auto -mt-[72px] w-full max-w-[864px] md:-mt-[88px]">
              <ErrorState error={error} onRetry={retry} />
            </div>
          </>
        )}

        {status === 'success' && data && <ProfileCard user={data} />}
      </main>
    </div>
  )
}
