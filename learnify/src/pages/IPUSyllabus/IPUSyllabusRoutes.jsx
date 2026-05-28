import { AnimatePresence } from 'framer-motion'
import { useLocation, useRoutes } from 'react-router-dom'
import { IPUErrorBoundary } from '../../components/IPU/IPUErrorBoundary'
import { PageTransition } from '../../components/IPU/PageTransition'
import { BranchesPage } from './BranchesPage'
import { BookmarksPage } from './BookmarksPage'
import { SemestersPage } from './SemestersPage'
import { SubjectsPage } from './SubjectsPage'
import { SubjectPage } from './SubjectPage'

const ipuRoutes = [
  { index: true, element: <BranchesPage /> },
  { path: 'bookmarks', element: <BookmarksPage /> },
  {
    path: ':branchId/semester/:semNum/subject/:subjectId',
    element: <SubjectPage />,
  },
  { path: ':branchId/semester/:semNum', element: <SubjectsPage /> },
  { path: ':branchId', element: <SemestersPage /> },
]

export function IPUSyllabusRoutes() {
  const location = useLocation()
  const element = useRoutes(ipuRoutes)

  return (
    <IPUErrorBoundary>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>{element}</PageTransition>
      </AnimatePresence>
    </IPUErrorBoundary>
  )
}
