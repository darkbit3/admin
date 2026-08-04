import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { authApi } from '../api/authApi'

export default function Login() {
  const [phone, setPhone]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const navigate = useNavigate()

  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    if (raw.startsWith('0')) raw = raw.slice(1)
    if (raw.length === 1 && raw !== '9' && raw !== '7') return
    if (raw.length > 9) return
    setPhone(raw)
  }

  const fullPhone = phone ? '0' + phone : ''
  const isValidPhone = () => phone.length === 9 && (phone[0] === '9' || phone[0] === '7')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidPhone()) {
      setError('Enter a valid 10-digit phone number starting with 09 or 07')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.login(fullPhone, password)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err.message || 'Invalid phone number or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F0E6D6' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12"
        style={{ backgroundColor: '#1C1C1C' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
            style={{ backgroundColor: '#C8A96E' }}>
            <img src="/logo.png" alt="Shmeta Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold tracking-wide" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>Shmeta</span>
        </div>
        <div>
          <p className="text-4xl font-bold leading-snug mb-4" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>
            Manage your<br />
            <span style={{ color: '#C8A96E' }}>platform</span><br />
            with confidence.
          </p>
          <p className="text-sm" style={{ color: '#7A6A5A' }}>Admin portal for Shmeta operations.</p>
        </div>
        <p className="text-xs" style={{ color: '#4A3D32' }}>© {new Date().getFullYear()} Shmeta. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3"
              style={{ backgroundColor: '#C8A96E' }}>
              <img src="/logo.png" alt="Shmeta Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Georgia, serif' }}>Shmeta</h1>
            <p className="text-xs tracking-widest uppercase font-medium mt-1" style={{ color: '#C8A96E' }}>Admin Portal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8" style={{ border: '1px solid #E8D9C5' }}>
            <div className="mb-7">
              <h2 className="text-xl font-bold" style={{ color: '#1C1C1C' }}>Sign In</h2>
              <p className="text-sm mt-1" style={{ color: '#8A7060' }}>Welcome back — enter your credentials.</p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>
                  Phone Number
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden transition-all"
                  style={{ borderColor: '#D4C4B0' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#C8A96E'}
                  onBlur={e => e.currentTarget.style.borderColor = '#D4C4B0'}>
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
                <p className="text-xs mt-1" style={{ color: '#A09080' }}>Format: 09xxxxxxxxx or 07xxxxxxxxx (10 digits)</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>
                  Password
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden"
                  style={{ borderColor: '#D4C4B0' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
                    style={{ color: '#1C1C1C' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="px-3 transition-colors"
                    style={{ color: '#A09080' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="text-right">
                <Link to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#C8A96E' }}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading}
                className="w-full font-semibold py-2.5 rounded-lg transition-all duration-150 disabled:opacity-60"
                style={{ backgroundColor: '#1C1C1C', color: '#F5EDE0' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#C8A96E')}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#1C1C1C')}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
