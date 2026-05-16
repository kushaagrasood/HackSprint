// Application Constants

// App Info
export const APP_NAME = 'HackSprint'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Solo Hackathon Execution Platform'

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  CHECKLIST: '/checklist',
  PITCH: '/pitch',
  ANALYTICS: '/analytics',
  TEMPLATES: '/templates',
  EXPORT: '/export',
  SETTINGS: '/settings',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
}

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  BLOCKED: 'blocked',
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.DONE]: 'Done',
  [TASK_STATUS.BLOCKED]: 'Blocked',
}

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: 'gray',
  [TASK_STATUS.IN_PROGRESS]: 'info',
  [TASK_STATUS.DONE]: 'success',
  [TASK_STATUS.BLOCKED]: 'error',
}

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.URGENT]: 'Urgent',
}

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'gray',
  [TASK_PRIORITY.MEDIUM]: 'info',
  [TASK_PRIORITY.HIGH]: 'warning',
  [TASK_PRIORITY.URGENT]: 'error',
}

// Hackathon Status
export const HACKATHON_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
}

export const HACKATHON_STATUS_LABELS = {
  [HACKATHON_STATUS.PLANNING]: 'Planning',
  [HACKATHON_STATUS.IN_PROGRESS]: 'In Progress',
  [HACKATHON_STATUS.COMPLETED]: 'Completed',
  [HACKATHON_STATUS.ARCHIVED]: 'Archived',
}

// Template Categories
export const TEMPLATE_CATEGORIES = {
  WEB: 'web',
  MOBILE: 'mobile',
  AI_ML: 'ai_ml',
  BLOCKCHAIN: 'blockchain',
  IOT: 'iot',
  GAME: 'game',
  GENERAL: 'general',
}

export const TEMPLATE_CATEGORY_LABELS = {
  [TEMPLATE_CATEGORIES.WEB]: 'Web Development',
  [TEMPLATE_CATEGORIES.MOBILE]: 'Mobile App',
  [TEMPLATE_CATEGORIES.AI_ML]: 'AI/ML',
  [TEMPLATE_CATEGORIES.BLOCKCHAIN]: 'Blockchain',
  [TEMPLATE_CATEGORIES.IOT]: 'IoT',
  [TEMPLATE_CATEGORIES.GAME]: 'Game Development',
  [TEMPLATE_CATEGORIES.GENERAL]: 'General',
}

// Export Formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  CSV: 'csv',
  JSON: 'json',
  MARKDOWN: 'markdown',
}

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.PDF]: 'PDF Document',
  [EXPORT_FORMATS.CSV]: 'CSV Spreadsheet',
  [EXPORT_FORMATS.JSON]: 'JSON Data',
  [EXPORT_FORMATS.MARKDOWN]: 'Markdown File',
}

// Time Presets (in minutes)
export const TIME_PRESETS = {
  POMODORO: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
  PITCH_2MIN: 2,
  PITCH_5MIN: 5,
  PITCH_10MIN: 10,
}

// Checklist Templates
export const CHECKLIST_TEMPLATES = {
  PRE_HACKATHON: 'pre_hackathon',
  DURING_HACKATHON: 'during_hackathon',
  POST_HACKATHON: 'post_hackathon',
  PITCH_PREP: 'pitch_prep',
  CUSTOM: 'custom',
}

export const CHECKLIST_TEMPLATE_LABELS = {
  [CHECKLIST_TEMPLATES.PRE_HACKATHON]: 'Pre-Hackathon',
  [CHECKLIST_TEMPLATES.DURING_HACKATHON]: 'During Hackathon',
  [CHECKLIST_TEMPLATES.POST_HACKATHON]: 'Post-Hackathon',
  [CHECKLIST_TEMPLATES.PITCH_PREP]: 'Pitch Preparation',
  [CHECKLIST_TEMPLATES.CUSTOM]: 'Custom Checklist',
}

// Analytics Time Ranges
export const ANALYTICS_TIME_RANGES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  ALL_TIME: 'all_time',
}

export const ANALYTICS_TIME_RANGE_LABELS = {
  [ANALYTICS_TIME_RANGES.TODAY]: 'Today',
  [ANALYTICS_TIME_RANGES.WEEK]: 'This Week',
  [ANALYTICS_TIME_RANGES.MONTH]: 'This Month',
  [ANALYTICS_TIME_RANGES.ALL_TIME]: 'All Time',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hacksprint_auth_token',
  USER_PREFERENCES: 'hacksprint_user_preferences',
  THEME: 'hacksprint_theme',
  SIDEBAR_STATE: 'hacksprint_sidebar_state',
  DRAFT_TASKS: 'hacksprint_draft_tasks',
  DRAFT_PITCH: 'hacksprint_draft_pitch',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
}

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 500,
  MAX_PITCH_CONTENT_LENGTH: 10000,
  MIN_HACKATHON_NAME_LENGTH: 3,
  MAX_HACKATHON_NAME_LENGTH: 50,
}

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    CHECKLIST_SAVED: 'Checklist saved successfully',
    PITCH_SAVED: 'Pitch saved successfully',
    EXPORT_SUCCESS: 'Export completed successfully',
    TEMPLATE_SAVED: 'Template saved successfully',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    AUTH_REQUIRED: 'Please log in to continue.',
    INVALID_INPUT: 'Please check your input and try again.',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_FILE_TYPE: 'Invalid file type.',
  },
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#6366f1',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  GRAY: '#6b7280',
}

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

// Feature Flags
export const FEATURES = {
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  EXPORT: import.meta.env.VITE_ENABLE_EXPORT !== 'false',
  TEMPLATES: import.meta.env.VITE_ENABLE_TEMPLATES !== 'false',
  DARK_MODE: true,
  REAL_TIME: true,
}

// API Endpoints (if using custom API)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  AUTH: '/auth',
  TASKS: '/tasks',
  CHECKLISTS: '/checklists',
  PITCHES: '/pitches',
  ANALYTICS: '/analytics',
  TEMPLATES: '/templates',
  EXPORT: '/export',
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  TIME_ONLY: 'HH:mm',
  SHORT_DATE: 'MM/dd/yyyy',
}

// Error Codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
}

// Made with Bob
