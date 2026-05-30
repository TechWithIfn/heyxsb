import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Download, Search, Trash2 } from 'lucide-react'
import { loadBranchCatalog } from '../utils/navigationData'
import { getEnglishName } from '../utils/translate'
import { buildNoteKey } from '../components/PersonalNotes'

const NOTE_PREFIX = 'ipu-note-'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readAllStoredNotes() {
  const storage = getStorage()
  if (!storage) {
    return []
  }

  const items = []
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (!key || !key.startsWith(NOTE_PREFIX)) {
      continue
    }

    const value = storage.getItem(key) ?? ''
    if (value.trim()) {
      items.push({ key, value })
    }
  }

  return items
}

function previewText(text, length = 100) {
  const cleaned = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (cleaned.length <= length) {
    return cleaned
  }

  return `${cleaned.slice(0, length).trim()}...`
}

function buildTopicIndex(catalog) {
  const index = new Map()

  catalog.forEach((branch) => {
    branch.semesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        subject.units.forEach((unit) => {
          unit.topics.forEach((topic) => {
            index.set(buildNoteKey(branch.id, semester.semNumber, subject.id, topic.id), {
              branchId: branch.id,
              branchName: getEnglishName(branch),
              branchShortName: branch.shortName,
              sem: semester.semNumber,
              subjectId: subject.id,
              subjectName: getEnglishName(subject),
              subjectCode: subject.subjectCode || subject.code,
              unitId: unit.id,
              unitTitle: unit.title,
              topicId: topic.id,
              topicTitle: topic.title,
            })
          })
        })
      })
    })
  })

  return index
}

function NoteCard({ note, onDelete, onOpen }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              {note.branchShortName} · Sem {note.sem}
            </p>
            {note?.meta?.bookmarked && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">★ Bookmark</span>
            )}
          </div>
          <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            {note.topicTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {note.subjectName} · {note.unitTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {previewText(note.value)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{note.branchName}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{note.subjectCode}</span>
      </div>
    </article>
  )
}

export function IPUNotesPage() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState([])
  const [search, setSearch] = useState('')
  const [version, setVersion] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    loadBranchCatalog().then((branches) => {
      if (!cancelled) {
        setCatalog(branches.filter(Boolean))
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const refresh = () => setVersion((current) => current + 1)
    window.addEventListener('learnify-ipu-notes-updated', refresh)
    return () => window.removeEventListener('learnify-ipu-notes-updated', refresh)
  }, [])

  const notes = useMemo(() => {
    const topicIndex = buildTopicIndex(catalog)
    const storedNotes = readAllStoredNotes()

    return storedNotes
      .map((item) => ({
        ...topicIndex.get(item.key),
        key: item.key,
        value: item.value,
        meta: (() => {
          try {
            const raw = window.localStorage?.getItem(`${item.key}-meta`)
            return raw ? JSON.parse(raw) : { bookmarked: false }
          } catch {
            return { bookmarked: false }
          }
        })(),
      }))
      .filter(Boolean)
      .filter((note) => {
        const needle = search.trim().toLowerCase()
        if (!needle) {
          return true
        }

        return [note.topicTitle, note.subjectName, note.unitTitle, note.value]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      })
  }, [catalog, search, version])

  const exportNotes = () => {
    const lines = notes.map((note) => [
      `${note.topicTitle}`,
      `${note.branchName} > Sem ${note.sem} > ${note.subjectName} > ${note.unitTitle}`,
      '',
      note.value,
      '\n---\n',
    ].join('\n'))

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'learnify-ipu-notes.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const removeNote = (note) => {
    const storage = getStorage()
    if (!storage) {
      return
    }

    storage.removeItem(note.key)
    window.dispatchEvent(new Event('learnify-ipu-notes-updated'))
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="h-10 w-64 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                IPU Notes
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                📝 My Notes
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
                Search, review, delete, or export your saved topic notes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/ipu/dashboard"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Back to dashboard
              </Link>
              <button
                type="button"
                onClick={exportNotes}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export .txt
              </button>
            </div>
          </div>

          <label className="relative mt-8 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search inside notes..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Saved Notes</p>
              <p className="mt-2 text-3xl font-black">{notes.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Branches</p>
              <p className="mt-2 text-3xl font-black">{new Set(notes.map((note) => note.branchId)).size}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Subjects</p>
              <p className="mt-2 text-3xl font-black">{new Set(notes.map((note) => `${note.branchId}-${note.sem}-${note.subjectId}`)).size}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Search Match</p>
              <p className="mt-2 text-3xl font-black">{search ? notes.length : '—'}</p>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
              No notes found. Open any topic and start writing in the notes panel.
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {notes.map((note) => (
                <div key={note.key}>
                  <NoteCard
                    note={note}
                    onDelete={() => removeNote(note)}
                    onOpen={() => navigate(`/ipu/${note.branchId}/${note.sem}/${note.subjectId}/${note.topicId}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
