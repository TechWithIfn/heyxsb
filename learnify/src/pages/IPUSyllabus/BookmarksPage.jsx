import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Star,
  Zap,
} from 'lucide-react'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import ipuBranches from '../../data/ipuData.js'
import { getAllBookmarkedTopics } from '../../lib/ipuSubjectStorage'
import { easeOut } from '../../lib/motion'
import { getEnglishName } from '../../ipu/utils/translate'

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

function resolveBookmarks() {
  const stored = getAllBookmarkedTopics()
  const groups = []

  for (const { subjectId, topicIds } of stored) {
    for (const branch of ipuBranches) {
      for (const sem of branch.semesters) {
        const subject = sem.subjects.find((s) => s.id === subjectId)
        if (!subject) continue

        const topics = []
        for (const unit of subject.units) {
          for (const topic of unit.topics) {
            if (topicIds.includes(topic.id)) {
              topics.push({
                ...topic,
                unitNumber: unit.unitNumber,
                path: `/ipu-syllabus/${branch.id}/semester/${sem.semNumber}/subject/${subjectId}#${topic.id}`,
              })
            }
          }
        }

        if (topics.length > 0) {
          groups.push({
            branchId: branch.id,
            branchName: getEnglishName(branch),
            shortName: branch.shortName,
            icon: branch.icon,
            semNum: sem.semNumber,
            subjectId: subject.id,
            subjectName: getEnglishName(subject),
            subjectCode: subject.subjectCode,
            topics,
          })
        }
      }
    }
  }

  return groups
}

export function BookmarksPage() {
  const navigate = useNavigate()
  const groups = useMemo(() => resolveBookmarks(), [])
  const totalTopics = groups.reduce((n, g) => n + g.topics.length, 0)

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-3xl px-4 py-10 outline-none sm:px-6 sm:py-14"
    >
      <IPUBreadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'IPU Syllabus', to: '/ipu-syllabus' },
          { label: 'My Bookmarks' },
        ]}
      />

      <header className="mb-10">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
          <Star className="h-8 w-8 fill-amber-400 text-amber-500" aria-hidden="true" />
          My Bookmarks
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {totalTopics > 0
            ? `${totalTopics} saved topic${totalTopics === 1 ? '' : 's'} across your IPU syllabus.`
            : 'Star topics while studying to save them here.'}
        </p>
        <Link
          to="/ipu-syllabus"
          className="mt-4 inline-flex text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
        >
          ← Back to branches
        </Link>
      </header>

      {groups.length === 0 ? (
        <motion.div
          className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Star
            className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-600"
            aria-hidden="true"
          />
          <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
            No bookmarks yet
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Open any subject and tap the star on a topic to bookmark it.
          </p>
        </motion.div>
      ) : (
        <ul className="space-y-8">
          {groups.map((group) => (
            <motion.li
              key={`${group.branchId}-${group.semNum}-${group.subjectId}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900">
                  <BranchIcon name={group.icon} className="h-5 w-5 text-green-700 dark:text-green-400" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {group.shortName} · Semester {group.semNum}
                  </p>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    {group.subjectName}
                  </h2>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {group.subjectCode}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {group.topics.map((topic) => (
                  <li
                    key={topic.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {topic.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Unit {topic.unitNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(topic.path.replace(/#.*$/, '') + `#${topic.id}`)}
                      className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
                    >
                      Go to topic
                    </button>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      )}
    </main>
  )
}
