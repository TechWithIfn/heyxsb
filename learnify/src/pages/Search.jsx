import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchResults } from '../components/SearchResults'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

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

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQ)
  const inputRef = useRef(null)
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [query, setSearchParams])

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-3xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <nav
        className="mb-8 text-sm text-slate-500 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-[#04AA6D] dark:hover:text-green-400">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          ›
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-200">
          Search
        </span>
      </nav>

      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Search lessons
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Full-text search across HTML, CSS, JavaScript, Python, and all other
          tutorials — entirely in your browser.
        </p>
      </div>

      <div className="relative mt-8">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, theory, key points…"
          autoComplete="off"
          className="w-full rounded-xl border-2 border-green-200 bg-white py-4 pl-12 pr-4 text-lg text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#04AA6D] focus:outline-none focus:ring-4 focus:ring-[#04AA6D]/20 dark:border-green-900 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-green-500 dark:focus:ring-green-500/20"
          aria-label="Search all lessons"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Results update as you type (300ms debounce). Searching: title, subtitle,
        theory, and key points.
      </p>

      <div className="mt-10">
        <SearchResults query={debouncedQuery} />
      </div>
    </main>
  )
}
