import { memo, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { correctPulse, easeOut, shake } from '../lib/motion'
import { prepareQuizDeck } from '../lib/quiz'

const LABELS = ['A', 'B', 'C', 'D']
const DEFAULT_TIME_PER_QUESTION = 30

function optionClass({ answered, isAnswer, isSelected }) {
  if (answered && isAnswer) {
    return 'border-green-500 bg-green-50 text-slate-900 ring-2 ring-green-500/30 dark:border-green-500 dark:bg-green-950/60 dark:text-green-100 dark:ring-green-500/40'
  }
  if (answered && isSelected && !isAnswer) {
    return 'border-red-400 bg-red-50 text-slate-900 ring-2 ring-red-400/30 dark:border-red-500 dark:bg-red-950/50 dark:text-red-100 dark:ring-red-500/40'
  }
  return 'border-slate-200 bg-white text-slate-800 hover:border-[#04AA6D] hover:bg-green-50/50 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-green-600 dark:hover:bg-slate-700'
}

function ScoreRing({ correct, total }) {
  const pct = total ? Math.round((correct / total) * 100) : 0
  return (
    <motion.div
      className="relative mx-auto flex h-32 w-32 items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className="stroke-[#04AA6D] transition-all duration-700 ease-out dark:stroke-green-500"
          strokeWidth="3"
          strokeDasharray={`${pct} 100`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-slate-900 dark:text-white">
        {pct}%
      </span>
    </motion.div>
  )
}

function TimerBar({ timeLeft, totalTime }) {
  const pct = totalTime ? Math.max(0, Math.min(100, Math.round((timeLeft / totalTime) * 100))) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        <span>Timer</span>
        <span>{timeLeft}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 8 ? 'bg-rose-500' : 'bg-[#04AA6D] dark:bg-green-500'}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.25, ease: easeOut }}
        />
      </div>
    </div>
  )
}

/**
 * @param {object} props
 * @param {Array<{ question: string, options: string[], answer: number, explanation?: string }>} props.quiz
 */
