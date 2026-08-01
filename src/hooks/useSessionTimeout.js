import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

// 15 minutes idle → auto logout
// 2 minutes before that → show warning
const TIMEOUT_MS = 15 * 60 * 1000       // 15 min
const WARNING_MS = 13 * 60 * 1000       // warn at 13 min (2 min before logout)

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']

export function useSessionTimeout({ onWarning, onLogout }) {
  const navigate = useNavigate()
  const logoutTimer = useRef(null)
  const warningTimer = useRef(null)

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
    if (warningTimer.current) clearTimeout(warningTimer.current)
  }, [])

  const logout = useCallback(() => {
    clearTimers()
    sessionStorage.removeItem('admin_auth')
    onLogout?.()
    navigate(ROUTES.LOGIN, { replace: true })
  }, [clearTimers, navigate, onLogout])

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
    const isAuth = sessionStorage.getItem('admin_auth') === 'true'
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
