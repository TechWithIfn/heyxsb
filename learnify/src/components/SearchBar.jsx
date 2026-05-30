import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchIndex } from '../hooks/useSearchIndex'
import { groupResultsByTopic, searchLessons, searchIpuSubjects } from '../lib/search'

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

export function SearchBar({ scope } = {}) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query])

  const { index: searchIndex } = useSearchIndex()

  const results = useMemo(() => {
    if (scope && (scope.type === 'ipu' || scope.type === 'ipu-branch') && scope.branchId) {
      // semNumber may be undefined for branch-level scope
      return searchIpuSubjects(debouncedQuery, searchIndex, scope.branchId, scope.semNumber)
    }
    return searchLessons(debouncedQuery, searchIndex)
  }, [debouncedQuery, searchIndex, scope])

  const grouped = useMemo(() => groupResultsByTopic(results), [results])

  const showDropdown =
    open && debouncedQuery.trim().length > 0

  useEffect(() => {
    if (query.trim()) setOpen(true)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const first = results[0]
    if (first) {
      setQuery('')
      setOpen(false)
      if (scope && (scope.type === 'ipu' || scope.type === 'ipu-branch') && scope.branchId) {
        // topicSlug is in `ipu/{branch}/{sem}` — extract sem from the first result if available
        const parts = first.topicSlug ? first.topicSlug.split('/') : []
        const sem = scope.semNumber ?? (parts.length >= 3 ? parts[2] : '')
        navigate(`/ipu/${scope.branchId}/${sem}/${first.lessonId}`)
      } else {
        navigate(`/${first.topicSlug}/${first.lessonId}`)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md flex-1">
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="lesson-search" className="sr-only">
          Search lessons
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="lesson-search"
            type="search"
            placeholder="Search lessons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setOpen(true)}
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-[#04AA6D] focus:outline-none focus:ring-4 focus:ring-[#04AA6D]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </form>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          role="listbox"
          aria-label="Search results"
        >
          <div className="max-h-80 overflow-y-auto">
            {grouped.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No lessons found for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : (
              grouped.map((group) => (
                <div
                  key={group.topicSlug}
                  className="border-b border-slate-100 last:border-b-0 dark:border-slate-700"
                >
                  <p className="sticky top-0 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#04AA6D] dark:bg-slate-900 dark:text-emerald-400">
                    {group.topicTitle}
                  </p>
                  <ul>
                    {group.lessons.map((item) => (
                      <li key={`${item.topicSlug}-${item.lessonId}`}>
                        <Link
                          to={
                            scope && scope.type === 'ipu' && scope.branchId && scope.semNumber
                              ? `/ipu/${scope.branchId}/${scope.semNumber}/${item.lessonId}`
                              : `/${item.topicSlug}/${item.lessonId}`
                          }
                          role="option"
                          onClick={() => {
                            setQuery('')
                            setOpen(false)
                          }}
                          className="block px-4 py-3 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                        >
                          <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.matchedField === 'title' && item.excerptParts ? (
                              item.excerptParts.map((part, idx) => (
                                <span
                                  key={idx}
                                  className={part.highlight ? 'text-emerald-600 font-bold' : ''}
                                >
                                  {part.text}
                                </span>
                              ))
                            ) : (
                              item.title
                            )}
                          </span>
                          {item.subtitle && (
                            <span className="mt-1 line-clamp-1 block text-xs text-slate-500 dark:text-slate-400">
                              {item.subtitle}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
