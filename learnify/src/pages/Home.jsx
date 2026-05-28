import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTopicProgress } from '../hooks/useProgress'
import { staggerContainer, staggerItem } from '../lib/motion'
import { getLatestVersion } from '../lib/changelog'
import { getTopic } from '../lib/topics'
import { useTopics } from '../context/TopicsContext'

const TOPIC_CARDS = [
  {
    slug: 'html',
    title: 'HTML',
    description: 'Structure web pages with semantic markup, forms, tables, and accessibility basics.',
    icon: 'html',
    fallbackLessons: 10,
  },
  {
    slug: 'css',
    title: 'CSS',
    description: 'Style layouts, typography, colors, flexbox, and responsive design.',
    icon: 'css',
    fallbackLessons: 2,
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    description: 'Add interactivity, DOM APIs, functions, and modern ES syntax.',
    icon: 'javascript',
    fallbackLessons: 2,
  },
  {
    slug: 'python',
    title: 'Python',
    description: 'Learn programming fundamentals, data types, and problem solving.',
    icon: 'python',
    fallbackLessons: 5,
  },
  {
    slug: 'sql',
    title: 'SQL',
    description: 'Query databases with SELECT, JOINs, aggregates, and relational design.',
    icon: 'sql',
    fallbackLessons: 5,
  },
  {
    slug: 'java',
    title: 'Java',
    description: 'Object-oriented programming, classes, collections, and JVM concepts.',
    icon: 'java',
    fallbackLessons: 5,
  },
  {
    slug: 'dsa',
    title: 'DSA',
    description: 'Data structures and algorithms — arrays, trees, graphs, and complexity.',
    icon: 'dsa',
    fallbackLessons: 5,
  },
  {
    slug: 'react',
    title: 'React',
    description: 'Build UIs with components, hooks, state, and the React ecosystem.',
    icon: 'react',
    fallbackLessons: 5,
  },
]

const FEATURES = [
  {
    title: 'Open Source',
    description:
      'All lessons and platform code are open. Fork, contribute, and improve tutorials with the community.',
    icon: 'opensource',
  },
  {
    title: 'No Login',
    description:
      'Start learning instantly. No accounts, passwords, or tracking — just open a lesson and read.',
    icon: 'nologin',
  },
  {
    title: 'Free Forever',
    description:
      'Theory-first education should be accessible to everyone, everywhere, at no cost.',
    icon: 'free',
  },
]

function IconBadge({ label, children }) {
  return (
    <span role="img" aria-label={label} className="inline-flex shrink-0">
      {children}
    </span>
  )
}

function TopicIcon({ name, title, className }) {
  const c = className ?? 'h-10 w-10'
  const label = title ? `${title} course icon` : 'Course icon'
  let icon = null
  switch (name) {
    case 'html':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path fill="#E44D26" d="M4 3h16l-1.5 17-6.5 2-6.5-2L4 3z" />
          <path fill="#F16529" d="M12 20.5 17 19l1.3-14.5H12v16.5z" />
          <path fill="#EBEBEB" d="M12 5.5h6.8l-.6 6H12V5.5zm0 8.5h5.8l-.5 5.5-5.3 1.5V14z" />
        </svg>
      )
      break
    case 'css':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path fill="#264DE4" d="M4 3h16l-1.5 17-6.5 2-6.5-2L4 3z" />
          <path fill="#2965F1" d="M12 20.5 17 19l1.3-14.5H12v16.5z" />
          <path fill="#EBEBEB" d="M12 5.5h6.8l-.6 3.5H12V5.5zm0 5h6l-.6 3.5-5.4 1.5V10.5z" />
        </svg>
      )
      break
    case 'javascript':
      icon = (
        <svg className={c} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="2" fill="#F7DF1E" />
          <path
            fill="#323330"
            d="M14.5 17.2c.4.7.8 1.2 1.8 1.2 1 0 1.5-.5 1.5-1.2v-4.5h2v4.6c0 2-1.2 2.9-3.4 2.9-1.8 0-2.9-.9-3.4-2l1.5-.9zM8.8 17.3l1.5-.9c.3.5.7 1 1.5 1 .6 0 1-.3 1-.8 0-.6-.5-.8-1.3-1.1l-.5-.2c-1.3-.5-2.1-1.1-2.1-2.4 0-1.2 1-2.1 2.5-2.1 1 0 1.8.4 2.3 1.3l-1.4.9c-.3-.5-.7-.8-1.3-.8-.6 0-1 .4-1 .8 0 .5.4.8 1.2 1.1l.5.2c1.5.6 2.3 1.2 2.3 2.5 0 1.4-1.1 2.2-2.7 2.2-1.5 0-2.5-.7-2.8-1.8z"
          />
        </svg>
      )
      break
    case 'python':
      icon = (
        <svg className={c} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#3776AB" d="M12 2C8 2 7 4 7 6v2h5v1H6c-2 0-4 2-4 5s2 5 4 5h2v-2.5c0-1.5 1-2.5 2.5-2.5h4.5c2 0 3-1 3-3V6c0-2-1-4-5-4zm-2.5 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          <path fill="#FFD43B" d="M12 22c4 0 5-2 5-4v-2h-5v-1h6c2 0 4-2 4-5s-2-5-4-5h-2v2.5c0 1.5-1 2.5-2.5 2.5H9c-2 0-3 1-3 3v4c0 2 1 4 5 4zm2.5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
      )
      break
    case 'sql':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="6" rx="8" ry="3" fill="#336791" />
          <path
            fill="#336791"
            d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"
          />
          <ellipse cx="12" cy="12" rx="8" ry="3" fill="#4A90B8" opacity="0.6" />
        </svg>
      )
      break
    case 'java':
      icon = (
        <svg className={c} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#5382A1"
            d="M8.5 17.5s-.8.5.6.7c1.8.2 2.7.2 4.7 0 1.5-.1 2.4-.5 2.4-.5s.4.3 1 .5c3 .9 1.3 1.5 1.3 1.5-2.5 1.1-5.3 1-6.6-.2-.8-.8-.5-1.6-.5-1.6z"
          />
          <path
            fill="#E76F00"
            d="M12 3c-3 4-4 7-4 9.5a4 4 0 0 0 8 0C16 10 15 7 12 3z"
          />
          <path fill="#5382A1" d="M10 14h4v2h-4v-2z" />
        </svg>
      )
      break
    case 'dsa':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="#04AA6D" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="5" r="2" fill="#04AA6D" />
          <circle cx="6" cy="19" r="2" fill="#04AA6D" />
          <circle cx="18" cy="19" r="2" fill="#04AA6D" />
          <path d="M12 7v4M12 11l-6 6M12 11l6 6" />
        </svg>
      )
      break
    case 'react':
      icon = (
        <svg className={c} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(-60 12 12)" />
        </svg>
      )
      break
    default:
      icon = null
  }
  if (!icon) return null
  return <IconBadge label={label}>{icon}</IconBadge>
}

