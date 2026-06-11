import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { easeOut } from '../lib/motion'

const LANGUAGE_LOADERS = {
  css: () => import('react-syntax-highlighter/dist/esm/languages/prism/css'),
  html: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  jsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  java: () => import('react-syntax-highlighter/dist/esm/languages/prism/java'),
  javascript: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  js: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  markup: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  python: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
  sql: () => import('react-syntax-highlighter/dist/esm/languages/prism/sql'),
  tsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
  typescript: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  text: () => Promise.resolve(null),
}

const loadPrismLight = () => import('react-syntax-highlighter/dist/esm/light').then((m) => m.default)
const loadOneDark = () => import('react-syntax-highlighter/dist/esm/styles/prism/one-dark').then((m) => m.default)
const loadOneLight = () => import('react-syntax-highlighter/dist/esm/styles/prism/one-light').then((m) => m.default)

function resolvePrismLanguage(language) {
  const normalized = String(language ?? '').toLowerCase()

  if (normalized === 'html') {
    return 'markup'
  }

  if (normalized === 'js') {
    return 'javascript'
  }

  return normalized || 'text'
}

function CopyIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CodePlaceholder({ label, language }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#dddddd]">
      {/* Before: green header and darker border. After: W3Schools code box border and neutral code chrome. */}
      <div className="bg-[#282A35] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
        {label ?? language}
      </div>
      <div className="animate-pulse space-y-2 bg-[#f1f1f1] p-4">
        <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}

function CodeBlockInner({ code = '', language = 'text', label, onRun }) {
  const { isDark } = useTheme()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [inView, setInView] = useState(false)
  const [highlighter, setHighlighter] = useState(null)
  const [prismStyles, setPrismStyles] = useState(null)
  const blockRef = useRef(null)
  const headerLabel = label ?? language
  const prismLanguage = resolvePrismLanguage(language)

  useEffect(() => {
    const el = blockRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || highlighter) return

    let cancelled = false

    const languageLoader =
      LANGUAGE_LOADERS[prismLanguage] ?? LANGUAGE_LOADERS.text

    Promise.all([
      loadPrismLight(),
      languageLoader(),
      loadOneDark(),
      loadOneLight(),
    ]).then(([PrismLight, languageModule, oneDark, oneLight]) => {
      if (!cancelled) {
        if (languageModule?.default && prismLanguage !== 'text') {
          PrismLight.registerLanguage(prismLanguage, languageModule.default)
        }

        setHighlighter(() => PrismLight)
        setPrismStyles({ oneDark, oneLight })
      }
    })

    return () => {
      cancelled = true
    }
  }, [inView, highlighter, prismLanguage])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast('Code copied to clipboard', { type: 'success' })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [code, toast])

  if (!inView) {
    return (
      <div ref={blockRef} className="my-4">
        <CodePlaceholder label={headerLabel} language={language} />
      </div>
    )
  }

  const SyntaxHighlighter = highlighter
  const codeBg = isDark ? '#1e1e1e' : '#f1f1f1'
  const codeText = isDark ? '#d4d4d4' : '#282A35'
  const prismStyle = isDark ? prismStyles?.oneDark : prismStyles?.oneLight

  return (
    <motion.div
      ref={blockRef}
      className="my-4 max-w-full overflow-hidden rounded-lg border border-[#dddddd] shadow-sm dark:border-[#444444] dark:shadow-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dddddd] bg-[#282A35] px-3 py-2 sm:px-4 dark:border-[#444444] dark:bg-[#1a1a2a]">
        <span className="text-xs font-semibold uppercase tracking-wide text-white">
          {headerLabel}
        </span>
        <div className="flex items-center gap-2">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              className="flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Run code example"
            >
              Run
            </button>
          )}
          <span className="group relative shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
              className="flex items-center gap-1.5 rounded-md bg-[#04AA6D] px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-[#059862] focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
            >
              {copied ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-3.5 w-3.5" />
                  Copy Code
                </>
              )}
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 print:hidden"
            >
              {copied ? 'Copied!' : 'Copy code to clipboard'}
            </span>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto overscroll-x-contain bg-slate-50 dark:bg-slate-950 [-webkit-overflow-scrolling:touch]">
        {SyntaxHighlighter && prismStyle ? (
          <SyntaxHighlighter
            language={prismLanguage}
            style={prismStyle}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '1rem 1.25rem',
              fontSize: '0.8125rem',
              lineHeight: '1.6',
              background: codeBg,
              color: codeText,
              borderRadius: 0,
              minWidth: 'min-content',
            }}
            codeTagProps={{
              className: 'font-mono text-sm whitespace-pre min-w-max',
            }}
            preTagProps={{
              className: 'min-w-max',
            }}
          >
            {code.trimEnd()}
          </SyntaxHighlighter>
        ) : (
          <CodePlaceholder label={headerLabel} language={language} />
        )}
      </div>
    </motion.div>
  )
}

export const CodeBlock = memo(CodeBlockInner)
