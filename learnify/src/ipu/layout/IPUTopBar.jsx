import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Search, Sun, Moon, BarChart2, FileText, Calendar, Edit3 } from 'lucide-react'

export default function IPUTopBar({
  branchId,
  sem,
  subject,
  progressPercent = 0,
  onSearch,
  onProgressClick,
  onExpectedQuestions,
  onPreviousYearQuestions,
  onNotes,
}) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Breadcrumbs */}
        <div className="hidden md:flex items-center space-x-2 text-sm font-medium">
          <Link to="/ipu" className="text-slate-500 hover:text-[#04AA6D] dark:text-slate-400 dark:hover:text-green-400 transition-colors">IPU</Link>
          <span className="text-slate-300 dark:text-slate-600">›</span>
          <span className="uppercase text-slate-500 dark:text-slate-400">{branchId}</span>
          <span className="text-slate-300 dark:text-slate-600">›</span>
          <span className="text-slate-500 dark:text-slate-400">Sem {sem}</span>
          <span className="text-slate-300 dark:text-slate-600">›</span>
          <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px] lg:max-w-[300px]">{subject?.name}</span>
        </div>

        {/* Center/Mobile: Title */}
        <div className="flex-1 md:hidden flex items-center justify-start min-w-0 pr-4">
          <span className="font-bold text-base truncate text-slate-900 dark:text-white">{subject?.name}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <button 
            onClick={onSearch} 
            aria-label="Search syllabus topics" 
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
          
          <button 
            onClick={toggleTheme} 
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} 
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          
          <div className="hidden sm:flex items-center gap-2">
            {onExpectedQuestions ? (
              <button
                type="button"
                onClick={onExpectedQuestions}
                title="Expected Exam Questions"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95 hover:bg-slate-50"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Expected</span>
              </button>
            ) : (
              <Link
                to={`/ipu/expected?branch=${encodeURIComponent(branchId)}&sem=${encodeURIComponent(sem)}&subjectId=${encodeURIComponent(subject?.id)}`}
                title="Expected Exam Questions"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95 hover:bg-slate-50"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Expected</span>
              </Link>
            )}

            {onPreviousYearQuestions ? (
              <button
                type="button"
                onClick={onPreviousYearQuestions}
                title="Previous Year Questions"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95 hover:bg-slate-50"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            ) : (
              <Link
                to={`/ipu/previous?branch=${encodeURIComponent(branchId)}&sem=${encodeURIComponent(sem)}&subjectId=${encodeURIComponent(subject?.id)}`}
                title="Previous Year Questions"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95 hover:bg-slate-50"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Link>
            )}

            {onNotes ? (
              <button
                type="button"
                onClick={onNotes}
                title="My Notes"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95 hover:bg-slate-50"
              >
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Notes</span>
              </button>
            ) : (
              <Link
                to={`/ipu/my-notes?branch=${encodeURIComponent(branchId)}&sem=${encodeURIComponent(sem)}&subjectId=${encodeURIComponent(subject?.id)}`}
                title="My Notes"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all active:scale-95 hover:bg-slate-50"
              >
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Notes</span>
              </Link>
            )}

            <button 
              onClick={onProgressClick} 
              aria-label="Open reading progress"
              title="Reading progress"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300 dark:hover:bg-slate-800"
            >
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] text-white">
                {Math.max(0, Math.min(100, Math.round(progressPercent)))}
              </span>
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={onProgressClick}
            aria-label="Open reading progress"
            title="Reading progress"
            className="sm:hidden inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] text-white">
              {Math.max(0, Math.min(100, Math.round(progressPercent)))}
            </span>
            <BarChart2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
