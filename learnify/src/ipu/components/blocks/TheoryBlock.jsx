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
          const firstChar = para?.trim()?.charAt(0) || ''
          const rest = para?.trim()?.slice(1) || ''
          return (
            <p key={idx} className={`text-gray-600 dark:text-gray-300 leading-7 text-base` }>
              {idx === 0 ? (
                <span className="first-letter:float-left first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:mr-3 first-letter:text-[#04a04a]">{firstChar}</span>
              ) : null}
              {formatInlineBold((idx === 0 ? rest : para))}
            </p>
          )
        })}
      </div>
    </section>
  )
}
