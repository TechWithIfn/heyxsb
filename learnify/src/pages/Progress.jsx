import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedCounter } from '../components/AnimatedCounter'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { useTopics } from '../context/TopicsContext'
import { LearningStatsSummary } from '../components/LearningStatsSummary'
import { useOverallProgress } from '../hooks/useProgress'

function CheckCircleIcon({ className }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3.01" />
    </svg>
  )
}

function FlameIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function OverallRing({ percent }) {
  return (
    <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className="stroke-[#04AA6D] transition-all duration-700 ease-out dark:stroke-green-500"
          strokeWidth="3"
          strokeDasharray={`${percent} 100`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-slate-900 dark:text-white">
        {percent}%
      </span>
    </div>
  )
}

export function Progress() {
  const { ensureAllTopics, version } = useTopics()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    ensureAllTopics().finally(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [ensureAllTopics, version])

  const stats = useOverallProgress()

  if (loading) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-4xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#04AA6D] dark:text-green-400">
          Your learning journey
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Progress
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-400">
          Tracked locally on this device — no account required.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CheckCircleIcon className="mx-auto h-8 w-8 text-[#04AA6D] dark:text-green-400" />
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            <AnimatedCounter value={stats.totalDone} />
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Lessons completed
          </p>
          <p className="mt-1 text-xs text-slate-400">
            of {stats.totalLessons} total
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950/40">
          <FlameIcon className="mx-auto h-8 w-8 text-orange-500" />
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            <AnimatedCounter value={stats.streakDays} />
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Day streak
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Mark lessons done to build your streak
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <OverallRing percent={stats.overallPercent} />
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            Overall complete
          </p>
        </div>
      </div>

      <div className="mt-12">
        <LearningStatsSummary />
      </div>

      <section className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
          Progress by topic
        </h2>
        <ul className="space-y-4">
          {stats.byTopic.map((topic) => (
            <li
              key={topic.slug}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-hover hover:border-emerald-500/20 dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-dark-premium dark:hover:shadow-dark-premium-hover"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    to={`/${topic.slug}`}
                    className="text-lg font-bold text-slate-850 hover:text-[#04AA6D] dark:text-white dark:hover:text-emerald-400 transition-colors"
                  >
                    {topic.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {topic.done} / {topic.total} lessons · {topic.percent}%
                  </p>
                </div>
                <span className="text-2xl font-bold text-[#04AA6D] dark:text-emerald-400">
                  {topic.percent}%
                </span>
              </div>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                role="progressbar"
                aria-valuenow={topic.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${topic.title} progress`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                  style={{ width: `${topic.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {stats.totalDone === 0 && (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
          No lessons marked complete yet. Open any lesson and click{' '}
          <strong className="text-[#04AA6D] dark:text-green-400">
            Mark as Done ✓
          </strong>
          .
        </p>
      )}

      <div className="mt-10 text-center">
        <Link
          to="/topics"
          className="inline-flex rounded-lg bg-[#04AA6D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-600 dark:hover:bg-green-500"
        >
          Browse tutorials
        </Link>
      </div>
    </main>
  )
}
