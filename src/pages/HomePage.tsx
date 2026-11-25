import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Header } from '../components/Header'
import { IssueList } from '../components/IssueList'
import { LoadingState } from '../components/LoadingState'
import { ProfileCard } from '../components/ProfileCard'
import { config } from '../config/env'
import { useGitHubUser } from '../hooks/useGitHubUser'
import { useIssues } from '../hooks/useIssues'

export function HomePage() {
  const profile = useGitHubUser(config.username)
  const issues = useIssues({ term: '', page: 1 })

  const publicationsLabel =
    issues.data?.totalCount === 1 ? '1 publicação' : `${issues.data?.totalCount ?? 0} publicações`

  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-[864px] px-4 pb-8 md:px-6 xl:px-0">
        {profile.status === 'loading' && (
          <>
            <h1 className="sr-only">GitHub Blog</h1>
            <div className="mx-auto -mt-[72px] w-full max-w-[864px] md:-mt-[88px]">
              <LoadingState variant="profile" />
            </div>
          </>
        )}

        {profile.status === 'error' && profile.error && (
          <>
            <h1 className="sr-only">GitHub Blog</h1>
            <div className="mx-auto -mt-[72px] w-full max-w-[864px] md:-mt-[88px]">
              <ErrorState error={profile.error} onRetry={profile.retry} />
            </div>
          </>
        )}

        {profile.status === 'success' && profile.data && <ProfileCard user={profile.data} />}

        <section className="mt-[72px]">
          <div className="mb-12 flex items-center justify-between gap-4">
            <h2 className="text-subtitle text-[18px] font-bold leading-[1.6]">Publicações</h2>
            <span aria-live="polite" className="text-span text-[14px] leading-[1.6]">
              {issues.status === 'success' ? publicationsLabel : ''}
            </span>
          </div>

          {issues.status === 'loading' && <LoadingState variant="list" />}

          {issues.status === 'error' && issues.error && (
            <ErrorState error={issues.error} onRetry={issues.retry} />
          )}

          {issues.status === 'success' && issues.data && issues.data.items.length === 0 && (
            <EmptyState term="" onClear={issues.retry} />
          )}

          {issues.status === 'success' && issues.data && issues.data.items.length > 0 && (
            <IssueList issues={issues.data.items} />
          )}
        </section>
      </main>
    </div>
  )
}
