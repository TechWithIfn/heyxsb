import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'
import { unregisterServiceWorkers } from './lib/unregisterServiceWorkers'
import './styles/index.css'
import './styles/w3colors.css'
import './styles/w3colors.css'

// Add global error event listeners to handle errors that happen before mounting or in unhandled promises.
window.addEventListener('error', (event) => {
  const root = document.getElementById('root')
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 24px; max-width: 600px; margin: 40px auto; font-family: system-ui, -apple-system, sans-serif; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <h1 style="color: #c53030; font-size: 20px; font-weight: bold; margin-bottom: 12px;">Global Runtime Error:</h1>
        <p style="color: #4a5568; font-size: 14px; margin-bottom: 16px;">An error occurred during startup before React could render the error boundary:</p>
        <pre style="background: #fff; padding: 16px; border-radius: 4px; border: 1px solid #fed7d7; overflow: auto; font-size: 13px; font-family: monospace; color: #2d3748; line-height: 1.5; max-height: 250px;">${event.error?.stack || event.message}</pre>
        <button onclick="window.location.reload()" style="margin-top: 16px; background: #c53030; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 600; cursor: pointer;">Reload Page</button>
      </div>
    `
  }
})

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root')
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 24px; max-width: 600px; margin: 40px auto; font-family: system-ui, -apple-system, sans-serif; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <h1 style="color: #c53030; font-size: 20px; font-weight: bold; margin-bottom: 12px;">Unhandled Promise Rejection:</h1>
        <p style="color: #4a5568; font-size: 14px; margin-bottom: 16px;">An asynchronous promise was rejected and not handled:</p>
        <pre style="background: #fff; padding: 16px; border-radius: 4px; border: 1px solid #fed7d7; overflow: auto; font-size: 13px; font-family: monospace; color: #2d3748; line-height: 1.5; max-height: 250px;">${event.reason?.stack || event.reason}</pre>
        <button onclick="window.location.reload()" style="margin-top: 16px; background: #c53030; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 600; cursor: pointer;">Reload Page</button>
      </div>
    `
  }
})

try {
  unregisterServiceWorkers().catch((err) => {
    console.warn('Failed to unregister service workers:', err)
  })
} catch (err) {
  console.warn('Failed to unregister service workers:', err)
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)

