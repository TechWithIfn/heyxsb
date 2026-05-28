import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Flame, NotebookText, Target, Trophy } from 'lucide-react'
import { AnimatedCounter } from '../../components/AnimatedCounter'
import { ProgressRing } from '../components/ProgressRing'
import { IPU_RECENT_ACTIVITY_EVENT, loadBranchCatalog, readRecentTopicVisits } from '../utils/navigationData'
import {
  getAllTimeTotal,
  getBranchProgress,
  getRecentActivity,
  getStreak,
  getTodayCount,
  getSemProgress,
  getTopicProgress,
  getWeeklyData,
  registerSemesterSnapshot,
} from '../hooks/useIPUProgress'
import { getAllBookmarks } from '../hooks/useIPUBookmarks'

const DAILY_TARGET_KEY = 'learnify-ipu-daily-target-v1'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readDailyTarget() {
  const storage = getStorage()
  if (!storage) {
    return 5
  }

  const parsed = Number.parseInt(storage.getItem(DAILY_TARGET_KEY) ?? '5', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5
}

function writeDailyTarget(value) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(DAILY_TARGET_KEY, String(value))
  } catch {
    /* storage blocked */
  }
}

function formatRelativeTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return 'recently'
  }

  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) {
    return 'just now'
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  return `${days} day${days === 1 ? '' : 's'} ago`
}

function StatCard({ icon, label, value, description, suffix = '' }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {icon}
        </div>
      </div>
      {description && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  )
}

function ActivityLine({ item }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          You completed {item.topicTitle || 'a topic'} in {item.subjectName || 'IPU'}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {item.unitTitle ? `${item.unitTitle} · ` : ''}{formatRelativeTime(item.doneAt)}
        </p>
      </div>
    </div>
  )
}

