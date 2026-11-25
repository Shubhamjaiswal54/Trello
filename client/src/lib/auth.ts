export interface SessionUser {
  _id: string
  name: string
  email: string
}

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function setSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Only checks shape and expiry; the server is still the authority on validity.
export function hasValidSession() {
  const token = getToken()
  if (!token || !getCurrentUser()) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
