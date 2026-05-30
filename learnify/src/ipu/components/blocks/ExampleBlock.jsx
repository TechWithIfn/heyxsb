import React, { useState } from 'react'

export default function ExampleBlock({ examples = [] }) {
  if (!examples || examples.length === 0) return null

  return (
    <section className="mb-6 space-y-4">
      {examples.map((ex, idx) => {
        const label = ex.label || `Example ${idx + 1}`
        const problem = ex.problem || ex.content || ''
        const solution = ex.solution || ex.solutionSteps || ex.steps || ''
        const answer = ex.answer || ex.answerText || ''
        // Only render example cards if meaningful content exists
        if (!problem && !solution && !answer) return null
        return <ExampleCard key={idx} index={idx} label={label} problem={problem} solution={solution} answer={answer} />
      })}
    </section>
  )
}

function ExampleCard({ index, label, problem, solution, answer }) {
  const [showSteps, setShowSteps] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const solutionSteps = Array.isArray(solution) ? solution : (typeof solution === 'string' ? solution.split('\n').filter(Boolean) : [])

  return (
    <div className="border rounded-md p-4 bg-white/50 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm font-medium">{label}</span>
          <div className="text-sm text-gray-700 dark:text-gray-200">Problem</div>
        </div>
        <div className="flex items-center gap-2">
          {solutionSteps.length > 0 && (
            <button onClick={() => setShowSteps(s => !s)} className="text-sm px-2 py-1 bg-blue-50 dark:bg-white/5 rounded">
              {showSteps ? 'Hide Steps' : 'Show Steps'}
            </button>
          )}

          {answer && (
            <button onClick={() => setShowAnswer(s => !s)} className="text-sm px-2 py-1 bg-green-50 dark:bg-green-900/10 rounded">
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-gray-800 dark:text-gray-200">{problem}</div>

      {(showSteps || showAnswer) && (
        <div className="mt-3">
          {showSteps && solutionSteps.length > 0 && (
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {solutionSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}

          {showAnswer && answer && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">Answer: <strong>{answer}</strong></div>
          )}
        </div>
      )}
    </div>
  )
}
