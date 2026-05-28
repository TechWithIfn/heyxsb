import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart } from '../components/charts/BarChart'
import { LineChart } from '../components/charts/LineChart'
import { useAnalytics } from '../hooks/useAnalytics'

function ShieldIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function DownloadIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export function Analytics() {
  const { stats, exportJson, resetStats } = useAnalytics()
  const [confirmReset, setConfirmReset] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  const handleExport = useCallback(() => {
    const json = exportJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learnify-stats-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    window.setTimeout(() => setExportDone(false), 2500)
  }, [exportJson])

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetStats()
    setConfirmReset(false)
  }, [confirmReset, resetStats])

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-4xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#04AA6D] dark:text-green-400">
          Privacy-first
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Your Learning Analytics
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          Personal stats stored only in{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
            localStorage
          </code>
          . No accounts, no external trackers.
        </p>
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
          <ShieldIcon className="h-4 w-4 shrink-0" />
          Self-hosted · 100% on your device
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Page views" value={stats.totalViews} hint="Lesson opens" />
        <MetricCard
          title="Total time"
          value={stats.totalTimeFormatted}
          hint="All lessons"
        />
        <MetricCard
          title="This week"
          value={stats.weekTotalFormatted}
          hint="Last 7 days"
        />
        <MetricCard
          title="Quizzes taken"
          value={stats.quizCount}
          hint={
            stats.quizCount
              ? `${stats.quizCompletionRate}% passed (≥50%)`
              : 'Finish lesson quizzes'
          }
        />
        <MetricCard
          title="Avg quiz score"
          value={stats.quizCount ? `${stats.avgQuizPercent}%` : '—'}
          hint="Across all attempts"
        />
        <MetricCard
          title="Bookmarks"
          value={stats.bookmarksCount}
          hint={`${stats.searchCount} searches logged`}
        />
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Time spent learning this week
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Minutes per day (last 7 days)
        </p>
        <div className="mt-6 overflow-x-auto">
          <BarChart data={stats.weeklyTime} />
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Quiz scores over time
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Percent correct per quiz attempt (most recent up to 20)
        </p>
        <div className="mt-6 overflow-x-auto">
          <LineChart data={stats.quizLine} />
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Most visited lessons
        </h2>
        {stats.mostVisited.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Open a lesson to start tracking views.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
            {stats.mostVisited.map((item, i) => (
              <li key={item.key} className="flex items-center gap-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-[#048a5c] dark:bg-green-900/60 dark:text-green-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/${item.topicSlug}/${item.lessonId}`}
                    className="font-semibold text-slate-900 hover:text-[#04AA6D] dark:text-white dark:hover:text-green-400"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.topicSlug} · {item.views} views ·{' '}
                    {formatSeconds(item.timeSeconds)} reading
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {stats.recentSearches.length > 0 && (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent searches
          </h2>
          <ul className="mt-4 space-y-2">
            {stats.recentSearches.map((s, i) => (
              <li
                key={`${s.at}-${i}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/50"
              >
                <Link
                  to={`/search?q=${encodeURIComponent(s.query)}`}
                  className="font-medium text-slate-800 hover:text-[#04AA6D] dark:text-slate-200 dark:hover:text-green-400"
                >
                  &ldquo;{s.query}&rdquo;
                </Link>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {s.resultCount} results ·{' '}
                  {new Date(s.at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#04AA6D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-600 dark:hover:bg-green-500"
        >
          <DownloadIcon className="h-4 w-4" />
          {exportDone ? 'Downloaded!' : 'Export stats as JSON'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          onBlur={() => window.setTimeout(() => setConfirmReset(false), 200)}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-colors ${
            confirmReset
              ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <TrashIcon className="h-4 w-4" />
          {confirmReset ? 'Click again to confirm reset' : 'Reset all stats'}
        </button>
      </section>

      {confirmReset && (
        <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
          This permanently deletes all analytics on this device. Progress and
          bookmarks are not affected.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/progress" className="font-medium text-[#04AA6D] hover:underline dark:text-green-400">
          ← Back to Progress
        </Link>
      </p>
    </main>
  )
}

function MetricCard({ title, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  )
}

function formatSeconds(seconds) {
  if (!seconds) return '0m'
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}
