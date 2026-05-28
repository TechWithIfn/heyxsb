import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { TopicLoadError } from './components/TopicLoadError'
import { Navbar } from './components/Navbar'
import { SkipToContent } from './components/SkipToContent'
import { ShortcutsProvider } from './context/ShortcutsContext'
import { TopicsProvider } from './context/TopicsContext'
import { ThemeProvider } from './context/ThemeContext'
import { useTopic } from './hooks/useTopic'
import { lazyRoute } from './lib/lazyRoute'
import { Home } from './pages/Home'
import {
  getLesson,
  isReservedSlug,
  isValidTopicSlug,
} from './lib/topics'

const TopicsPage = lazyRoute(() =>
  import('./pages/TopicsPage').then((m) => ({ default: m.TopicsPage })),
)
const TopicPage = lazyRoute(() =>
  import('./pages/TopicPage').then((m) => ({ default: m.TopicPage })),
)
const LessonPage = lazyRoute(() =>
  import('./pages/LessonPage').then((m) => ({ default: m.LessonPage })),
)
const Bookmarks = lazyRoute(() =>
  import('./pages/Bookmarks').then((m) => ({ default: m.Bookmarks })),
)
const Roadmap = lazyRoute(() =>
  import('./pages/Roadmap').then((m) => ({ default: m.Roadmap })),
)
const Progress = lazyRoute(() =>
  import('./pages/Progress').then((m) => ({ default: m.Progress })),
)
const Search = lazyRoute(() =>
  import('./pages/Search').then((m) => ({ default: m.Search })),
)
const Changelog = lazyRoute(() =>
  import('./pages/Changelog').then((m) => ({ default: m.Changelog })),
)
const Analytics = lazyRoute(() =>
  import('./pages/Analytics').then((m) => ({ default: m.Analytics })),
)
const IPUSyllabusRoutes = lazyRoute(() =>
  import('./pages/IPUSyllabus/IPUSyllabusRoutes').then((m) => ({
    default: m.IPUSyllabusRoutes,
  })),
)
const QuizPage = lazyRoute(() => import('./pages/QuizPage').then((m) => ({ default: m.default })))
const IPUHomePage = lazyRoute(() =>
  import('./ipu/pages/IPUHomePage').then((m) => ({ default: m.IPUHomePage })),
)
const IPUDashboard = lazyRoute(() =>
  import('./ipu/pages/IPUDashboard').then((m) => ({ default: m.IPUDashboard })),
)
const IPUNotesPage = lazyRoute(() =>
  import('./ipu/pages/IPUNotesPage').then((m) => ({ default: m.IPUNotesPage })),
)
const ExpectedQuestionsPage = lazyRoute(() =>
  import('./ipu/pages/ExpectedQuestionsPage').then((m) => ({ default: m.default })),
)
const PreviousYearPage = lazyRoute(() =>
  import('./ipu/pages/PreviousYearPage').then((m) => ({ default: m.default })),
)
const BranchPage = lazyRoute(() =>
  import('./ipu/pages/BranchPage').then((m) => ({ default: m.BranchPage })),
)
const SemesterPage = lazyRoute(() =>
  import('./ipu/pages/SemesterPage').then((m) => ({ default: m.SemesterPage })),
)
const SubjectLearnPage = lazyRoute(() =>
  import('./ipu/pages/SubjectLearnPage').then((m) => ({
    default: m.SubjectLearnPage,
  })),
)
const NotFound = lazyRoute(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
)

function PlaceholderPage({ title, description }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-2xl px-4 py-16 text-center outline-none"
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">{description}</p>
    </main>
  )
}

function TopicRoute() {
  const { topic: topicSlug } = useParams()
  const { topic, loading, error } = useTopic(topicSlug)

  if (!topicSlug || isReservedSlug(topicSlug) || !isValidTopicSlug(topicSlug)) {
    return <Navigate to="/404" replace />
  }

  if (loading) {
    return <LoadingSkeleton variant="topic" />
  }

  if (error) {
    return <TopicLoadError topicSlug={topicSlug} message={error} />
  }

  if (!topic) {
    return <Navigate to="/404" replace />
  }

  return (
    <Suspense fallback={<LoadingSkeleton variant="topic" />}>
      <TopicPage />
    </Suspense>
  )
}

function LessonRoute() {
  const { topic: topicSlug, lessonId: lessonIdParam } = useParams()
  const { topic, loading, error } = useTopic(topicSlug)

  if (!topicSlug || isReservedSlug(topicSlug) || !isValidTopicSlug(topicSlug)) {
    return <Navigate to="/404" replace />
  }

  if (loading) {
    return <LoadingSkeleton variant="lesson" />
  }

  if (error) {
    return (
      <TopicLoadError
        topicSlug={topicSlug}
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (!topic) {
    return <Navigate to="/404" replace />
  }

  if (!getLesson(topicSlug, lessonIdParam)) {
    return <Navigate to="/404" replace />
  }

  return (
    <Suspense fallback={<LoadingSkeleton variant="lesson" />}>
      <LessonPage />
    </Suspense>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <SkipToContent />
      <Navbar />
      <Suspense fallback={<LoadingSkeleton variant="page" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ipu" element={<IPUHomePage />} />
          <Route path="/ipu/dashboard" element={<IPUDashboard />} />
          <Route path="/ipu/my-notes" element={<IPUNotesPage />} />
          <Route path="/ipu/expected" element={<ExpectedQuestionsPage />} />
          <Route path="/ipu/previous" element={<PreviousYearPage />} />
          <Route path="/ipu/:branchId" element={<BranchPage />} />
          <Route path="/ipu/:branchId/:sem" element={<SemesterPage />} />
          <Route path="/ipu-syllabus/*" element={<IPUSyllabusRoutes />} />
          <Route path="/ipu/:branchId/:sem/:subjectId/:topicId?" element={<SubjectLearnPage />} />
          <Route
            path="/references"
            element={
              <PlaceholderPage
                title="References"
                description="Quick lookup guides for HTML, CSS, and JavaScript."
              />
            }
          />
          <Route path="/quiz" element={<QuizPage />} />
          <Route
            path="/about"
            element={
              <PlaceholderPage
                title="About LearnTheory"
                description="An open source, theory-based education platform. Lessons load live from the server — internet required."
              />
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="/:topic/:lessonId" element={<LessonRoute />} />
          <Route path="/:topic" element={<TopicRoute />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <TopicsProvider>
        <ShortcutsProvider>
          <AppRoutes />
        </ShortcutsProvider>
      </TopicsProvider>
    </ThemeProvider>
  )
}
