import { motion, AnimatePresence } from 'framer-motion'

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function InfoIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

function AlertIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

const STYLES = {
  success: {
    wrap: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
    icon: 'text-[#04AA6D] dark:text-green-400',
    Icon: CheckIcon,
  },
  error: {
    wrap: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    Icon: AlertIcon,
  },
  info: {
    wrap: 'border-slate-200 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
    icon: 'text-blue-600 dark:text-blue-400',
    Icon: InfoIcon,
  },
}

function ToastItem({ toast, onDismiss }) {
  const style = STYLES[toast.type] ?? STYLES.info
  const Icon = style.Icon

  return (
    <motion.div
      layout
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${style.wrap}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
