import Layout from '../components/Layout'

// ── colour tokens (matches admin gold theme) ───────────────────────────────
const GOLD        = '#C8A96E'
const GOLD_BG     = 'rgba(200,169,110,0.08)'
const GOLD_BORDER = 'rgba(200,169,110,0.2)'
const DARK        = '#1C1C1C'
const TEXT_MID    = '#6B5D4F'

// ── placeholder ────────────────────────────────────────────────────────────
export default function History() {
  return (
    <Layout>
      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
        >
          {/* Clock icon */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: DARK }}>History</h1>
          <p className="text-sm" style={{ color: TEXT_MID }}>Activity logs and audit trail</p>
        </div>
      </div>

      {/* Content placeholder — replace this block with real content */}
      <div
        className="rounded-2xl flex flex-col items-center justify-center py-24 gap-4"
        style={{ backgroundColor: '#fff', border: `1px solid ${GOLD_BORDER}` }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: GOLD_BG }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-base font-semibold" style={{ color: DARK }}>History page is ready</p>
        <p className="text-sm text-center max-w-xs" style={{ color: TEXT_MID }}>
          Content coming soon — tell Kiro what logic and data to show here.
        </p>
      </div>
    </Layout>
  )
}