function FeatureIcon({ name, title, className }) {
  const c = className ?? 'h-8 w-8 text-[#04AA6D]'
  const label = title ? `${title} icon` : 'Feature icon'
  let icon = null
  switch (name) {
    case 'opensource':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      )
      break
    case 'nologin':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
      break
    case 'free':
      icon = (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
      break
    default:
      icon = null
  }
  if (!icon) return null
  return <IconBadge label={label}>{icon}</IconBadge>
}

function lessonCountFor(slug, fallback) {
  const topic = getTopic(slug)
  const count = topic?.lessons?.length ?? fallback
  return count
}

function TopicCard({ card }) {
  const count = lessonCountFor(card.slug, card.fallbackLessons)
  const { done, total, percent } = useTopicProgress(card.slug)
  const displayTotal = total || count

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-premium transition-all duration-300 hover:border-emerald-500/30 hover:shadow-premium-hover dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-dark-premium dark:hover:border-emerald-500/30 dark:hover:shadow-dark-premium-hover"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 shadow-inner">
            <TopicIcon
              name={card.icon}
              title={card.title}
              className="h-10 w-10"
            />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {card.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-[#10B981] dark:text-emerald-400">
          {displayTotal} lesson{displayTotal === 1 ? '' : 's'}
        </p>

        {displayTotal > 0 && (
          <div className="mt-4 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>
                {done} / {displayTotal} completed
              </span>
              <span className="text-[#10B981] dark:text-emerald-400">{percent}%</span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${card.title} progress`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-650 dark:text-slate-400">
          {card.description}
        </p>

        <Link
          to={`/${card.slug}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#04AA6D] py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#059862] hover:shadow-md active:scale-[0.98] dark:bg-green-600 dark:hover:bg-green-500"
        >
          Start Learning
        </Link>
      </div>
    </motion.article>
  )
}

export function Home() {
  const { ensureAllTopics } = useTopics()

  useEffect(() => {
    ensureAllTopics().catch(() => {})
  }, [ensureAllTopics])

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[calc(100vh-3.5rem)] flex-col outline-none"
    >
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-green-50/40 via-white to-white px-4 py-16 dark:border-slate-800/80 dark:from-emerald-950/10 dark:via-slate-950 dark:to-slate-950 sm:px-6 sm:py-20 md:py-24">
        {/* Glow Effects */}
        <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            LearnTheory
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Learn to Code — <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Free Theory</span> for Everyone
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-650 dark:text-slate-400 sm:text-lg md:text-xl leading-relaxed">
            Master programming fundamentals with clear explanations, examples, and
            quizzes. No sign-up, no paywalls — just open a topic and start reading.
          </p>
          <Link
            to="/html"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#04AA6D] px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-[#059862] hover:shadow-xl active:scale-95 transition-all duration-200 dark:bg-green-600 dark:hover:bg-green-500"
          >
            Start with HTML
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:py-20">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Choose a topic
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Pick a track and learn at your own pace.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {TOPIC_CARDS.map((card) => (
            <TopicCard key={card.slug} card={card} />
          ))}
        </motion.div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50/50 px-4 py-16 dark:border-slate-800/80 dark:bg-slate-900/20 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why LearnTheory?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-500 dark:text-slate-400">
            Built for learners who believe education should stay open.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-premium dark:border-slate-850 dark:bg-slate-900/30 dark:shadow-dark-premium sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-dark-premium-hover"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 sm:mx-0 shadow-inner">
                  <FeatureIcon
                    name={feature.icon}
                    title={feature.title}
                    className="h-6 w-6"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 bg-slate-50 px-4 py-10 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-base">LearnTheory</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
              Open source education platform · MIT License
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <a
              href="https://github.com/learn-theory/learn-theory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-850 px-4 py-2.5 text-sm font-semibold text-slate-850 dark:text-white transition-all duration-200"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-end">
              <Link
                to="/changelog"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-600 transition-colors hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-400 dark:hover:border-emerald-800"
                title="View changelog"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                v{getLatestVersion()}
              </Link>
              <p className="text-xs text-slate-400 dark:text-slate-555">
                © {new Date().getFullYear()} LearnTheory · MIT License
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
