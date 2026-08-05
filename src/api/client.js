// Base API client — handles auth headers, token refresh, and errors

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

async function request(path, options = {}, retry = true) {
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
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken()
      return request(path, options, false)
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
  get:    (path)       => request(path, { method: 'GET' }),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
}

export { setTokens, clearTokens, getAccessToken }
