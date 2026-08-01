import { useEffect, useState } from 'react'

// Countdown from 120 seconds (2 minutes)
const COUNTDOWN_SEC = 120

export default function SessionTimeoutModal({ visible, onStayLoggedIn, onLogout }) {
  const [seconds, setSeconds] = useState(COUNTDOWN_SEC)

  useEffect(() => {
    if (!visible) {
      setSeconds(COUNTDOWN_SEC)
      return
    }

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval)
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeStr = `${minutes}:${secs.toString().padStart(2, '0')}`

  // Determine ring color based on urgency
  const ringColor =
    seconds > 60 ? 'text-yellow-500' : seconds > 30 ? 'text-orange-500' : 'text-red-500'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ⏰
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Session Expiring</h2>
        <p className="text-gray-500 text-sm mb-6">
          You've been inactive. Your session will automatically expire in:
        </p>

        {/* Countdown */}
        <div className={`text-5xl font-mono font-bold mb-6 ${ringColor}`}>
          {timeStr}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout Now
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  )
}
