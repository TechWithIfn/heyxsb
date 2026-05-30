import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import {
  getBranchFilterGroup,
  getBranchMeta,
  getBranchProgramLabel,
  loadBranchCatalog,
  IPU_RECENT_ACTIVITY_EVENT,
  readRecentSubjects,
} from '../utils/navigationData'
import { getEnglishName, getEnglishShortName } from '../utils/translate'

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

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'btech', label: 'B.Tech' },
  { id: 'pg', label: 'PG (MCA/MBA)' },
  { id: 'bca', label: 'BCA/BCS' },
]

function BranchIcon({ name, className }) {
  const Icon = ICON_MAP[name] ?? BookOpen
  return <Icon className={className} aria-hidden="true" />
}

function matchBranchQuery(branch, query) {
  if (!query) {
    return true
  }

  return (branch.searchIndex ?? '').includes(query)
}

function branchMatchesFilter(branch, filterId) {
  if (filterId === 'all') {
    return true
  }

  return getBranchFilterGroup(branch) === filterId
}

function RecentSubjectCard({ item, onOpen }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-[#dddddd] bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-[#444444] dark:bg-[#2e2e3e]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-[#D9EEE1] px-2 py-1 text-xs font-bold uppercase text-[#04AA6D] dark:bg-green-900/30 dark:text-green-400">
            {item.branchShortName || item.branchId.toUpperCase()}
          </span>
          <span className="rounded bg-[#f1f1f1] px-2 py-1 text-xs font-semibold text-[#282A35] dark:bg-slate-700 dark:text-slate-200">
            Sem {item.semNumber}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#282A35] dark:text-[#E0E0E0]">
          {item.topicTitle || item.subjectName}
        </h3>
        <p className="mt-1 text-sm text-[#595959] dark:text-[#AAAAAA]">
          {item.subjectName ? `${item.subjectName} · ` : ''}{item.branchName}
        </p>
        {item.topicTitle && (
          <p className="mt-2 text-xs text-[#595959] dark:text-[#AAAAAA]">
            {item.unitTitle || 'Topic'}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-5 inline-block w-full rounded bg-[#04AA6D] px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#059862]"
      >
        Resume Learning
      </button>
    </article>
  )
}

function BranchCard({ branch, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col rounded-lg border border-[#dddddd] bg-[#f1f1f1] p-6 text-left transition-colors hover:border-[#04AA6D] dark:border-[#444444] dark:bg-[#2e2e3e] dark:hover:border-[#04AA6D]"
    >
      <div className="flex items-center justify-between w-full">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded bg-[#282A35] text-white dark:bg-[#1a1a2a]">
            <BranchIcon name={branch.icon} className="h-5 w-5" />
          </span>
        <span className="rounded bg-[#04AA6D] px-2 py-1 text-xs font-bold uppercase text-white">
          {getBranchProgramLabel(branch)}
        </span>
      </div>

      <div className="mt-6 flex-1">
            <h3 className="text-2xl font-bold text-[#282A35] dark:text-[#E0E0E0]">
              {getEnglishShortName(branch) || branch.shortName}
            </h3>
            <p className="mt-2 text-sm text-[#595959] dark:text-[#AAAAAA]">
              {getEnglishName(branch)}
            </p>
        <p className="mt-4 text-sm font-semibold text-[#04AA6D]">
          {branch.totalSemesters} semester{branch.totalSemesters === 1 ? '' : 's'}
        </p>
      </div>
    </button>
  )
}

export function IPUHomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filterId, setFilterId] = useState('all')
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentSubjects, setRecentSubjects] = useState(() => readRecentSubjects())

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await loadBranchCatalog()
        if (!cancelled) {
          setCatalog(data.filter(Boolean))
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
  }, [])

  useEffect(() => {
    const refresh = () => setRecentSubjects(readRecentSubjects())
    window.addEventListener(IPU_RECENT_ACTIVITY_EVENT, refresh)
    refresh()
    return () => window.removeEventListener(IPU_RECENT_ACTIVITY_EVENT, refresh)
  }, [])

  const filteredBranches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return catalog.filter(
      (branch) =>
        branchMatchesFilter(branch, filterId) && matchBranchQuery(branch, normalizedQuery),
    )
  }, [catalog, filterId, query])

  return (
    <main className="min-h-screen bg-white dark:bg-[#282A35]">
      {/* Jumbotron removed per user request; show compact page header */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#282A35] dark:text-white">IPU Syllabus Reference</h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setFilterId(filter.id)}
                aria-pressed={filterId === filter.id}
                className={`rounded px-4 py-2 text-sm font-bold transition-colors ${
                  filterId === filter.id
                    ? 'bg-[#04AA6D] text-white'
                    : 'bg-[#f1f1f1] text-[#282A35] hover:bg-[#dddddd] dark:bg-[#2e2e3e] dark:text-[#E0E0E0] dark:hover:bg-[#3e3e4e]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-3xl font-bold text-[#282A35] dark:text-white">Branches</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-lg bg-[#f1f1f1] dark:bg-[#2e2e3e]"
                />
              ))}
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="rounded-lg border border-[#dddddd] bg-[#f1f1f1] p-10 text-center text-[#595959] dark:border-[#444444] dark:bg-[#2e2e3e] dark:text-[#AAAAAA]">
              No branches match your current search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredBranches.map((branch) => (
                <div key={branch.id}>
                  <BranchCard
                    branch={branch}
                    onOpen={() => navigate(`/ipu/${branch.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#282A35] dark:text-white">Recently Viewed Lessons</h2>
            <p className="mt-2 text-[#595959] dark:text-[#AAAAAA]">
              Pick up where you left off.
            </p>
          </div>

          {recentSubjects.length === 0 ? (
            <div className="rounded-lg bg-[#E7F3FE] p-6 text-[#282A35] border-l-4 border-[#2196F3] dark:bg-blue-900/20 dark:text-blue-100">
              <strong>Info!</strong> Open any topic to populate your recent study history.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentSubjects.map((item) => {
                const branch = getBranchMeta(item.branchId)
                return (
                  <RecentSubjectCard
                    key={`${item.branchId}-${item.semNumber}-${item.subjectId}-${item.topicId ?? 'subject'}`}
                    item={{
                      ...item,
                      branchName: item.branchName || branch?.name || 'IPU',
                      branchShortName:
                        item.branchShortName || branch?.shortName || item.branchId.toUpperCase(),
                    }}
                    onOpen={() =>
                      navigate(
                        `/ipu/${item.branchId}/${item.semNumber}/${item.subjectId}/${item.topicId ?? ''}`.replace(/\/$/, ''),
                      )
                    }
                  />
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

