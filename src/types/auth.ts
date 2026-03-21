export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  phone?: string
  birthYear?: number
  profileImageUrl?: string
  geminiApiKey?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  birthYear?: number
  orgCode?: string
  instructorCode?: string
}
