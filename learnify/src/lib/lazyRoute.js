import { lazy } from 'react'

/**
 * Retry dynamic imports (common when an old Vite dev server is still cached in the tab).
 * @param {() => Promise<{ default: React.ComponentType }>} factory
 */
export function lazyRoute(factory) {
  return lazy(async () => {
    try {
      return await factory()
    } catch (firstError) {
      if (import.meta.env.DEV) {
        await new Promise((r) => setTimeout(r, 400))
        try {
          return await factory()
        } catch {
          /* fall through */
        }
      }
      throw firstError
    }
  })
}
