import { useState, useMemo } from 'react'
import { 
  Lightbulb, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Rocket,
  Code,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Presentation,
  Sparkles
} from 'lucide-react'

/**
 * Pitch Preparation Page Component
 * Helps users build their pitch with problem statement builder and slide structure template
 */

// Slide structure data
const SLIDE_STRUCTURE = [
  {
    id: 'introduction',
    title: 'Introduction (30 seconds)',
    icon: Presentation,
    color: 'primary',
    content: [
      'Team name and members',
      'Project name with tagline',
      'Hook: One sentence that captures attention',
      'Example: "Hi, we\'re Team {{TEAM_NAME}} from {{ORGANIZATION}}, and we built {{PROJECT_NAME}} - {{TAGLINE}}"'
    ]
  },
  {
    id: 'problem',
    title: 'The Problem (45 seconds)',
    icon: AlertCircle,
    color: 'error',
    content: [
      'Who faces this problem? (Target users)',
      'What is the problem? (Pain points)',
      'Why does it matter? (Impact/statistics)',
      'Current alternatives and their limitations',
      'Example: "{{TARGET_USER}} struggle with {{PROBLEM}} because {{REASON}}. Current solutions like {{ALTERNATIVES}} fall short because {{LIMITATIONS}}"'
    ]
  },
  {
    id: 'solution',
    title: 'The Solution - Demo Time (60 seconds)',
    icon: Rocket,
    color: 'success',
    content: [
      'What is your solution?',
      'How does it solve the problem?',
      'Key features (2-3 main ones)',
      'Live demo or screenshots',
      'Unique value proposition',
      'Example: "{{PROJECT_NAME}} solves this by {{SOLUTION}}. Let me show you..."'
    ]
  },
  {
    id: 'tech',
    title: 'Tech Stack (20 seconds)',
    icon: Code,
    color: 'info',
    content: [
      'Frontend technologies',
      'Backend technologies',
      'Database and APIs',
      'Special tools or frameworks',
      'Why these choices? (briefly)',
      'Example: "Built with {{FRONTEND}} and {{BACKEND}}, powered by {{DATABASE}} and {{API}}"'
    ]
  },
  {
    id: 'future',
    title: 'Future Scope (25 seconds)',
    icon: TrendingUp,
    color: 'warning',
    content: [
      'What\'s next for the project?',
      'Scalability plans',
      'Additional features',
      'Potential impact',
      'Call to action',
      'Example: "We plan to add {{FEATURE_1}}, {{FEATURE_2}}, and scale to {{SCALE_PLAN}}. Thank you!"'
    ]
  }
]

