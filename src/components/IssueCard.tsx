import { Link } from 'react-router-dom'
import type { GitHubIssue } from '../types/github'
import { formatRelativeDate } from '../utils/formatRelativeDate'
import { stripMarkdown } from '../utils/stripMarkdown'

interface IssueCardProps {
  issue: GitHubIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  const commentsLabel = `${issue.comments} ${issue.comments === 1 ? 'comentário' : 'comentários'}`

  return (
    <Link
      to={`/post/${issue.number}`}
      className="bg-post rounded-card border border-transparent hover:border-brand focus-visible:outline-brand flex min-h-[260px] flex-col p-8 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h3 className="text-title line-clamp-2 text-[20px] font-bold leading-[1.6]">
          {issue.title}
        </h3>
        <span className="text-span order-first shrink-0 text-[14px] leading-[1.6] sm:order-none">
          {formatRelativeDate(issue.created_at)}
        </span>
      </div>

      <p className="text-text mt-4 line-clamp-3 text-[16px] leading-[1.6]">
        {stripMarkdown(issue.body)}
      </p>

      <div className="text-span mt-auto flex items-center gap-2 pt-3 text-[14px] leading-[1.6]">
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{commentsLabel}</span>
      </div>
    </Link>
  )
}
