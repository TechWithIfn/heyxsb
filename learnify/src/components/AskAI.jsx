import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

const MODEL = 'claude-sonnet-4-5-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

function SparkleIcon({ className }) {
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
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </svg>
  )
}

function CloseIcon({ className }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function Spinner({ className }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function getApiKey() {
  return import.meta.env.VITE_ANTHROPIC_API_KEY?.trim() || ''
}

function buildSystemPrompt(lessonTitle, theoryText) {
  return `You are a friendly tutor on LearnTheory, an open-source programming education platform.
The student is reading the lesson "${lessonTitle}".

Use the lesson theory below as your primary source. Answer clearly and concisely. Use short paragraphs and examples when helpful. If the question is outside the lesson, say so briefly and still help.

--- Lesson theory ---
${theoryText || '(No theory text provided for this lesson.)'}
--- End lesson theory ---`
}

async function streamAnthropic({ apiKey, lessonTitle, theoryText, question, onDelta }) {
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
      max_tokens: 2048,
      stream: true,
      system: buildSystemPrompt(lessonTitle, theoryText),
      messages: [{ role: 'user', content: question }],
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

  const reader = res.body?.getReader()
  if (!reader) throw new Error('Streaming not supported in this browser.')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (!data || data === '[DONE]') continue

      try {
        const event = JSON.parse(data)
        if (
          event.type === 'content_block_delta' &&
          event.delta?.type === 'text_delta' &&
          event.delta.text
        ) {
          onDelta(event.delta.text)
        }
      } catch {
        /* skip malformed SSE chunks */
      }
    }
  }
}

export function AskAI({ open, onClose, lessonTitle, theoryText }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const answerRef = useRef(null)

  const envKey = getApiKey()
  const apiKey = envKey || apiKeyInput.trim()
  const needsKey = !envKey

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, loading])

  useEffect(() => {
    if (!open) {
      setQuestion('')
      setAnswer('')
      setError(null)
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight
    }
  }, [answer])

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault()
      const q = question.trim()
      if (!q || loading) return

      if (!apiKey) {
        setError('Add your Anthropic API key to continue.')
        return
      }

      setError(null)
      setAnswer('')
      setLoading(true)

      try {
        await streamAnthropic({
          apiKey,
          lessonTitle: lessonTitle ?? 'Lesson',
          theoryText: theoryText ?? '',
          question: q,
          onDelta: (text) => {
            setAnswer((prev) => prev + text)
            setLoading(false)
          },
        })
      } catch (err) {
        setError(err.message || 'Something went wrong. Try again.')
      } finally {
        setLoading(false)
      }
    },
    [question, loading, apiKey, lessonTitle, theoryText],
  )

  const panelRef = useFocusTrap(open)
  const showSpinner = loading && !answer

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60"
        onClick={() => !loading && onClose()}
        aria-label="Close Ask AI panel"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-ai-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-green-200 bg-white shadow-2xl dark:border-green-900 dark:bg-slate-900 sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-green-100 bg-gradient-to-r from-[#04AA6D] to-[#059862] px-4 py-4 dark:border-green-900 dark:from-green-700 dark:to-green-800">
          <div className="flex min-w-0 items-center gap-2 text-white">
            <SparkleIcon className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <h2 id="ask-ai-title" className="text-lg font-bold leading-tight">
                Explain This
              </h2>
              <p className="truncate text-xs text-white/85">{lessonTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25 disabled:opacity-50"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {needsKey && (
            <div className="shrink-0 border-b border-green-100 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/40">
              <label
                htmlFor="anthropic-api-key"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#04AA6D] dark:text-green-400"
              >
                Anthropic API key
              </label>
              <input
                id="anthropic-api-key"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                autoComplete="off"
                className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-[#04AA6D] focus:border-[#04AA6D] focus:ring-2 dark:border-green-800 dark:bg-slate-800 dark:text-slate-100"
              />
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Or set{' '}
                <code className="rounded bg-green-100 px-1 py-0.5 text-[11px] dark:bg-green-900/60">
                  VITE_ANTHROPIC_API_KEY
                </code>{' '}
                in your <code className="text-[11px]">.env</code> file.
              </p>
            </div>
          )}

          <div
            ref={answerRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
          >
            {!answer && !error && !showSpinner && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ask anything about this lesson — concepts, examples, or how it
                applies in real projects.
              </p>
            )}

            {showSpinner && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#04AA6D] dark:text-green-400">
                <Spinner className="h-10 w-10" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Thinking…
                </p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
              >
                {error}
              </div>
            )}

            {answer && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {answer}
                  {loading && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-[#04AA6D] align-middle dark:bg-green-400" />
                  )}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-green-100 bg-green-50/80 p-4 dark:border-green-900 dark:bg-slate-800/80"
          >
            <label htmlFor="ask-ai-question" className="sr-only">
              Your question
            </label>
            <textarea
              id="ask-ai-question"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="e.g. Can you explain this in simpler terms?"
              disabled={loading}
              className="mb-3 w-full resize-none rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-[#04AA6D] focus:border-[#04AA6D] focus:ring-2 disabled:opacity-60 dark:border-green-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#04AA6D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#059862] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-500"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Generating…
                </>
              ) : (
                <>
                  <SparkleIcon className="h-4 w-4" />
                  Ask AI
                </>
              )}
            </button>
          </form>
        </div>
      </aside>
    </div>
  )
}
