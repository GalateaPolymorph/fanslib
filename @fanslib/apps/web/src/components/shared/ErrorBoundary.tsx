import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate correlation ID for debugging
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with correlation ID
    console.error(`[${this.state.errorId}] Error caught by boundary:`, error);
    console.error(`[${this.state.errorId}] Component stack:`, errorInfo.componentStack);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className='flex flex-col items-center justify-center min-h-64 p-6 bg-base-100'>
          <div className='card bg-base-200 shadow-lg max-w-md w-full'>
            <div className='card-body text-center'>
              <div className='text-4xl mb-4'>⚠️</div>
              <h2 className='card-title justify-center text-error mb-2'>Something went wrong</h2>
              <p className='text-base-content/70 mb-4'>
                We encountered an unexpected error. Please try again or reload the page.
              </p>

              {/* Error ID for debugging */}
              {this.state.errorId && (
                <div className='bg-base-300 p-2 rounded text-xs font-mono mb-4'>
                  Error ID: {this.state.errorId}
                </div>
              )}

              <div className='card-actions justify-center space-x-2'>
                <button
                  className='btn btn-primary btn-sm touch-manipulation'
                  onClick={this.handleRetry}
                >
                  Try Again
                </button>
                <button
                  className='btn btn-ghost btn-sm touch-manipulation'
                  onClick={this.handleReload}
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
