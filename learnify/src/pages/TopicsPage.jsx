import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { useTopics } from '../context/TopicsContext'
import { getTopic } from '../lib/topics'

const CATALOG = [
  { slug: 'html', title: 'HTML' },
  { slug: 'css', title: 'CSS' },
  { slug: 'javascript', title: 'JavaScript' },
  { slug: 'python', title: 'Python' },
  { slug: 'sql', title: 'SQL' },
  { slug: 'java', title: 'Java' },
  { slug: 'dsa', title: 'DSA' },
  { slug: 'react', title: 'React' },
]

export function TopicsPage() {
  const { ensureAllTopics, version } = useTopics()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    ensureAllTopics().finally(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [ensureAllTopics, version])

  if (loading) {
    return <LoadingSkeleton variant="page" />
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-12 outline-none"
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        All tutorials
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Choose a topic to view lessons and start learning.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATALOG.map(({ slug, title }) => {
          const topic = getTopic(slug)
          const count = topic?.lessons?.length ?? 0

          return (
            <li key={slug}>
              <Link
                to={`/${slug}`}
                className="group relative block rounded-2xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-300 hover:border-emerald-500 hover:shadow-premium-hover dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-dark-premium dark:hover:shadow-dark-premium-hover"
              >
                <h2 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[#04AA6D] dark:text-white dark:group-hover:text-emerald-400">{title}</h2>
                <p className="mt-1.5 text-sm font-semibold text-[#04AA6D] dark:text-emerald-400">
                  {count} lesson{count === 1 ? '' : 's'}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
