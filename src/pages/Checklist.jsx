import { useState, useEffect } from 'react'
import { useHackSprint } from '@context/HackSprintContext'
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Github, 
  Video, 
  FileText, 
  Book, 
  Globe, 
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Submission Checklist Page Component
 * Tracks 6 critical hackathon deliverables with status and URLs
 */

// Define the 6 critical deliverables
const DELIVERABLES = [
  {
    id: 'github_repo',
    title: 'GitHub Repository',
    description: 'Public repository with complete source code',
    icon: Github,
    placeholder: 'https://github.com/username/project'
  },
  {
    id: 'demo_video',
    title: 'Demo Video',
    description: 'Video demonstration of your project',
    icon: Video,
    placeholder: 'https://youtube.com/watch?v=...'
  },
  {
    id: 'pitch_deck',
    title: 'Pitch Deck',
    description: 'Presentation slides for your pitch',
    icon: FileText,
    placeholder: 'https://docs.google.com/presentation/...'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'README and technical documentation',
    icon: Book,
    placeholder: 'https://github.com/username/project#readme'
  },
  {
    id: 'deployment_link',
    title: 'Deployment Link',
    description: 'Live demo or deployed application',
    icon: Globe,
    placeholder: 'https://your-project.vercel.app'
  },
  {
    id: 'team_profiles',
    title: 'Team Profiles',
    description: 'Team member profiles and contributions',
    icon: Users,
    placeholder: 'https://devpost.com/software/...'
  }
]

