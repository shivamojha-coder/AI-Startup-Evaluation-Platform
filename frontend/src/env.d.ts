/// <reference types="vite/client" />

/**
 * Type-safe access to Vite environment variables via `import.meta.env`.
 *
 * Vite only exposes variables prefixed with VITE_ to client code.
 * @see https://vite.dev/guide/env-and-mode
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
