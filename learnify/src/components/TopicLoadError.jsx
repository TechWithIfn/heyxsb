import { Link } from 'react-router-dom'

export function TopicLoadError({ topicSlug, message, onRetry }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center outline-none"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
        aria-hidden="true"
      >
        <svg
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h1 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
        Could not load {topicSlug ? `${topicSlug} lessons` : 'this topic'}
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        {message ??
          'The lesson data could not be fetched. Check your internet connection and try again.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-[#04AA6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-600"
          >
            Try again
          </button>
        )}
        <Link
          to="/topics"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          All topics
        </Link>
      </div>
    </main>
  )
}
