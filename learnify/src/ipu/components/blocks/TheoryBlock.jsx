import React from 'react'

function formatInlineBold(text) {
  // split by **bold** tokens
  const parts = text.split(/(\*\*.+?\*\*)/g)
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/)
    if (m) return <strong key={i} className="font-semibold">{m[1]}</strong>
    return <span key={i}>{part}</span>
  })
}

export default function TheoryBlock({ theory = [] }) {
  if (!theory || theory.length === 0) return null

  return (
    <section className="mb-6">
      <div className="space-y-4">
        {theory.map((para, idx) => {
          const text = para?.trim() || ''
          return (
            <p key={idx} className="text-base leading-8 text-slate-700 dark:text-slate-300">
              {formatInlineBold(text)}
            </p>
          )
        })}
      </div>
    </section>
  )
}
