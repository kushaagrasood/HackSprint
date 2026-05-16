import { format, formatDistance, isToday, isYesterday, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns'
import { DATE_FORMATS } from './constants'

/**
 * Format date to display format
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = DATE_FORMATS.DISPLAY) {
  if (!date) return ''
  try {
    return format(new Date(date), formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format date with time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date with time
 */
export function formatDateTime(date) {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME)
}

/**
 * Format time only
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time
 */
export function formatTime(date) {
  return formatDate(date, DATE_FORMATS.TIME_ONLY)
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative date
 */
export function formatRelativeDate(date) {
  if (!date) return ''
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative date:', error)
    return ''
  }
}

/**
 * Format date in a friendly way (Today, Yesterday, or date)
 * @param {Date|string} date - Date to format
 * @returns {string} Friendly date
 */
export function formatFriendlyDate(date) {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    
    if (isToday(dateObj)) {
      return `Today at ${formatTime(dateObj)}`
    }
    
    if (isYesterday(dateObj)) {
      return `Yesterday at ${formatTime(dateObj)}`
    }
    
    return formatDate(dateObj, DATE_FORMATS.DISPLAY)
  } catch (error) {
    console.error('Error formatting friendly date:', error)
    return ''
  }
}

/**
 * Format duration in minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export function formatDuration(minutes) {
  if (!minutes || minutes === 0) return '0m'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Format seconds to MM:SS format
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time
 */
export function formatTimer(seconds) {
  if (!seconds || seconds < 0) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Format time difference between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted time difference
 */
export function formatTimeDifference(startDate, endDate) {
  if (!startDate || !endDate) return ''
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const days = differenceInDays(end, start)
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
    
    const hours = differenceInHours(end, start)
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    
    const minutes = differenceInMinutes(end, start)
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } catch (error) {
    console.error('Error formatting time difference:', error)
    return ''
  }
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return ''
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return `${currency} ${amount}`
  }
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  
  try {
    return new Intl.NumberFormat('en-US').format(num)
  } catch (error) {
    console.error('Error formatting number:', error)
    return String(num)
  }
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 0) {
  if (value === null || value === undefined) return '0%'
  
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  if (!bytes) return ''
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return ''
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  
  return phone
}

/**
 * Format task status for display
 * @param {string} status - Task status
 * @returns {string} Formatted status
 */
export function formatTaskStatus(status) {
  if (!status) return ''
  
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format priority for display
 * @param {string} priority - Priority level
 * @returns {string} Formatted priority
 */
export function formatPriority(priority) {
  if (!priority) return ''
  
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
}

/**
 * Format array to comma-separated string
 * @param {Array} array - Array to format
 * @param {string} separator - Separator character
 * @returns {string} Formatted string
 */
export function formatArrayToString(array, separator = ', ') {
  if (!Array.isArray(array) || array.length === 0) return ''
  
  return array.join(separator)
}

/**
 * Format name (capitalize first letter of each word)
 * @param {string} name - Name to format
 * @returns {string} Formatted name
 */
export function formatName(name) {
  if (!name) return ''
  
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format text to title case
 * @param {string} text - Text to format
 * @returns {string} Title case text
 */
export function toTitleCase(text) {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format text to sentence case
 * @param {string} text - Text to format
 * @returns {string} Sentence case text
 */
export function toSentenceCase(text) {
  if (!text) return ''
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format slug to readable text
 * @param {string} slug - Slug to format
 * @returns {string} Readable text
 */
export function formatSlug(slug) {
  if (!slug) return ''
  
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format text to slug
 * @param {string} text - Text to format
 * @returns {string} Slug
 */
export function toSlug(text) {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 50, suffix = '...') {
  if (!text) return ''
  if (text.length <= length) return text
  
  return text.slice(0, length).trim() + suffix
}

/**
 * Format markdown to plain text
 * @param {string} markdown - Markdown text
 * @returns {string} Plain text
 */
export function markdownToPlainText(markdown) {
  if (!markdown) return ''
  
  return markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove code
    .replace(/>\s/g, '') // Remove blockquotes
    .replace(/[-*+]\s/g, '') // Remove list markers
    .trim()
}

/**
 * Format JSON for display
 * @param {Object} obj - Object to format
 * @param {number} indent - Indentation spaces
 * @returns {string} Formatted JSON
 */
export function formatJSON(obj, indent = 2) {
  if (!obj) return ''
  
  try {
    return JSON.stringify(obj, null, indent)
  } catch (error) {
    console.error('Error formatting JSON:', error)
    return String(obj)
  }
}

/**
 * Format error message for display
 * @param {Error|string} error - Error to format
 * @returns {string} Formatted error message
 */
export function formatError(error) {
  if (!error) return 'An unknown error occurred'
  
  if (typeof error === 'string') return error
  if (error.message) return error.message
  
  return 'An error occurred'
}

/**
 * Format validation errors
 * @param {Object} errors - Validation errors object
 * @returns {string} Formatted error message
 */
export function formatValidationErrors(errors) {
  if (!errors || typeof errors !== 'object') return ''
  
  const errorMessages = Object.values(errors).filter(Boolean)
  return errorMessages.join('. ')
}

/**
 * Format progress as text
 * @param {number} completed - Completed items
 * @param {number} total - Total items
 * @returns {string} Progress text
 */
export function formatProgress(completed, total) {
  if (!total || total === 0) return '0/0'
  return `${completed || 0}/${total}`
}

/**
 * Format hackathon duration
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Duration text
 */
export function formatHackathonDuration(startDate, endDate) {
  if (!startDate || !endDate) return ''
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = differenceInDays(end, start)
    
    if (days === 0) return 'Same day'
    if (days === 1) return '1 day'
    return `${days} days`
  } catch (error) {
    console.error('Error formatting hackathon duration:', error)
    return ''
  }
}

// Made with Bob
