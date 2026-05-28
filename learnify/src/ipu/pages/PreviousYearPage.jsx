import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Download } from 'lucide-react'
import { loadSubjectData, getAllTopicsFlat } from '../utils/dataLoader'
import ReactMarkdown from 'react-markdown'

export default function PreviousYearPage() {
  const [params] = useSearchParams()
  const branch = params.get('branch')
  const sem = params.get('sem')
  const subjectId = params.get('subjectId')

  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadSubjectData(branch, Number.parseInt(sem || '0', 10), subjectId)
      .then((s) => {
        if (!cancelled) setSubject(s)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [branch, sem, subjectId])

  const grouped = useMemo(() => {
    if (!subject) return []
    const topics = getAllTopicsFlat(subject)
    return topics.map((t) => ({ topic: t, pyqs: (t.pyqs || t.content?.pyqs || []) }))
  }, [subject])

  const filtered = grouped.filter((g) => {
    const q = filter.trim().toLowerCase()
    if (!q) return true
    return (
      String(g.topic.topicTitle || g.topic.title || '').toLowerCase().includes(q) ||
      (g.pyqs || []).some((eq) => String(eq).toLowerCase().includes(q))
    )
  })

  const downloadAll = () => {
    const lines = []
    grouped.forEach((g) => {
      if ((g.pyqs || []).length === 0) return
      lines.push(`# ${g.topic.topicTitle || g.topic.title}`)
      lines.push(...g.pyqs.map((q, i) => `${i + 1}. ${q}`))
      lines.push('\n')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${subject?.name || 'subject'}-previous-year-questions.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!subject) return <div className="p-8">Subject not found.</div>

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Previous Year Questions — {subject.name}</h1>
          <p className="text-sm text-slate-600">Semester-wise previous year questions aggregated by topic.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={downloadAll} className="rounded-lg bg-emerald-600 px-3 py-2 text-white">Download</button>
        </div>
      </div>

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search previous year questions..." className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4" />
      </label>

      <div className="mt-6 space-y-6">
        {filtered.map((g) => (
          <section key={g.topic.topicId || g.topic.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{g.topic.topicTitle || g.topic.title}</h2>
            <div className="mt-3 space-y-2">
              {(g.pyqs || []).length === 0 ? (
                <p className="text-sm text-slate-500">No previous year questions for this topic.</p>
              ) : (
                <ol className="list-decimal pl-5">
                  {(g.pyqs || []).map((q, i) => (
                    <li key={i} className="mb-2 text-sm">
                      <ReactMarkdown>{q}</ReactMarkdown>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
