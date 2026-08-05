import { Component } from 'react'
import { ROUTES } from '../config/routes'

/**
 * Catches unhandled React render errors and shows a friendly recovery screen.
 * Wrap around routes or the whole app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = ROUTES.DASHBOARD
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: '#F0E6D6' }}
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl p-8 text-center"
          style={{ border: '1px solid #E8D9C5', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#DC2626' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold mb-2" style={{ color: '#1C1C1C', fontFamily: 'Georgia, serif' }}>
            Something went wrong
          </h1>
          <p className="text-sm mb-2" style={{ color: '#8A7060' }}>
            An unexpected error occurred. You can try reloading the page.
          </p>

          {/* Show error message in dev */}
          {import.meta.env.DEV && this.state.error && (
            <pre
              className="text-xs text-left rounded-lg p-3 mb-5 overflow-auto max-h-32"
              style={{ backgroundColor: '#FEF2F2', color: '#7F1D1D', border: '1px solid #FCA5A5' }}
            >
              {this.state.error.message}
            </pre>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={this.handleGoHome}
              className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors"
              style={{ borderColor: '#D4C4B0', color: '#3A2E24' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5EDE0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Go to Dashboard
            </button>
            <button
              onClick={this.handleReload}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#1C1C1C', color: '#F5EDE0' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C8A96E'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1C1C1C'}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
