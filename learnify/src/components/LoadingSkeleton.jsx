function Shimmer({ className }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 ${className ?? ''}`}
    />
  )
}

function SidebarSkeleton() {
  return (
    <div className="hidden w-[320px] min-w-[320px] max-w-[320px] shrink-0 space-y-4 border-r border-slate-200 bg-[#f1f1f1] p-4 dark:border-slate-700 dark:bg-slate-900 lg:block">
      <Shimmer className="h-4 w-32" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Shimmer key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}

function LessonSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg-min-h lg:grid-cols-[320px_minmax(0,900px)] lg:gap-6 lg:px-8 lg:py-6 xl:grid-cols-[320px_minmax(0,900px)_300px]">
      <SidebarSkeleton />
      <div className="min-w-0 space-y-5">
        <Shimmer className="h-8 w-32 rounded-full" />
        <Shimmer className="h-12 w-2/3 max-w-[36rem] rounded-2xl" />
        <Shimmer className="h-4 w-full max-w-2xl" />
        <Shimmer className="h-4 w-11/12 max-w-2xl" />
        <Shimmer className="mt-6 h-40 w-full rounded-3xl" />
        <Shimmer className="h-24 w-full rounded-3xl" />
        <Shimmer className="h-24 w-full rounded-3xl" />
      </div>
      <div className="hidden min-w-0 space-y-4 xl:block">
        <Shimmer className="h-24 w-full rounded-3xl" />
        <Shimmer className="h-24 w-full rounded-3xl" />
        <Shimmer className="h-24 w-full rounded-3xl" />
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-3 text-center sm:text-left">
        <Shimmer className="mx-auto h-10 w-64 sm:mx-0" />
        <Shimmer className="mx-auto h-4 w-96 max-w-full sm:mx-0" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
          >
            <Shimmer className="mb-4 h-10 w-10 rounded-lg" />
            <Shimmer className="h-6 w-24" />
            <Shimmer className="mt-3 h-4 w-20" />
            <Shimmer className="mt-4 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function TopicSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <Shimmer className="h-9 w-48" />
      <Shimmer className="h-4 w-full max-w-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/**
 * @param {{ variant?: 'page' | 'lesson' | 'topic' }} props
 */
export function LoadingSkeleton({ variant = 'page' }) {
  return (
    <div
      className="min-h-[40vh]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading content"
    >
      {variant === 'lesson' && <LessonSkeleton />}
      {variant === 'topic' && <TopicSkeleton />}
      {variant === 'page' && <PageSkeleton />}
    </div>
  )
}
