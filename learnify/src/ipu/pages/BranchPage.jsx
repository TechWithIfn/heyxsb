import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Cpu,
  Cog,
  GraduationCap,
  Laptop,
  Monitor,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import { readSemProgress } from '../../lib/ipuProgress'
import {
  buildFirstSubjectRoute,
  getBranchMeta,
  getBranchProgramLabel,
  loadBranchDetail,
} from '../utils/navigationData'
import { ProgressRing } from '../components/ProgressRing'
import { getBranchProgress, registerSemesterSnapshot } from '../hooks/useIPUProgress'

const ICON_MAP = {
  Cpu,
  Monitor,
  Brain,
  Radio,
  Zap,
  Cog,
  Building2,
  GraduationCap,
  Laptop,
  Briefcase,
  BookOpen,
}

function BranchIcon({ name, className }) {
  const Icon = ICON_MAP[name] ?? BookOpen
  return <Icon className={className} aria-hidden="true" />
}

function getSemesterTone(semNumber) {
  if (semNumber <= 2) {
    return {
      badge: 'bg-emerald-500',
      ring: 'from-emerald-500 to-emerald-600',
      progress: 'bg-emerald-500',
      glow: 'shadow-emerald-500/15',
    }
  }

  if (semNumber <= 5) {
    return {
      badge: 'bg-sky-500',
      ring: 'from-sky-500 to-blue-600',
      progress: 'bg-sky-500',
      glow: 'shadow-sky-500/15',
    }
  }

  return {
    badge: 'bg-violet-500',
    ring: 'from-violet-500 to-purple-600',
    progress: 'bg-violet-500',
    glow: 'shadow-violet-500/15',
  }
}

function SemesterRoadmapCard({ branchId, semester, active, onOpen }) {
  const progress = active ? readSemProgress(branchId, semester.semNumber) : 0
  const tone = getSemesterTone(semester.semNumber)

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={!active}
      whileHover={active ? { y: -3 } : undefined}
      whileTap={active ? { scale: 0.99 } : undefined}
      className={`group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border bg-white/90 p-5 text-left shadow-sm transition-all duration-300 dark:bg-slate-900/90 ${
        active
          ? `border-slate-200 hover:border-transparent hover:shadow-lg dark:border-slate-800 ${tone.glow}`
          : 'cursor-not-allowed border-dashed border-slate-200 opacity-55 dark:border-slate-800'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.ring}`} />
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg ${tone.badge}`}
        >
          {semester.semNumber}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {active ? `${semester.subjectCount} subjects` : 'Not available'}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Semester {semester.semNumber}
        </h3>
        <p className="mt-2 min-h-[2.75rem] text-sm leading-6 text-slate-500 dark:text-slate-400">
          {active ? `${semester.totalCredits} credits total` : 'No content in this programme yet'}
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Completion</span>
            <span className="text-slate-700 dark:text-slate-200">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${tone.progress} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-transform duration-300 group-hover:translate-x-1 dark:text-emerald-400">
        Open roadmap
        <span aria-hidden="true">→</span>
      </span>
    </motion.button>
  )
}

export function BranchPage() {
  const { branchId } = useParams()
  const navigate = useNavigate()
  const [branch, setBranch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await loadBranchDetail(branchId)
        if (!cancelled) {
          if (data) {
            data.semesters.forEach((semester) => {
              registerSemesterSnapshot(data.id, semester.semNumber, semester.subjects, data)
            })
          }
          setBranch(data)
        }
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
  }, [branchId])

  useEffect(() => {
    if (!loading && !branch) {
      navigate('/ipu', { replace: true })
    }
  }, [branch, loading, navigate])

  const roadmap = useMemo(() => {
    if (!branch) {
      return []
    }

    const semMap = new Map(branch.semesters.map((semester) => [semester.semNumber, semester]))

    return Array.from({ length: 8 }, (_, index) => {
      const semNumber = index + 1
      const semester = semMap.get(semNumber) ?? {
        semNumber,
        subjectCount: 0,
        totalCredits: 0,
      }

      return {
        semester,
        active: semNumber <= (branch.totalSemesters ?? 0) && semester.subjectCount > 0,
      }
    })
  }, [branch])

  const overview = branch?.overview ?? {
    subjectCount: 0,
    totalUnits: 0,
    totalTopics: 0,
  }
  const branchProgress = branch ? getBranchProgress(branch.id, branch.overview?.totalTopics ?? 0) : 0

  if (loading || !branch) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <IPUBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'IPU', to: '/ipu' },
            { label: branch.shortName },
          ]}
        />

        <header className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${branch.color} text-white shadow-lg`}>
                  <BranchIcon name={branch.icon} className="h-8 w-8" />
                </div>
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {getBranchProgramLabel(branch)}
                  </span>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    {branch.name}
                  </h1>
                </div>
              </div>

              <Link
                to="/ipu"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to IPU
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
              <div className="flex justify-center lg:justify-start">
                <ProgressRing percent={branchProgress} size={118} strokeWidth={10} color="#10b981" label="Branch" />
              </div>
              <div className="min-w-0 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Subjects
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {overview.subjectCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Topics
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {overview.totalTopics}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              {branch.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {branch.totalSemesters} semesters
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {overview.subjectCount} subjects
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {overview.totalUnits} units
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {overview.totalTopics} topics
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(buildFirstSubjectRoute(branch))}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Start from Beginning
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Semester Roadmap
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  8-semester visual path with progress tracking.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              <AnimatePresence>
                {roadmap.map(({ semester, active }) => (
                  <SemesterRoadmapCard
                    key={semester.semNumber}
                    branchId={branch.id}
                    semester={semester}
                    active={active}
                    onOpen={() => active && navigate(`/ipu/${branch.id}/${semester.semNumber}`)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </header>
      </div>
    </main>
  )
}
