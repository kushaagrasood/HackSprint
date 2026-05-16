import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '@services/supabase'
import { handleSupabaseError } from '@services/supabase'

const AuthContext = createContext({})

/**
 * AuthProvider component
 * Manages authentication state and provides auth methods to the app
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentSession = await auth.getSession()
        setSession(currentSession)
        
        if (currentSession) {
          const currentUser = await auth.getCurrentUser()
          setUser(currentUser)
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        setError(handleSupabaseError(err))
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: authListener } = auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event)
      
      setSession(currentSession)
      
      if (currentSession) {
        try {
          const currentUser = await auth.getCurrentUser()
          setUser(currentUser)
        } catch (err) {
          console.error('Error getting user:', err)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user metadata
   */
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await auth.signUp(email, password, metadata)
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
   * Sign in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const data = await auth.signIn(email, password)
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
   * Sign in with OAuth provider
   * @param {string} provider - OAuth provider (google, github, etc.)
   */
  const signInWithOAuth = async (provider) => {
    try {
      setLoading(true)
      setError(null)
      const data = await auth.signInWithOAuth(provider)
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
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      await auth.signOut()
      setUser(null)
      setSession(null)
      return { error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reset user password
   * @param {string} email - User email
   */
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      await auth.resetPassword(email)
      return { error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update user password
   * @param {string} newPassword - New password
   */
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true)
      setError(null)
      const data = await auth.updatePassword(newPassword)
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
   * Update user metadata
   * @param {Object} metadata - User metadata
   */
  const updateUser = async (metadata) => {
    try {
      setLoading(true)
      setError(null)
      const data = await auth.updateUser(metadata)
      setUser(data.user)
      return { data, error: null }
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

// Made with Bob