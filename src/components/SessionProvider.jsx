import { useState } from 'react'
import { useSessionTimeout } from '../hooks/useSessionTimeout'
import SessionTimeoutModal from './SessionTimeoutModal'

export default function SessionProvider({ children }) {
  const [showWarning, setShowWarning] = useState(false)

  const { resetTimers } = useSessionTimeout({
    onWarning: () => setShowWarning(true),
    onLogout: () => setShowWarning(false),
  })

  const handleStayLoggedIn = () => {
    setShowWarning(false)
    resetTimers()
  }

  const handleLogoutNow = () => {
    setShowWarning(false)
    localStorage.removeItem('admin_auth')
    // navigation is handled by useSessionTimeout's logout fn
    window.location.href = '/'
  }

  return (
    <>
      {children}
      <SessionTimeoutModal
        visible={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogoutNow}
      />
    </>
  )
}
