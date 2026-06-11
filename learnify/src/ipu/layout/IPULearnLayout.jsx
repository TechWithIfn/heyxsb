export default function IPULearnLayout({ topbar, sidebar, rightPanel, children }) {
  return (
    <div className="min-h-screen bg-white text-[#282A35] dark:bg-[#1a1a2a] dark:text-[#f1f1f1]">
      {topbar}

      <div className="relative">
        <div className="mx-auto grid w-full max-w-[1800px] gap-0 px-0 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <div className="hidden lg:block lg:self-start">{sidebar}</div>

          {/* Main content column */}
          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 px-4 py-6 outline-none md:px-6 lg:max-h-[calc(100vh-4rem)] lg:px-8 lg:py-8 lg:overflow-y-auto scrollbar-hidden"
          >
            <div className="mx-auto w-full max-w-[900px]">{children}</div>
          </main>

          {rightPanel ? (
            <aside className="hidden xl:block xl:self-start xl:h-[calc(100vh-4rem)] xl:overflow-y-auto xl:pr-4 scrollbar-hidden" aria-label="Learning tools and progress">
              {rightPanel}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  )
}
