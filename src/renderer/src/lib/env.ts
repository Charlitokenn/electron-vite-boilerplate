/**
 * ─────────────────────────────────────────────────
 *  ENV VALIDATION
 *  Fails fast at startup with a clear error if any
 *  required environment variables are missing.
 *  Add new variables here as your app grows.
 * ─────────────────────────────────────────────────
 */

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env and fill in the values.`
    )
  }
  return value
}

export const env = {
  clerkPublishableKey: requireEnv('VITE_CLERK_PUBLISHABLE_KEY'),
  supabaseUrl: requireEnv('VITE_SUPABASE_URL'),
  supabasePublishableKey: requireEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
} as const
