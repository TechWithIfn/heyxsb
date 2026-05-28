import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { extractSlugFromPath, suggestTopics } from '../lib/suggest'

function FloatingShape({ className, delay }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  )
}

function NotFoundIllustration() {
  return (
    <div className="relative mx-auto h-48 w-48" aria-hidden="true">
      <FloatingShape
        className="absolute left-4 top-8 h-14 w-14 rounded-2xl bg-green-200/80 dark:bg-green-900/60"
        delay={0}
      />
      <FloatingShape
        className="absolute right-6 top-4 h-10 w-10 rounded-full bg-blue-200/80 dark:bg-blue-900/50"
        delay={0.5}
      />
      <motion.p
        className="absolute inset-0 flex items-center justify-center text-7xl font-black text-[#04AA6D] dark:text-green-500"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        404
      </motion.p>
      <FloatingShape
        className="absolute bottom-6 left-10 h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-700"
        delay={1}
      />
    </div>
  )
}

export function NotFound() {
  const { pathname } = useLocation()
  const attemptedSlug = extractSlugFromPath(pathname)
  const suggestions = useMemo(
    () => suggestTopics(attemptedSlug),
    [attemptedSlug],
  )

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center outline-none"
    >
      <NotFoundIllustration />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h1 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {attemptedSlug ? (
            <>
              We could not find{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">
                /{attemptedSlug}
              </code>
              . Did you mean one of these?
            </>
          ) : (
            'This page does not exist or the URL may be incorrect.'
          )}
        </p>

        {suggestions.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((topic) => (
              <li key={topic.slug}>
                <Link
                  to={`/${topic.slug}`}
                  className="inline-flex rounded-full border border-[#04AA6D] bg-green-50 px-4 py-2 text-sm font-semibold text-[#048a5c] transition-colors hover:bg-[#04AA6D] hover:text-white dark:border-green-600 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-600"
                >
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-[#04AA6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-600"
          >
            Home
          </Link>
          <Link
            to="/topics"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            All topics
          </Link>
          <Link
            to="/search"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Search lessons
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
