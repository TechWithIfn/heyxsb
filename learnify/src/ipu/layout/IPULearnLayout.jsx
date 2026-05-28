export default function IPULearnLayout({ topbar, sidebar, children }) {
  return (
    <div className="min-h-screen bg-white text-[#282A35] dark:bg-[#1a1a2a] dark:text-[#f1f1f1]">
      {topbar}

      <div className="relative flex">
        {sidebar}

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-h-[calc(100vh-4rem)] px-4 py-8 outline-none md:pl-[256px] md:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
