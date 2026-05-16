import { useState } from 'react'
import { Clock, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { TASK_PRIORITY } from '@utils/constants'
import { format } from 'date-fns'

/**
 * TaskCard Component
 * Displays a task card with title, priority badge, and deadline
 */
function TaskCard({ task, onMove, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false)

  // Priority badge colors
  const priorityColors = {
    [TASK_PRIORITY.LOW]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TASK_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [TASK_PRIORITY.HIGH]: 'bg-red-100 text-red-700 border-red-200',
    [TASK_PRIORITY.URGENT]: 'bg-red-200 text-red-800 border-red-300',
  }

  const priorityLabels = {
    [TASK_PRIORITY.LOW]: 'Low',
    [TASK_PRIORITY.MEDIUM]: 'Medium',
    [TASK_PRIORITY.HIGH]: 'High',
    [TASK_PRIORITY.URGENT]: 'Urgent',
  }

  const formatDeadline = (deadline) => {
    if (!deadline) return null
    try {
      return format(new Date(deadline), 'MMM dd, yyyy')
    } catch (error) {
      return null
    }
  }

  const isOverdue = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex-1 line-clamp-2">
          {task.title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Task options"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => {
                    onEdit?.(task)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(task.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            priorityColors[task.priority] || priorityColors[TASK_PRIORITY.MEDIUM]
          }`}
        >
          {priorityLabels[task.priority] || 'Medium'}
        </span>

        {/* Deadline */}
        {task.deadline && (
          <div
            className={`flex items-center gap-1 text-xs ${
              isOverdue(task.deadline) ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDeadline(task.deadline)}</span>
          </div>
        )}
      </div>

      {/* Move buttons (for column navigation) */}
      {onMove && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
          {task.status !== 'todo' && (
            <button
              onClick={() => onMove(task.id, 'todo')}
              className="flex-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            >
              ← To Do
            </button>
          )}
          {task.status !== 'in_progress' && (
            <button
              onClick={() => onMove(task.id, 'in_progress')}
              className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            >
              {task.status === 'todo' ? 'Start →' : '← In Progress'}
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onMove(task.id, 'done')}
              className="flex-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors"
            >
              Complete →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskCard

// Made with Bob