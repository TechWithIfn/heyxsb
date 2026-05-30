import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Zap,
} from 'lucide-react'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import { getBranch } from '../../data/ipuData.js'
import { getEnglishName } from '../../ipu/utils/translate'
import { readSemProgress } from '../../lib/ipuProgress.js'
import { easeOut } from '../../lib/motion'

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

const SEMESTER_SLOTS = 8

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
}

function buildSemesterSlots(branch) {
  const byNumber = Object.fromEntries(
    branch.semesters.map((s) => [s.semNumber, s]),
  )
  return Array.from({ length: SEMESTER_SLOTS }, (_, i) => {
    const semNumber = i + 1
    const sem = byNumber[semNumber]
    const active = semNumber <= branch.totalSemesters && Boolean(sem)
    return {
      semNumber,
      active,
      subjects: sem?.subjects ?? [],
    }
  })
}

function SemesterCard({ branchId, slot }) {
  const navigate = useNavigate()
  const { semNumber, active, subjects } = slot
  const progress = active ? readSemProgress(branchId, semNumber) : 0
  const preview = subjects.slice(0, 3)
  const more = subjects.length - preview.length

  const handleClick = () => {
    if (!active) return
    navigate(`/ipu-syllabus/${branchId}/semester/${semNumber}`)
  }

  return (
    <motion.li variants={cardVariants} className="min-w-0">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={!active}
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl border p-5 text-left shadow-sm transition-colors ${
          active
            ? 'border-slate-200 bg-white hover:border-green-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-green-600'
            : 'cursor-not-allowed border-dashed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-900/40'
        }`}
        whileHover={active ? { y: -3 } : undefined}
        whileTap={active ? { scale: 0.99 } : undefined}
      >
        <span
          className="pointer-events-none absolute -right-2 -top-4 select-none text-8xl font-black leading-none text-slate-900 opacity-[0.07] dark:text-white"
          aria-hidden="true"
        >
          {semNumber}
        </span>

        <h2 className="relative text-lg font-bold text-slate-900 dark:text-white">
          Semester {semNumber}
        </h2>

        {active ? (
          <>
            <p className="relative mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subjects.length} subject{subjects.length === 1 ? '' : 's'}
            </p>

            {preview.length > 0 ? (
              <ul className="relative mt-3 flex flex-wrap gap-1.5">
                {preview.map((sub) => (
                  <li
                    key={sub.id}
                    className="max-w-full truncate rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {getEnglishName(sub)}
                  </li>
                ))}
                {more > 0 && (
                  <li className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-800 dark:bg-green-950/60 dark:text-green-400">
                    +{more} more
                  </li>
                )}
              </ul>
            ) : (
              <p className="relative mt-3 text-xs text-slate-400 dark:text-slate-500">
                Subjects coming soon
              </p>
            )}

            <div className="relative mt-4">
              <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Progress</span>
                <span className="text-green-700 dark:text-green-400">{progress}%</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Semester ${semNumber} progress`}
              >
                <div
                  className="h-full rounded-full bg-green-700 transition-all duration-500 dark:bg-green-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <span className="relative mt-4 inline-flex w-full items-center justify-center rounded-lg bg-green-700 py-2 text-sm font-semibold text-white dark:bg-green-600">
              {progress > 0 ? 'Continue' : 'Start'}
            </span>
          </>
        ) : (
          <p className="relative mt-4 text-sm text-slate-500 dark:text-slate-400">
            Not part of this programme
          </p>
        )}
      </motion.button>
    </motion.li>
  )
}

export function SemestersPage() {
  const { branchId } = useParams()
  const navigate = useNavigate()
  const branch = getBranch(branchId)

  const slots = useMemo(
    () => (branch ? buildSemesterSlots(branch) : []),
    [branch],
  )

  useEffect(() => {
    if (!branch) {
      navigate('/ipu-syllabus', { replace: true })
    }
  }, [branch, navigate])

  if (!branch) {
    return null
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: easeOut }}
      >
        <IPUBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'IPU Syllabus', to: '/ipu-syllabus' },
            { label: getEnglishName(branch) },
          ]}
        />
      </motion.div>

      <header className="mb-10">
        <Link
          to="/ipu-syllabus"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-green-700 dark:text-slate-400 dark:hover:text-green-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Branches
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900/80 ${branch.color}`}
          >
            <BranchIcon name={branch.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {getEnglishName(branch)}
              </h1>
              <span
                className={`rounded-full bg-slate-100 px-3 py-1 text-sm font-bold dark:bg-slate-900 ${branch.color}`}
              >
                {branch.shortName}
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {branch.description}
            </p>
          </div>
        </div>
      </header>

      <motion.ul
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {slots.map((slot) => (
          <SemesterCard key={slot.semNumber} branchId={branch.id} slot={slot} />
        ))}
      </motion.ul>
    </main>
  )
}
