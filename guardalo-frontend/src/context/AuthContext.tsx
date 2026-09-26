import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'cliente'
  phone?: string
  dni?: string
  cuit?: string
  address?: string
  city?: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation?: string
  phone?: string
  dni?: string
  cuit?: string
  address?: string
  city?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; requires_verification?: boolean; message?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; requires_verification?: boolean; message?: string; email?: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string; user?: User }>
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string }>
  loginWithGoogle: (googleData?: { credential?: string; email?: string; name?: string; google_id?: string }) => Promise<boolean>
  loginWithSocial: (provider?: string) => Promise<void>
  logout: () => void
  switchDemoRole: (role: 'admin' | 'cliente') => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const DEFAULT_DEMO_ADMIN: User = {
  id: 1,
  name: 'Juan López',
  email: 'juan@guardalo.com.ar',
  role: 'admin',
  phone: '02346 15-55-1234',
  dni: '32.456.789',
  cuit: '20-32456789-4',
  address: 'Av. Mitre 450',
  city: 'Chivilcoy',
}

export const DEFAULT_DEMO_CLIENT: User = {
  id: 2,
  name: 'Juan López',
  email: 'juan.lopez@ejemplo.com',
  role: 'cliente',
  phone: '02346 15-55-1234',
  dni: '32.456.789',
  cuit: '20-32456789-4',
  address: 'Av. Mitre 450',
  city: 'Chivilcoy',
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  verifyEmail: async () => ({ success: false }),
  resendVerification: async () => ({ success: false }),
  loginWithGoogle: async () => false,
  loginWithSocial: async () => {},
  logout: () => {},
  switchDemoRole: () => {},
  updateProfile: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize from localStorage safely on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('guardalo_user')
        const storedToken = localStorage.getItem('guardalo_token')
        if (storedUser && storedToken) {
          const parsed = JSON.parse(storedUser)
          if (!parsed.city) parsed.city = 'Chivilcoy'
          setUser(parsed)
          setToken(storedToken)
        }
      } catch (e) {
        console.error('Error loading session from localStorage:', e)
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  const register = async (data: RegisterData): Promise<{ success: boolean; requires_verification?: boolean; message?: string; email?: string }> => {
    setIsLoading(true)
    try {
      // 1. Attempt Laravel API registration
      try {
        const response = await authApi.register(data)
        if (response.data && response.data.success) {
          if (response.data.requires_verification) {
            return {
              success: true,
              requires_verification: true,
              message: response.data.message || '¡Cuenta creada! Te enviamos un correo para activar tu cuenta.',
              email: response.data.email || data.email,
            }
          }
          const apiUser = response.data.user
          const apiToken = response.data.token
          if (apiUser && apiToken) {
            setUser(apiUser)
            setToken(apiToken)
            if (typeof window !== 'undefined') {
              localStorage.setItem('guardalo_user', JSON.stringify(apiUser))
              localStorage.setItem('guardalo_token', apiToken)
            }
          }
          return { success: true, message: response.data.message }
        }
      } catch (apiErr: any) {
        const errorMsg =
          apiErr?.response?.data?.message ||
          apiErr?.response?.data?.errors?.email?.[0] ||
          apiErr?.response?.data?.errors?.password?.[0]
        if (errorMsg) {
          return { success: false, message: errorMsg }
        }
        console.warn('API backend not reachable, using local fallback:', apiErr)
      }

      // 2. Local fallback registration
      const newUser: User = {
        id: Math.floor(100 + Math.random() * 900),
        name: data.name,
        email: data.email,
        role: 'cliente',
        phone: data.phone || '',
        dni: data.dni || '',
        cuit: data.cuit || '',
        address: data.address || '',
        city: data.city || 'Chivilcoy',
      }
      const fakeToken = 'auth-token-' + Date.now()

      setUser(newUser)
      setToken(fakeToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('guardalo_user', JSON.stringify(newUser))
        localStorage.setItem('guardalo_token', fakeToken)
      }
      return { success: true }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, pass: string): Promise<{ success: boolean; requires_verification?: boolean; message?: string }> => {
    setIsLoading(true)
    try {
      // 1. Attempt Laravel API call
      try {
        const response = await authApi.login(email, pass)
        if (response.data && response.data.success) {
          const apiUser = response.data.user
          if (!apiUser.city) apiUser.city = 'Chivilcoy'
          const apiToken = response.data.token

          setUser(apiUser)
          setToken(apiToken)
          if (typeof window !== 'undefined') {
            localStorage.setItem('guardalo_user', JSON.stringify(apiUser))
            localStorage.setItem('guardalo_token', apiToken)
          }
          return { success: true }
        }
      } catch (apiErr: any) {
        if (apiErr?.response?.data?.requires_verification) {
          return {
            success: false,
            requires_verification: true,
            message: apiErr.response.data.message || 'Tu cuenta aún no fue activada. Por favor revisá tu correo.',
          }
        }
        if (apiErr?.response?.status === 401 || apiErr?.response?.status === 422) {
          return {
            success: false,
            message: apiErr?.response?.data?.message || 'Email o contraseña incorrectos.',
          }
        }
        console.warn('API backend error or not reachable:', apiErr)
      }

      // 2. Demo accounts
      const cleanEmail = email.toLowerCase().trim()
      const isJuanAdmin = cleanEmail === 'juan@guardalo.com.ar'
      const isJuanClient = cleanEmail === 'juan.lopez@ejemplo.com'

      if (isJuanAdmin || isJuanClient) {
        let loggedUser: User = isJuanAdmin ? DEFAULT_DEMO_ADMIN : DEFAULT_DEMO_CLIENT
        const fakeToken = 'bearer-auth-token-' + Date.now()
        setUser(loggedUser)
        setToken(fakeToken)
        if (typeof window !== 'undefined') {
          localStorage.setItem('guardalo_user', JSON.stringify(loggedUser))
          localStorage.setItem('guardalo_token', fakeToken)
        }
        return { success: true }
      }

      return {
        success: false,
        message: 'No pudimos verificar tus credenciales. Por favor revisá tu email y contraseña.',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (tokenParam: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    setIsLoading(true)
    try {
      const response = await authApi.verifyEmail(tokenParam)
      if (response.data && response.data.success) {
        const apiUser = response.data.user
        const apiToken = response.data.token
        if (apiUser && apiToken) {
          setUser(apiUser)
          setToken(apiToken)
          if (typeof window !== 'undefined') {
            localStorage.setItem('guardalo_user', JSON.stringify(apiUser))
            localStorage.setItem('guardalo_token', apiToken)
          }
        }
        return {
          success: true,
          message: response.data.message || '¡Tu cuenta ha sido activada con éxito!',
          user: apiUser,
        }
      }
      return {
        success: false,
        message: response.data?.message || 'No se pudo verificar la cuenta.',
      }
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || 'El enlace de activación es inválido o ha expirado.',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async (userEmail: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.resendVerification(userEmail)
      return {
        success: response.data?.success ?? true,
        message: response.data?.message || 'Enlace de activación reenviado con éxito.',
      }
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || 'Error al reenviar el correo de activación.',
      }
    }
  }

  const loginWithGoogle = async (googleData?: { credential?: string; email?: string; name?: string; google_id?: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      // 1. Try real backend Google authentication
      try {
        const payload = googleData || { email: 'usuario.google@gmail.com', name: 'Usuario Google' }
        const res = await authApi.googleLogin(payload)
        if (res.data && res.data.success && res.data.token) {
          const loggedUser: User = res.data.user
          setUser(loggedUser)
          setToken(res.data.token)
          if (typeof window !== 'undefined') {
            localStorage.setItem('guardalo_user', JSON.stringify(loggedUser))
            localStorage.setItem('guardalo_token', res.data.token)
          }
          return true
        }
      } catch (apiErr) {
        console.warn('Backend googleLogin failed or offline, falling back to simulated Google session:', apiErr)
      }

      // 2. Safe fallback for preview / offline environment
      const email = googleData?.email || 'usuario.google@gmail.com'
      const name = googleData?.name || 'Usuario Google'
      const loggedUser: User = {
        id: Math.floor(100 + Math.random() * 900),
        name: name,
        email: email,
        role: 'cliente',
        phone: '',
        dni: '',
        cuit: '',
        address: '',
        city: 'Chivilcoy',
      }
      const fakeToken = `google-auth-token-${Date.now()}`
      setUser(loggedUser)
      setToken(fakeToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('guardalo_user', JSON.stringify(loggedUser))
        localStorage.setItem('guardalo_token', fakeToken)
      }
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithSocial = async (provider = 'google') => {
    await loginWithGoogle({ email: `usuario.${provider}@gmail.com`, name: `Usuario ${provider.toUpperCase()}` })
  }

  const logout = () => {
    try {
      authApi.logout().catch(() => {})
    } catch (e) {}

    setUser(null)
    setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guardalo_user')
      localStorage.removeItem('guardalo_token')
    }
  }

  const switchDemoRole = (role: 'admin' | 'cliente') => {
    const newUser = role === 'admin' ? DEFAULT_DEMO_ADMIN : DEFAULT_DEMO_CLIENT
    setUser(newUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guardalo_user', JSON.stringify(newUser))
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    try {
      await authApi.updateProfile(data).catch(() => {})
    } catch (e) {}

    const updated = { ...user, ...data }
    setUser(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guardalo_user', JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyEmail,
        resendVerification,
        loginWithGoogle,
        loginWithSocial,
        logout,
        switchDemoRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
