/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_GITHUB_REPO: string;
  readonly VITE_POSTS_PER_PAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
