import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, ChevronDown, Search, Star } from 'lucide-react'
import { easeOut } from '../../lib/motion'
import { getEnglishName } from '../../ipu/utils/translate'

function TopicRow({ topic, unitLabel, isActive, isRead, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic.id)}
      className={`flex w-full items-start gap-2 border-l-4 px-3 py-2 text-left text-sm transition-colors ${
        isActive
          ? 'border-green-600 bg-green-50/80 text-green-900 dark:border-green-500 dark:bg-green-950/40 dark:text-green-100'
          : 'border-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      <span className="min-w-0 flex-1 leading-snug">
        {unitLabel && (
          <span className="mb-0.5 block text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {unitLabel}
          </span>
        )}
        <span className={isRead ? 'font-medium' : ''}>{topic.title}</span>
      </span>
    </button>
  )
}

function UnitBlock({
  unit,
  topics,
  activeTopic,
  readTopicSet,
  expanded,
  onToggle,
  onSelectTopic,
}) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
        <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
      >
        <span className="min-w-0 truncate">
          {`UNIT ${unit.unitNumber}`}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="overflow-hidden"
          >
            <ul>
              {topics.map((topic) => (
                <li key={topic.id}>
                  <TopicRow
                    topic={topic}
                    isActive={activeTopic === topic.id}
                    isRead={readTopicSet.has(topic.id)}
                    onSelect={onSelectTopic}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TopicSidebar({
  subject,
  activeTopic,
  progress,
  readTopics,
  bookmarks,
  onTopicSelect,
}) {
  const [tab, setTab] = useState('topics')
  const [query, setQuery] = useState('')
  const [expandedUnits, setExpandedUnits] = useState(() =>
    Object.fromEntries(subject.units.map((u) => [u.unitNumber, true])),
  )

  const readTopicSet = useMemo(() => new Set(readTopics), [readTopics])
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks])

  const flatTopics = useMemo(
    () =>
      subject.units.flatMap((u) =>
        u.topics.map((t) => ({
          ...t,
          unitNumber: u.unitNumber,
          unitTitle: u.title,
        })),
      ),
    [subject.units],
  )

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return flatTopics.filter((t) => t.title.toLowerCase().includes(q))
  }, [flatTopics, query])

  const bookmarkedTopics = useMemo(
    () => flatTopics.filter((t) => bookmarkSet.has(t.id)),
    [flatTopics, bookmarkSet],
  )

  const toggleUnit = (unitNumber) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitNumber]: !prev[unitNumber],
    }))
  }

  const handleSelect = (topicId) => {
    onTopicSelect(topicId)
  }

  const hasUnits =
    subject.units?.length > 0 &&
    subject.units.some((u) => u.topics?.length > 0)

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">
          {getEnglishName(subject)}
        </h2>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Overall progress</span>
            <span className="text-green-700 dark:text-green-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-500 dark:bg-green-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <Link
          to="/ipu-syllabus/bookmarks"
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-700 transition-colors hover:underline dark:text-green-400"
        >
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          My Bookmarks
        </Link>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'topics', label: 'Topics' },
          { id: 'bookmarks', label: 'Bookmarks' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
              tab === id
                ? 'border-b-2 border-green-600 text-green-700 dark:border-green-500 dark:text-green-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {id === 'bookmarks' && <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />}
            {label}
            {id === 'bookmarks' && bookmarks.length > 0 && (
              <span className="rounded-full bg-slate-200 px-1.5 text-[10px] dark:bg-slate-700">
                {bookmarks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'topics' && (
        <div className="border-b border-slate-200 p-3 dark:border-slate-700">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 dark:border-slate-600 dark:bg-gray-900 dark:text-white"
              aria-label="Search topics in subject"
            />
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        {!hasUnits ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Content coming soon for this subject.
          </p>
        ) : tab === 'bookmarks' ? (
          bookmarkedTopics.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No bookmarked topics yet. Star a topic in the lesson to save it here.
            </p>
          ) : (
            <ul>
              {bookmarkedTopics.map((topic) => (
                <li key={topic.id}>
                  <TopicRow
                    topic={topic}
                    unitLabel={`UNIT ${topic.unitNumber}`}
                    isActive={activeTopic === topic.id}
                    isRead={readTopicSet.has(topic.id)}
                    onSelect={handleSelect}
                  />
                </li>
              ))}
            </ul>
          )
        ) : query.trim() ? (
          searchResults.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No topics match your search.
            </p>
          ) : (
            <ul>
              {searchResults.map((topic) => (
                <li key={topic.id}>
                  <TopicRow
                    topic={topic}
                    unitLabel={`UNIT ${topic.unitNumber}`}
                    isActive={activeTopic === topic.id}
                    isRead={readTopicSet.has(topic.id)}
                    onSelect={handleSelect}
                  />
                </li>
              ))}
            </ul>
          )
        ) : hasUnits ? (
          subject.units.map((unit) => (
            <UnitBlock
              key={unit.unitNumber}
              unit={unit}
              topics={unit.topics}
              activeTopic={activeTopic}
              readTopicSet={readTopicSet}
              expanded={expandedUnits[unit.unitNumber] !== false}
              onToggle={() => toggleUnit(unit.unitNumber)}
              onSelectTopic={handleSelect}
            />
          ))
        ) : null}
      </div>
    </div>
  )
}
