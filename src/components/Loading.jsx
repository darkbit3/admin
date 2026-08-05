// Reusable loading components for Admin portal

export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }[size] || 'w-6 h-6 border-2'

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-3 text-center">
      <div
        className={`${sizeClasses} border-t-transparent border-[#C8A96E] rounded-full animate-spin`}
      />
      {text && <p className="text-xs font-medium text-[#8A7060]">{text}</p>}
    </div>
  )
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center">
      <div className="bg-white px-6 py-5 rounded-2xl shadow-xl flex items-center gap-4 border border-[#E8D9C5]">
        <div className="w-6 h-6 border-2 border-t-transparent border-[#C8A96E] rounded-full animate-spin flex-shrink-0" />
        <span className="text-sm font-semibold text-[#1C1C1C]">{message}</span>
      </div>
    </div>
  )
}
