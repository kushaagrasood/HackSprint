import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '@components/layout/Layout'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import { ROUTES } from '@utils/constants'
import AuthPage from '@/pages/Auth'

// Lazy load page components for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const TaskBoard = lazy(() => import('@/pages/TaskBoard'))
const Checklist = lazy(() => import('@/pages/Checklist'))
const PitchPrep = lazy(() => import('@/pages/PitchPrep'))
const ExportPage = lazy(() => import('@/pages/Export'))
// Placeholder components for routes not yet implemented
const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
    <p className="text-xl text-gray-600">This feature is under development</p>
  </div>
)

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
)

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<AuthPage mode="login" />} />
        <Route path={ROUTES.SIGNUP} element={<AuthPage mode="signup" />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<AuthPage mode="forgot-password" />} />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          
          {/* Main application routes */}
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.TASKS} element={<TaskBoard />} />
          <Route path={ROUTES.CHECKLIST} element={<Checklist />} />
          <Route path={ROUTES.PITCH} element={<PitchPrep />} />
          <Route path={ROUTES.ANALYTICS} element={<ComingSoon />} />
          <Route path={ROUTES.TEMPLATES} element={<ComingSoon />} />
          <Route path={ROUTES.EXPORT} element={<ExportPage />} />
        </Route>

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a
                href={ROUTES.DASHBOARD}
                className="btn btn-primary"
              >
                Go to Dashboard
              </a>
            </div>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

// Made with Bob
