import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setLoading(false)
      throw error
    }
    setUser(data.user)
    setLoading(false)
    return data
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLoading(false)
      throw error
    }
    setUser(null)
    setLoading(false)
    window.location.href = '/'
  }

  const resetPassword = async (email) => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })
    setLoading(false)
    if (error) throw error
  }

  const updatePassword = async (newPassword) => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setLoading(false)
    if (error) throw error
  }

  return { user, loading, signIn, signOut, resetPassword, updatePassword }
}