function PitchPrep() {
  // Problem Statement Builder state
  const [problemStatement, setProblemStatement] = useState({
    targetUser: '',
    problem: '',
    alternatives: '',
    solution: ''
  })

  // Accordion state
  const [expandedSlides, setExpandedSlides] = useState({
    introduction: true,
    problem: false,
    solution: false,
    tech: false,
    future: false
  })

  // Toggle accordion
  const toggleSlide = (slideId) => {
    setExpandedSlides(prev => ({
      ...prev,
      [slideId]: !prev[slideId]
    }))
  }

  // Expand/Collapse all
  const expandAll = () => {
    const allExpanded = {}
    SLIDE_STRUCTURE.forEach(slide => {
      allExpanded[slide.id] = true
    })
    setExpandedSlides(allExpanded)
  }

  const collapseAll = () => {
    const allCollapsed = {}
    SLIDE_STRUCTURE.forEach(slide => {
      allCollapsed[slide.id] = false
    })
    setExpandedSlides(allCollapsed)
  }

  // Generate elevator pitch
  const elevatorPitch = useMemo(() => {
    const { targetUser, problem, alternatives, solution } = problemStatement
    
    if (!targetUser && !problem && !alternatives && !solution) {
      return 'Start filling in the fields above to generate your elevator pitch...'
    }

    let pitch = ''
    
    if (targetUser) {
      pitch += `${targetUser} `
    }
    
    if (problem) {
      pitch += `face a critical challenge: ${problem}. `
    }
    
    if (alternatives) {
      pitch += `While ${alternatives} exist, they fall short. `
    }
    
    if (solution) {
      pitch += `Our solution ${solution}, providing a better way forward.`
    }

    return pitch || 'Start filling in the fields above to generate your elevator pitch...'
  }, [problemStatement])

  // Check if elevator pitch is complete
  const isPitchComplete = problemStatement.targetUser && 
                          problemStatement.problem && 
                          problemStatement.alternatives && 
                          problemStatement.solution

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="card gradient-primary text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Presentation className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Pitch Preparation</h1>
              <p className="text-white/90">Craft your perfect 3-minute hackathon pitch</p>
            </div>
          </div>
        </div>

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Problem Statement Builder */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Problem Statement Builder</h2>
                  <p className="text-sm text-gray-600">Define your pitch foundation</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Target User */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Users className="w-4 h-4" />
                    Target User
                  </label>
                  <textarea
                    value={problemStatement.targetUser}
                    onChange={(e) => setProblemStatement(prev => ({ ...prev, targetUser: e.target.value }))}
                    placeholder="e.g., College students, Small business owners, Healthcare professionals..."
                    className="input min-h-20 resize-none"
                    rows={2}
                  />
                </div>

                {/* The Problem */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <AlertCircle className="w-4 h-4" />
                    The Problem
                  </label>
                  <textarea
                    value={problemStatement.problem}
                    onChange={(e) => setProblemStatement(prev => ({ ...prev, problem: e.target.value }))}
                    placeholder="e.g., struggle to manage their time effectively during hackathons, leading to missed deadlines and incomplete projects..."
                    className="input min-h-24 resize-none"
                    rows={3}
                  />
                </div>

                {/* Current Alternatives */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Current Alternatives
                  </label>
                  <textarea
                    value={problemStatement.alternatives}
                    onChange={(e) => setProblemStatement(prev => ({ ...prev, alternatives: e.target.value }))}
                    placeholder="e.g., generic project management tools like Trello or Notion..."
                    className="input min-h-20 resize-none"
                    rows={2}
                  />
                </div>

                {/* Our Solution */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Rocket className="w-4 h-4" />
                    Our Solution
                  </label>
                  <textarea
                    value={problemStatement.solution}
                    onChange={(e) => setProblemStatement(prev => ({ ...prev, solution: e.target.value }))}
                    placeholder="e.g., is a specialized hackathon management platform that combines task tracking, time management, and submission preparation in one place..."
                    className="input min-h-24 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Generated Elevator Pitch */}
            <div className={`card border-2 ${
              isPitchComplete 
                ? 'border-success-300 bg-gradient-to-br from-success-50 to-success-100' 
                : 'border-primary-200 bg-gradient-to-br from-primary-50 to-info-50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  isPitchComplete ? 'bg-success-600' : 'bg-primary-600'
                }`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Generated Elevator Pitch</h3>
                  <p className="text-sm text-gray-600">
                    {isPitchComplete ? 'Ready to use!' : 'Fill all fields above'}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                isPitchComplete 
                  ? 'bg-white border-success-200' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <p className={`text-base leading-relaxed ${
                  isPitchComplete ? 'text-gray-900' : 'text-gray-500 italic'
                }`}>
                  {elevatorPitch}
                </p>
              </div>

              {isPitchComplete && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(elevatorPitch)
                      alert('Elevator pitch copied to clipboard!')
                    }}
                    className="btn btn-primary flex-1"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Slide Structure Template */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info-100 rounded-lg">
                    <Presentation className="w-6 h-6 text-info-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Slide Structure Template</h2>
                    <p className="text-sm text-gray-600">Perfect 3-minute pitch flow</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Accordion */}
              <div className="space-y-3">
                {SLIDE_STRUCTURE.map((slide, index) => {
                  const Icon = slide.icon
                  const isExpanded = expandedSlides[slide.id]
                  const colorClasses = {
                    primary: 'bg-primary-100 text-primary-600 border-primary-200',
                    error: 'bg-error-100 text-error-600 border-error-200',
                    success: 'bg-success-100 text-success-600 border-success-200',
                    info: 'bg-info-100 text-info-600 border-info-200',
                    warning: 'bg-warning-100 text-warning-600 border-warning-200'
                  }

                  return (
                    <div
                      key={slide.id}
                      className={`border-2 rounded-lg overflow-hidden transition-all ${
                        isExpanded ? colorClasses[slide.color] : 'border-gray-200 bg-white'
                      }`}
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleSlide(slide.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isExpanded 
                              ? `bg-${slide.color}-600 text-white` 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {index + 1}. {slide.title}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 bg-white/50">
                          <ul className="space-y-2">
                            {slide.content.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-gray-400 mt-0.5">•</span>
                                <span className={item.startsWith('Example:') ? 'italic text-gray-600 bg-gray-50 px-2 py-1 rounded' : ''}>
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Template Variables Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-info-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Template Variables
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use these placeholders in your pitch and replace them with your actual data:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <code className="text-primary-600">{'{{TEAM_NAME}}'}</code>
                    <span className="text-gray-500 ml-1">→ Your team name</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <code className="text-primary-600">{'{{ORGANIZATION}}'}</code>
                    <span className="text-gray-500 ml-1">→ VIT Chennai</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <code className="text-primary-600">{'{{PROJECT_NAME}}'}</code>
                    <span className="text-gray-500 ml-1">→ Your project</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <code className="text-primary-600">{'{{TAGLINE}}'}</code>
                    <span className="text-gray-500 ml-1">→ One-liner</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <code className="text-primary-600">{'{{TARGET_USER}}'}</code>
                    <span className="text-gray-500 ml-1">→ Your audience</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <code className="text-primary-600">{'{{FRONTEND}}'}</code>
                    <span className="text-gray-500 ml-1">→ React, Vue, etc.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="card bg-gradient-to-br from-warning-50 to-warning-100 border-2 border-warning-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-warning-600" />
                Pro Tips for Your Pitch
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-warning-600 mt-0.5">✓</span>
                  <span>Practice your pitch multiple times - aim for exactly 3 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-600 mt-0.5">✓</span>
                  <span>Start with a hook that grabs attention in the first 5 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-600 mt-0.5">✓</span>
                  <span>Spend most time on the demo - show, don't just tell</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-600 mt-0.5">✓</span>
                  <span>Use simple language - avoid jargon unless necessary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning-600 mt-0.5">✓</span>
                  <span>End with a clear call-to-action or memorable statement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PitchPrep

// Made with Bob