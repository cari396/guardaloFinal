import axios from 'axios'

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    if ((window as any)._ENV_API_URL) {
      return (window as any)._ENV_API_URL
    }
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8080'
    }
    if (host === 'staging.guardalo.com.ar') {
      return 'https://staging-api.guardalo.com.ar'
    }
    if (host.includes('guardalo.com.ar')) {
      return 'https://staging-api.guardalo.com.ar'
    }
  }
  return process.env.GATSBY_API_URL || 'https://staging-api.guardalo.com.ar'
}

export const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Attach Bearer token dynamically if available and ensure dynamic baseURL
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const currentBase = getApiBaseUrl()
    config.baseURL = `${currentBase}/api`
    const token = localStorage.getItem('guardalo_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const authApi = {
  login: async (email: string, password: string) => {
    return api.post('/login', { email, password })
  },
  googleLogin: async (data: { credential?: string; email?: string; name?: string; google_id?: string }) => {
    return api.post('/auth/google', data)
  },
  register: async (userData: {
    name: string
    email: string
    password: string
    password_confirmation?: string
    phone?: string
    dni?: string
    cuit?: string
    address?: string
    city?: string
  }) => {
    return api.post('/register', userData)
  },
  getProfile: async () => {
    return api.get('/user')
  },
  updateProfile: async (data: Record<string, any>) => {
    return api.put('/user/profile', data)
  },
  logout: async () => {
    return api.post('/logout')
  },
  verifyEmail: async (token: string) => {
    return api.post('/verify-email', { token })
  },
  resendVerification: async (email: string) => {
    return api.post('/resend-verification', { email })
  },
  forgotPassword: async (email: string) => {
    return api.post('/forgot-password', { email })
  },
  resetPassword: async (data: { token: string; email: string; password: string; password_confirmation: string }) => {
    return api.post('/reset-password', data)
  },
}

export const boxApi = {
  getMyBoxes: async () => {
    return api.get('/my-boxes')
  },
  getMyOperations: async () => {
    return api.get('/my-operations')
  },
  getOperationDetail: async (id: string | number) => {
    return api.get(`/operations/${id}`)
  },
  getAvailableBoxes: async () => {
    return api.get('/boxes/available')
  },
  getAvailability: async () => {
    return api.get('/boxes/availability')
  },
}

export const priceApi = {
  getPrices: async () => {
    return api.get('/prices')
  },
  getAll: async () => {
    return api.get('/prices')
  },
  createPrice: async (data: { period: string; amount: number; promo_text?: string; size_category?: string }) => {
    return api.post('/prices', data)
  },
  updatePrice: async (id: string | number, data: { period?: string; amount?: number; promo_text?: string; size_category?: string }) => {
    return api.put(`/prices/${id}`, data)
  },
  deletePrice: async (id: string | number) => {
    return api.delete(`/prices/${id}`)
  },
}

export const adminApi = {
  getClients: async () => {
    return api.get('/admin/clients')
  },
  getBoxes: async () => {
    return api.get('/admin/boxes')
  },
  setCapacity: async (size: 'Pequeño' | 'Mediano' | 'Grande', target_total: number) => {
    return api.post('/admin/boxes/set-capacity', { size, target_total })
  },
  createBox: async (data: { box_number: string; size: string; status?: string; notes?: string }) => {
    return api.post('/admin/boxes', data)
  },
  updateBox: async (id: number | string, data: { box_number?: string; size?: string; status?: string; notes?: string }) => {
    return api.put(`/admin/boxes/${id}`, data)
  },
  deleteBox: async (id: number | string) => {
    return api.delete(`/admin/boxes/${id}`)
  },
  getContractTemplate: async () => {
    return api.get('/admin/contract-template')
  },
  updateContractTemplate: async (content: string, title?: string) => {
    return api.put('/admin/contract-template', { content, title })
  },
  getOperations: async () => {
    return api.get('/admin/operations')
  },
  approveTransfer: async (id: number | string) => {
    return api.put(`/admin/operations/${id}/approve-transfer`)
  },
}

export const paymentApi = {
  getBankDetails: async () => {
    return api.get('/payments/bank-details')
  },
  getInstallments: async (amount: number, bin?: string) => {
    return api.get('/payments/installments', {
      params: { amount, bin },
    })
  },
  createPreference: async (data: {
    amount: number
    title: string
    operation_code?: string
    email?: string
    name?: string
  }) => {
    return api.post('/payments/create-preference', data)
  },
  processCard: async (data: {
    card_number: string
    card_holder: string
    expiration_month: string | number
    expiration_year: string | number
    cvv: string
    amount: number
    operation_code: string
    installments?: number
    dni?: string
  }) => {
    return api.post('/payments/process-card', data)
  },
  confirmTransfer: async (formData: FormData) => {
    return api.post('/payments/confirm-transfer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
