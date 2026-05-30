export default function IPULearnLayout({ topbar, sidebar, children }) {
  return (
    <div className="min-h-screen bg-white text-[#282A35] dark:bg-[#1a1a2a] dark:text-[#f1f1f1]">
      {topbar}

      <div className="relative lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        <div className="grid lg:h-full lg:grid-cols-[320px_minmax(0,1fr)_160px]">
          {/* Sidebar column (kept as-is) */}
          <div className="hidden lg:block">{sidebar}</div>

          {/* Main content column */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 px-4 py-8 outline-none md:px-8 lg:px-12 lg:h-full lg:min-h-0 lg:overflow-y-auto scrollbar-hidden"
          >
            <div className="mx-auto w-full max-w-[950px]">{children}</div>
          </main>

          {/* Right-side advertisement space (desktop only) */}
          <aside className="hidden lg:block bg-white dark:bg-[#1a1a2a]" aria-label="Advertisement space" />
        </div>
      </div>
    </div>
  )
}
