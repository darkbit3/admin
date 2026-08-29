import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { authApi } from '../api/authApi'
import { BASE_URL } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

// ── colour tokens ──────────────────────────────────────────────────────────
const GOLD        = '#C8A96E'
const GOLD_BG     = 'rgba(200,169,110,0.10)'
const GOLD_BORDER = 'rgba(200,169,110,0.25)'
const DARK        = '#1C1C1C'
const BG          = '#F0E6D6'

// ── phone helpers ──────────────────────────────────────────────────────────
function usePhoneInput() {
  const [raw, setRaw] = useState('')           // 9 digits after stripping leading 0
  const full = raw ? '0' + raw : ''            // full 10-digit form
  const valid = raw.length === 9 && (raw[0] === '9' || raw[0] === '7')

  const onChange = (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.startsWith('0')) v = v.slice(1)
    if (v.length === 1 && v !== '9' && v !== '7') return
    if (v.length > 9) return
    setRaw(v)
  }

  return { raw, full, valid, onChange }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Login page
// ═══════════════════════════════════════════════════════════════════════════
export default function Login() {
  const [tab, setTab] = useState('login')   // 'login' | 'register' | 'forgot'

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BG }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{ backgroundColor: DARK }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: GOLD }}>
            <img src="/logo.png" alt="Shmeta Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold tracking-wide" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>Shmeta</span>
        </div>
        <div>
          <p className="text-4xl font-bold leading-snug mb-4" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>
            Manage your<br />
            <span style={{ color: GOLD }}>platform</span><br />
            with confidence.
          </p>
          <p className="text-sm" style={{ color: '#7A6A5A' }}>Admin portal for Shmeta operations.</p>
        </div>
        <p className="text-xs" style={{ color: '#4A3D32' }}>© {new Date().getFullYear()} Shmeta. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3" style={{ backgroundColor: GOLD }}>
              <img src="/logo.png" alt="Shmeta Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>Shmeta</h1>
            <p className="text-xs tracking-widest uppercase font-medium mt-1" style={{ color: GOLD }}>Admin Portal</p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden mb-4" style={{ backgroundColor: '#fff', border: `1px solid ${GOLD_BORDER}` }}>
            {[['login', 'Sign In'], ['register', 'Register']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: tab === key ? DARK : 'transparent',
                  color: tab === key ? '#F5EDE0' : '#8A7060',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'login'    && <LoginForm    onForgot={() => setTab('forgot')} />}
          {tab === 'register' && <RegisterInfo />}
          {tab === 'forgot'   && <ForgotFlow   onBack={() => setTab('login')} />}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Login form
// ═══════════════════════════════════════════════════════════════════════════
function LoginForm({ onForgot }) {
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const phone = usePhoneInput()
  const navigate = useNavigate()
  const { refreshAdmin } = useAuth()

  useEffect(() => {
    fetch(`${BASE_URL.replace(/\/api$/, '')}/health`).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone.valid) { setError('Enter a valid 10-digit phone number starting with 09 or 07'); return }
    setError(''); setLoading(true)
    try {
      await authApi.login(phone.full, password)
      await refreshAdmin()
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err.message || 'Invalid phone number or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8" style={{ border: '1px solid #E8D9C5' }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: DARK }}>Sign In</h2>
        <p className="text-sm mt-1" style={{ color: '#8A7060' }}>Welcome back — enter your credentials.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>Phone Number</label>
          <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#D4C4B0' }}>
            <span className="px-3 py-2.5 text-sm font-semibold select-none"
              style={{ backgroundColor: '#F5EDE0', color: '#7A6A5A', borderRight: '1px solid #D4C4B0' }}>0</span>
            <input
              type="tel" value={phone.raw} onChange={phone.onChange}
              placeholder="9xxxxxxxx  or  7xxxxxxxx"
              inputMode="numeric" maxLength={9}
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-white" style={{ color: DARK }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>Password</label>
          <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#D4C4B0' }}>
            <input
              type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-white" style={{ color: DARK }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3" style={{ color: '#A09080' }}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="text-right">
          <button type="button" onClick={onForgot} className="text-sm font-medium hover:underline" style={{ color: GOLD }}>
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={loading}
          className="w-full font-semibold py-2.5 rounded-lg transition-all duration-150 disabled:opacity-60"
          style={{ backgroundColor: DARK, color: '#F5EDE0' }}
          onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = GOLD)}
          onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = DARK)}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Register info (no self-registration — accounts are created by super-admin)
