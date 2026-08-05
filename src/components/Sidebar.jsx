import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { authApi } from '../api/authApi'

const navItems = [
  {
    label: 'Dashboard', path: ROUTES.DASHBOARD, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    label: 'Manage', path: ROUTES.MANAGE, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await authApi.logout()
    navigate(ROUTES.LOGIN)
  }

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(200,169,110,0.2)' }}>
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
          style={{ backgroundColor: '#C8A96E' }}>
          <img src="/logo.png" alt="Shmeta Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-base font-bold leading-tight tracking-wide" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>Shmeta</h2>
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#C8A96E' }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? '' : ''}`
            }
            style={({ isActive }) => isActive
              ? { backgroundColor: 'rgba(200,169,110,0.15)', color: '#C8A96E', border: '1px solid rgba(200,169,110,0.3)' }
              : { color: '#A09080', border: '1px solid transparent' }
            }
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? '#C8A96E' : '#6B5D4F' }}>{item.icon}</span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(200,169,110,0.2)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ color: '#A09080' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#A09080' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0" style={{ backgroundColor: '#1C1C1C', minHeight: '100vh' }}>
        <SidebarContent onNavClick={() => {}} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#1C1C1C', borderBottom: '1px solid rgba(200,169,110,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden" style={{ backgroundColor: '#C8A96E' }}>
            <img src="/logo.png" alt="Shmeta" className="w-full h-full object-cover" />
          </div>
          <span className="text-base font-bold" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>Shmeta</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg" style={{ color: '#C8A96E' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <aside className="relative w-72 flex flex-col" style={{ backgroundColor: '#1C1C1C' }}>
            {/* Close btn */}
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ color: '#A09080' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
