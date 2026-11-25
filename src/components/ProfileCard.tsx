import type { GitHubUser } from '../types/github'

interface ProfileCardProps {
  user: GitHubUser
}

function InfoItem({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <span className="text-subtitle inline-flex items-center gap-2 text-[16px] leading-[1.6]">
      <span aria-hidden className="text-span inline-flex h-[18px] w-[18px] items-center justify-center">
        {children}
      </span>
      <span>{label}</span>
    </span>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h.01M9 13h.01M9 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
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

export function ProfileCard({ user }: ProfileCardProps) {
  const name = user.name ?? user.login
  const bio = user.bio ?? 'Este usuário não possui bio.'
  const company = user.company ?? 'Não informado'
  const followersLabel = `${user.followers} ${user.followers === 1 ? 'seguidor' : 'seguidores'}`

  return (
    <section className="bg-profile rounded-card shadow-card relative mx-auto -mt-[72px] flex w-full max-w-[864px] flex-col gap-6 p-6 md:-mt-[88px] md:flex-row md:gap-8 md:p-8 xl:p-8">
      <img
        src={user.avatar_url}
        alt={`Foto de perfil de ${name}`}
        className="size-28 rounded-lg object-cover md:size-[148px]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-title text-[24px] font-bold leading-[1.3]">{name}</h1>
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand inline-flex shrink-0 items-center gap-2 text-[12px] font-bold uppercase hover:underline"
          >
            GITHUB
            <ExternalLinkIcon />
          </a>
        </div>

        <p className="text-text mt-2 max-w-[612px] text-[16px] leading-[1.6]">{bio}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <InfoItem label={user.login}>
            <GitHubIcon />
          </InfoItem>
          <InfoItem label={company}>
            <BuildingIcon />
          </InfoItem>
          <InfoItem label={followersLabel}>
            <UsersIcon />
          </InfoItem>
        </div>
      </div>
    </section>
  )
}
