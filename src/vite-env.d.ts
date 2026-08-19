/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RELEASE_LANE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
