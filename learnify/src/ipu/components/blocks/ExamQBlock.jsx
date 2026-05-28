import React from 'react'

export default function ExamQBlock({ examQuestions = [] }) {
  if (!examQuestions || examQuestions.length === 0) return null

  // group by marks
  const groups = examQuestions.reduce((acc, q) => {
    const m = q.marks || 'other'
    if (!acc[m]) acc[m] = []
    acc[m].push(q)
    return acc
  }, {})

  const ordered = Object.keys(groups).sort((a,b)=>Number(a)-Number(b))

  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold">📝 Expected Exam Questions</h3>

      <div className="mt-3 space-y-4">
        {ordered.map((marksKey) => (
          <div key={marksKey}>
            <div className="text-sm font-medium mb-2">{marksKey} mark{marksKey>1?'s':''}</div>
            <ul className="space-y-2">
              {groups[marksKey].map((q, i) => (
                <li key={i} className="p-3 border rounded-md bg-white/50 dark:bg-gray-800 flex items-start justify-between">
                  <div className="text-sm text-gray-800 dark:text-gray-200">{q.question}</div>
                  <div className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-700 rounded">{q.marks}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
