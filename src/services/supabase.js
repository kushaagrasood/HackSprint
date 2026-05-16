import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set')
}

// Create Supabase client with configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database abstraction layer for flexibility
// This allows easy switching between Supabase and other backends

/**
 * Database service abstraction
 * Provides a unified interface for database operations
 */
export const db = {
  /**
   * Query data from a table
   * @param {string} table - Table name
   * @returns {Object} Query builder
   */
  from: (table) => supabase.from(table),

  /**
   * Execute RPC (Remote Procedure Call)
   * @param {string} fn - Function name
   * @param {Object} params - Function parameters
   * @returns {Promise} Function result
   */
  rpc: (fn, params) => supabase.rpc(fn, params),

  /**
   * Subscribe to real-time changes
   * @param {string} table - Table name
   * @param {Function} callback - Callback function
   * @param {Object} options - Subscription options
   * @returns {Object} Subscription object
   */
  subscribe: (table, callback, options = {}) => {
    const { event = '*', filter } = options
    
    let channel = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event, schema: 'public', table, filter }, callback)
    
    return channel.subscribe()
  },

  /**
   * Unsubscribe from real-time changes
   * @param {Object} subscription - Subscription object
   */
  unsubscribe: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription)
    }
  },
}

/**
 * Authentication service abstraction
 */
export const auth = {
  /**
   * Get current user
   * @returns {Promise<Object>} Current user
   */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  /**
   * Get current session
   * @returns {Promise<Object>} Current session
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user metadata
   * @returns {Promise<Object>} User data
   */
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
    return data
  },

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  /**
   * Sign in with OAuth provider
   * @param {string} provider - OAuth provider (google, github, etc.)
   * @returns {Promise<Object>} Auth response
   */
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Reset password
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  },

  /**
   * Update user metadata
   * @param {Object} metadata - User metadata
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (metadata) => {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    })
    if (error) throw error
    return data
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function
   * @returns {Object} Subscription object
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

/**
 * Storage service abstraction
 */
export const storage = {
  /**
   * Upload file to storage
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  upload: async (bucket, path, file, options = {}) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, options)
    if (error) throw error
    return data
  },

  /**
   * Download file from storage
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @returns {Promise<Blob>} File blob
   */
  download: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    if (error) throw error
    return data
  },

  /**
   * Get public URL for file
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @returns {string} Public URL
   */
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  /**
   * Delete file from storage
   * @param {string} bucket - Bucket name
   * @param {string} path - File path
   * @returns {Promise<void>}
   */
  delete: async (bucket, path) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    if (error) throw error
  },

  /**
   * List files in bucket
   * @param {string} bucket - Bucket name
   * @param {string} path - Directory path
   * @returns {Promise<Array>} List of files
   */
  list: async (bucket, path = '') => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)
    if (error) throw error
    return data
  },
}

/**
 * Helper function to handle Supabase errors
 * @param {Error} error - Supabase error
 * @returns {string} User-friendly error message
 */
export function handleSupabaseError(error) {
  if (!error) return 'An unknown error occurred'

  // Authentication errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password'
  }
  if (error.message?.includes('Email not confirmed')) {
    return 'Please confirm your email address'
  }
  if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists'
  }

  // Database errors
  if (error.message?.includes('duplicate key')) {
    return 'This item already exists'
  }
  if (error.message?.includes('foreign key')) {
    return 'Cannot delete this item as it is referenced by other items'
  }

  // Network errors
  if (error.message?.includes('Failed to fetch')) {
    return 'Network error. Please check your connection'
  }

  // Default error message
  return error.message || 'An error occurred'
}

/**
 * Check if Supabase is configured
 * @returns {boolean} True if configured
 */
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Export default client for direct access if needed
export default supabase

// Made with Bob
