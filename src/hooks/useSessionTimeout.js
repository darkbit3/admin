import { useEffect, useRef, useCallback } from 'react'

// 15 minutes idle → auto logout
// 2 minutes before that → show warning
const TIMEOUT_MS = 15 * 60 * 1000       // 15 min
const WARNING_MS = 13 * 60 * 1000       // warn at 13 min (2 min before logout)

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']

export function useSessionTimeout({ onWarning, onLogout }) {
  const logoutTimer = useRef(null)
  const warningTimer = useRef(null)

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
    if (warningTimer.current) clearTimeout(warningTimer.current)
  }, [])

  const logout = useCallback(() => {
    clearTimers()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('admin_auth')
    onLogout?.()
    // Use hash so the login page can detect expiry without query param sticking
    window.location.replace('/#expired')
  }, [clearTimers, onLogout])

  const resetTimers = useCallback(() => {
    clearTimers()

    warningTimer.current = setTimeout(() => {
      onWarning?.()
    }, WARNING_MS)

    logoutTimer.current = setTimeout(() => {
      logout()
    }, TIMEOUT_MS)
  }, [clearTimers, logout, onWarning])

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth') === 'true'
    if (!isAuth) return

    // Start timers
    resetTimers()

    // Reset on any user activity
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, resetTimers))

    return () => {
      clearTimers()
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, resetTimers))
    }
  }, [resetTimers, clearTimers])

  return { resetTimers }
}
