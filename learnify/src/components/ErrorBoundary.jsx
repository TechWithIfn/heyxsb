import { Component } from 'react'

function ErrorIllustration() {
  return (
    <svg
      className="mx-auto h-40 w-40 text-[#04AA6D] dark:text-green-500"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="8 8"
        opacity="0.35"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      <path
        d="M70 85h60M70 100h40M70 115h50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="130" cy="70" r="12" fill="currentColor" opacity="0.2" />
      <text
        x="100"
        y="165"
        textAnchor="middle"
        fill="currentColor"
        fontSize="28"
        fontWeight="bold"
      >
        !
      </text>
    </svg>
  )
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('LearnTheory error boundary:', error, info)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          id="main-content"
          className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center"
        >
          <ErrorIllustration />
          <h1 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            An unexpected error occurred. Reload the page to try again.
          </p>
          {this.state.error?.message?.includes('dynamically imported module') && (
            <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
              Dev tip: stop other <code className="rounded bg-amber-100 px-1 dark:bg-amber-950">npm run dev</code>{' '}
              terminals, run <code className="rounded bg-amber-100 px-1 dark:bg-amber-950">npm run dev</code> again,
              then hard-refresh (Ctrl+Shift+R).
            </p>
          )}
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 max-h-32 w-full overflow-auto rounded-lg bg-slate-100 p-3 text-left text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-8 rounded-lg bg-[#04AA6D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#059862] dark:bg-green-600"
          >
            Reload page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
