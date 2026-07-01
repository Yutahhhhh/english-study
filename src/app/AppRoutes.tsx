import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { CoursesPage } from '@/features/courses/CoursesPage'
import { CourseDetailPage } from '@/features/courses/CourseDetailPage'
import { LessonDayPage } from '@/features/lesson/LessonDayPage'
import { VocabularyPage } from '@/features/vocabulary/VocabularyPage'
import { VocabularyQuizPage } from '@/features/vocabulary/VocabularyQuizPage'
import { GrammarPage } from '@/features/grammar/GrammarPage'
import { GrammarQuizPage } from '@/features/grammar/GrammarQuizPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { Layout } from './Layout'

function withLayout(node: ReactNode) {
  return (
    <ProtectedRoute>
      <Layout>{node}</Layout>
    </ProtectedRoute>
  )
}

function withoutLayout(node: ReactNode) {
  return <ProtectedRoute>{node}</ProtectedRoute>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/courses" replace />} />
      <Route path="/courses" element={withLayout(<CoursesPage />)} />
      <Route path="/courses/:courseId" element={withLayout(<CourseDetailPage />)} />
      <Route
        path="/courses/:courseId/days/:dayNumber"
        element={withLayout(<LessonDayPage />)}
      />
      <Route path="/vocabulary" element={withLayout(<VocabularyPage />)} />
      <Route path="/vocabulary/quiz" element={withoutLayout(<VocabularyQuizPage />)} />
      <Route path="/grammar" element={withLayout(<GrammarPage />)} />
      <Route path="/grammar/quiz" element={withoutLayout(<GrammarQuizPage />)} />
      <Route path="/settings" element={withLayout(<SettingsPage />)} />
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  )
}
