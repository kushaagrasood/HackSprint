import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { db } from '@services/supabase'
import { handleSupabaseError } from '@services/supabase'
import { useAuth } from '@context/AuthContext'
import toast from 'react-hot-toast'

const HackSprintContext = createContext({})

function normalizeTaskPayload(taskData = {}) {
  const payload = { ...taskData }

  if ('deadline' in payload && !('due_date' in payload)) {
    payload.due_date = payload.deadline
  }

  delete payload.deadline
  return payload
}

/**
 * HackSprintProvider component
 * Manages global state for active project, tasks, and checklist
 */
export function HackSprintProvider({ children }) {
  const { user } = useAuth()
  
  // Active project state
  const [activeProject, setActiveProject] = useState(null)
  const [projectOverview, setProjectOverview] = useState({
    title: '',
    description: '',
    status: 'planning', // planning, in-progress, completed
    startDate: null,
    endDate: null,
    progress: 0,
  })
  
  // Tasks state
  const [tasks, setTasks] = useState([])
  
  // Checklist state
  const [checklist, setChecklist] = useState([])
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  /**
   * Load project data from database
   * @param {string} projectId - Project ID
   */
  const loadProject = useCallback(async (projectId) => {
    if (!projectId || !user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch project details
      const { data: project, error: projectError } = await db
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (projectError) throw projectError

      setActiveProject(project)
      setProjectOverview({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'planning',
        startDate: project.start_date || null,
        endDate: project.end_date || null,
        progress: project.progress || 0,
      })

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await db
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (tasksError) throw tasksError
      setTasks(tasksData || [])

      // Fetch checklist items
      const { data: checklistData, error: checklistError } = await db
        .from('checklist_items')
        .select('*')
        .eq('project_id', projectId)
        .order('order', { ascending: true })

      if (checklistError) throw checklistError
      setChecklist(checklistData || [])

      return { success: true, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadInitialProject = useCallback(async () => {
    if (!user) {
      clearProject()
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data: projects, error: projectsError } = await db
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)

      if (projectsError) throw projectsError

      if (projects?.length) {
        await loadProject(projects[0].id)
      } else {
        clearProject()
      }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadProject, user])

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   */
  const createProject = async (projectData) => {
    if (!user) {
      const error = 'User not authenticated'
      toast.error(error)
      return { data: null, error }
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: createError } = await db
        .from('projects')
        .insert([
          {
            ...projectData,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) throw createError

      setActiveProject(data)
      setProjectOverview({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'planning',
        startDate: data.start_date || null,
        endDate: data.end_date || null,
        progress: data.progress || 0,
      })

      toast.success('Project created successfully!')
      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update project overview
   * @param {Object} updates - Project updates
   */
  const updateProjectOverview = async (updates) => {
    if (!activeProject) return { data: null, error: 'No active project' }

    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await db
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeProject.id)
        .select()
        .single()

      if (updateError) throw updateError

      setActiveProject(data)
      setProjectOverview({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'planning',
        startDate: data.start_date || null,
        endDate: data.end_date || null,
        progress: data.progress || 0,
      })

      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new task
   * @param {Object} taskData - Task data
   */
  const addTask = async (taskData) => {
    if (!activeProject) {
      const error = 'No active project'
      toast.error(error)
      return { data: null, error }
    }
    if (!user) {
      const error = 'User not authenticated'
      toast.error(error)
      return { data: null, error }
    }

    try {
      setError(null)

      const { data, error: insertError } = await db
        .from('tasks')
        .insert([
          {
            ...normalizeTaskPayload(taskData),
            project_id: activeProject.id,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      setTasks((prev) => [...prev, data])
      toast.success('Task created successfully')
      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Task updates
   */
  const updateTask = async (taskId, updates) => {
    try {
      setError(null)

      const { data, error: updateError } = await db
        .from('tasks')
        .update({
          ...normalizeTaskPayload(updates),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single()

      if (updateError) throw updateError

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data : task))
      )
      toast.success('Task updated successfully')
      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   */
  const deleteTask = async (taskId) => {
    try {
      setError(null)

      const { error: deleteError } = await db
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (deleteError) throw deleteError

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success('Task deleted successfully')
      return { error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { error: errorMessage }
    }
  }

  /**
   * Add a checklist item
   * @param {Object} itemData - Checklist item data
   */
  const addChecklistItem = async (itemData) => {
    if (!activeProject) {
      const error = 'No active project'
      toast.error(error)
      return { data: null, error }
    }
    if (!user) {
      const error = 'User not authenticated'
      toast.error(error)
      return { data: null, error }
    }

    try {
      setError(null)

      const { data, error: insertError } = await db
        .from('checklist_items')
        .insert([
          {
            ...itemData,
            project_id: activeProject.id,
            user_id: user.id,
            order: checklist.length,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      setChecklist((prev) => [...prev, data])
      // Don't show toast here - let the calling component handle it for better UX
      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  /**
   * Update a checklist item
   * @param {string} itemId - Checklist item ID
   * @param {Object} updates - Checklist item updates
   */
  const updateChecklistItem = async (itemId, updates) => {
    try {
      setError(null)

      const { data, error: updateError } = await db
        .from('checklist_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single()

      if (updateError) throw updateError

      setChecklist((prev) =>
        prev.map((item) => (item.id === itemId ? data : item))
      )
      // Don't show toast here - let the calling component handle it for better UX
      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  /**
   * Delete a checklist item
   * @param {string} itemId - Checklist item ID
   */
  const deleteChecklistItem = async (itemId) => {
    try {
      setError(null)

      const { error: deleteError } = await db
        .from('checklist_items')
        .delete()
        .eq('id', itemId)

      if (deleteError) throw deleteError

      setChecklist((prev) => prev.filter((item) => item.id !== itemId))
      toast.success('Checklist item deleted')
      return { error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      toast.error(errorMessage)
      return { error: errorMessage }
    }
  }

  /**
   * Reorder checklist items
   * @param {Array} reorderedItems - Reordered checklist items
   */
  const reorderChecklist = async (reorderedItems) => {
    try {
      setError(null)

      // Update order for all items
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        order: index,
      }))

      // Batch update
      for (const update of updates) {
        await db
          .from('checklist_items')
          .update({ order: update.order })
          .eq('id', update.id)
      }

      setChecklist(reorderedItems)
      return { error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  /**
   * Clear active project
   */
  const clearProject = () => {
    setActiveProject(null)
    setProjectOverview({
      title: '',
      description: '',
      status: 'planning',
      startDate: null,
      endDate: null,
      progress: 0,
    })
    setTasks([])
    setChecklist([])
    setError(null)
  }

  // Set up real-time subscriptions when active project changes
  useEffect(() => {
    loadInitialProject()
  }, [loadInitialProject])

  useEffect(() => {
    if (!activeProject) return

    // Subscribe to tasks changes
    const tasksSubscription = db.subscribe(
      'tasks',
      (payload) => {
        console.log('Tasks change received:', payload)
        
        if (payload.eventType === 'INSERT') {
          setTasks((prev) => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setTasks((prev) =>
            prev.map((task) => (task.id === payload.new.id ? payload.new : task))
          )
        } else if (payload.eventType === 'DELETE') {
          setTasks((prev) => prev.filter((task) => task.id !== payload.old.id))
        }
      },
      { filter: `project_id=eq.${activeProject.id}` }
    )

    // Subscribe to checklist changes
    const checklistSubscription = db.subscribe(
      'checklist_items',
      (payload) => {
        console.log('Checklist change received:', payload)
        
        if (payload.eventType === 'INSERT') {
          setChecklist((prev) => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setChecklist((prev) =>
            prev.map((item) => (item.id === payload.new.id ? payload.new : item))
          )
        } else if (payload.eventType === 'DELETE') {
          setChecklist((prev) => prev.filter((item) => item.id !== payload.old.id))
        }
      },
      { filter: `project_id=eq.${activeProject.id}` }
    )

    // Cleanup subscriptions
    return () => {
      db.unsubscribe(tasksSubscription)
      db.unsubscribe(checklistSubscription)
    }
  }, [activeProject])

  const value = {
    // State
    activeProject,
    projectOverview,
    tasks,
    checklist,
    loading,
    error,
    
    // Project methods
    loadProject,
    createProject,
    updateProjectOverview,
    clearProject,
    
    // Task methods
    addTask,
    updateTask,
    deleteTask,
    
    // Checklist methods
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    reorderChecklist,
  }

  return (
    <HackSprintContext.Provider value={value}>
      {children}
    </HackSprintContext.Provider>
  )
}

/**
 * Custom hook to use HackSprint context
 * @returns {Object} HackSprint context value
 */
export function useHackSprint() {
  const context = useContext(HackSprintContext)
  if (context === undefined) {
    throw new Error('useHackSprint must be used within a HackSprintProvider')
  }
  return context
}

export default HackSprintContext

// Made with Bob
