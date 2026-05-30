import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { loadBranchCatalog } from '../utils/navigationData'
import { getEnglishName } from '../utils/translate'

const RECENT_SEARCHES_KEY = 'learnify-ipu-recent-searches-v1'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readRecentSearches() {
  const storage = getStorage()
  if (!storage) {
    return []
  }

  try {
    const raw = storage.getItem(RECENT_SEARCHES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query) {
  const value = String(query ?? '').trim()
  if (!value) {
    return
  }

  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    const next = [value, ...readRecentSearches().filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 6)
    storage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
  } catch {
    /* storage blocked */
  }
}

function normalize(value) {
  return String(value ?? '').toLowerCase()
}

function extractTopicSearchFields(topic) {
  const content = topic?.content ?? {}
  const theory = Array.isArray(content.theory) ? content.theory.join(' ') : ''
  const definition = content.definition?.text ?? ''
  const keyPoints = Array.isArray(content.keyPoints) ? content.keyPoints.join(' ') : ''
  const formulas = Array.isArray(content.formulas)
    ? content.formulas
        .map((formula) => [formula.name, formula.formula, formula.description].filter(Boolean).join(' '))
        .join(' ')
    : ''
  const examples = Array.isArray(content.examples)
    ? content.examples
        .map((example) => [example.problem, example.solution, example.title, example.explanation].filter(Boolean).join(' '))
        .join(' ')
    : ''
  const examQuestions = Array.isArray(content.examQuestions)
    ? content.examQuestions
        .map((question) => (typeof question === 'string' ? question : question.question))
        .filter(Boolean)
        .join(' ')
    : ''
  const subtopics = Array.isArray(topic?.subtopics) ? topic.subtopics.join(' ') : ''

  return [topic?.title, subtopics, theory, definition, keyPoints, formulas, examples, examQuestions]
    .filter(Boolean)
    .join(' ')
}

function highlightExcerpt(text, query) {
  const source = String(text ?? '')
  const needle = String(query ?? '').trim()

  if (!needle) {
    return [{ text: source, highlight: false }]
  }

  const lowerSource = source.toLowerCase()
  const lowerNeedle = needle.toLowerCase()
  const index = lowerSource.indexOf(lowerNeedle)

  if (index === -1) {
    return [{ text: source, highlight: false }]
  }

  const before = source.slice(0, index)
  const match = source.slice(index, index + needle.length)
  const after = source.slice(index + needle.length)

  return [
    { text: before, highlight: false },
    { text: match, highlight: true },
    { text: after, highlight: false },
  ]
}

function renderHighlightedParts(parts) {
  return parts.map((part, index) =>
    part.highlight ? (
      <mark key={index} className="rounded bg-yellow-300 px-0.5 text-slate-900">
        {part.text}
      </mark>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  )
}

export default function IPUSearchOverlay({ open, onClose, onOpenTopic }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [catalog, setCatalog] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState(() => readRecentSearches())

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false
    setLoading(true)

    loadBranchCatalog().then((branches) => {
      if (!cancelled) {
        setCatalog(branches.filter(Boolean))
        setLoading(false)
      }
    })

    window.setTimeout(() => inputRef.current?.focus(), 0)

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  const results = useMemo(() => {
    const needle = normalize(debouncedQuery)
    if (!needle) {
      return []
    }

    const rows = []

    catalog.forEach((branch) => {
      branch.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          subject.units.forEach((unit) => {
            unit.topics.forEach((topic) => {
              const searchText = normalize(extractTopicSearchFields(topic))
              if (!searchText.includes(needle)) {
                return
              }

              const excerptSource =
                topic.title ||
                (Array.isArray(topic.subtopics) && topic.subtopics[0]) ||
                (Array.isArray(topic.content?.keyPoints) && topic.content.keyPoints[0]) ||
                (Array.isArray(topic.content?.examQuestions) &&
                  (typeof topic.content.examQuestions[0] === 'string'
                    ? topic.content.examQuestions[0]
                    : topic.content.examQuestions[0]?.question)) ||
                ''

              rows.push({
                branchId: branch.id,
                branchName: getEnglishName(branch),
                branchShortName: branch.shortName,
                semNumber: semester.semNumber,
                subjectId: subject.id,
                subjectName: getEnglishName(subject),
                subjectCode: subject.subjectCode || subject.code,
                unitId: unit.id,
                unitTitle: unit.title,
                topicId: topic.id,
                topicTitle: topic.title,
                groupKey: `${branch.id}|${semester.semNumber}|${subject.id}|${unit.id}`,
                groupLabel: `In ${branch.shortName} > Sem ${semester.semNumber} > ${getEnglishName(subject)} > ${unit.title}`,
                excerpt: excerptSource,
                searchedText: searchText,
              })
            })
          })
        })
      })
    })

    return rows
  }, [catalog, debouncedQuery])

  const groupedResults = useMemo(() => {
    const groups = new Map()

    results.forEach((result) => {
      if (!groups.has(result.groupKey)) {
        groups.set(result.groupKey, {
          groupKey: result.groupKey,
          groupLabel: result.groupLabel,
          items: [],
        })
      }

      groups.get(result.groupKey).items.push(result)
    })

    return Array.from(groups.values())
  }, [results])

  const flatResults = useMemo(() => groupedResults.flatMap((group) => group.items), [groupedResults])

  useEffect(() => {
    setSelectedIndex(0)
  }, [debouncedQuery])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((index) => Math.min(index + 1, Math.max(0, flatResults.length - 1)))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((index) => Math.max(index - 1, 0))
        return
      }

      if (event.key === 'Enter' && flatResults[selectedIndex]) {
        event.preventDefault()
        handleSelect(flatResults[selectedIndex])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [flatResults, onClose, open, selectedIndex])

  function handleSelect(result) {
    if (!result) {
      return
    }

    saveRecentSearch(query)
    setRecentSearches(readRecentSearches())
    onOpenTopic(`/ipu/${result.branchId}/${result.semNumber}/${result.subjectId}/${result.topicId}`)
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
              Search IPU
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Find topics, subtopics, formulas, and exam questions
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-label="Close search"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Arrays, Limit, Newton's Law..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/20"
            />
          </div>

          {!debouncedQuery && recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Recent searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 max-h-[60vh] overflow-y-auto overscroll-contain pr-1">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
                Loading IPU syllabus index...
              </div>
            ) : debouncedQuery && flatResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
                <p className="text-lg font-semibold text-white">No results</p>
                <p className="mt-2 text-sm text-slate-400">
                  Try searching: Arrays, Limit, Newton&apos;s Law...
                </p>
              </div>
            ) : (
              groupedResults.map((group) => (
                <section key={group.groupKey} className="mb-6 last:mb-0">
                  <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-slate-300">
                    <span className="h-px flex-1 bg-white/10" />
                    <span>{group.groupLabel}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="space-y-3">
                    {group.items.map((result) => {
                      const index = flatResults.findIndex((item) => item === result)
                      const selected = index === selectedIndex
                      return (
                        <button
                          key={`${result.groupKey}-${result.topicId}`}
                          type="button"
                          onClick={() => handleSelect(result)}
                          className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                            selected
                              ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                              : 'border-white/10 bg-slate-950/70 hover:border-white/20 hover:bg-slate-950'
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            <span className="rounded-full bg-white/5 px-2 py-1 text-emerald-300">
                              Sem {result.semNumber}
                            </span>
                            <span className="rounded-full bg-white/5 px-2 py-1 text-slate-300">
                              {result.subjectCode}
                            </span>
                          </div>
                          <h3 className="mt-3 text-lg font-bold text-white">
                            {result.topicTitle}
                          </h3>
                          <p className="mt-1 text-sm text-slate-300">
                            {result.subjectName}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-200">
                            {renderHighlightedParts(highlightExcerpt(result.excerpt, debouncedQuery))}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
