import React from 'react'

export default function PYQBlock({ pyqs = [], onViewSolution }) {
  if (!pyqs || pyqs.length === 0) return null

  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold text-red-600 mb-3">📋 Previous Year Questions</h3>
      <div className="space-y-3">
        {pyqs.map((q, idx) => (
          <div key={idx} className="p-3 border rounded-md bg-white/50 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{q.year}</span>
                {q.marks && <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-700 rounded">{q.marks} marks</span>}
              </div>
              <button onClick={() => onViewSolution ? onViewSolution(q) : console.log('Solve via AI placeholder', q)} className="text-sm px-2 py-1 bg-white/10 rounded">View Solution</button>
            </div>

            <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">{q.question}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
