import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
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
  Search,
  Zap,
} from 'lucide-react'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import ipuBranches from '../../data/ipuData.js'
import { getEnglishName } from '../../ipu/utils/translate'
import useIPUSearch from '../../hooks/useIPUSearch.js'
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

function countSubjects(branch) {
  return branch.semesters.reduce((n, sem) => n + sem.subjects.length, 0)
}

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
}

function SearchResultRow({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-green-700 dark:bg-slate-800 dark:text-green-400">
        <BranchIcon name={item.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-slate-900 dark:text-white">
          {item.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
          {item.breadcrumb}
        </span>
      </span>
    </button>
  )
}

function SearchResultsPanel({ results, onSelect, onClose }) {
  const sections = [
    { key: 'branches', label: 'Branches', items: results.branches },
    { key: 'subjects', label: 'Subjects', items: results.subjects },
    { key: 'topics', label: 'Topics', items: results.topics },
  ]

  const total = sections.reduce((n, s) => n + s.items.length, 0)

  if (total === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No matches found.
      </div>
    )
  }

  return (
    <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain py-1">
      {sections.map(
        ({ key, label, items }) =>
          items.length > 0 && (
            <div key={key} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {items.length}
                </span>
              </div>
              <ul>
                {items.map((item) => (
                  <li key={`${key}-${item.path}`}>
                    <SearchResultRow
                      item={item}
                      onSelect={() => {
                        onSelect(item)
                        onClose()
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  )
}

export function BranchesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const searchRef = useRef(null)
  const results = useIPUSearch(query)

  const showPanel = query.trim().length >= 2

  useEffect(() => {
    setPanelOpen(showPanel)
  }, [showPanel])

  useEffect(() => {
    if (!panelOpen) return

    const onDocClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setPanelOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [panelOpen])

  const handleResultSelect = (item) => {
    const path = item.path.split('#')[0]
    navigate(path)
    if (item.topicId) {
      window.setTimeout(() => {
        const el = document.getElementById(item.topicId)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <IPUBreadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'IPU Syllabus' },
        ]}
      />

      <motion.section
        className="mb-12 text-center sm:text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
            <GraduationCap size={36} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              IPU Syllabus
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              Explore all branches, semesters and subjects from Guru Gobind Singh
              Indraprastha University
            </p>
          </div>
        </div>

        <div ref={searchRef} className="relative mx-auto mt-8 max-w-xl sm:mx-0">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => showPanel && setPanelOpen(true)}
            placeholder="Search branches, subjects, topics…"
            className="relative z-10 w-full rounded-xl border-2 border-green-200 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/20 dark:border-green-900 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            aria-label="Search IPU syllabus"
            aria-expanded={panelOpen}
            aria-controls="ipu-global-search-results"
          />
          <AnimatePresence>
            {panelOpen && showPanel && (
              <motion.div
                id="ipu-global-search-results"
                role="listbox"
                className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: easeOut }}
              >
                <SearchResultsPanel
                  results={results}
                  onSelect={handleResultSelect}
                  onClose={() => setPanelOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          animate="show"
          layout
        >
          <AnimatePresence mode="popLayout">
            {ipuBranches.map((branch) => {
              const subjectTotal = countSubjects(branch)
              return (
                <motion.li
                  key={branch.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                >
                  <motion.button
                    type="button"
                    onClick={() => navigate(`/ipu-syllabus/${branch.id}`)}
                    className="flex h-full w-full flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800"
                    whileHover={{
                      y: -4,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/80 ${branch.color}`}
                      >
                        <BranchIcon name={branch.icon} className="h-5 w-5" />
                      </span>
                      <span
                        className={`shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold dark:bg-slate-900 ${branch.color}`}
                      >
                        {branch.shortName}
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                      {getEnglishName(branch)}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {branch.description}
                    </p>

                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      {branch.totalSemesters} semester
                      {branch.totalSemesters === 1 ? '' : 's'} · {subjectTotal}{' '}
                      subject{subjectTotal === 1 ? '' : 's'} total
                    </p>

                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-green-700 dark:text-green-400">
                      Explore →
                    </span>
                  </motion.button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
    </main>
  )
}
