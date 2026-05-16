import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '@components/layout/Layout'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import { ROUTES } from '@utils/constants'

// Lazy load components for code splitting
const Dashboard = lazy(() => import('@components/dashboard/Dashboard'))
const TaskList = lazy(() => import('@components/tasks/TaskList'))
const Checklist = lazy(() => import('@components/checklist/Checklist'))
const PitchPrep = lazy(() => import('@components/pitch-prep/PitchPrep'))
const Analytics = lazy(() => import('@components/analytics/Analytics'))
const TemplateLibrary = lazy(() => import('@components/templates/TemplateLibrary'))
const ExportModal = lazy(() => import('@components/export/ExportModal'))
const Login = lazy(() => import('@components/auth/Login'))
const Signup = lazy(() => import('@components/auth/Signup'))
const ForgotPassword = lazy(() => import('@components/auth/ForgotPassword'))

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
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

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
          <Route path={ROUTES.TASKS} element={<TaskList />} />
          <Route path={ROUTES.CHECKLIST} element={<Checklist />} />
          <Route path={ROUTES.PITCH} element={<PitchPrep />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.TEMPLATES} element={<TemplateLibrary />} />
          <Route path={ROUTES.EXPORT} element={<ExportModal />} />
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
