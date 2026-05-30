import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
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
import { SearchBar } from '../../components/SearchBar'
import { readSubjectProgress } from '../../lib/ipuProgress'
import {
  getBranchMeta,
  getBranchProgramLabel,
  loadBranchDetail,
} from '../utils/navigationData'
import { getEnglishName } from '../utils/translate'
import { ProgressRing } from '../components/ProgressRing'
import { getSemProgress, registerSemesterSnapshot } from '../hooks/useIPUProgress'

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

function getTypeLabel(type) {
  const normalized = String(type ?? '').toLowerCase()

  if (normalized === 'lab') {
    return 'Lab'
  }

  if (normalized === 'elective') {
    return 'Elective'
  }

  return 'Theory'
}

function getTypeTone(type) {
  const normalized = String(type ?? '').toLowerCase()

  if (normalized === 'lab') {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
  }

  if (normalized === 'elective') {
    return 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300'
  }

  return 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300'
}

function buildSemesterDescription(branch, semester) {
  if (!semester) {
    return ''
  }

  const highlightedSubjects = semester.subjects.slice(0, 3).map((subject) => getEnglishName(subject))
  const subjectLabel = semester.subjectCount === 1 ? 'subject' : 'subjects'
  const topicLabel = semester.totalTopics === 1 ? 'topic' : 'topics'

  if (highlightedSubjects.length > 0) {
    return `Semester ${semester.semNumber} focuses on ${highlightedSubjects.join(', ')}. It groups ${semester.subjectCount} ${subjectLabel} and ${semester.totalTopics} ${topicLabel} in a recommended order for ${branch.shortName}.`
  }

  return `Semester ${semester.semNumber} groups ${semester.subjectCount} ${subjectLabel} and ${semester.totalTopics} ${topicLabel} in a recommended order for ${branch.shortName}.`
}

const CSE_SEM1_SUBJECT_ORDER = [
  'Manufacturing Process',
  'Applied Chemistry',
  'Applied Mathematics 1',
  'Applied Physics 1',
  'Basic Chemistry',
  'Communications Skills',
  'Electrical Science',
  'Indian Constitution',
  'Human Values And Ethics',
  'Programming In C',
]

function sortCseSem1Subjects(subjects, branchId, semNumber) {
  if (String(branchId ?? '').toLowerCase() !== 'cse' || semNumber !== 1) {
    return subjects
  }

  const order = new Map(CSE_SEM1_SUBJECT_ORDER.map((name, index) => [name, index]))

  return [...subjects].sort((left, right) => {
    const leftRank = order.get(left?.name) ?? Number.MAX_SAFE_INTEGER
    const rightRank = order.get(right?.name) ?? Number.MAX_SAFE_INTEGER
    return leftRank - rightRank
  })
}

function SubjectCard({ branchId, semNumber, subject, index, onOpen }) {
  const progress = readSubjectProgress(branchId, semNumber, subject.id)
  const completed = progress >= 100
  const unitCount = Array.isArray(subject.units) ? subject.units.length : 0
  const topicCount = Array.isArray(subject.units)
    ? subject.units.reduce(
        (total, unit) => total + (Array.isArray(unit.topics) ? unit.topics.length : 0),
        0,
      )
    : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className={`flex h-full min-h-[340px] flex-col rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 dark:bg-slate-900 sm:p-6 ${
        completed
          ? 'border-emerald-200 dark:border-emerald-900/50'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {subject.subjectCode || subject.code}
            </span>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTypeTone(subject.type)}`}>
              {getTypeLabel(subject.type)}
            </span>
            {completed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Completed
              </span>
            )}
          </div>

            <h3 className="mt-4 text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-[1.65rem]">
            {getEnglishName(subject)}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {subject.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 text-center">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {subject.credits} credits
          </span>
          <ProgressRing percent={progress} size={64} strokeWidth={7} color="#10b981" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-700 dark:text-slate-300">{unitCount} units</span>
        <span aria-hidden="true">·</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{topicCount} topics</span>
      </div>

      <div className="mt-auto pt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Completion</span>
          <span className="text-slate-700 dark:text-slate-200">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Start Learning
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.article>
  )
}

