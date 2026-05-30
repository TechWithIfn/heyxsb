import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import { SearchBar } from '../../components/SearchBar'
import { readSemProgress } from '../../lib/ipuProgress'
import { loadBranchDetail } from '../utils/navigationData'
import { registerSemesterSnapshot } from '../hooks/useIPUProgress'

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
      whileHover={active ? { y: -2 } : undefined}
      whileTap={active ? { scale: 0.99 } : undefined}
      className={`relative flex h-full min-h-[170px] flex-col overflow-hidden rounded-3xl border bg-white/90 p-4 text-left shadow-sm transition-all duration-300 dark:bg-slate-900/90 sm:p-5 ${
        active
          ? `border-slate-200 hover:border-transparent hover:shadow-lg dark:border-slate-800 ${tone.glow}`
          : 'cursor-not-allowed border-dashed border-slate-200 opacity-55 dark:border-slate-800'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.ring}`} />
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          Semester {semester.semNumber}
        </h3>
        <span
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-black text-white shadow ${tone.badge}`}
          aria-label={`Semester ${semester.semNumber}`}
        >
          {semester.semNumber}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {active ? `${semester.subjectCount} subjects` : 'Not available'}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {active ? `${semester.totalCredits} credits` : 'No credits'}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span className="text-slate-700 dark:text-slate-200">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${tone.progress} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
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

  if (loading || !branch) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
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

        <section className="mt-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Semesters</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">8-semester path with progress tracking.</p>
            </div>
            <div className="w-full max-w-md">
              <SearchBar scope={{ type: 'ipu-branch', branchId: branch.id }} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
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
        </section>
      </div>
    </main>
  )
}
