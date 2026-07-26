'use client';

import { Component } from 'react';
import Link from 'next/link';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--surface-default)' }}
        >
          <div
            className="max-w-md w-full rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--surface-raised)',
              boxShadow: 'var(--shadow-overlay)',
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-danger-subtle)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: 'var(--color-danger)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-default)' }}>
              Something went wrong
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-subtle)' }}>
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-brand)',
                  color: 'var(--text-inverse)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand-bold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand)';
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full px-6 py-3 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--surface-sunken)',
                  color: 'var(--text-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hovered)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-sunken)';
                }}
              >
                Try Again
              </button>
              <Link
                href="/"
                className="block w-full px-6 py-3 text-center font-medium transition-colors"
                style={{ color: 'var(--text-brand)' }}
              >
                Go to Homepage
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary
                  className="cursor-pointer text-sm font-medium"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  Error Details
                </summary>
                <pre
                  className="mt-3 p-4 rounded-lg text-xs overflow-auto"
                  style={{
                    backgroundColor: 'var(--surface-sunken)',
                    color: 'var(--text-default)',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