export function IPUDashboard() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState([])
  const [version, setVersion] = useState(0)
  const [dailyTarget, setDailyTarget] = useState(() => readDailyTarget())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const branches = await loadBranchCatalog()
        if (cancelled) {
          return
        }

        branches.filter(Boolean).forEach((branch) => {
          branch.semesters?.forEach((semester) => {
            registerSemesterSnapshot(branch.id, semester.semNumber, semester.subjects, branch)
          })
        })

        setCatalog(branches.filter(Boolean))
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const refresh = () => setVersion((current) => current + 1)
    window.addEventListener('learnify-ipu-progress-updated', refresh)
    window.addEventListener('learnify-ipu-bookmarks-updated', refresh)
    window.addEventListener(IPU_RECENT_ACTIVITY_EVENT, refresh)

    return () => {
      window.removeEventListener('learnify-ipu-progress-updated', refresh)
      window.removeEventListener('learnify-ipu-bookmarks-updated', refresh)
      window.removeEventListener(IPU_RECENT_ACTIVITY_EVENT, refresh)
    }
  }, [])

  const summary = useMemo(() => {
    const weeklyData = getWeeklyData()
    const weekTotal = weeklyData.reduce((total, day) => total + day.count, 0)
    const streak = getStreak()
    const recent = getRecentActivity()
    const recentLessons = readRecentTopicVisits()
    const bookmarks = getAllBookmarks()
    const todayCount = getTodayCount()
    const allTimeTotal = getAllTimeTotal()
    const totalSubjects = catalog.reduce((count, branch) => count + (branch.overview?.subjectCount ?? 0), 0)
    const totalUnits = catalog.reduce((count, branch) => count + (branch.overview?.totalUnits ?? 0), 0)
    const totalTopics = catalog.reduce((count, branch) => count + (branch.overview?.totalTopics ?? 0), 0)

    let completedUnits = 0

    const studiedBranches = catalog
      .map((branch) => ({
        ...branch,
        progress: getBranchProgress(branch.id, branch.overview?.totalTopics ?? 0),
      }))
      .filter((branch) => branch.progress > 0)
      .sort((a, b) => b.progress - a.progress)

    const semesterProgress = catalog
      .flatMap((branch) =>
        (branch.semesters ?? []).map((semester) => {
          const progress = getSemProgress(branch.id, semester.semNumber, semester.subjectCount)
          const completedInSemester = (semester.subjects ?? []).reduce((count, subject) => {
            const topicProgress = getTopicProgress(branch.id, semester.semNumber, subject.id)
            return (
              count +
              topicProgress.unitBreakdown.filter((unit) => unit.total > 0 && unit.done === unit.total).length
            )
          }, 0)

          completedUnits += completedInSemester

          return {
            key: `${branch.id}-${semester.semNumber}`,
            branchId: branch.id,
            branchName: branch.name,
            branchShortName: branch.shortName,
            semNumber: semester.semNumber,
            subjectCount: semester.subjectCount,
            totalTopics: semester.totalTopics,
            progress,
          }
        }),
      )
      .filter((semester) => semester.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 6)

    const overallPercent = totalTopics > 0 ? Math.round((allTimeTotal / totalTopics) * 100) : 0

    return {
      weeklyData,
      weekTotal,
      streak,
      recent,
      recentLessons,
      bookmarks,
      todayCount,
      allTimeTotal,
      totalSubjects,
      totalUnits,
      totalTopics,
      completedUnits,
      overallPercent,
      studiedBranches,
      semesterProgress,
    }
  }, [catalog, version])

  const lastStudied = summary.recent[0]
  const weeklyGoal = dailyTarget * 7
  const goalProgress = weeklyGoal > 0 ? Math.min(100, Math.round((summary.weekTotal / weeklyGoal) * 100)) : 0
  const maxDay = Math.max(1, ...summary.weeklyData.map((day) => day.count))

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="h-10 w-72 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">📊 My Study Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
                Track progress, revisit the last topic you studied, and keep an eye on this week&apos;s goal.
              </p>
            </div>

            <Link
              to="/ipu"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Back to IPU
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <StatCard icon={<NotebookText className="h-5 w-5" aria-hidden="true" />} label="Completed Lessons" value={summary.allTimeTotal} description="Topics completed across IPU" />
            <StatCard icon={<Trophy className="h-5 w-5" aria-hidden="true" />} label="Overall Progress" value={summary.overallPercent} suffix="%" description="Rollup across all loaded topics" />
            <StatCard icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />} label="Total Subjects" value={summary.totalSubjects} description="Subjects loaded in the catalog" />
            <StatCard icon={<NotebookText className="h-5 w-5" aria-hidden="true" />} label="Bookmarked Topics" value={summary.bookmarks.length} description="Saved from the topic reader" />
            <StatCard icon={<Target className="h-5 w-5" aria-hidden="true" />} label="Units Completed" value={summary.completedUnits} description="Units fully finished end to end" />
            <StatCard icon={<Flame className="h-5 w-5" aria-hidden="true" />} label="Learning Streak" value={summary.streak.current} suffix=" days" description={summary.streak.lastStudied ? `Last studied ${summary.streak.lastStudied}` : 'Start studying to build a streak'} />
          </div>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Weekly Activity</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Seven-day topic completion overview</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Goal target: {dailyTarget}/day
                </span>
              </div>

              <div className="mt-6 h-64">
                <svg viewBox="0 0 700 240" className="h-full w-full">
                  {summary.weeklyData.map((day, index) => {
                    const barHeight = Math.max(12, (day.count / maxDay) * 160)
                    const x = 40 + index * 95
                    const y = 190 - barHeight
                    return (
                      <g key={day.date}>
                        <rect x={x} y={y} width="52" height={barHeight} rx="18" fill={day.count > 0 ? '#10b981' : '#cbd5e1'} className="transition-all duration-300" />
                        <text x={x + 26} y="215" textAnchor="middle" className="fill-slate-500 text-[13px] font-semibold dark:fill-slate-400">{day.day}</text>
                        <text x={x + 26} y={y - 10} textAnchor="middle" className="fill-slate-900 text-[12px] font-bold dark:fill-white">{day.count}</text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">This Week&apos;s Goal</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set your target topics per day</p>
                  </div>
                  <Target className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>

                <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Daily target
                  <input
                    type="number"
                    min="1"
                    value={dailyTarget}
                    onChange={(event) => {
                      const next = Math.max(1, Number.parseInt(event.target.value || '1', 10))
                      setDailyTarget(next)
                      writeDailyTarget(next)
                    }}
                    className="mt-2 w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{summary.weekTotal} topics this week</span>
                    <span>{weeklyGoal} target</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${goalProgress}%` }} />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Continue Where You Left Off</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Resume your latest completed topic</p>
                  </div>
                </div>

                {lastStudied ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/ipu/${lastStudied.branchId}/${lastStudied.sem}/${lastStudied.subjectId}/${lastStudied.topicId}`)}
                    className="mt-5 inline-flex w-full items-center justify-between rounded-3xl bg-emerald-600 px-5 py-5 text-left text-white transition-colors hover:bg-emerald-700"
                  >
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/90">Resume topic</span>
                      <span className="mt-2 block text-lg font-bold">{lastStudied.topicTitle || 'Continue learning'}</span>
                      <span className="mt-1 block text-sm text-emerald-50/90">{lastStudied.subjectName || 'IPU'} · {lastStudied.branchShortName || lastStudied.branchId?.toUpperCase()}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </button>
                ) : (
                  <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                    Complete a topic to enable fast resume.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold">Progress by Branch</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Only branches with study activity are shown here</p>

              {summary.studiedBranches.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                  Study a topic to see branch-level progress.
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {summary.studiedBranches.map((branch) => (
                    <button key={branch.id} type="button" onClick={() => navigate(`/ipu/${branch.id}`)} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/50">
                      <ProgressRing percent={branch.progress} size={88} strokeWidth={9} color="#10b981" />
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold text-slate-900 dark:text-white">{branch.shortName}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{branch.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold">Recently Viewed Lessons</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your latest opened topic pages</p>

              <div className="mt-6 space-y-3">
                {summary.recentLessons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                    No lesson views yet. Open a topic to populate this list.
                  </div>
                ) : (
                  summary.recentLessons.map((item) => (
                    <button
                      key={`${item.branchId}-${item.semNumber}-${item.subjectId}-${item.topicId ?? 'subject'}`}
                      type="button"
                      onClick={() => navigate(`/ipu/${item.branchId}/${item.semNumber}/${item.subjectId}/${item.topicId ?? ''}`.replace(/\/$/, ''))}
                      className="w-full text-left"
                    >
                      <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:bg-slate-950">
                        <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.topicTitle || item.subjectName || 'Opened lesson'}</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.subjectName || 'IPU'} · {formatRelativeTime(item.updatedAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Semester Progress</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live progress for the most active semesters</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{summary.semesterProgress.length} active</span>
            </div>

            {summary.semesterProgress.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                Complete a topic to see semester progress here.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {summary.semesterProgress.map((semester) => (
                  <button key={semester.key} type="button" onClick={() => navigate(`/ipu/${semester.branchId}/${semester.semNumber}`)} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/50">
                    <ProgressRing percent={semester.progress} size={88} strokeWidth={9} color="#10b981" />
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-slate-900 dark:text-white">{semester.branchShortName} Sem {semester.semNumber}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{semester.subjectCount} subjects · {semester.totalTopics} topics</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Bookmarked Topics</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{summary.bookmarks.length}</span>
              </div>

              <div className="mt-6 space-y-3">
                {summary.bookmarks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                    Bookmark topics from the reader to save them here.
                  </div>
                ) : (
                  summary.bookmarks.map((bookmark) => (
                    <Link
                      key={`${bookmark.branchId}-${bookmark.sem}-${bookmark.subjectId}-${bookmark.topicId}`}
                      to={`/ipu/${bookmark.branchId}/${bookmark.sem}/${bookmark.subjectId}/${bookmark.topicId}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-emerald-700 dark:hover:bg-slate-950"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{bookmark.topicTitle || 'Bookmarked topic'}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bookmark.subjectName} · {bookmark.unitTitle}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold">Goal Snapshot</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Move toward your weekly target at a steady pace</p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{summary.weekTotal} / {weeklyGoal} topics</span>
                  <span>{goalProgress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${goalProgress}%` }} />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                If you keep your pace, you&apos;ll stay close to {dailyTarget} topics per day.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
