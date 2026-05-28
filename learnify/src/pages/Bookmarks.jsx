import { Link } from 'react-router-dom'
import { removeBookmark } from '../lib/bookmarks'
import { useBookmarks } from '../hooks/useBookmarks'

function BookmarkIcon({ className, filled }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function Bookmarks() {
  const bookmarks = useBookmarks()

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-10 outline-none sm:py-14"
    >
      <header className="mb-10">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          <BookmarkIcon className="h-9 w-9 text-[#04AA6D] dark:text-green-400" filled />
          My bookmarks
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Lessons you saved in this browser. No account needed — stored locally in{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
            localStorage
          </code>
          .
        </p>
      </header>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-800/50">
          <BookmarkIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" filled={false} />
          <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
            No bookmarks yet
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Open a lesson and tap the bookmark icon next to the title to save it here.
          </p>
          <Link
            to="/topics"
            className="mt-6 inline-flex rounded-lg bg-[#04AA6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-700 dark:hover:bg-green-600"
          >
            Browse tutorials
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            {bookmarks.length} saved lesson{bookmarks.length === 1 ? '' : 's'}
          </p>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((item) => (
              <li
                key={`${item.topicSlug}-${item.lessonId}`}
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white shadow-premium transition-all duration-300 hover:border-emerald-500/30 hover:shadow-premium-hover dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-dark-premium dark:hover:shadow-dark-premium-hover"
              >
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#04AA6D] dark:text-green-400">
                    {item.topicTitle}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-slate-800 group-hover:text-[#04AA6D] dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                    {item.lessonTitle}
                  </h2>
                  {item.subtitle && (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-2">
                    <Link
                      to={`/${item.topicSlug}/${item.lessonId}`}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#04AA6D] py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#059862] hover:shadow transition-all duration-200 active:scale-[0.98] dark:bg-green-600 dark:hover:bg-green-500"
                    >
                      Open lesson
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        removeBookmark(item.topicSlug, item.lessonId)
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:border-slate-800 dark:hover:bg-red-950/20 transition-colors"
                      aria-label={`Remove ${item.lessonTitle} from bookmarks`}
                    >
                      <BookmarkIcon className="h-5 w-5" filled />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
