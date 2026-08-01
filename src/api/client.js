// Base API client — handles auth headers, token refresh, and errors

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-l34f.onrender.com/api'

function getAccessToken() {
  return sessionStorage.getItem('access_token')
}

function setTokens(accessToken, refreshToken) {
  sessionStorage.setItem('access_token', accessToken)
  if (refreshToken) sessionStorage.setItem('refresh_token', refreshToken)
}

function clearTokens() {
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('refresh_token')
  sessionStorage.removeItem('admin_auth')
}

async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refresh_token')
  if (!refreshToken) throw new Error('No refresh token')

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!res.ok) {
    clearTokens()
    window.location.href = '/'
    throw new Error('Session expired')
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

  // Token expired — try refresh once
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken()
      return request(path, options, false)
    } catch {
      clearTokens()
      window.location.href = '/'
      throw new Error('Session expired. Please log in again.')
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
  get:    (path)         => request(path, { method: 'GET' }),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
}

export { setTokens, clearTokens, getAccessToken }