function Checklist() {
  const { activeProject, checklist, addChecklistItem, updateChecklistItem, loading } = useHackSprint()
  
  // Local state for deliverables
  const [deliverables, setDeliverables] = useState({})
  const [saving, setSaving] = useState({})
  const [initialized, setInitialized] = useState(false)

  // Initialize deliverables from checklist
  useEffect(() => {
    if (!activeProject || initialized) return

    const deliverableMap = {}
    
    // Map existing checklist items to deliverables
    DELIVERABLES.forEach(deliverable => {
      const existingItem = checklist.find(item => 
        item.title.toLowerCase().includes(deliverable.id.replace('_', ' '))
      )
      
      deliverableMap[deliverable.id] = {
        id: existingItem?.id || null,
        completed: existingItem?.completed || false,
        url: existingItem?.url || ''
      }
    })
    
    setDeliverables(deliverableMap)
    setInitialized(true)
  }, [activeProject, checklist, initialized])

  // Validate URL
  const isValidUrl = (url) => {
    if (!url || url.trim() === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Handle status toggle
  const handleToggleStatus = async (deliverableId) => {
    if (!activeProject) {
      toast.error('No active project')
      return
    }

    const deliverable = DELIVERABLES.find(d => d.id === deliverableId)
    const currentData = deliverables[deliverableId]
    const newStatus = !currentData.completed

    setSaving(prev => ({ ...prev, [deliverableId]: true }))

    try {
      if (currentData.id) {
        // Update existing item
        const { error } = await updateChecklistItem(currentData.id, {
          completed: newStatus
        })

        if (error) throw new Error(error)

        setDeliverables(prev => ({
          ...prev,
          [deliverableId]: { ...prev[deliverableId], completed: newStatus }
        }))

        toast.success(newStatus ? `${deliverable.title} marked as ready!` : `${deliverable.title} marked as missing`)
      } else {
        // Create new item
        const { data, error } = await addChecklistItem({
          title: deliverable.title,
          completed: newStatus,
          url: currentData.url || ''
        })

        if (error) throw new Error(error)

        setDeliverables(prev => ({
          ...prev,
          [deliverableId]: { 
            id: data.id,
            completed: newStatus,
            url: currentData.url || ''
          }
        }))

        toast.success(`${deliverable.title} added to checklist`)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setSaving(prev => ({ ...prev, [deliverableId]: false }))
    }
  }

  // Handle URL change
  const handleUrlChange = (deliverableId, url) => {
    setDeliverables(prev => ({
      ...prev,
      [deliverableId]: { ...prev[deliverableId], url }
    }))
  }

  // Handle URL save
  const handleSaveUrl = async (deliverableId) => {
    if (!activeProject) {
      toast.error('No active project')
      return
    }

    const deliverable = DELIVERABLES.find(d => d.id === deliverableId)
    const currentData = deliverables[deliverableId]

    if (!isValidUrl(currentData.url)) {
      toast.error('Please enter a valid URL')
      return
    }

    setSaving(prev => ({ ...prev, [deliverableId]: true }))

    try {
      if (currentData.id) {
        // Update existing item
        const { error } = await updateChecklistItem(currentData.id, {
          url: currentData.url
        })

        if (error) throw new Error(error)
        toast.success('URL saved successfully')
      } else {
        // Create new item with URL
        const { data, error } = await addChecklistItem({
          title: deliverable.title,
          completed: false,
          url: currentData.url
        })

        if (error) throw new Error(error)

        setDeliverables(prev => ({
          ...prev,
          [deliverableId]: { 
            id: data.id,
            completed: false,
            url: currentData.url
          }
        }))

        toast.success('URL saved successfully')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save URL')
    } finally {
      setSaving(prev => ({ ...prev, [deliverableId]: false }))
    }
  }

  // Handle open link
  const handleOpenLink = (url) => {
    if (isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Calculate completion percentage
  const completionPercentage = Object.values(deliverables).filter(d => d.completed).length / DELIVERABLES.length * 100

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Project</h2>
            <p className="text-gray-600">Please create a project first to use the submission checklist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="card gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Submission Checklist</h1>
              <p className="text-white/90">Track your hackathon deliverables</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-white/80">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Deliverables List */}
        <div className="space-y-4">
          {DELIVERABLES.map((deliverable) => {
            const Icon = deliverable.icon
            const data = deliverables[deliverable.id] || { completed: false, url: '' }
            const isSaving = saving[deliverable.id]
            const hasValidUrl = isValidUrl(data.url)

            return (
              <div
                key={deliverable.id}
                className={`card transition-all duration-200 ${
                  data.completed 
                    ? 'border-2 border-success-300 bg-success-50' 
                    : 'border-2 border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex flex-col gap-4">
                  {/* Header Row */}
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${
                      data.completed ? 'bg-success-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        data.completed ? 'text-success-600' : 'text-gray-600'
                      }`} />
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {deliverable.title}
                      </h3>
                      <p className="text-sm text-gray-600">{deliverable.description}</p>
                    </div>

                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleStatus(deliverable.id)}
                      disabled={isSaving || loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        data.completed
                          ? 'bg-success-600 text-white hover:bg-success-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : data.completed ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="hidden sm:inline">Ready</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span className="hidden sm:inline">Missing</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* URL Input Row */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={data.url}
                      onChange={(e) => handleUrlChange(deliverable.id, e.target.value)}
                      onBlur={() => {
                        if (data.url && data.url !== (deliverables[deliverable.id]?.url || '')) {
                          handleSaveUrl(deliverable.id)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveUrl(deliverable.id)
                        }
                      }}
                      placeholder={deliverable.placeholder}
                      disabled={isSaving || loading}
                      className="input flex-1"
                    />
                    
                    {hasValidUrl && (
                      <button
                        onClick={() => handleOpenLink(data.url)}
                        className="btn btn-secondary flex items-center gap-2"
                        title="Open link in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Open Link</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Card */}
        <div className="card bg-gradient-to-br from-primary-50 to-info-50 border-2 border-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Submission Status</h2>
              <p className="text-sm text-gray-600">
                {Object.values(deliverables).filter(d => d.completed).length} of {DELIVERABLES.length} deliverables ready
              </p>
            </div>
          </div>

          {completionPercentage === 100 ? (
            <div className="p-4 bg-success-100 border border-success-300 rounded-lg">
              <p className="text-success-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                🎉 All deliverables are ready! You're good to submit!
              </p>
            </div>
          ) : (
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <p className="text-warning-800 font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Complete all deliverables before submitting your project
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checklist

// Made with Bob