function QuizCardInner({
  quiz = [],
  onQuizComplete,
  questionTimeSeconds = DEFAULT_TIME_PER_QUESTION,
  manualStart = true, // require explicit start by default
  startSignal = null, // optional external start trigger
  subjectKey = null, // optional subject identifier for analytics
}) {
  const [shuffleVersion, setShuffleVersion] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(questionTimeSeconds)
  const [running, setRunning] = useState(false)
  const [shuffleCount, setShuffleCount] = useState(0)

  const preparedQuiz = useMemo(() => prepareQuizDeck(quiz), [quiz, shuffleVersion])

  useEffect(() => {
    setCurrentIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
    setTimeLeft(questionTimeSeconds)
    setRunning(false)
    setShuffleCount(0)
  }, [preparedQuiz, questionTimeSeconds])

  // Timer only runs when `running` is true. This prevents auto-start.
  useEffect(() => {
    if (!running || finished || selected !== null || !preparedQuiz.length) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTimeLeft((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(timer)
          setSelected(-1)
          setRunning(false)
          return 0
        }

        return currentValue - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running, finished, preparedQuiz.length, selected])

  // External start signal: if startSignal becomes truthy, begin running.
  useEffect(() => {
    if (!manualStart && preparedQuiz.length) {
      setRunning(true)
      return
    }
    if (startSignal) {
      setRunning(true)
    }
  }, [startSignal, manualStart, preparedQuiz.length])

  if (!preparedQuiz.length) return null

  const total = preparedQuiz.length
  const current = preparedQuiz[currentIndex]
  const answered = selected !== null
  const isCorrect = answered && selected === current.answer
  const timedOut = selected === -1
  const isLast = currentIndex === total - 1
  const progressPct = finished
    ? 100
    : ((currentIndex + (answered ? 1 : 0)) / total) * 100

  const handleSelect = (index) => {
    if (!running) return // don't accept answers before Start
    if (answered) return
    setSelected(index)
    setRunning(false)
    if (index === current.answer) {
      setCorrectCount((c) => c + 1)
    }
  }

  const goNext = () => {
    if (isLast) {
      setFinished(true)
      onQuizComplete?.({ correct: correctCount, total, shuffled: shuffleVersion, subject: subjectKey ?? null })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelected(null)
    setTimeLeft(questionTimeSeconds)
    setRunning(true)
  }

  const restart = () => {
    setCurrentIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
    setTimeLeft(questionTimeSeconds)
    setRunning(false)
    setShuffleCount(0)
  }

  const shuffleQuestions = () => {
    if (shuffleCount >= 2) return
    setShuffleVersion((value) => value + 1)
    setShuffleCount((c) => c + 1)
  }

  if (finished) {
    return (
      <motion.div
        className="quiz-summary my-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/90"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        <h3 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Quiz complete
        </h3>
        <div className="mt-6">
          <ScoreRing correct={correctCount} total={total} />
        </div>
        <p className="mt-6 text-center text-3xl font-bold text-[#04AA6D] dark:text-green-400">
          {correctCount} / {total} correct
        </p>
        <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
          {correctCount === total
            ? 'Perfect score! You nailed every question.'
            : correctCount >= total / 2
              ? 'Good work — review the lesson and try again.'
              : 'Keep studying — re-read the theory and retry the quiz.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.button
            type="button"
            onClick={restart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex rounded-lg bg-[#04AA6D] px-6 py-2.5 text-sm font-semibold text-white dark:bg-green-700"
          >
            Try again
          </motion.button>
          <motion.button
            type="button"
            onClick={shuffleQuestions}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Shuffle new set
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="my-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-950/30">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
          <span>
            Question {currentIndex + 1} of {total}
          </span>
            <div className="flex items-center gap-3">
              <span>
                Score: {correctCount}/{total}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={shuffleQuestions}
                  disabled={shuffleCount >= 2}
                  title={shuffleCount >= 2 ? 'Shuffle limit reached' : 'Shuffle questions'}
                  className={`rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 ${shuffleCount >= 2 ? 'cursor-not-allowed opacity-60' : 'text-slate-700'}`}
                >
                  {shuffleCount >= 2 ? 'Shuffle (limit)' : 'Shuffle'}
                </button>
                <span className="text-xs text-slate-500">{shuffleCount}/2</span>
              </div>
              <button
                type="button"
                onClick={restart}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Restart
              </button>
            </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full rounded-full bg-[#04AA6D] dark:bg-green-500"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: easeOut }}
            role="progressbar"
            aria-valuenow={Math.round(progressPct)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <TimerBar timeLeft={timeLeft} totalTime={questionTimeSeconds} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: easeOut }}
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {current.question}
          </h3>

          <ul className="space-y-2">
            {current.options.map((option, i) => {
              const isAnswer = i === current.answer
              const isSelected = i === selected
              const showShake = answered && isSelected && !isAnswer
              const showPulse = answered && isAnswer

              return (
                <li key={i}>
                  <motion.button
                    type="button"
                    disabled={answered}
                    onClick={() => handleSelect(i)}
                    animate={
                      showShake
                        ? shake
                        : showPulse
                          ? correctPulse
                          : {}
                    }
                    whileHover={answered ? {} : { scale: 1.01 }}
                    whileTap={answered ? {} : { scale: 0.99 }}
                    className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors duration-200 ${optionClass({
                      answered,
                      isAnswer,
                      isSelected,
                    })}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        answered && isAnswer
                          ? 'bg-green-600 text-white'
                          : answered && isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {LABELS[i]}
                    </span>
                    <span className="pt-0.5">{option}</span>
                  </motion.button>
                </li>
              )
            })}
          </ul>

          <AnimatePresence>
            {answered && (
              <motion.div
                className="mt-5 space-y-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <div
                  className={`rounded-lg border px-4 py-3 ${
                    isCorrect
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      timedOut
                        ? 'text-amber-700 dark:text-amber-400'
                        : isCorrect
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {timedOut ? 'Time is up' : isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  {current.explanation && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {current.explanation}
                    </p>
                  )}
                  {timedOut && (
                    <p className="mt-2 text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                      The question expired before an answer was selected.
                    </p>
                  )}
                </div>

                <motion.button
                  type="button"
                  onClick={goNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-[#04AA6D] py-3 text-sm font-semibold text-white dark:bg-green-700 sm:w-auto sm:px-8"
                >
                  {isLast ? 'View results' : 'Next question'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export const QuizCard = memo(QuizCardInner)
