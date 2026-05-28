import { Link } from 'react-router-dom'
import { useAnalytics } from '../hooks/useAnalytics'
import { useOverallProgress } from '../hooks/useProgress'
import { AnimatedCounter } from './AnimatedCounter'
import { ProgressRing } from '../ipu/components/ProgressRing'
import { BarChart } from './charts/BarChart'

export function LearningStatsSummary({ compact = false }) {
  const { stats } = useAnalytics()
  const progress = useOverallProgress()

  const summaryCards = [
    {
      label: 'Completed lessons',
      value: progress.totalDone,
      description: `${progress.totalDone} of ${progress.totalLessons} lessons finished`,
    },
    {
      label: 'Overall progress',
      value: progress.overallPercent,
      suffix: '%',
      description: 'Live completion rate across tracked lessons',
    },
    {
      label: 'Bookmarks',
      value: stats.bookmarksCount,
      description: 'Saved lessons and topics on this device',
    },
    {
      label: 'Learning streak',
      value: progress.streakDays,
      suffix: ' days',
      description: progress.streakDays ? `Last active ${progress.activityDates?.[0] ?? 'recently'}` : 'Start reading to build a streak',
    },
  ]

  const recentLessons = stats.recentLessons.slice(0, compact ? 3 : 6)
  const mostVisited = stats.mostVisited.slice(0, compact ? 3 : 5)

  if (!stats.hasData) {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ProgressRing percent={0} size={80} strokeWidth={8} color="#10b981" label="Stats" />
          </div>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Your Learning Stats
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Read lessons, take quizzes, and open topics to populate live analytics here. Data stays private on this device.
          </p>
          <Link
            to="/analytics"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
          >
            Open analytics →
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Your Learning Stats
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Private analytics stored in your browser. Values update live when you complete lessons, revisit topics, or change bookmarks.
          </p>
        </div>
        <Link
          to="/analytics"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
        >
          View full stats
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryMetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recently viewed lessons</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest opened lessons from your browser history</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
              {recentLessons.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {recentLessons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                Open a lesson to start building this list.
              </div>
            ) : (
              recentLessons.map((item) => (
                <Link
                  key={item.key}
                  to={`/${item.topicSlug}/${item.lessonId}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-emerald-700"
                >
                  <span className="min-w-0 flex-1 font-medium text-slate-800 dark:text-slate-200">
                    {item.lessonTitle}
                  </span>
                  <span className="ml-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {item.views} view{item.views === 1 ? '' : 's'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Most visited</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Frequently opened lessons and topics</p>
            </div>
          </div>

          {stats.mostVisited.length > 0 && (
            <ul className="mt-4 space-y-3">
              {mostVisited.map((item) => (
                <li key={item.key}>
                  <Link
                    to={`/${item.topicSlug}/${item.lessonId}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-emerald-700"
                  >
                    <span className="min-w-0 flex-1 font-medium text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                      {item.views} view{item.views === 1 ? '' : 's'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!compact && stats.weeklyTime.some((d) => d.value > 0) && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Time this week (minutes)
              </h3>
              <BarChart data={stats.weeklyTime} height={180} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function SummaryMetricCard({ label, value, description, suffix = '' }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-emerald-700">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      {description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  )
}
