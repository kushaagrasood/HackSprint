import { useState, useMemo } from 'react'
import { useHackSprint } from '@context/HackSprintContext'
import { Plus, Circle, CircleDot, CheckCircle2, Filter, Search } from 'lucide-react'
import { TASK_STATUS, TASK_PRIORITY } from '@utils/constants'
import TaskColumn from '@components/tasks/TaskColumn'
import AddTaskModal from '@components/tasks/AddTaskModal'

/**
 * TaskBoard Page Component
 * Kanban board with 3 columns: To-Do, In Progress, Completed
 */
function TaskBoard() {
  const { tasks, addTask, updateTask, deleteTask, activeProject, loading } = useHackSprint()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Filter tasks based on search and priority
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      )
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    return filtered
  }, [tasks, searchQuery, priorityFilter])

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter((task) => task.status === TASK_STATUS.TODO),
      in_progress: filteredTasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS),
      done: filteredTasks.filter((task) => task.status === TASK_STATUS.DONE),
    }
  }, [filteredTasks])

  // Handle adding a new task
  const handleAddTask = async (taskData) => {
    const result = await addTask(taskData)
    if (result.error) {
      console.error('Error adding task:', result.error)
      throw new Error(result.error)
    }
  }

  // Handle updating a task
  const handleUpdateTask = async (taskData, taskId) => {
    const result = await updateTask(taskId, taskData)
    if (result.error) {
      console.error('Error updating task:', result.error)
      throw new Error(result.error)
    }
  }

  // Handle task submission (add or edit)
  const handleTaskSubmit = async (taskData, taskId) => {
    if (taskId) {
      await handleUpdateTask(taskData, taskId)
    } else {
      await handleAddTask(taskData)
    }
  }

  // Handle moving task between columns
  const handleMoveTask = async (taskId, newStatus) => {
    const result = await updateTask(taskId, { status: newStatus })
    if (result.error) {
      console.error('Error moving task:', result.error)
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId)
      if (result.error) {
        console.error('Error deleting task:', result.error)
      }
    }
  }

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasksByStatus.todo.length,
      inProgress: tasksByStatus.in_progress.length,
      done: tasksByStatus.done.length,
      completionRate: tasks.length > 0 ? Math.round((tasksByStatus.done.length / tasks.length) * 100) : 0,
    }
  }, [tasks, tasksByStatus])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600 mt-1">
              Manage your hackathon tasks with a Kanban board
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 justify-center"
            disabled={!activeProject}
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* No Active Project Warning */}
        {!activeProject && (
          <div className="card bg-warning-50 border-warning-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Circle className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <h3 className="font-semibold text-warning-900">No Active Project</h3>
                <p className="text-sm text-warning-700 mt-1">
                  Please create or select a project from the dashboard to start managing tasks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {activeProject && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-sm text-gray-600 mb-1">To Do</div>
              <div className="text-2xl font-bold text-gray-700">{stats.todo}</div>
            </div>
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-sm text-gray-600 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </div>
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.done}</div>
            </div>
            <div className="card bg-gradient-to-br from-success-50 to-success-100">
              <div className="text-sm text-gray-600 mb-1">Completion</div>
              <div className="text-2xl font-bold text-success-600">{stats.completionRate}%</div>
            </div>
          </div>
        )}

        {/* Filters */}
        {activeProject && tasks.length > 0 && (
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Priority Filter */}
              <div className="sm:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value={TASK_PRIORITY.LOW}>Low Priority</option>
                    <option value={TASK_PRIORITY.MEDIUM}>Medium Priority</option>
                    <option value={TASK_PRIORITY.HIGH}>High Priority</option>
                    <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || priorityFilter !== 'all') && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                )}
                {priorityFilter !== 'all' && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    Priority: {priorityFilter}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setPriorityFilter('all')
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Kanban Board */}
        {activeProject && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* To Do Column */}
            <TaskColumn
              title="To Do"
              status={TASK_STATUS.TODO}
              tasks={tasksByStatus.todo}
              icon={Circle}
              color="gray"
              onMove={handleMoveTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />

            {/* In Progress Column */}
            <TaskColumn
              title="In Progress"
              status={TASK_STATUS.IN_PROGRESS}
              tasks={tasksByStatus.in_progress}
              icon={CircleDot}
              color="blue"
              onMove={handleMoveTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />

            {/* Completed Column */}
            <TaskColumn
              title="Completed"
              status={TASK_STATUS.DONE}
              tasks={tasksByStatus.done}
              icon={CheckCircle2}
              color="green"
              onMove={handleMoveTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </div>
        )}

        {/* Empty State */}
        {activeProject && tasks.length === 0 && !loading && (
          <div className="card text-center py-12">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary-100 rounded-full mb-4">
                <Circle className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Get started by creating your first task. Break down your hackathon project into
                manageable tasks and track your progress.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Task
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
      />
    </div>
  )
}

export default TaskBoard

// Made with Bob
