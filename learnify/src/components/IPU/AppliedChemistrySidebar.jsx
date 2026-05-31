import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'

const SECTION_GROUPS = [
  {
    key: 'unit1',
    title: 'Fuels and Combustion',
    items: [
      ['applied-chemistry-u1-t1', 'Fuels – Classification and Characteristics of Fuels'],
      ['applied-chemistry-u1-t2', 'Calorific Value of Fuels'],
      ['applied-chemistry-u1-t3', 'Comparison of Solid, Liquid and Gaseous Fuels'],
      ['applied-chemistry-u1-t4', 'Bomb Calorimeter'],
      ['applied-chemistry-u1-t5', "Boy's Calorimeter"],
      ['applied-chemistry-u1-t6', 'Dulong Formula'],
      ['applied-chemistry-u1-t7', 'Calorific Value Numericals'],
      ['applied-chemistry-u1-t8', 'Coal'],
      ['applied-chemistry-u1-t9', 'Proximate Analysis'],
      ['applied-chemistry-u1-t10', 'Ultimate Analysis'],
      ['applied-chemistry-u1-t11', 'Coal Analysis Numericals'],
      ['applied-chemistry-u1-t12', 'Carbonisation of Coal'],
      ['applied-chemistry-u1-t13', 'Otto-Hoffmann Oven'],
      ['applied-chemistry-u1-t14', 'Recovery of By-products'],
      ['applied-chemistry-u1-t15', 'Metallurgical Coke'],
      ['applied-chemistry-u1-t16', 'Petroleum Products'],
      ['applied-chemistry-u1-t17', 'Refining of Petroleum'],
      ['applied-chemistry-u1-t18', 'Thermal Cracking'],
      ['applied-chemistry-u1-t19', 'Catalytic Cracking'],
      ['applied-chemistry-u1-t20', 'Knocking Characteristics'],
      ['applied-chemistry-u1-t21', 'Octane Rating'],
      ['applied-chemistry-u1-t22', 'Cetane Rating'],
      ['applied-chemistry-u1-t23', 'Natural Gas'],
      ['applied-chemistry-u1-t24', 'CNG'],
      ['applied-chemistry-u1-t25', 'LPG'],
      ['applied-chemistry-u1-t26', 'Coal Gas'],
      ['applied-chemistry-u1-t27', 'Oil Gas'],
      ['applied-chemistry-u1-t28', 'Producer Gas'],
      ['applied-chemistry-u1-t29', 'Water Gas'],
      ['applied-chemistry-u1-t30', 'Combustion of Fuels'],
      ['applied-chemistry-u1-t31', 'Combustion Numericals'],
    ],
  },
]

function SidebarItem({ topicId, label, currentTopic, onSelect }) {
  const active = currentTopic === topicId

  return (
    <button
      type="button"
      onClick={() => onSelect(topicId)}
      className={`group flex w-full cursor-pointer items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-left text-sm transition-all duration-200 ${
        active
          ? 'border-[#04895a] bg-[#04AA6D] font-semibold text-white shadow-sm'
          : 'border-transparent text-slate-700 hover:bg-emerald-50 hover:text-slate-900'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`} aria-hidden="true" />
      <span
        className="min-w-0 flex-1 whitespace-normal break-words leading-[1.5]"
        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
      >
        {label}
      </span>
      <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`} aria-hidden="true" />
    </button>
  )
}

function SidebarSection({ title, items, currentTopic, onSelect, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
      >
        <span className="min-w-0 whitespace-normal break-words leading-[1.5]">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden px-2 pb-2"
          >
            <ul className="space-y-1">
              {items.map(([topicId, label]) => (
                <li key={topicId}>
                  <SidebarItem topicId={topicId} label={label} currentTopic={currentTopic} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AppliedChemistrySidebar({
  subject = null,
  currentTopic = '',
  onSelect = () => {},
  readCount = 0,
  totalTopics = 0,
}) {
  const sections = useMemo(() => {
    if (!subject || !subject.units) return SECTION_GROUPS
    return subject.units.map((u) => ({
      key: `unit${u.unitNumber}`,
      title: `UNIT ${u.unitNumber}`,
      items: (u.topics || []).map((t) => [t.id, t.title || t.id]),
    }))
  }, [subject])

  const unitCount = subject?.units?.length ?? 0

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-[#f1f1f1]">
      <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Applied Chemistry</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900">Applied Chemistry</h1>
            <p className="mt-1 text-sm text-slate-600">BAS-203 · {unitCount} unit{unitCount === 1 ? '' : 's'} syllabus navigation</p>
          </div>
          <div className="shrink-0 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-right text-xs font-bold text-emerald-700 shadow-sm">
            <div className="uppercase tracking-[0.18em] text-slate-500">Topics</div>
            <div className="mt-0.5 whitespace-nowrap">{readCount}/{totalTopics}</div>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3" aria-label="Applied Chemistry topics">
        {sections.map((section, index) => (
          <SidebarSection
            key={section.key}
            title={section.title}
            items={section.items}
            currentTopic={currentTopic}
            onSelect={onSelect}
            defaultOpen={index === 0}
          />
        ))}
      </nav>
    </aside>
  )
}
