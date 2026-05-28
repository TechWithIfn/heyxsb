import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export class IPUErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[IPU ErrorBoundary]', error, errorInfo)
    }
  }

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.assign('/ipu')
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 outline-none"
        >
          <div className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <AlertTriangle
              className="mx-auto h-12 w-12 text-amber-500 dark:text-amber-400"
              aria-hidden="true"
            />
            <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Something went wrong loading this content
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              An unexpected error occurred in the IPU Syllabus section. Try going
              back or return to the branch list.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleGoBack}
                className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
              >
                Go Back
              </button>
              <Link
                to="/ipu"
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                IPU home
              </Link>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
