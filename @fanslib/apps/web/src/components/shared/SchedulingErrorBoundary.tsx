import { type ErrorInfo, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface SchedulingErrorBoundaryProps {
  children: ReactNode;
}

export const SchedulingErrorBoundary = ({ children }: SchedulingErrorBoundaryProps) => {
  const handleSchedulingError = (error: Error, errorInfo: ErrorInfo) => {
    // Log scheduling specific error with context
    console.error('[Scheduling] Calendar operations or batch scheduling error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      context: 'scheduling_operation',
    });

    // Could integrate with error reporting service here
    // reportError('scheduling_error', { error, errorInfo });
  };

  const fallbackUI = (
    <div className='flex flex-col items-center justify-center min-h-96 p-6 bg-base-100'>
      <div className='card bg-base-200 shadow-lg max-w-lg w-full'>
        <div className='card-body text-center'>
          <div className='text-5xl mb-4'>📅</div>
          <h2 className='card-title justify-center text-error mb-2'>Scheduling Error</h2>
          <p className='text-base-content/70 mb-4'>
            We encountered an issue with your content scheduling. This might be due to:
          </p>
          <ul className='text-left text-sm text-base-content/60 mb-4 space-y-1'>
            <li>• Calendar loading problems</li>
            <li>• Batch scheduling conflicts</li>
            <li>• Date/time validation errors</li>
            <li>• Channel availability issues</li>
          </ul>
          <div className='alert alert-info text-sm mb-4'>
            <span>🔄 Your scheduled posts may still be processing</span>
          </div>
          <div className='card-actions justify-center'>
            <button
              className='btn btn-primary btn-sm touch-manipulation'
              onClick={() => window.location.reload()}
            >
              Refresh Calendar
            </button>
            <button
              className='btn btn-ghost btn-sm touch-manipulation'
              onClick={() => window.history.back()}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handleSchedulingError}>
      {children}
    </ErrorBoundary>
  );
};
