import { type ErrorInfo, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface TaggingErrorBoundaryProps {
  children: ReactNode;
}

export const TaggingErrorBoundary = ({ children }: TaggingErrorBoundaryProps) => {
  const handleTaggingError = (error: Error, errorInfo: ErrorInfo) => {
    // Log tagging specific error with context
    console.error('[Tagging] Tag operations or dimension management error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      context: 'tagging_operation',
    });

    // Could integrate with error reporting service here
    // reportError('tagging_error', { error, errorInfo });
  };

  const fallbackUI = (
    <div className='flex flex-col items-center justify-center min-h-96 p-6 bg-base-100'>
      <div className='card bg-base-200 shadow-lg max-w-lg w-full'>
        <div className='card-body text-center'>
          <div className='text-5xl mb-4'>🏷️</div>
          <h2 className='card-title justify-center text-error mb-2'>Tagging System Error</h2>
          <p className='text-base-content/70 mb-4'>
            We encountered an issue with the tagging system. This might be due to:
          </p>
          <ul className='text-left text-sm text-base-content/60 mb-4 space-y-1'>
            <li>• Tag creation or modification errors</li>
            <li>• Dimension management conflicts</li>
            <li>• Filter system malfunctions</li>
            <li>• Tag association failures</li>
          </ul>
          <div className='alert alert-warning text-sm mb-4'>
            <span>🔖 Your existing tags and filters remain safe</span>
          </div>
          <div className='card-actions justify-center'>
            <button
              className='btn btn-primary btn-sm touch-manipulation'
              onClick={() => window.location.reload()}
            >
              Refresh Tagging
            </button>
            <button
              className='btn btn-ghost btn-sm touch-manipulation'
              onClick={() => window.history.back()}
            >
              Back to Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handleTaggingError}>
      {children}
    </ErrorBoundary>
  );
};
