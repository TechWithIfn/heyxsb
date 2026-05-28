import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { pageTransition } from '../lib/motion'

export function LessonTransition({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
