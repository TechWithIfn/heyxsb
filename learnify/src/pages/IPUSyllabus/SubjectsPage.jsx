import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import { getBranch } from '../../data/ipuData.js'
import { readSubjectProgress } from '../../lib/ipuProgress.js'
import { easeOut } from '../../lib/motion'

const RADIUS = 36
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
}

function CircularProgress({ percent }) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE

  return (
    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 88 88"
        aria-hidden="true"
      >
        <circle
          cx="44"
          cy="44"
          r={RADIUS}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="8"
        />
        <motion.circle
          cx="44"
          cy="44"
          r={RADIUS}
          fill="none"
          className="stroke-green-700 dark:stroke-green-500"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: easeOut }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-100">
        {percent}%
      </span>
    </div>
  )
}

function SubjectActionButton({ branchId, semNum, subject, progress }) {
  const navigate = useNavigate()

  const label =
    progress >= 100
      ? 'Completed ✓'
      : progress > 0
        ? 'Continue'
        : 'Start Learning'

  const className =
    progress >= 100
      ? 'rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
      : 'rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500'

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/ipu-syllabus/${branchId}/semester/${semNum}/subject/${subject.id}`,
        )
      }
      className={className}
    >
      {label}
    </button>
  )
}

function SubjectCard({ branchId, semNum, subject }) {
  const progress = readSubjectProgress(branchId, semNum, subject.id)
  const unitsCount = subject.units?.length ?? 0

  return (
    <motion.li
      variants={cardVariants}
      className="min-w-0"
      whileHover={{ x: 4 }}
    >
      <article className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
            {subject.subjectCode}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {subject.name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {subject.description}
          </p>
          <ul className="mt-4 flex flex-wrap items-center gap-2">
            <li className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {subject.credits} credit{subject.credits === 1 ? '' : 's'}
            </li>
            <li
              className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                subject.type === 'lab'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              }`}
            >
              {subject.type}
            </li>
            <li className="rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950/50 dark:text-green-400">
              {unitsCount} unit{unitsCount === 1 ? '' : 's'}
            </li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-3 sm:items-end">
          <CircularProgress percent={progress} />
          <SubjectActionButton
            branchId={branchId}
            semNum={semNum}
            subject={subject}
            progress={progress}
          />
        </div>
      </article>
    </motion.li>
  )
}

export function SubjectsPage() {
  const { branchId, semNum } = useParams()
  const navigate = useNavigate()
  const [sort, setSort] = useState('name')

  const branch = getBranch(branchId)
  const semNumber = Number(semNum)
  const semester = branch?.semesters.find((s) => s.semNumber === semNumber)

  const sortedSubjects = useMemo(() => {
    if (!semester) return []
    const list = [...semester.subjects]
    if (sort === 'credits') {
      return list.sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name))
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [semester, sort])

  const totalCredits = useMemo(
    () => sortedSubjects.reduce((n, s) => n + (s.credits ?? 0), 0),
    [sortedSubjects],
  )

  useEffect(() => {
    if (!branch || !semester) {
      navigate('/ipu-syllabus', { replace: true })
    }
  }, [branch, semester, navigate])

  if (!branch || !semester) {
    return null
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-4xl overflow-x-hidden px-4 py-10 outline-none sm:px-6 sm:py-14"
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
            { label: branch.name, to: `/ipu-syllabus/${branchId}` },
            { label: `Semester ${semNumber}` },
          ]}
        />
      </motion.div>

      <header className="mb-8">
        <Link
          to={`/ipu-syllabus/${branchId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-green-700 dark:text-slate-400 dark:hover:text-green-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to semesters
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Semester {semNumber} — {branch.name}
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
          {sortedSubjects.length} subject
          {sortedSubjects.length === 1 ? '' : 's'} · {totalCredits} credits total
        </p>
      </header>

      <div
        className="mb-6 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900/60"
        role="group"
        aria-label="Sort subjects"
      >
        {[
          { id: 'name', label: 'By Name' },
          { id: 'credits', label: 'By Credits' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSort(id)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              sort === id
                ? 'bg-white text-green-700 shadow-sm dark:bg-slate-800 dark:text-green-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            aria-pressed={sort === id}
          >
            {label}
          </button>
        ))}
      </div>

      {sortedSubjects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
          No subjects listed for this semester yet.
        </p>
      ) : (
        <motion.ul
          className="space-y-4"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {sortedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              branchId={branch.id}
              semNum={semNum}
              subject={subject}
            />
          ))}
        </motion.ul>
      )}
    </main>
  )
}