export function SemesterPage() {
  const { branchId, sem } = useParams()
  const navigate = useNavigate()
  const semesterNavRef = useRef(null)
  const [branch, setBranch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSemNumber, setActiveSemNumber] = useState(() => {
    const initialSemNumber = Number.parseInt(sem, 10)
    return Number.isFinite(initialSemNumber) ? initialSemNumber : 1
  })

  const semNumber = Number.parseInt(sem, 10)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await loadBranchDetail(branchId)
        if (!cancelled) {
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
    if (Number.isFinite(semNumber)) {
      setActiveSemNumber(semNumber)
    }
  }, [branchId, semNumber])

  useEffect(() => {
    if (!loading && !branch) {
      navigate('/ipu', { replace: true })
    }
  }, [branch, loading, navigate])

  const semester = useMemo(() => {
    if (!branch || !Number.isFinite(activeSemNumber)) {
      return null
    }

    return branch.semesters.find((item) => item.semNumber === activeSemNumber) ?? null
  }, [branch, activeSemNumber])

  const recommendedSubjects = useMemo(
    () => sortCseSem1Subjects(semester?.subjects ?? [], branchId, activeSemNumber),
    [semester, branchId, activeSemNumber],
  )

  const displaySemester = useMemo(
    () => (semester ? { ...semester, subjects: recommendedSubjects } : null),
    [semester, recommendedSubjects],
  )

  useEffect(() => {
    if (branch && displaySemester) {
      registerSemesterSnapshot(branch.id, displaySemester.semNumber, displaySemester.subjects, branch)
    }
  }, [branch, displaySemester])

  const branchMeta = getBranchMeta(branchId)
  const semesterDescription = useMemo(
    () => (branch && displaySemester ? buildSemesterDescription(branch, displaySemester) : ''),
    [branch, displaySemester],
  )
  const semesterProgress =
    branch && displaySemester
      ? getSemProgress(branch.id, displaySemester.semNumber, displaySemester.subjects.length)
      : 0

  const semesterTabs = useMemo(
    () => Array.from({ length: 8 }, (_, index) => index + 1),
    [],
  )

  const availableSemesterNumbers = useMemo(
    () => new Set((branch?.semesters ?? []).map((item) => item.semNumber)),
    [branch],
  )

  function handleSemesterChange(nextSemNumber) {
    if (!branch || !availableSemesterNumbers.has(nextSemNumber)) {
      return
    }

    setActiveSemNumber(nextSemNumber)
    navigate(`/ipu/${branch.id}/${nextSemNumber}`, { replace: true })
  }

  // No scrolling — semesters are fixed buttons that do not move

  // No layout measurement required for static tabs

  // Autoplay removed — semesters are fixed

  if (loading || !branch) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-28 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </main>
    )
  }

  if (!semester) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <IPUBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'IPU', to: '/ipu' },
            { label: branch.shortName, to: `/ipu/${branch.id}` },
            { label: `Semester ${activeSemNumber}` },
          ]}
        />
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Semester not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            This branch does not have content for Semester {sem} yet.
          </p>
          <Link
            to={`/ipu/${branch.id}`}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to branch
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Semester Navigation Bar: fixed under the main navbar and aligned to page container */}
        <div className="fixed top-16 left-0 right-0 z-40">
          <div className="w-full border-t border-slate-800 bg-slate-900 text-white shadow-[0_18px_50px_-32px_rgba(0,0,0,0.75)] backdrop-blur-md">
            <div className="w-full">
              <LayoutGroup id="semester-nav">
                <div className="w-full px-0 py-1">
                  <div className="sr-only">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">Semester Navigation Bar</p>
                    <p className="mt-1 text-xs text-white/55">Switch semesters without leaving the page.</p>
                  </div>

                  <div className="relative overflow-hidden">
                    <div
                      ref={semesterNavRef}
                      className="grid w-full gap-0"
                      style={{ gridTemplateColumns: `repeat(${semesterTabs.length}, minmax(0, 1fr))` }}
                    >
                      {semesterTabs.map((semesterNumber) => {
                        const isAvailable = availableSemesterNumbers.has(semesterNumber)
                        const isActive = semesterNumber === activeSemNumber

                        return (
                          <button
                            key={semesterNumber}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => handleSemesterChange(semesterNumber)}
                            className={`col-span-1 w-full relative flex items-center justify-center overflow-hidden px-4 py-3 text-sm font-semibold text-center transition-all duration-300 ${
                              isActive
                                ? 'bg-emerald-600 text-white rounded-full border-2 border-emerald-400/60 shadow-sm'
                                : isAvailable
                                  ? 'bg-transparent text-white/90 hover:bg-white/5'
                                  : 'bg-transparent text-white/40'
                            }`}
                          >
                            <span className="relative z-10 whitespace-nowrap">Semester {semesterNumber}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </LayoutGroup>
            </div>
          </div>
        </div>
        {/* spacer to reserve nav height so page content sits below the fixed nav */}
        <div className="h-14" aria-hidden="true" />

        <IPUBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'IPU', to: '/ipu' },
            { label: branch.shortName, to: `/ipu/${branch.id}` },
            { label: `Semester ${activeSemNumber}` },
          ]}
        />

        {/* Header removed per user request: compact view without hero/summary */}

        

        <AnimatePresence mode="wait">
          <motion.section
            key={`${branch.id}-${activeSemNumber}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="mt-0 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start"
          >
            <div className="min-w-0">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Subject List
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {semester.subjects.length} subject grid with progress tracking.
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <SearchBar scope={{ type: 'ipu', branchId: branch.id, semNumber: activeSemNumber }} />
                </div>
              </div>

              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 2xl:grid-cols-3">
                <AnimatePresence>
                  {semester.subjects.map((subject, index) => (
                    <SubjectCard
                      key={subject.id}
                      branchId={branch.id}
                      semNumber={semester.semNumber}
                      subject={subject}
                      index={index}
                      onOpen={() => navigate(`/ipu/${branch.id}/${semester.semNumber}/${subject.id}`)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-6 self-start">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recommended Study Order
                </h3>
                <ol className="mt-4 space-y-3">
                  {recommendedSubjects.map((subject, index) => (
                    <li
                      key={subject.id}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-900 dark:text-white">
                          {getEnglishName(subject)}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {subject.subjectCode || subject.code} · {subject.credits} credits
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                  Tip
                </p>
                <p className="mt-3 text-base leading-7">
                  💡 Complete subjects in order for best understanding
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Semester Summary
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Credits
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {semester.totalCredits}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Topics
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {semester.totalTopics}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  )
}
