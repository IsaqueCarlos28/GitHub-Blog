export const config = {
  username: import.meta.env.VITE_GITHUB_USERNAME ?? 'IsaqueCarlos28',
  repo: import.meta.env.VITE_GITHUB_REPO ?? 'GitHub-Blog',
  perPage: Number(import.meta.env.VITE_POSTS_PER_PAGE ?? 6),
  debounceMs: 500,
} as const;
