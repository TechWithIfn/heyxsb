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

function SummaryIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6M9 9h2" />
    </svg>
  )
}

function ChevronIcon({ className, open }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={open ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
    </svg>
  )
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
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setSummary(null)
    setLoading(false)
    setError(null)
    setExpanded(false)
    setCopied(false)
  }, [resetKey])

  const handleSummarize = useCallback(async () => {
    const apiKey = getApiKey()
    if (!apiKey) {
      setError(
        'Add VITE_ANTHROPIC_API_KEY to your .env file to use Quick Summary.',
      )
      setExpanded(true)
      return
    }

    setExpanded(true)
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

  const hasSummary = Boolean(summary)
  const canCollapse = hasSummary || loading || Boolean(error)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-[#04AA6D] dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-400">
            <SummaryIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Quick Summary
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Generate a concise recap of the lesson when you want the key ideas
              in a faster, easier-to-scan format.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#04AA6D] bg-[#04AA6D] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#059862] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04AA6D] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-75 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500 dark:focus-visible:ring-offset-slate-950"
          >
            {loading
              ? 'Generating...'
              : hasSummary
                ? 'Regenerate summary'
                : 'Generate summary'}
          </button>

          {canCollapse && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-[#04AA6D] hover:text-[#04AA6D] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04AA6D] focus-visible:ring-offset-2 active:translate-y-px dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-green-500 dark:hover:text-green-400 dark:focus-visible:ring-offset-slate-950"
              aria-expanded={expanded}
            >
              <ChevronIcon className="h-4 w-4" open={expanded} />
              <span>{expanded ? 'Collapse' : 'Expand'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {loading && <SummarySkeleton />}

        {error && !loading && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
          >
            {error}
          </div>
        )}

        {!loading && !error && !summary && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-white">
              No summary generated yet.
            </p>
            <p className="mt-1">
              Use the generate button to create a short bullet recap of the
              lesson.
            </p>
          </div>
        )}

        {!loading && !error && summary && expanded && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="text-sm leading-relaxed">
              <MarkdownSummary markdown={summary} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#04AA6D] bg-white px-3 text-xs font-semibold text-[#04AA6D] transition-colors hover:bg-[#04AA6D] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04AA6D] focus-visible:ring-offset-2 dark:border-green-500 dark:bg-slate-800 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
              >
                {copied ? 'Copied!' : 'Copy summary'}
              </button>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Ready for quick review
              </span>
            </div>
          </div>
        )}

        {!loading && !error && summary && !expanded && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            Summary generated. Expand the card to review the main takeaways and
            copy them if needed.
          </div>
        )}
      </div>
    </div>
  )
}
