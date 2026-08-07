import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { manageApi } from '../api/manageApi'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

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
  const { admin } = useAuth()
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
            Welcome back, <span style={{ color: '#C8A96E', fontWeight: 600 }}>{admin?.name || admin?.phone || 'Admin'}</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
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

      {/* ── Owner Account Details Table ───────────────────────────────── */}
      <div className="bg-white rounded-xl overflow-hidden mb-6"
        style={{ border: '1px solid #E8D9C5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        {/* Table header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E8D9C5' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1C1C1C' }}>Owner Account Details</h2>
            <p className="text-xs mt-0.5" style={{ color: '#8A7060' }}>
              Cashiers &amp; cutters assigned to each Manufacturer / Reseller
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(200,169,110,0.15)', color: '#9A7040' }}
          >
            {stats?.ownersBreakdown?.length ?? 0} Owners
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ backgroundColor: '#FBF5EC' }}>
              <tr>
                {['Owner Name', 'Phone', 'Role', 'Account', 'Cashiers', 'Cutters', 'Status'].map(h => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${h === 'Cashiers' || h === 'Cutters' ? 'text-center' : h === 'Status' ? 'text-right' : ''}`}
                    style={{ color: '#6A5040' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: '#B0A090' }}>
                    Loading owner details…
                  </td>
                </tr>
              ) : !stats?.ownersBreakdown || stats.ownersBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: '#B0A090' }}>
                    No owner accounts created yet
                  </td>
                </tr>
              ) : (
                stats.ownersBreakdown.map((owner, idx) => (
                  <tr
                    key={owner.id}
                    style={{
                      borderTop: idx > 0 ? '1px solid #F0E8DC' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FDF8F2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5 font-medium" style={{ color: '#1C1C1C' }}>
                      {owner.name}
                    </td>
                    {/* Phone */}
                    <td className="px-5 py-3.5 font-mono text-xs" style={{ color: '#6A5040' }}>
                      {owner.phone}
                    </td>
                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={
                          owner.role === 'Manufacturer'
                            ? { backgroundColor: '#FEF3C7', color: '#92400E' }
                            : { backgroundColor: '#DBEAFE', color: '#1E40AF' }
                        }
                      >
                        {owner.role}
                      </span>
                    </td>
                    {/* Account Type */}
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={
                          owner.account_type === 'Paid'
                            ? { backgroundColor: '#D1FAE5', color: '#065F46' }
                            : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                        }
                      >
                        {owner.account_type || 'Free'}
                      </span>
                    </td>
                    {/* Cashiers */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}
                      >
                        {owner.cashier_count} Cashier{owner.cashier_count !== 1 ? 's' : ''}
                      </span>
                    </td>
                    {/* Cutters */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: '#EEF2FF', color: '#3730A3', border: '1px solid #C7D2FE' }}
                      >
                        {owner.cutter_count} Cutter{owner.cutter_count !== 1 ? 's' : ''}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={
                          owner.status === 'Active'
                            ? { backgroundColor: '#D1FAE5', color: '#065F46' }
                            : { backgroundColor: '#FEE2E2', color: '#991B1B' }
                        }
                      >
                        {owner.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
