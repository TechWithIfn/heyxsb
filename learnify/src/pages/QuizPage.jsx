import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { prepareQuizDeck, buildLessonQuizDeck } from '../lib/quiz'
import { getLesson, getTopic } from '../lib/topics'
import { loadSubjectData, getAllTopicsFlat } from '../ipu/utils/dataLoader'
import { QuizCard } from '../components/QuizCard'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function QuizPage() {
  const navigate = useNavigate()
  const query = useQuery()
  const [deck, setDeck] = useState([])
  const [loading, setLoading] = useState(false)
  const [startSignal, setStartSignal] = useState(false)
  const [error, setError] = useState(null)

  const topic = query.get('topic')
  const lessonId = query.get('lessonId')
  const isIpu = query.get('ipu')
  const branch = query.get('branch')
  const sem = query.get('sem')
  const subjectId = query.get('subjectId')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const generatedFlag = query.get('generated')
        if (generatedFlag) {
          const raw = sessionStorage.getItem('learnify.generated_quiz')
          if (raw) {
            const parsed = JSON.parse(raw)
            if (!cancelled) setDeck(prepareQuizDeck(parsed))
            setLoading(false)
            return
          }
        }
        if (isIpu && branch && sem && subjectId) {
          const sub = await loadSubjectData(branch, Number.parseInt(sem, 10), subjectId)
          if (cancelled) return
          if (!sub) {
            setError('Subject content not found')
            setDeck([])
            return
          }
          // aggregate all topic quizzes into a subject deck
          const topics = getAllTopicsFlat(sub)
          const all = []
          for (const t of topics) {
            if (Array.isArray(t.quiz) && t.quiz.length) all.push(...t.quiz)
          }
          setDeck(prepareQuizDeck(all))
          return
        }

        if (topic && lessonId) {
          const lesson = getLesson(topic, lessonId)
          if (!lesson) {
            setError('Lesson not found')
            setDeck([])
            return
          }
          const built = buildLessonQuizDeck({ lessonTitle: lesson.title, theoryText: lesson.theory ?? '', quiz: lesson.quiz ?? [] })
          setDeck(built)
          return
        }

        setDeck([])
      } catch (err) {
        setError(err?.message || String(err))
        setDeck([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [isIpu, branch, sem, subjectId, topic, lessonId])

  const startQuiz = () => {
    // global guard: only one active quiz timer at a time
    if (window.__learnify_active_quiz) {
      alert('Another quiz is already running. Please finish it first.')
      return
    }
    window.__learnify_active_quiz = true
    setStartSignal((s) => !s)
  }

  const handleComplete = () => {
    window.__learnify_active_quiz = false
    navigate(-1)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      {loading && <p>Loading...</p>}
      {error && <div className="rounded-md bg-rose-50 p-3 text-rose-700">{error}</div>}
      {!loading && !error && (!deck || deck.length === 0) && (
        <div className="rounded-md border p-6">No quiz available for this selection.</div>
      )}

      {deck && deck.length > 0 && (
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Questions: {deck.length}</p>
            </div>
            <div>
              <button onClick={startQuiz} className="rounded-lg bg-[#04AA6D] px-4 py-2 text-white">Start Quiz</button>
            </div>
          </div>

          <QuizCard quiz={deck} startSignal={startSignal} onQuizComplete={handleComplete} />
        </section>
      )}
    </main>
  )
}
