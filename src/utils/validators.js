import { VALIDATION } from './constants'

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export function validatePassword(password) {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
    }
  }

  // Check for at least one uppercase, one lowercase, and one number
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      error: 'Password must contain uppercase, lowercase, and number',
    }
  }

  return { isValid: true, error: null }
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Validation result
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'Please confirm your password' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate task title
 * @param {string} title - Task title
 * @returns {Object} Validation result
 */
export function validateTaskTitle(title) {
  if (!title || title.trim() === '') {
    return { isValid: false, error: 'Task title is required' }
  }

  if (title.length > VALIDATION.MAX_TASK_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Task title must be less than ${VALIDATION.MAX_TASK_TITLE_LENGTH} characters`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Validate task description
 * @param {string} description - Task description
 * @returns {Object} Validation result
 */
export function validateTaskDescription(description) {
  if (!description) {
    return { isValid: true, error: null } // Description is optional
  }

  if (description.length > VALIDATION.MAX_TASK_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `Description must be less than ${VALIDATION.MAX_TASK_DESCRIPTION_LENGTH} characters`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Validate hackathon name
 * @param {string} name - Hackathon name
 * @returns {Object} Validation result
 */
export function validateHackathonName(name) {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Hackathon name is required' }
  }

  if (name.length < VALIDATION.MIN_HACKATHON_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Name must be at least ${VALIDATION.MIN_HACKATHON_NAME_LENGTH} characters`,
    }
  }

  if (name.length > VALIDATION.MAX_HACKATHON_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Name must be less than ${VALIDATION.MAX_HACKATHON_NAME_LENGTH} characters`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Validate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Validation result
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate) {
    return { isValid: false, error: 'Start date is required' }
  }

  if (!endDate) {
    return { isValid: false, error: 'End date is required' }
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime())) {
    return { isValid: false, error: 'Invalid start date' }
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid end date' }
  }

  if (end < start) {
    return { isValid: false, error: 'End date must be after start date' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export function validateUrl(url) {
  if (!url || url.trim() === '') {
    return { isValid: true, error: null } // URL is optional
  }

  try {
    new URL(url)
    return { isValid: true, error: null }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  } = options

  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  return { isValid: true, error: null }
}

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export function validateNumberRange(value, min, max, fieldName = 'Value') {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  const num = Number(value)

  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a number` }
  }

  if (num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` }
  }

  if (num > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` }
  }

  return { isValid: true, error: null }
}

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export function validateStringLength(value, min, max, fieldName = 'Field') {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (value.length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`,
    }
  }

  if (value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be at most ${max} characters`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors object
 */
export function validateForm(data, rules) {
  const errors = {}
  let isValid = true

  Object.keys(rules).forEach((field) => {
    const rule = rules[field]
    const value = data[field]

    if (rule.required) {
      const result = validateRequired(value, rule.label || field)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
        return
      }
    }

    if (rule.type === 'email') {
      const result = validateEmail(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    if (rule.type === 'password') {
      const result = validatePassword(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    if (rule.type === 'url') {
      const result = validateUrl(value)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    if (rule.minLength || rule.maxLength) {
      const result = validateStringLength(
        value,
        rule.minLength || 0,
        rule.maxLength || Infinity,
        rule.label || field
      )
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    if (rule.min !== undefined || rule.max !== undefined) {
      const result = validateNumberRange(
        value,
        rule.min || -Infinity,
        rule.max || Infinity,
        rule.label || field
      )
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }

    if (rule.custom && typeof rule.custom === 'function') {
      const result = rule.custom(value, data)
      if (!result.isValid) {
        errors[field] = result.error
        isValid = false
      }
    }
  })

  return { isValid, errors }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html) return ''
  
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Validate pitch content
 * @param {string} content - Pitch content
 * @returns {Object} Validation result
 */
export function validatePitchContent(content) {
  if (!content || content.trim() === '') {
    return { isValid: false, error: 'Pitch content is required' }
  }

  if (content.length > VALIDATION.MAX_PITCH_CONTENT_LENGTH) {
    return {
      isValid: false,
      error: `Content must be less than ${VALIDATION.MAX_PITCH_CONTENT_LENGTH} characters`,
    }
  }

  return { isValid: true, error: null }
}

// Made with Bob
