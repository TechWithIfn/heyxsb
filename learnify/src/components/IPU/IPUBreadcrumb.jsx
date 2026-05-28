import { Link } from 'react-router-dom'

/**
 * @param {{ items: { label: string, to?: string }[] }} props
 * Last item should omit `to` (current page).
 */
export function IPUBreadcrumb({ items }) {
  return (
    <nav
      className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400"
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="inline-flex items-center gap-2">
          {i > 0 && (
            <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
              ›
            </span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="font-medium transition-colors hover:text-green-700 dark:hover:text-green-400"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
