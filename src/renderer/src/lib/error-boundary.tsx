import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center p-8 bg-slate-900 text-white">
            <div className="max-w-md text-center space-y-6">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-400 mb-2">Application Error</h2>
                <p className="text-sm font-mono break-all text-red-200">
                  {this.state.error?.message || 'An unknown error occurred'}
                </p>
              </div>
              <p className="text-slate-400 text-sm">
                Please check your .env file and ensure all required environment variables are set.
              </p>
              <button
                className="px-4 py-2 bg-white cursor-pointer text-slate-900 rounded-md font-medium hover:bg-slate-200 transition-colors"
                onClick={() => {
                  console.log('Attempting to recover from error...')
                  this.setState({ hasError: false, error: null })
                }}
              >
                Try to Restart
              </button>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
