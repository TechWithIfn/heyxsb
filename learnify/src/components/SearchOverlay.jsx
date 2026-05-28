import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchResults } from './SearchResults'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useFocusTrap } from '../hooks/useFocusTrap'

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const panelRef = useFocusTrap(open)
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm dark:bg-black/80"
            aria-label="Close search"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-4 pb-8 pt-20 sm:px-6 sm:pt-24"
            role="dialog"
            aria-modal="true"
            aria-label="Search lessons"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-200">
                Search LearnTheory
              </p>
              <div className="flex items-center gap-2">
                <Link
                  to="/search"
                  onClick={onClose}
                  className="text-xs font-medium text-slate-200 hover:text-white"
                >
                  Full page →
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
                  aria-label="Close search"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative shrink-0">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <label htmlFor="overlay-lesson-search" className="sr-only">
                Search lessons
              </label>
              <input
                id="overlay-lesson-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lessons…"
                autoComplete="off"
                className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-12 text-lg text-slate-900 shadow-2xl placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#04AA6D]/40 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="mt-3 shrink-0 text-center text-xs text-slate-300">
              <kbd className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
                Esc
              </kbd>{' '}
              to close ·{' '}
              <kbd className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
                Ctrl
              </kbd>
              +
              <kbd className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
                K
              </kbd>{' '}
              to open
            </p>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-xl bg-white/95 p-4 shadow-2xl dark:bg-slate-900/95 sm:p-6">
              <SearchResults
                query={debouncedQuery}
                compact
                onResultClick={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
