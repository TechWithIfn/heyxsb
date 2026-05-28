import React, { useEffect, useState } from 'react'
import { Bookmark, ChevronDown } from 'lucide-react'
import { isBookmarked } from '../hooks/useIPUBookmarks'

function UnitItem({
  unit,
  isOpen,
  toggle,
  activeTopicId,
  onTopicSelect,
  visited = new Set(),
  branchId,
  semNumber,
  subjectId,
}) {
  const completed = unit.topics.filter(t => visited.has(t.id)).length
  return (
    <div className="border-b border-slate-200/60 dark:border-slate-800/40">
      <button 
        onClick={toggle} 
        className="w-full flex items-center justify-between px-4 py-3.5 text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex flex-col items-start text-left min-w-0 pr-2">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Unit {unit.unitNumber}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate w-full">{unit.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-100/50 dark:border-green-900/30">
            {completed}/{unit.topics.length}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 dark:text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="py-1.5 px-2.5 space-y-1">
          {unit.topics.map(topic => {
            const isTopicActive = topic.id === activeTopicId
            return (
              <li key={topic.id}>
                <button
                  onClick={() => onTopicSelect(unit.unitNumber, topic.id)}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between text-[13px] transition-all duration-200 rounded-xl ${
                    isTopicActive 
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm dark:bg-emerald-500' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate pr-2">
                    <span className="truncate">{topic.title}</span>
                    {isBookmarked(branchId, semNumber, subjectId, topic.id) && (
                      <Bookmark className={`h-3.5 w-3.5 shrink-0 ${isTopicActive ? 'text-white' : 'text-amber-500'} fill-current`} aria-hidden="true" />
                    )}
                  </span>
                  <span className={`ml-1 text-xs font-bold shrink-0 ${isTopicActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {visited.has(topic.id) ? '✓' : ''}
                  </span>
                </button>

                {topic.subtopics && topic.subtopics.length > 0 && isTopicActive && (
                  <div className="bg-slate-100/50 dark:bg-slate-950/40 pl-6 pr-4 py-2 text-[12px] text-slate-500 dark:text-slate-400 border-l-2 border-[#04AA6D] dark:border-green-500 my-1 mx-2 rounded-r-md">
                    {topic.subtopics.map((s, i) => (
                      <div key={i} className="py-1 line-clamp-2">• {s}</div>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function IPUSidebar({
  subject,
  activeUnit,
  activeTopic,
  onTopicSelect,
  sidebarOpen,
  onClose,
  visitedTopics = new Set(),
  branchId,
  semNumber,
}) {
  const [openUnits, setOpenUnits] = useState(() => new Set())
  const units = subject?.units || []

  useEffect(() => {
    if (openUnits.size > 0 || units.length === 0) {
      return
    }

    setOpenUnits(new Set([units[0].unitNumber]))
  }, [openUnits.size, units])

  useEffect(() => {
    if (activeUnit == null) {
      return
    }

    setOpenUnits((current) => {
      if (current.has(activeUnit) && current.size > 0) {
        return current
      }

      return new Set([activeUnit])
    })
  }, [activeUnit])

  const toggleUnit = (unitNumber) => {
    setOpenUnits(prev => {
      const next = new Set(prev)
      if (next.has(unitNumber)) next.delete(unitNumber)
      else next.add(unitNumber)
      return next
    })
  }

  const topicMatches = new Set(visitedTopics)

  useEffect(() => {
    const refresh = () => setOpenUnits((current) => new Set(current))
    window.addEventListener('learnify-ipu-bookmarks-updated', refresh)
    return () => window.removeEventListener('learnify-ipu-bookmarks-updated', refresh)
  }, [])

  const sidebar = (
    <aside className="w-64 min-w-[256px] max-w-[256px] h-full fixed left-0 top-16 bottom-0 overflow-y-auto bg-slate-50/85 border-r border-slate-200/80 dark:bg-slate-900/90 dark:border-slate-800/80 backdrop-blur-md">
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40">
        <div className="text-slate-800 dark:text-white font-bold text-[15px] leading-snug line-clamp-2">{subject?.name}</div>
        <div className="mt-1.5 inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{subject?.code}</div>
      </div>

      <div className="pb-16 mt-1">
        {units.map(unit => (
          <UnitItem
            key={unit.unitNumber}
            unit={unit}
            isOpen={openUnits.has(unit.unitNumber)}
            toggle={() => toggleUnit(unit.unitNumber)}
            activeTopicId={activeTopic}
            onTopicSelect={onTopicSelect}
            visited={topicMatches}
            branchId={branchId}
            semNumber={semNumber}
            subjectId={subject?.id}
          />
        ))}
      </div>
    </aside>
  )

  // mobile drawer
  return (
    <>
      <div className="hidden md:block">{sidebar}</div>

      <div className={`md:hidden fixed inset-y-0 left-0 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300 ease-out`}>
        <div className="w-72 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto flex flex-col">
          <div className="px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="min-w-0 pr-4">
              <div className="font-bold text-slate-800 dark:text-white truncate text-base">{subject?.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{subject?.code}</div>
            </div>
            <button onClick={onClose} className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="pb-20 mt-2">
            {units.map(unit => (
              <UnitItem
                key={unit.unitNumber}
                unit={unit}
                isOpen={openUnits.has(unit.unitNumber)}
                toggle={() => toggleUnit(unit.unitNumber)}
                activeTopicId={activeTopic}
                onTopicSelect={(u, t) => { onTopicSelect(u, t); onClose && onClose() }}
                visited={topicMatches}
                branchId={branchId}
                semNumber={semNumber}
                subjectId={subject?.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* mobile floating toggle */}
      <button onClick={onClose} className="md:hidden fixed bottom-6 left-4 z-50 bg-[#04AA6D] dark:bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:bg-[#059862] active:scale-95 transition-all">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 dark:bg-black/60"
          onClick={onClose}
        />
      )}
    </>
  )
}
