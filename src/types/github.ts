export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  company: string | null;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  comments: number;
  html_url: string;
  state: 'open' | 'closed';
  user: { login: string; avatar_url: string; html_url: string } | null;
  pull_request?: unknown;
}

export interface SearchIssuesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
}
