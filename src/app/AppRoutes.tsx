import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './AppLayout'
import { QuizLayout } from './QuizLayout'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { ChapterLibraryPage } from '../features/chapters/ChapterLibraryPage'
import { ChapterPage } from '../features/chapters/ChapterPage'
import { QuizPage } from '../features/quiz/QuizPage'
import { ResultsPage } from '../features/results/ResultsPage'
import { MistakesPage } from '../features/mistakes/MistakesPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { NotFoundPage } from '../components/NotFoundPage'

/**
 * Every screen and its URL, in one place.
 * Screens inside <AppLayout> get the main navigation.
 * The quiz uses <QuizLayout>, which hides navigation so the learner can focus.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="learn" element={<ChapterLibraryPage />} />
        <Route path="learn/:chapterNumber" element={<ChapterPage />} />
        <Route path="practice" element={<Navigate to="/practice/mistakes" replace />} />
        <Route path="practice/mistakes" element={<MistakesPage />} />
        <Route path="quiz/:sessionId/results" element={<ResultsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="quiz/:sessionId" element={<QuizLayout />}>
        <Route index element={<QuizPage />} />
      </Route>
    </Routes>
  )
}
