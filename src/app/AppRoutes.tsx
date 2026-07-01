import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { CoursesPage } from '@/features/courses/CoursesPage'
import { CourseDetailPage } from '@/features/courses/CourseDetailPage'
import { LessonDayPage } from '@/features/lesson/LessonDayPage'
import { VocabularyPage } from '@/features/vocabulary/VocabularyPage'
import { GrammarPage } from '@/features/grammar/GrammarPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { Layout } from './Layout'

function withLayout(node: ReactNode) {
  return (
    <ProtectedRoute>
      <Layout>{node}</Layout>
    </ProtectedRoute>
  )
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
      <Route path="/grammar" element={withLayout(<GrammarPage />)} />
      <Route path="/settings" element={withLayout(<SettingsPage />)} />
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  )
}
