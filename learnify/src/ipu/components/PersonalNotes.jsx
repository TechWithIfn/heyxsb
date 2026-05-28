import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Star, Edit3 } from 'lucide-react'

const NOTES_CHANGED_EVENT = 'learnify-ipu-notes-updated'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readNote(key) {
  const storage = getStorage()
  if (!storage) {
    return ''
  }

  try {
    return storage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

function writeNote(key, value) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    if (value.trim()) {
      storage.setItem(key, value)
    } else {
      storage.removeItem(key)
    }
    window.dispatchEvent(new Event(NOTES_CHANGED_EVENT))
  } catch {
    /* storage blocked */
  }
}

export function buildNoteKey(branchId, sem, subjectId, topicId) {
  return `ipu-note-${String(branchId ?? '').toLowerCase()}-${sem}-${subjectId}-${topicId}`
}

export default function PersonalNotes({ branchId, sem, subjectId, topicId, topicTitle }) {
  const storageKey = useMemo(
    () => buildNoteKey(branchId, sem, subjectId, topicId),
    [branchId, sem, subjectId, topicId],
  )
  const [value, setValue] = useState(() => readNote(storageKey))
  const [saved, setSaved] = useState(Boolean(readNote(storageKey).trim()))
  const [open, setOpen] = useState(true)
  const [preview, setPreview] = useState(false)
  const [meta, setMeta] = useState(() => {
    try {
      const raw = window.localStorage?.getItem(`${storageKey}-meta`)
      return raw ? JSON.parse(raw) : { bookmarked: false }
    } catch {
      return { bookmarked: false }
    }
  })

  useEffect(() => {
    const nextValue = readNote(storageKey)
    setValue(nextValue)
    setSaved(Boolean(nextValue.trim()))
  }, [storageKey])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      writeNote(storageKey, value)
      setSaved(Boolean(value.trim()))
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [storageKey, value])

  useEffect(() => {
    try {
      window.localStorage?.setItem(`${storageKey}-meta`, JSON.stringify(meta))
    } catch {
      /* ignore */
    }
  }, [storageKey, meta])

  useEffect(() => {
    const onUpdate = () => {
      const nextValue = readNote(storageKey)
      setValue(nextValue)
      setSaved(Boolean(nextValue.trim()))
    }

    window.addEventListener(NOTES_CHANGED_EVENT, onUpdate)
    return () => window.removeEventListener(NOTES_CHANGED_EVENT, onUpdate)
  }, [storageKey])

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">📝 My Notes</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Write notes for {topicTitle || 'this topic'} using simple markdown like **bold** or - bullet points.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {open ? 'Collapse' : 'Expand'}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm"
              >
                <Edit3 className="w-4 h-4" />
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button
                type="button"
                onClick={() => setMeta((m) => ({ ...m, bookmarked: !m.bookmarked }))}
                title={meta?.bookmarked ? 'Unbookmark topic' : 'Bookmark topic'}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm"
              >
                <Star className={`w-4 h-4 ${meta?.bookmarked ? 'text-amber-500' : ''}`} />
                {meta?.bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{value.length} characters · <span className={saved ? 'text-emerald-600 dark:text-emerald-400' : ''}>{saved ? '✓ Saved' : 'Saving...'}</span></div>
          </div>

          {!preview ? (
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Write your notes for this topic..."
              className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          ) : (
            <div className="prose max-w-none rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <ReactMarkdown>{value || '*No content to preview*'}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
