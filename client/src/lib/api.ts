import axios, { isAxiosError } from 'axios'
import { clearSession, getToken } from './auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/users/')
    if (error.response?.status === 401 && !isAuthRequest) {
      clearSession()
      window.location.assign('/user/login?expired=1')
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    if (!error.response) return 'Can’t reach the server. Check your connection.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message) return message
  }
  return fallback
}