// ═══════════════════════════════════════════════════════════════════════════
function RegisterInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center" style={{ border: '1px solid #E8D9C5' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: GOLD_BG }}>
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: DARK }}>New Account</h3>
      <p className="text-sm mb-4" style={{ color: '#8A7060', lineHeight: 1.6 }}>
        Admin accounts are created by the <strong>Super Admin</strong>.<br />
        Contact your Shmeta Super Administrator to get registered.
      </p>
      <div className="rounded-xl p-4 text-left text-sm" style={{ backgroundColor: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}>
        <div className="flex gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ color: '#5A4A38' }}>
            Ask your Super Admin to add your phone number in the Super Admin Panel under "Manage Admins".
          </span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Forgot password flow: phone → OTP → new password → done
// ═══════════════════════════════════════════════════════════════════════════
function ForgotFlow({ onBack }) {
  const [step, setStep]         = useState('phone')   // 'phone' | 'otp' | 'done'
  const [devOtp, setDevOtp]     = useState(null)
  const phone = usePhoneInput()

  // Phone step
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneError,   setPhoneError]   = useState('')

  // OTP step
  const [otp, setOtp]               = useState('')
  const [newPass, setNewPass]       = useState('')
  const [confirmPass, setConfirm]   = useState('')
  const [showNew, setShowNew]       = useState(false)
  const [showConf, setShowConf]     = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError,   setOtpError]   = useState('')

  const BASE = BASE_URL  // same api base

  const submitPhone = async (e) => {
    e.preventDefault()
    if (!phone.valid) { setPhoneError('Enter a valid 10-digit phone number starting with 09 or 07'); return }
    setPhoneError(''); setPhoneLoading(true)
    try {
      const res = await api.post('/user-auth/forgot-password/check-phone', { phone: phone.full })
      setDevOtp(res?.data?.otp ?? null)
      setStep('otp')
    } catch (err) {
      setPhoneError(err.message || 'Phone not found. Please check and try again.')
    } finally {
      setPhoneLoading(false)
    }
  }

  const submitOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6)        { setOtpError('OTP must be exactly 6 digits'); return }
    if (newPass.length < 6)      { setOtpError('Password must be at least 6 characters'); return }
    if (newPass !== confirmPass) { setOtpError('Passwords do not match'); return }
    setOtpError(''); setOtpLoading(true)
    try {
      await api.post('/user-auth/forgot-password/verify-otp', { phone: phone.full, otp, newPassword: newPass })
      setStep('done')
    } catch (err) {
      setOtpError(err.message || 'Invalid or expired OTP.')
    } finally {
      setOtpLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center" style={{ border: '1px solid #E8D9C5' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: DARK }}>Password Reset!</h3>
        <p className="text-sm mb-6" style={{ color: '#8A7060' }}>Your password has been reset. You can now sign in with your new password.</p>
        <button onClick={onBack} className="w-full font-semibold py-2.5 rounded-lg"
          style={{ backgroundColor: DARK, color: '#F5EDE0' }}>
          Back to Sign In
        </button>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8" style={{ border: '1px solid #E8D9C5' }}>
        <div className="mb-5">
          <h2 className="text-lg font-bold" style={{ color: DARK }}>Verification Code</h2>
          <p className="text-sm mt-1" style={{ color: '#8A7060' }}>Code sent to {phone.full} — enter it below.</p>
        </div>

        {/* Dev OTP banner */}
        {devOtp && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.4)', color: '#92400e' }}>
            Dev mode — OTP: {devOtp}
          </div>
        )}

        {otpError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{otpError}</div>
        )}

        <form onSubmit={submitOtp} className="space-y-4">
          {/* OTP */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>Verification Code</label>
            <input
              type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •" maxLength={6} inputMode="numeric"
              className="w-full border rounded-lg px-4 py-2.5 text-center text-2xl font-bold tracking-widest outline-none"
              style={{ borderColor: '#D4C4B0', color: DARK, letterSpacing: '0.5em' }}
            />
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>New Password</label>
            <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#D4C4B0' }}>
              <input
                type={showNew ? 'text' : 'password'} value={newPass}
                onChange={e => setNewPass(e.target.value)} placeholder="••••••••"
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white" style={{ color: DARK }}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="px-3" style={{ color: '#A09080' }}>
                <EyeIcon open={showNew} />
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>Confirm Password</label>
            <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#D4C4B0' }}>
              <input
                type={showConf ? 'text' : 'password'} value={confirmPass}
                onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white" style={{ color: DARK }}
              />
              <button type="button" onClick={() => setShowConf(!showConf)} className="px-3" style={{ color: '#A09080' }}>
                <EyeIcon open={showConf} />
              </button>
            </div>
          </div>

          <button type="submit" disabled={otpLoading}
            className="w-full font-semibold py-2.5 rounded-lg transition-all disabled:opacity-60"
            style={{ backgroundColor: DARK, color: '#F5EDE0' }}>
            {otpLoading ? 'Resetting…' : 'Reset Password'}
          </button>

          <button type="button" onClick={() => { setStep('phone'); setOtp(''); setNewPass(''); setConfirm(''); setOtpError('') }}
            className="w-full text-sm font-medium py-2 hover:underline" style={{ color: GOLD }}>
            ← Resend Code
          </button>
        </form>
      </div>
    )
  }

  // Phone step
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8" style={{ border: '1px solid #E8D9C5' }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: DARK }}>Forgot Password</h2>
        <p className="text-sm mt-1" style={{ color: '#8A7060' }}>Enter your phone number to receive a verification code.</p>
      </div>

      {phoneError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{phoneError}</div>
      )}

      <form onSubmit={submitPhone} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A2E24' }}>Phone Number</label>
          <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#D4C4B0' }}>
            <span className="px-3 py-2.5 text-sm font-semibold select-none"
              style={{ backgroundColor: '#F5EDE0', color: '#7A6A5A', borderRight: '1px solid #D4C4B0' }}>0</span>
            <input
              type="tel" value={phone.raw} onChange={phone.onChange}
              placeholder="9xxxxxxxx  or  7xxxxxxxx"
              inputMode="numeric" maxLength={9}
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-white" style={{ color: DARK }}
            />
          </div>
        </div>

        <button type="submit" disabled={phoneLoading}
          className="w-full font-semibold py-2.5 rounded-lg transition-all disabled:opacity-60"
          style={{ backgroundColor: DARK, color: '#F5EDE0' }}>
          {phoneLoading ? 'Checking…' : 'Send OTP'}
        </button>

        <button type="button" onClick={onBack}
          className="w-full text-sm font-medium py-2 hover:underline" style={{ color: GOLD }}>
          ← Back to Sign In
        </button>
      </form>
    </div>
  )
}

// ── Eye icon helper ────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
