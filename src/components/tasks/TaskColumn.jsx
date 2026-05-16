import TaskCard from './TaskCard'

/**
 * TaskColumn Component
 * Displays a column in the Kanban board with tasks
 */
function TaskColumn({ title, status, tasks, icon: Icon, color: _color, onMove, onDelete, onEdit }) {
  const taskCount = tasks.length

  // Column header colors
  const headerColors = {
    todo: 'bg-gray-100 text-gray-700 border-gray-300',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
    done: 'bg-green-100 text-green-700 border-green-300',
  }

  const iconColors = {
    todo: 'text-gray-600',
    in_progress: 'text-blue-600',
    done: 'text-green-600',
  }

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div
        className={`flex items-center justify-between p-4 rounded-t-lg border-b-2 ${
          headerColors[status] || headerColors.todo
        }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-5 h-5 ${iconColors[status]}`} />}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <span className="px-2.5 py-0.5 bg-white rounded-full text-sm font-semibold">
          {taskCount}
        </span>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-4 bg-gray-50 rounded-b-lg overflow-y-auto min-h-[400px] space-y-3">
        {taskCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className={`p-4 rounded-full ${headerColors[status]} mb-3`}>
              {Icon && <Icon className={`w-8 h-8 ${iconColors[status]}`} />}
            </div>
            <p className="text-sm text-gray-500 font-medium">No tasks yet</p>
            <p className="text-xs text-gray-400 mt-1">
              {status === 'todo' && 'Add a new task to get started'}
              {status === 'in_progress' && 'Move tasks here to start working'}
              {status === 'done' && 'Complete tasks will appear here'}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TaskColumn

// Made with Bob
