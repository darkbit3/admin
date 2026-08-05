import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { manageApi } from '../api/manageApi'

const recentActivity = [
  { id: 1, user: 'John Doe',    action: 'Placed an order',       time: '2 mins ago' },
  { id: 2, user: 'Jane Smith',  action: 'Registered an account', time: '15 mins ago' },
  { id: 3, user: 'Bob Johnson', action: 'Updated profile',        time: '1 hour ago' },
  { id: 4, user: 'Alice Brown', action: 'Cancelled order #245',   time: '3 hours ago' },
]

const cardDefs = [
  { key: 'total',        label: 'Total Users',    icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-2 0" />
    </svg>
  )},
  { key: 'active',       label: 'Active Users',   icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { key: 'inactive',     label: 'Inactive Users', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { key: 'manufacturer', label: 'Manufacturers',  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )},
  { key: 'reseller',     label: 'Resellers',      icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )},
]

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchStats = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await manageApi.getStats()
      setStats(data)
    } catch {
      setError('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Georgia, serif' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#8A7060' }}>Welcome back, Admin</p>
        </div>
        <button onClick={fetchStats} disabled={loading}
          title="Refresh stats"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-50"
          style={{ backgroundColor: 'white', color: '#3A2E24', borderColor: '#D4C4B0' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EDE0'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
          <svg xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {cardDefs.map((card) => (
          <div key={card.key}
            className="bg-white rounded-xl p-5 flex items-center gap-4"
            style={{ border: '1px solid #E8D9C5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(200,169,110,0.15)', color: '#C8A96E' }}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#8A7060' }}>{card.label}</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: '#1C1C1C' }}>
                {loading
                  ? <span className="inline-block w-8 h-5 rounded animate-pulse" style={{ backgroundColor: '#E8D9C5' }} />
                  : (stats?.[card.key] ?? '—')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E8D9C5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#1C1C1C' }}>Recent Activity</h2>
        <div style={{ borderTop: '1px solid #F0E6D6' }}>
          {recentActivity.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center"
              style={{ borderBottom: '1px solid #F0E6D6' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#1C1C1C' }}>{item.user}</p>
                <p className="text-xs mt-0.5" style={{ color: '#8A7060' }}>{item.action}</p>
              </div>
              <span className="text-xs" style={{ color: '#B0A090' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
