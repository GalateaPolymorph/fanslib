import { type ErrorInfo, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface PostCompositionErrorBoundaryProps {
  children: ReactNode;
}

export const PostCompositionErrorBoundary = ({ children }: PostCompositionErrorBoundaryProps) => {
  const handlePostCompositionError = (error: Error, errorInfo: ErrorInfo) => {
    // Log post composition specific error with context
    console.error('[PostComposition] Form validation or save error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      context: 'post_composition_operation',
    });

    // Could integrate with error reporting service here
    // reportError('post_composition_error', { error, errorInfo });
  };

  const fallbackUI = (
    <div className='flex flex-col items-center justify-center min-h-96 p-6 bg-base-100'>
      <div className='card bg-base-200 shadow-lg max-w-lg w-full'>
        <div className='card-body text-center'>
          <div className='text-5xl mb-4'>📝</div>
          <h2 className='card-title justify-center text-error mb-2'>Post Composition Error</h2>
          <p className='text-base-content/70 mb-4'>
            We encountered an issue while creating or editing your post. This might be due to:
          </p>
          <ul className='text-left text-sm text-base-content/60 mb-4 space-y-1'>
            <li>• Form validation errors</li>
            <li>• Content save failures</li>
            <li>• Media attachment issues</li>
            <li>• Draft persistence problems</li>
          </ul>
          <div className='alert alert-warning text-sm mb-4'>
            <span>💾 Your work may have been automatically saved as a draft</span>
          </div>
          <div className='card-actions justify-center'>
            <button
              className='btn btn-primary btn-sm touch-manipulation'
              onClick={() => window.location.reload()}
            >
              Reload Editor
            </button>
            <button
              className='btn btn-ghost btn-sm touch-manipulation'
              onClick={() => window.history.back()}
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handlePostCompositionError}>
      {children}
    </ErrorBoundary>
  );
};
