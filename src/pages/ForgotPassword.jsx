import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../config/routes'

export default function ForgotPassword() {
  const [phone, setPhone]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    if (raw.startsWith('0')) raw = raw.slice(1)
    if (raw.length === 1 && raw !== '9' && raw !== '7') return
    if (raw.length > 9) return
    setPhone(raw)
  }

  const isValidPhone = () => phone.length === 9 && (phone[0] === '9' || phone[0] === '7')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValidPhone()) {
      setError('Enter a valid 10-digit phone number starting with 09 or 07')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F0E6D6' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3"
            style={{ backgroundColor: '#1C1C1C' }}>
            <img src="/logo.png" alt="Shmeta Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Georgia, serif' }}>Shmeta</h1>
        </div>

        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E8D9C5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: 'rgba(200,169,110,0.15)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#C8A96E' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold" style={{ color: '#1C1C1C' }}>Reset link sent!</p>
              <p className="text-sm" style={{ color: '#8A7060' }}>
                We've sent a password reset message to{' '}
                <span className="font-semibold" style={{ color: '#1C1C1C' }}>0{phone}</span>
              </p>
              <Link to={ROUTES.LOGIN}
                className="inline-block mt-4 text-sm font-medium hover:underline"
                style={{ color: '#C8A96E' }}>
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#1C1C1C' }}>Forgot Password</h2>
                <p className="text-sm mt-1" style={{ color: '#8A7060' }}>
                  Enter your phone number to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>
                    Phone Number
                  </label>
                  <div className="flex items-center border rounded-lg overflow-hidden"
                    style={{ borderColor: '#D4C4B0' }}>
                    <span className="px-3 py-2.5 text-sm font-semibold select-none"
                      style={{ backgroundColor: '#F5EDE0', color: '#7A6A5A', borderRight: '1px solid #D4C4B0' }}>
                      0
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="9xxxxxxxx  or  7xxxxxxxx"
                      required
                      inputMode="numeric"
                      maxLength={9}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                      style={{ color: '#1C1C1C' }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#A09080' }}>
                    Format: 09xxxxxxxxx or 07xxxxxxxxx (10 digits)
                  </p>
                </div>

                <button type="submit"
                  className="w-full font-semibold py-2.5 rounded-lg transition-all"
                  style={{ backgroundColor: '#1C1C1C', color: '#F5EDE0' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C8A96E'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1C1C1C'}>
                  Send Reset Link
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to={ROUTES.LOGIN}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#C8A96E' }}>
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
