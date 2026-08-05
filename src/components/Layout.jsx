import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F0E6D6' }}>
      <Sidebar />
      {/* pt-14 on mobile to clear the fixed top bar, no padding on lg */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
