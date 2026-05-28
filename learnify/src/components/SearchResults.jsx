import { useEffect, useMemo, useRef } from 'react'
import { trackSearch } from '../lib/analytics'
import { Link } from 'react-router-dom'
import { useSearchIndex } from '../hooks/useSearchIndex'
import {
  groupResultsByTopic,
  searchLessons,
  sortGroupedResults,
} from '../lib/search'

function TopicBadge({ title }) {
  return (
    <span className="shrink-0 rounded-md bg-[#04AA6D] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-green-700">
      {title}
    </span>
  )
}

function Excerpt({ parts }) {
  return (
    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="rounded-sm bg-yellow-200 px-0.5 font-medium text-slate-900 dark:bg-yellow-500/40 dark:text-yellow-100"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  )
}

function NoResults({ query }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800/50">
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
        No results found
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Nothing matched &ldquo;{query}&rdquo;. Try a shorter keyword, check
        spelling, or browse topics like{' '}
        <Link to="/html" className="font-medium text-[#04AA6D] hover:underline">
          HTML
        </Link>
        ,{' '}
        <Link to="/css" className="font-medium text-[#04AA6D] hover:underline">
          CSS
        </Link>
        ,{' '}
        <Link
          to="/javascript"
          className="font-medium text-[#04AA6D] hover:underline"
        >
          JavaScript
        </Link>
        , or{' '}
        <Link
          to="/python"
          className="font-medium text-[#04AA6D] hover:underline"
        >
          Python
        </Link>
        .
      </p>
      <Link
        to="/topics"
        className="mt-6 inline-flex rounded-lg bg-[#04AA6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-600"
      >
        View all tutorials
      </Link>
    </div>
  )
}

/**
 * @param {object} props
 * @param {string} props.query
 * @param {(item: object) => void} [props.onResultClick]
 * @param {boolean} [props.compact]
 */
export function SearchResults({ query, onResultClick, compact = false }) {
  const debouncedQuery = query.trim()
  const { index: searchIndex } = useSearchIndex()

  const grouped = useMemo(() => {
    if (!debouncedQuery) return []
    return sortGroupedResults(
      groupResultsByTopic(searchLessons(debouncedQuery, searchIndex)),
    )
  }, [debouncedQuery, searchIndex])

  const totalCount = grouped.reduce((n, g) => n + g.lessons.length, 0)
  const lastTrackedRef = useRef('')

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return
    if (lastTrackedRef.current === debouncedQuery) return
    lastTrackedRef.current = debouncedQuery
    trackSearch(debouncedQuery, totalCount)
  }, [debouncedQuery, totalCount])

  if (!debouncedQuery) {
    return (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Type to search lesson titles, theory, and key points across all topics.
      </p>
    )
  }

  if (grouped.length === 0) {
    return <NoResults query={debouncedQuery} />
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-8'}>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {totalCount} result{totalCount === 1 ? '' : 's'} for &ldquo;
        {debouncedQuery}&rdquo;
      </p>

      {grouped.map((group) => (
        <section key={group.topicSlug}>
          <h2
            className={`mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white ${
              compact ? 'text-sm' : 'text-lg'
            }`}
          >
            <TopicBadge title={group.topicTitle} />
            <span className="font-normal text-slate-500 dark:text-slate-400">
              ({group.lessons.length})
            </span>
          </h2>

          <ul className="space-y-2">
            {group.lessons.map((item) => (
              <li key={`${item.topicSlug}-${item.lessonId}`}>
                <Link
                  to={`/${item.topicSlug}/${item.lessonId}`}
                  onClick={() => onResultClick?.(item)}
                  className={`block rounded-xl border border-slate-200 bg-white transition-colors hover:border-[#04AA6D] hover:bg-green-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-green-600 dark:hover:bg-green-950/30 ${
                    compact ? 'px-4 py-3' : 'px-5 py-4 shadow-sm'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {!compact && (
                      <TopicBadge title={group.topicTitle} />
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  )}
                  <Excerpt parts={item.excerptParts} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
