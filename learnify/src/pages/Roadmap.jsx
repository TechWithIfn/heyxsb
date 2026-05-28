import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, ChevronUp, Lightbulb, Rocket, Sparkles, Target } from 'lucide-react'
import { ProgressRing } from '../ipu/components/ProgressRing'
import { AnimatedCounter } from '../components/AnimatedCounter'
import {
  ROADMAP_EVENT,
  clearRoadmapProgress,
  createRoadmapPlan,
  getRoadmapProgressSummary,
  readActiveRoadmapRecord,
  toggleRoadmapItemComplete,
} from '../lib/roadmap'
import { useTopics } from '../context/TopicsContext'

function Spinner({ className }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function RoadmapSkeleton() {
  return (
    <div className="mt-10 space-y-5" aria-hidden="true">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-[80%] animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

function QuickChip({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
    >
      {children}
    </button>
  )
}

function StatTile({ label, value, suffix = '', icon, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{icon}</div>
      </div>
      {description && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  )
}

function BulletList({ title, items }) {
  if (!items?.length) return null

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TopicCard({ topic, completed, onToggle }) {
  return (
    <div className={`rounded-3xl border p-4 transition-all duration-300 ${completed ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/20' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${completed ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              aria-pressed={completed}
            >
              <Check className="h-3.5 w-3.5" />
              {completed ? 'Completed' : 'Mark complete'}
            </button>
            {topic.topicSlug && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                LearnTheory: {topic.topicSlug}
              </span>
            )}
          </div>
          <h4 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{topic.title}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{topic.description}</p>
        </div>

        {topic.tutorialUrl ? (
          <Link
            to={topic.tutorialUrl}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
          >
            Open tutorial
            <Rocket className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BulletList title="Subtopics" items={topic.subtopics} />
        <BulletList title="Practice" items={topic.practiceTasks} />
        <BulletList title="Projects" items={topic.projects} />
      </div>
    </div>
  )
}

function StageCard({ stage, completedIds, open, onToggleOpen, onToggleTopic }) {
  const stageCompleted = stage.topics.filter((topic) => completedIds.has(topic.id)).length
  const stagePercent = stage.topics.length ? Math.round((stageCompleted / stage.topics.length) * 100) : 0

  return (
    <motion.section layout className="relative rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
            {stage.difficulty} stage
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{stage.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{stage.overview}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Duration</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{stage.durationWeeks} weeks</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stageCompleted}/{stage.topics.length} topics done</p>
          </div>
          <ProgressRing percent={stagePercent} size={88} strokeWidth={8} color="#10b981" />
          {open ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={stage.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-slate-200 dark:border-slate-800"
          >
            <div className="space-y-5 p-5 sm:p-6">
              {stage.goals?.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Stage goals</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stage.goals.map((goal) => (
                        <span key={goal} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-200">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recommended projects</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {stage.topics.flatMap((topic) => topic.projects).slice(0, 4).map((project, index) => (
                        <li key={`${project}-${index}`} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                          <span>{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {stage.topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    completed={completedIds.has(topic.id)}
                    onToggle={() => onToggleTopic(topic.id)}
                  />
                ))}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Stage progress</span>
                  <span>{stagePercent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${stagePercent}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export function Roadmap() {
  const { ensureAllTopics } = useTopics()
  const [goal, setGoal] = useState('')
  const [roadmap, setRoadmap] = useState(() => readActiveRoadmapRecord())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const [expandedStages, setExpandedStages] = useState({})

  useEffect(() => {
    ensureAllTopics().catch(() => {})
  }, [ensureAllTopics])

  useEffect(() => {
    const sync = () => {
      const saved = readActiveRoadmapRecord()
      if (saved) {
        setRoadmap(saved)
        setGoal(saved.goal || '')
        setExpandedStages((current) => {
          if (Object.keys(current).length > 0) {
            return current
          }
          return { [saved.stages?.[0]?.id ?? 'beginner']: true }
        })
      }
    }

    window.addEventListener(ROADMAP_EVENT, sync)
    window.addEventListener('storage', sync)
    sync()

    return () => {
      window.removeEventListener(ROADMAP_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!roadmap?.stages?.length) {
      return
    }

    setExpandedStages((current) => {
      if (Object.keys(current).length > 0) {
        return current
      }

      return { [roadmap.stages[0].id]: true }
    })
  }, [roadmap?.goalKey])

  const summary = useMemo(() => (roadmap ? getRoadmapProgressSummary(roadmap) : null), [roadmap])

  const handleGenerate = useCallback(
    async (event) => {
      event.preventDefault()
      const trimmed = goal.trim()
      if (!trimmed || loading) {
        return
      }

      setLoading(true)
      setError(null)
      setNotice('')

      try {
        await ensureAllTopics().catch(() => {})
        const result = await createRoadmapPlan(trimmed)
        setRoadmap(result.roadmap)
        setGoal(result.roadmap.goal || trimmed)
        setNotice(result.notice)
        setExpandedStages({ [result.roadmap.stages?.[0]?.id ?? 'beginner']: true })
      } catch (err) {
        setError(err?.message || 'We could not build your roadmap right now. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [ensureAllTopics, goal, loading],
  )

  const handleToggleTopic = useCallback(
    (topicId) => {
      if (!roadmap?.goalKey || !topicId) {
        return
      }

      const next = toggleRoadmapItemComplete(roadmap.goalKey, topicId)
      if (next) {
        setRoadmap(next)
      }
    },
    [roadmap?.goalKey],
  )

  const handleClearProgress = useCallback(() => {
    if (!roadmap?.goalKey) {
      return
    }

    const next = clearRoadmapProgress(roadmap.goalKey)
    if (next) {
      setRoadmap(next)
    }
  }, [roadmap?.goalKey])

  const quickGoals = [
    'I want to become a frontend developer',
    'I want to learn data science',
    'I want to become a Python developer',
    'I want to become a full stack developer',
  ]

  const completedCount = summary?.completedCount ?? 0
  const totalCount = summary?.totalCount ?? 0
  const percent = summary?.percent ?? 0

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-10 outline-none dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI Learning Roadmap
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Turn any goal into a clear beginner-to-advanced plan
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
                Enter a learning goal and get a practical roadmap with stages, topics, tutorials, projects, and progress tracking. If AI is available, the roadmap is personalized; otherwise, LearnTheory builds a strong local roadmap automatically.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {quickGoals.map((item) => (
                  <QuickChip key={item} onClick={() => setGoal(item)}>{item}</QuickChip>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70 sm:min-w-80">
              <div className="flex items-center gap-4">
                <ProgressRing percent={percent} size={100} strokeWidth={9} color="#10b981" label="Roadmap" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Saved progress</p>
                  <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    <AnimatedCounter value={completedCount} />
                    <span className="text-slate-400">/{totalCount}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{percent}% complete</p>
                </div>
              </div>

              {roadmap ? (
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-900 dark:text-white">{roadmap.careerPath}</p>
                  <p>{roadmap.estimatedDuration || 'Live roadmap'}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Your latest roadmap will appear here after you generate one.</p>
              )}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="mt-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900 dark:from-emerald-950/30 dark:to-slate-900 sm:p-6">
            <label htmlFor="learning-goal" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              What do you want to learn?
            </label>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row">
              <input
                id="learning-goal"
                type="text"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder='e.g. "I want to become a frontend developer"'
                disabled={loading}
                className="flex-1 rounded-2xl border border-emerald-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900/70 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={loading || !goal.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    Generating roadmap...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    Generate Roadmap
                  </>
                )}
              </button>
            </div>
          </form>

          {notice && (
            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              {notice}
            </div>
          )}

          {error && (
            <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Stages" value={roadmap?.stages?.length ?? 0} icon={<Rocket className="h-5 w-5" />} description="Beginner to advanced flow" />
            <StatTile label="Completed" value={completedCount} icon={<Check className="h-5 w-5" />} description="Saved in your browser" />
            <StatTile label="Skills" value={roadmap?.recommendedSkills?.length ?? 0} icon={<Lightbulb className="h-5 w-5" />} description="Recommended core skills" />
            <StatTile label="Projects" value={roadmap?.projectIdeas?.length ?? 0} icon={<Sparkles className="h-5 w-5" />} description="Portfolio and practice ideas" />
          </div>
        </section>

        {!roadmap && !loading && !error ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Start with a learning goal</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Try a real-world goal like frontend developer, data science, or Python developer. LearnTheory will create a professional roadmap with stages, projects, and clickable tutorial links.
            </p>
          </div>
        ) : null}

        {roadmap && summary ? (
          <div className="mt-10 space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
                    {roadmap.source === 'ai' ? 'AI generated roadmap' : roadmap.source === 'fallback' ? 'AI fallback roadmap' : 'LearnTheory roadmap'}
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{roadmap.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">{roadmap.summary}</p>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{roadmap.careerPath}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{roadmap.difficulty}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{roadmap.estimatedDuration}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{roadmap.intent}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/40">
                  <ProgressRing percent={percent} size={104} strokeWidth={9} color="#10b981" label="Roadmap" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Completion</p>
                    <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                      <AnimatedCounter value={percent} suffix="%" />
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {completedCount} of {totalCount} topics complete
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Core skills</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(roadmap.recommendedSkills || []).map((skill) => (
                      <span key={skill} className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-emerald-900 dark:bg-slate-900 dark:text-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Alternative paths</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(roadmap.alternativePaths || []).map((path) => (
                      <span key={path} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                        {path}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{roadmap.projectIdeas?.length ?? 0}</span> project ideas included for portfolio building
                </div>
                <button
                  type="button"
                  onClick={handleClearProgress}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
                >
                  Reset progress
                </button>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(roadmap.projectIdeas || []).map((project) => (
                <div key={project} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Project idea</p>
                  <p className="mt-3 text-base font-bold text-slate-900 dark:text-white">{project}</p>
                </div>
              ))}
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Roadmap timeline</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Expand a stage to see topics, tutorials, tasks, and projects.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  {roadmap.stages.length} stages
                </span>
              </div>

              <div className="space-y-5">
                {summary.stages.map((stage) => (
                  <StageCard
                    key={stage.id}
                    stage={stage}
                    completedIds={new Set(roadmap.completedIds ?? [])}
                    open={Boolean(expandedStages[stage.id])}
                    onToggleOpen={() => setExpandedStages((current) => ({ ...current, [stage.id]: !current[stage.id] }))}
                    onToggleTopic={handleToggleTopic}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {loading && <RoadmapSkeleton />}
      </div>
    </main>
  )
}
