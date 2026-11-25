import type { GitHubIssue } from '../types/github'
import { IssueCard } from './IssueCard'

interface IssueListProps {
  issues: GitHubIssue[]
}

export function IssueList({ issues }: IssueListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
