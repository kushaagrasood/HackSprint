import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@context/AuthContext'
import { useHackSprint } from '@context/HackSprintContext'
import { 
  Clock, 
  CheckCircle2, 
  Target, 
  TrendingUp,
  Calendar,
  Zap,
  Award,
  Activity
} from 'lucide-react'

/**
 * Dashboard Page Component
 * Main dashboard with welcome header, countdown timer, and analytics widgets
 */
function Dashboard() {
  const { user } = useAuth()
  const { activeProject, projectOverview, tasks, checklist, createProject } = useHackSprint()
  
  // Countdown state (default 24 hours from now)
  const [countdownEnd, setCountdownEnd] = useState(() => {
    if (projectOverview?.endDate) {
      return new Date(projectOverview.endDate)
    }
    return new Date(Date.now() + 24 * 60 * 60 * 1000)
  })
  
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  })
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })
  const [projectError, setProjectError] = useState('')
  const [creatingProject, setCreatingProject] = useState(false)

  // Update countdown every second
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const end = countdownEnd.getTime()
      const difference = end - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeRemaining({ hours, minutes, seconds, total: difference })
      } else {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, total: 0 })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [countdownEnd])

  // Update countdown end when project end date changes
  useEffect(() => {
    if (projectOverview?.endDate) {
      setCountdownEnd(new Date(projectOverview.endDate))
    }
  }, [projectOverview?.endDate])

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const tasksCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const totalChecklistItems = checklist.length
    const completedChecklistItems = checklist.filter(item => item.completed).length
    const submissionReadiness = totalChecklistItems > 0 
      ? (completedChecklistItems / totalChecklistItems) * 100 
      : 0

    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length
    const blockedTasks = tasks.filter(task => task.status === 'blocked').length

    return {
      totalTasks,
      completedTasks,
      tasksCompletionRate,
      totalChecklistItems,
      completedChecklistItems,
      submissionReadiness,
      inProgressTasks,
      blockedTasks
    }
  }, [tasks, checklist])

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Circular progress component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary-600 transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
          <span className="text-xs text-gray-500 mt-1">Complete</span>
        </div>
      </div>
    )
  }

  const handleCreateProject = async (event) => {
    event.preventDefault()
    setProjectError('')

    if (!projectForm.title.trim()) {
      setProjectError('Project title is required.')
      return
    }

    setCreatingProject(true)

    const { error } = await createProject({
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      status: 'planning',
      start_date: projectForm.startDate ? new Date(projectForm.startDate).toISOString() : null,
      end_date: projectForm.endDate ? new Date(projectForm.endDate).toISOString() : null,
      progress: 0,
    })

    if (error) {
      setProjectError(error)
    }

    setCreatingProject(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="card gradient-primary text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {getGreeting()}, {user?.email?.split('@')[0] || 'Hacker'}! 👋
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                {activeProject ? (
                  <>
                    Working on: <span className="font-semibold">{projectOverview.title || 'Untitled Project'}</span>
                  </>
                ) : (
                  'Ready to start your hackathon journey?'
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {!activeProject && (
          <div className="card border border-primary-200 bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create your first project</h2>
              <p className="mt-2 text-sm text-gray-600">
                You are signed in as {user?.email || 'an authenticated user'}, but no active project exists yet.
              </p>
            </div>

            <form onSubmit={handleCreateProject} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="projectTitle">
                  Project title
                </label>
                <input
                  id="projectTitle"
                  value={projectForm.title}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="input"
                  placeholder="AI Hackathon Sprint"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="projectDescription">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  value={projectForm.description}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="input min-h-28"
                  placeholder="What are you building?"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="startDate">
                  Start date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, startDate: event.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="endDate">
                  End date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={projectForm.endDate}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, endDate: event.target.value }))}
                  className="input"
                />
              </div>

              {projectError && (
                <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {projectError}
                </div>
              )}

              <div className="md:col-span-2">
                <button type="submit" disabled={creatingProject} className="btn btn-primary">
                  {creatingProject ? 'Creating project...' : 'Create project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Countdown Timer Widget */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hackathon Countdown</h2>
              <p className="text-sm text-gray-600">
                {timeRemaining.total > 0 ? 'Time remaining until deadline' : 'Hackathon ended'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600">
                  {String(timeRemaining.hours).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600">
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Minutes</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600">
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Seconds</div>
              </div>
            </div>
          </div>

          {timeRemaining.total > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-700">
                <Zap className="w-4 h-4 inline mr-1" />
                Keep pushing! You&apos;ve got this! 💪
              </p>
            </div>
          )}
        </div>

        {/* Analytics Widgets - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Completed - Circular Progress */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tasks Completed</h2>
                <p className="text-sm text-gray-600">Your progress overview</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <CircularProgress percentage={analytics.tasksCompletionRate} />
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-success-600">
                    {analytics.completedTasks} / {analytics.totalTasks}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-info-600">
                    {analytics.inProgressTasks}
                  </span>
                </div>
                {analytics.blockedTasks > 0 && (
                  <div className="flex items-center justify-between p-3 bg-error-50 rounded-lg">
                    <span className="text-sm text-gray-600">Blocked</span>
                    <span className="font-semibold text-error-600">
                      {analytics.blockedTasks}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submission Readiness - Bar Chart */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-info-100 rounded-lg">
                <Target className="w-6 h-6 text-info-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Submission Readiness</h2>
                <p className="text-sm text-gray-600">Checklist completion status</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Main Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-2xl font-bold text-info-600">
                    {Math.round(analytics.submissionReadiness)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-info-500 to-info-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${analytics.submissionReadiness}%` }}
                  >
                    {analytics.submissionReadiness > 10 && (
                      <span className="text-xs font-medium text-white">
                        {Math.round(analytics.submissionReadiness)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Checklist Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                    <span className="text-xs text-gray-600">Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-success-600">
                    {analytics.completedChecklistItems}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Remaining</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">
                    {analytics.totalChecklistItems - analytics.completedChecklistItems}
                  </div>
                </div>
              </div>

              {/* Readiness Status */}
              <div className="p-4 bg-gradient-to-r from-primary-50 to-info-50 rounded-lg border border-primary-200">
                <div className="flex items-center gap-2">
                  {analytics.submissionReadiness >= 100 ? (
                    <>
                      <Award className="w-5 h-5 text-success-600" />
                      <span className="text-sm font-medium text-success-700">
                        🎉 Ready to submit! All items completed!
                      </span>
                    </>
                  ) : analytics.submissionReadiness >= 75 ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-info-600" />
                      <span className="text-sm font-medium text-info-700">
                        Almost there! Keep going! 🚀
                      </span>
                    </>
                  ) : analytics.submissionReadiness >= 50 ? (
                    <>
                      <Activity className="w-5 h-5 text-warning-600" />
                      <span className="text-sm font-medium text-warning-700">
                        Halfway there! Stay focused! 💪
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-primary-700">
                        Let&apos;s get started! You&apos;ve got this! ⚡
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalTasks}</div>
                <div className="text-xs text-gray-600">Total Tasks</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success-50 to-success-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.completedTasks}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-info-50 to-info-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.inProgressTasks}</div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-warning-50 to-warning-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.submissionReadiness)}%
                </div>
                <div className="text-xs text-gray-600">Readiness</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// Made with Bob
