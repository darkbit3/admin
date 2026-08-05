import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

// ── Icons ──────────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const IconManage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)
const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <IconDashboard /> },
  { label: 'Manage',    path: ROUTES.MANAGE,    icon: <IconManage /> },
]

// ── Admin profile card ─────────────────────────────────────────────────────
function AdminProfile({ admin }) {
  if (!admin) return null
  const initials = (admin.name || admin.phone || 'A')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div
      className="mx-3 mb-4 px-3 py-3 rounded-xl flex items-center gap-3"
      style={{ backgroundColor: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.18)' }}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ backgroundColor: '#C8A96E', color: '#1C1C1C' }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#F5EDE0' }}>
          {admin.name || 'Admin'}
        </p>
        <p className="text-xs truncate" style={{ color: '#C8A96E' }}>
          {admin.phone || ''}
        </p>
      </div>
      <div className="flex-shrink-0" style={{ color: '#C8A96E' }}>
        <IconUser />
      </div>
    </div>
  )
}

// ── Desktop sidebar content ────────────────────────────────────────────────
function SidebarContent({ admin, onNavClick, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(200,169,110,0.2)' }}>
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#C8A96E' }}>
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
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

      {/* Admin profile card */}
      <AdminProfile admin={admin} />

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(200,169,110,0.2)' }}>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ color: '#A09080' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#A09080' }}
        >
          <IconLogout />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { admin, clearAdmin } = useAuth()

  const handleLogout = async () => {
    await authApi.logout()
    clearAdmin()
    navigate(ROUTES.LOGIN)
  }

  return (
    <>
      {/* ── Desktop sidebar (lg+): always visible left panel ── */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0"
        style={{ backgroundColor: '#1C1C1C', minHeight: '100vh' }}
      >
        <SidebarContent admin={admin} onNavClick={() => {}} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile: fixed top header bar ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4"
        style={{ backgroundColor: '#1C1C1C', borderBottom: '1px solid rgba(200,169,110,0.2)', height: '56px' }}
      >
        {/* Logo + admin name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#C8A96E' }}>
            <img src="/logo.png" alt="Shmeta" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-base font-bold" style={{ color: '#F5EDE0', fontFamily: 'Georgia, serif' }}>Shmeta</span>
            {admin?.name && (
              <p className="text-xs leading-none" style={{ color: '#C8A96E' }}>{admin.name}</p>
            )}
          </div>
        </div>

        {/* Logout icon button */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-colors"
          style={{ color: '#A09080' }}
          onTouchStart={e => e.currentTarget.style.color = '#f87171'}
          onTouchEnd={e => e.currentTarget.style.color = '#A09080'}
        >
          <IconLogout />
        </button>
      </div>

      {/* ── Mobile: fixed bottom navigation bar ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          backgroundColor: '#1C1C1C',
          borderTop: '1px solid rgba(200,169,110,0.2)',
          height: '64px',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150"
            style={({ isActive }) => ({
              color: isActive ? '#C8A96E' : '#6B5D4F',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? '#C8A96E' : '#6B5D4F' }}>{item.icon}</span>
                <span className="text-xs font-medium" style={{ color: isActive ? '#C8A96E' : '#6B5D4F' }}>
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 rounded-full"
                    style={{
                      width: '32px',
                      height: '3px',
                      backgroundColor: '#C8A96E',
                      bottom: 'calc(env(safe-area-inset-bottom) + 0px)',
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
