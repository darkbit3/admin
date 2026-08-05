import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { manageApi } from '../api/manageApi'
import { useToast } from '../context/ToastContext'

// ── Stat card definitions ─────────────────────────────────────────────────
const cardDefs = [
  {
    key: 'total',
    label: 'Total Users',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-2 0" />
      </svg>
    ),
  },
  {
    key: 'active',
    label: 'Active',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'inactive',
    label: 'Inactive',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'manufacturer',
    label: 'Manufacturers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    key: 'reseller',
    label: 'Resellers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
]

// ── Refresh icon ──────────────────────────────────────────────────────────
const IconRefresh = ({ spinning }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

export default function Dashboard() {
  const toast = useToast()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchStats = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await manageApi.getStats()
      setStats(data)
    } catch (err) {
      const msg = err.message || 'Failed to load stats'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ color: '#1C1C1C', fontFamily: 'Georgia, serif' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8A7060' }}>
            Welcome back, Admin
          </p>
        </div>

        {/* Mobile: icon-only button. Desktop: full label button */}
        <button
          onClick={fetchStats}
          disabled={loading}
          aria-label="Refresh stats"
          title="Refresh stats"
          className="flex items-center justify-center gap-2 rounded-xl border transition-all disabled:opacity-50 
                     w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
          style={{ backgroundColor: 'white', color: '#3A2E24', borderColor: '#D4C4B0' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EDE0'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
        >
          <IconRefresh spinning={loading} />
          <span className="hidden sm:inline text-sm font-medium">
            {loading ? 'Loading…' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── Stats grid: 2 col mobile → 3 col sm → 5 col lg ─────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cardDefs.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-xl p-4 flex flex-col gap-3 min-h-[80px]"
            style={{ border: '1px solid #E8D9C5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(200,169,110,0.15)', color: '#C8A96E' }}
            >
              {card.icon}
            </div>
            {/* Label + value */}
            <div>
              <p className="text-xs font-medium leading-tight" style={{ color: '#8A7060' }}>
                {card.label}
              </p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: '#1C1C1C' }}>
                {loading ? (
                  <span
                    className="inline-block w-10 h-6 rounded animate-pulse align-middle"
                    style={{ backgroundColor: '#E8D9C5' }}
                  />
                ) : (
                  stats?.[card.key] ?? '—'
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
