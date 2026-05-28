import React from 'react'

function CopyButton({ text }) {
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // eslint-disable-next-line no-console
      console.log('Copied')
    } catch (e) {
      console.warn('Copy failed', e)
    }
  }
  return (
    <button onClick={handle} className="ml-2 px-2 py-1 bg-white/10 rounded text-sm">Copy</button>
  )
}

export default function FormulaBlock({ formulas = [] }) {
  if (!formulas || formulas.length === 0) return null

  return (
    <section className="mb-6">
      <div className="bg-[#1a1a2e] text-white font-mono rounded-md p-4">
        {formulas.map((f, idx) => {
          // accept string or object
          const label = typeof f === 'object' && f.label ? f.label : `Formula ${idx + 1}`
          const expr = typeof f === 'object' && f.formula ? f.formula : (typeof f === 'string' ? f : '')
          const desc = typeof f === 'object' && f.description ? f.description : ''

          return (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-300 font-medium">{label}</div>
                <CopyButton text={expr} />
              </div>

              <div className="text-xl mt-2 text-white">{expr}</div>
              {desc && <div className="text-sm text-green-200 mt-1">{desc}</div>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
