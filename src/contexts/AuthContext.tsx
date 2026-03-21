import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const fetchProfile = useCallback(async (userId: string, email: string): Promise<User | null> => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!data) return null

    return {
      id: userId,
      email,
      name: data.name || '',
      role: data.role || 'student',
      phone: data.phone,
      birthYear: data.birth_year,
      profileImageUrl: data.profile_image_url,
      geminiApiKey: data.gemini_api_key,
      createdAt: data.created_at,
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const profile = await fetchProfile(session.user.id, session.user.email || '')
      setState(prev => ({ ...prev, user: profile, loading: false }))
    } else {
      setState({ user: null, loading: false, error: null })
    }
  }, [fetchProfile])

  useEffect(() => {
    refreshUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email || '')
        setState({ user: profile, loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile, refreshUser])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          birth_year: data.birthYear,
        },
      },
    })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ user: null, loading: false, error: null })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
