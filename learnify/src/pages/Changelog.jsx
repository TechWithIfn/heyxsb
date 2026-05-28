import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  changelogEntries,
  getVersionBadgeClass,
} from '../lib/changelog'

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function VersionBadge({ type, version, latest }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`rounded-md px-2.5 py-1 font-mono text-sm font-bold ${getVersionBadgeClass(type)}`}
      >
        v{version}
      </span>
      <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-300">
        {type}
      </span>
      {latest && (
        <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-950">
          Latest
        </span>
      )}
    </div>
  )
}

export function Changelog() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-3xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <header className="mb-12 text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#04AA6D] dark:text-green-400">
          What&apos;s new
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Release history for LearnTheory — newest updates first.
        </p>
      </header>

      <ol className="relative border-l-2 border-[#04AA6D]/30 pl-8 dark:border-green-800">
        {changelogEntries.map((entry, index) => {
          const isLatest = index === 0
          return (
            <motion.li
              key={entry.version}
              className="relative pb-12 last:pb-0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
            >
              <span
                className={`absolute -left-[2.125rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 ${
                  isLatest
                    ? 'bg-[#04AA6D] ring-4 ring-[#04AA6D]/25 dark:bg-green-500 dark:ring-green-500/30'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
                aria-hidden="true"
              />

              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/90">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <VersionBadge
                    type={entry.type}
                    version={entry.version}
                    latest={isLatest}
                  />
                  <time
                    dateTime={entry.date}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    {formatDate(entry.date)}
                  </time>
                </div>

                <ul className="mt-4 space-y-2">
                  {entry.changes.map((change) => (
                    <li
                      key={change}
                      className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#04AA6D] dark:bg-green-500"
                        aria-hidden="true"
                      />
                      {change}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          )
        })}
      </ol>

      <p className="mt-12 text-center text-sm text-slate-600 dark:text-slate-400">
        <Link to="/" className="font-semibold text-[#04AA6D] hover:underline dark:text-green-400">
          ← Back to home
        </Link>
      </p>
    </main>
  )
}
