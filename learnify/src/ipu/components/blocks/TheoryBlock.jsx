import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function TheoryBlock({ theory = [] }) {
  if (!theory || theory.length === 0) return null

  const md = Array.isArray(theory) ? theory.join('\n\n') : String(theory)

  return (
    <section className="my-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="prose max-w-none dark:prose-invert prose-a:text-[#04AA6D] prose-a:underline text-[18px] leading-[1.8] text-slate-700 dark:text-slate-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img({ node, ...props }) {
              return <img {...props} className="mx-auto my-4 max-w-full rounded" alt={props.alt || ''} />
            },
            table({ node, ...props }) {
              return (
                <div className="overflow-x-auto">
                  <table {...props} className="table-auto w-full text-sm" />
                </div>
              )
            },
          }}
        >
          {md}
        </ReactMarkdown>
      </div>
    </section>
  )
}
