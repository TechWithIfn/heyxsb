import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildLessonQuizDeck } from '../lib/quiz'

const MODEL = 'claude-sonnet-4-5-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

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

function extractJsonArray(text) {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1].trim() : trimmed
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Could not find a JSON array in the response.')
  }
  return JSON.parse(raw.slice(start, end + 1))
}

function normalizeQuizItem(item, index) {
  if (!item || typeof item.question !== 'string') {
    throw new Error(`Question ${index + 1} is missing a question string.`)
  }
  if (!Array.isArray(item.options) || item.options.length !== 4) {
    throw new Error(`Question ${index + 1} must have exactly 4 options.`)
  }
  const answer = Number(item.answer)
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
    throw new Error(`Question ${index + 1} must have answer 0–3.`)
  }
  return {
    question: item.question.trim(),
    options: item.options.map((o) => String(o).trim()),
    answer,
    explanation:
      typeof item.explanation === 'string' ? item.explanation.trim() : '',
  }
}

function parseQuizJson(text) {
  const parsed = extractJsonArray(text)
  if (!Array.isArray(parsed)) {
    throw new Error('Response was not a JSON array.')
  }
  if (parsed.length !== 5) {
    throw new Error(`Expected 5 questions, got ${parsed.length}.`)
  }
  return parsed.map(normalizeQuizItem)
}

async function generateQuiz({ apiKey, lessonTitle, theoryText }) {
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
      max_tokens: 4096,
      system: `You create quiz questions for LearnTheory programming lessons. Output only valid JSON — no markdown fences, no commentary.`,
      messages: [
        {
          role: 'user',
          content: `Lesson title: "${lessonTitle}"

Lesson theory:
${theoryText || '(No theory provided)'}

Generate exactly 5 multiple-choice questions testing this lesson.

Return ONLY a JSON array in this exact shape (answer is the 0-based index of the correct option):
[{"question":"...","options":["option one","option two","option three","option four"],"answer":0,"explanation":"..."}]

Rules:
- Each question has exactly 4 option strings (full answer text, not just "A"/"B"/"C"/"D")
- answer must be 0, 1, 2, or 3
- explanation briefly says why the correct answer is right
- Questions should vary in difficulty and cover different parts of the theory`,
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
  const text = data?.content?.find((b) => b.type === 'text')?.text
  if (!text) throw new Error('Empty response from the API.')
  return parseQuizJson(text)
}

const sectionHeading =
  'mb-4 border-l-4 border-[#04AA6D] pl-3 text-xl font-bold text-slate-900 dark:border-green-500 dark:text-white sm:text-2xl'

import { Link, useNavigate } from 'react-router-dom'

export function AIQuizGenerator({ lessonTitle, theoryText, quiz = [], resetKey, topicSlug = null, lessonId = null }) {
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [quizVersion, setQuizVersion] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    setGeneratedQuiz(null)
    setError(null)
    setLoading(false)
    setQuizVersion(0)
  }, [resetKey])

  const localQuiz = useMemo(() => {
    if (!Array.isArray(quiz) || quiz.length === 0) {
      return null
    }

    return buildLessonQuizDeck({
      lessonTitle,
      theoryText,
      quiz,
    })
  }, [lessonTitle, theoryText, quiz])

  const handleGenerate = useCallback(async () => {
    const apiKey = getApiKey()
    if (!apiKey) {
      setError(
        'Add VITE_ANTHROPIC_API_KEY to your .env file to generate AI quizzes.',
      )
      return
    }

    setError(null)
    setLoading(true)

    try {
      const generated = await generateQuiz({
        apiKey,
        lessonTitle: lessonTitle ?? 'Lesson',
        theoryText: theoryText ?? '',
      })
      setGeneratedQuiz(generated)
      setQuizVersion((v) => v + 1)
    } catch (err) {
      setError(
        err.message ||
          'We could not generate a quiz right now. Please try again in a moment.',
      )
    } finally {
      setLoading(false)
    }
  }, [lessonTitle, theoryText])

  const buttonLabel = loading
    ? 'Generating...'
    : generatedQuiz
      ? 'Generate New Quiz'
      : 'Generate AI Quiz'

  if (localQuiz) {
    return (
      <section
        className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
        aria-labelledby="ai-quiz-heading"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="ai-quiz-heading" className={sectionHeading}>
              Subject Quiz
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Loaded from the lesson content and expanded with lesson-specific questions.
            </p>
          </div>
        </div>
        <div className="mt-4">
          {topicSlug && lessonId ? (
            <Link
              to={`/quiz?topic=${encodeURIComponent(topicSlug)}&lessonId=${encodeURIComponent(lessonId)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#04AA6D] px-4 py-2 text-sm font-semibold text-white"
            >
              Open Quiz
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                // fallback: navigate and let QuizPage attempt to load from content
                navigate('/quiz')
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#04AA6D] px-4 py-2 text-sm font-semibold text-white"
            >
              Open Quiz
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
      aria-labelledby="ai-quiz-heading"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="ai-quiz-heading" className={sectionHeading}>
          AI Quiz
        </h2>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#04AA6D] bg-[#04AA6D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#059862] disabled:cursor-not-allowed disabled:opacity-60 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500"
        >
          {loading && <Spinner className="h-4 w-4" />}
          {buttonLabel}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-green-200 bg-green-50 py-12 dark:border-green-900 dark:bg-green-950/40">
          <Spinner className="h-10 w-10 text-[#04AA6D] dark:text-green-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Claude is writing your quiz questions…
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
        >
          {error}
        </div>
      )}

      {generatedQuiz && !loading && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.setItem('learnify.generated_quiz', JSON.stringify(generatedQuiz))
              } catch (e) {
                /* ignore */
              }
              navigate('/quiz?generated=1')
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#04AA6D] px-4 py-2 text-sm font-semibold text-white"
          >
            Open Generated Quiz
          </button>
        </div>
      )}
    </section>
  )
}
