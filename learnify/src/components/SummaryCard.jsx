import { useCallback, useEffect, useState } from 'react'

const MODEL = 'claude-sonnet-4-5-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

function getApiKey() {
  return import.meta.env.VITE_ANTHROPIC_API_KEY?.trim() || ''
}

function markdownToPlainText(markdown) {
  return markdown
    .split('\n')
    .map((line) =>
      line
        .replace(/^[-*]\s+/, '• ')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .trim(),
    )
    .filter(Boolean)
    .join('\n')
}

function renderInline(text) {
  const parts = text.split(/(\*\*.+?\*\*)/g)
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/)
    if (bold) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {bold[1]}
        </strong>
      )
    }
    return part
  })
}

function MarkdownSummary({ markdown }) {
  const blocks = []
  let listItems = []

  const flushList = () => {
    if (listItems.length === 0) return
    blocks.push(
      <ul
        key={`list-${blocks.length}`}
        className="list-disc space-y-2 pl-5 marker:text-[#04AA6D] dark:marker:text-green-400"
      >
        {listItems.map((item, i) => (
          <li key={i} className="text-slate-800 dark:text-slate-200">
            {renderInline(item)}
          </li>
        ))}
      </ul>,
    )
    listItems = []
  }

  for (const line of markdown.split('\n')) {
    const trimmed = line.trim()
    const bullet = trimmed.match(/^[-*]\s+(.+)$/)
    if (bullet) {
      listItems.push(bullet[1])
      continue
    }
    flushList()
    if (!trimmed) continue
    const heading = trimmed.match(/^#{1,3}\s+(.+)$/)
    if (heading) {
      blocks.push(
        <p
          key={`h-${blocks.length}`}
          className="mb-2 text-sm font-bold uppercase tracking-wide text-[#04AA6D] dark:text-green-400"
        >
          {heading[1]}
        </p>,
      )
    } else {
      blocks.push(
        <p key={`p-${blocks.length}`} className="mb-2 text-slate-800 dark:text-slate-200">
          {renderInline(trimmed)}
        </p>,
      )
    }
  }
  flushList()

  return <div className="space-y-2">{blocks}</div>
}

function SummarySkeleton() {
  return (
    <div
      className="mt-4 animate-pulse rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/40"
      aria-hidden="true"
    >
      <div className="mb-4 h-4 w-32 rounded bg-green-200/80 dark:bg-green-800/60" />
      <ul className="space-y-3">
        {[88, 100, 72, 96, 80, 68].map((w, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-green-300 dark:bg-green-700" />
            <span
              className="h-3 rounded bg-green-200/90 dark:bg-green-800/50"
              style={{ width: `${w}%` }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

async function fetchSummary({ apiKey, lessonTitle, theoryText }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system:
        'You summarize programming lessons for LearnTheory. Reply with markdown only — no preamble.',
      messages: [
        {
          role: 'user',
          content: `Lesson: "${lessonTitle}"

Theory:
${theoryText || '(No theory provided)'}

Write a concise bullet-point summary with 5–7 points in markdown format.
Use a markdown unordered list only (lines starting with "- ").
Keep each bullet to one or two short sentences. Use **bold** sparingly for key terms.`,
        },
      ],
    }),
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const err = await res.json()
      detail = err?.error?.message ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }

  const data = await res.json()
  const text = data?.content?.find((b) => b.type === 'text')?.text?.trim()
  if (!text) throw new Error('Empty response from the API.')
  return text
}

export function SummaryCard({ lessonTitle, theoryText, resetKey }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setSummary(null)
    setLoading(false)
    setError(null)
    setVisible(false)
    setCopied(false)
  }, [resetKey])

  const handleSummarize = useCallback(async () => {
    if (summary) {
      setVisible(true)
      setError(null)
      return
    }

    const apiKey = getApiKey()
    if (!apiKey) {
      setError(
        'Add VITE_ANTHROPIC_API_KEY to your .env file to use Quick Summary.',
      )
      setVisible(true)
      return
    }

    setVisible(true)
    setError(null)
    setLoading(true)

    try {
      const text = await fetchSummary({
        apiKey,
        lessonTitle: lessonTitle ?? 'Lesson',
        theoryText: theoryText ?? '',
      })
      setSummary(text)
    } catch (err) {
      setError(
        err.message ||
          'Could not generate a summary right now. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [summary, lessonTitle, theoryText])

  const handleCopy = useCallback(async () => {
    if (!summary) return
    try {
      await navigator.clipboard.writeText(markdownToPlainText(summary))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }, [summary])

  const showCard = visible && (loading || summary || error)

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={handleSummarize}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-[#04AA6D] transition-colors hover:border-[#04AA6D] hover:bg-green-100 disabled:cursor-wait disabled:opacity-70 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400 dark:hover:border-green-500 dark:hover:bg-green-950"
      >
        <span aria-hidden="true">📋</span>
        Quick Summary
      </button>

      {showCard && loading && <SummarySkeleton />}

      {showCard && error && !loading && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
        >
          {error}
        </div>
      )}

      {showCard && summary && !loading && (
        <div className="mt-4 overflow-hidden rounded-xl border border-green-200 border-l-4 border-l-[#04AA6D] bg-gradient-to-br from-green-50 to-emerald-50/80 shadow-sm dark:border-green-900 dark:border-l-green-500 dark:from-green-950/60 dark:to-slate-900/40">
          <div className="flex items-center justify-between gap-3 border-b border-green-200/80 bg-green-100/50 px-5 py-3 dark:border-green-900/80 dark:bg-green-900/30">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#04AA6D] dark:text-green-400">
              Quick Summary
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg border border-[#04AA6D] bg-white px-3 py-1.5 text-xs font-semibold text-[#04AA6D] transition-colors hover:bg-[#04AA6D] hover:text-white dark:border-green-500 dark:bg-slate-800 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
            >
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
          <div className="px-5 py-4 text-sm leading-relaxed">
            <MarkdownSummary markdown={summary} />
          </div>
        </div>
      )}
    </div>
  )
}
