// Base API client — handles auth headers, token refresh, and errors

const DEFAULT_BASE_URL = 'https://backend-1-khts.onrender.com/api'
const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()
const isLocalBaseUrl = configuredBaseUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(configuredBaseUrl)
const BASE_URL = configuredBaseUrl && !isLocalBaseUrl ? configuredBaseUrl.replace(/\/$/, '') : DEFAULT_BASE_URL

function getAccessToken() {
  return localStorage.getItem('access_token')
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
}

function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('admin_auth')
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) throw new Error('No refresh token')

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) {
    clearTokens()
    window.location.replace('/')
    throw new Error('Session ended')
  }

  const data = await res.json()
  setTokens(data.data.accessToken, data.data.refreshToken)
  return data.data.accessToken
}

async function request(path, options = {}, retry = true, refreshOnUnauthorized = true) {
  const token = getAccessToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // Token expired — try silent refresh once
  if (res.status === 401 && retry && refreshOnUnauthorized) {
    try {
      await refreshAccessToken()
      return request(path, options, false, refreshOnUnauthorized)
    } catch {
      clearTokens()
      window.location.replace('/')
      return new Promise(() => {}) // never resolves — page is redirecting
    }
  }

  const data = await res.json()

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    err.errors = data?.errors
    throw err
  }

  return data
}

export const api = {
  get:    (path, options)       => request(path, { method: 'GET' }, true, options?.refreshOnUnauthorized !== false),
  post:   (path, body, options) => request(path, { method: 'POST', body: JSON.stringify(body) }, true, options?.refreshOnUnauthorized !== false),
  put:    (path, body, options) => request(path, { method: 'PUT', body: JSON.stringify(body) }, true, options?.refreshOnUnauthorized !== false),
  patch:  (path, body, options) => request(path, { method: 'PATCH', body: JSON.stringify(body) }, true, options?.refreshOnUnauthorized !== false),
  delete: (path, options)       => request(path, { method: 'DELETE' }, true, options?.refreshOnUnauthorized !== false),
}

export { BASE_URL, setTokens, clearTokens, getAccessToken }
