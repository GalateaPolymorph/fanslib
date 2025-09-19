import { type ErrorInfo, type ReactNode } from 'react';

import { ErrorBoundary } from '../../components/shared/ErrorBoundary';

export interface PostsErrorBoundaryProps {
  children: ReactNode;
}

export const PostsErrorBoundary = ({ children }: PostsErrorBoundaryProps) => {
  const handlePostsError = (error: Error, errorInfo: ErrorInfo) => {
    // Log posts specific error with context
    console.error('[Posts] Post composition or management error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      context: 'posts_page_operation',
    });

    // Could integrate with error reporting service here
    // reportError('posts_error', { error, errorInfo });
  };

  const fallbackUI = (
    <div className='flex flex-col items-center justify-center min-h-96 p-6 bg-base-100'>
      <div className='card bg-base-200 shadow-lg max-w-lg w-full'>
        <div className='card-body text-center'>
          <div className='text-5xl mb-4'>📝</div>
          <h2 className='card-title justify-center text-error mb-2'>Post Management Error</h2>
          <p className='text-base-content/70 mb-4'>
            We encountered an issue while managing your posts. This might be due to:
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
            <button className='btn btn-primary btn-sm' onClick={() => window.location.reload()}>
              Reload Posts
            </button>
            <button className='btn btn-ghost btn-sm' onClick={() => window.history.back()}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handlePostsError}>
      {children}
    </ErrorBoundary>
  );
};
