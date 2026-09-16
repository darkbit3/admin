import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { authApi } from '../api/authApi'
import { clearTokens } from '../api/client'

const AuthContext = createContext(null)

const POLL_INTERVAL = 30_000 // check every 30 seconds

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const pollRef = useRef(null)

  const logout = () => {
    clearTokens()
    setAdmin(null)
  }

  // Start polling /auth/me to detect remote deactivation
  const startPolling = () => {
    stopPolling()
    pollRef.current = setInterval(async () => {
      try {
        const data = await authApi.getMe()
        setAdmin(data)
      } catch (err) {
        // 401 = deactivated or session expired — force logout
        if (err?.status === 401 || err?.status === 403) {
          stopPolling()
          logout()
        }
      }
    }, POLL_INTERVAL)
  }

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) { setLoading(false); return }

    authApi.getMe()
      .then(data => {
        setAdmin(data)
        startPolling()
      })
      .catch(() => {
        clearTokens()
        setAdmin(null)
      })
      .finally(() => setLoading(false))

    return () => stopPolling()
  }, [])

  const refreshAdmin = async () => {
    try {
      const data = await authApi.getMe()
      setAdmin(data)
      startPolling()
    } catch {
      logout()
    }
  }

  const clearAdmin = () => {
    stopPolling()
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, refreshAdmin, clearAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
