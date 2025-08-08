import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('Signing up:', email, userData)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      
      console.log('Sign up response:', data)
      
      // Save user data to your database
      if (data.user) {
        await saveUserToDatabase(data.user, userData)
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('Signing in:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      console.log('Sign in response:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  const resetPassword = async (email) => {
    try {
      console.log('Resetting password for:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error }
    }
  }

  const updatePassword = async (password) => {
    try {
      console.log('Updating password')
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error }
    }
  }

  const enable2FA = async () => {
    try {
      console.log('Enabling 2FA')
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Enable 2FA error:', error)
      return { data: null, error }
    }
  }

  const verify2FA = async (code) => {
    try {
      console.log('Verifying 2FA code')
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: user.factors[0].id,
        code
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Verify 2FA error:', error)
      return { data: null, error }
    }
  }

  const saveUserToDatabase = async (user, userData) => {
    try {
      console.log('Saving user to database:', user.id, userData)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          ...userData
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save user to database')
      }
      
      const result = await response.json()
      console.log('User saved to database:', result)
      return result
    } catch (error) {
      console.error('Error saving user to database:', error)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    enable2FA,
    verify2FA
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 