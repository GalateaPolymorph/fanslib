import { type ErrorInfo, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface ContentBrowserErrorBoundaryProps {
  children: ReactNode;
}

export const ContentBrowserErrorBoundary = ({ children }: ContentBrowserErrorBoundaryProps) => {
  const handleContentBrowserError = (error: Error, errorInfo: ErrorInfo) => {
    // Log content browser specific error with context
    console.error('[ContentBrowser] Media scanning or display error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      context: 'content_browser_media_operation',
    });

    // Could integrate with error reporting service here
    // reportError('content_browser_error', { error, errorInfo });
  };

  const fallbackUI = (
    <div className='flex flex-col items-center justify-center min-h-96 p-6 bg-base-100'>
      <div className='card bg-base-200 shadow-lg max-w-lg w-full'>
        <div className='card-body text-center'>
          <div className='text-5xl mb-4'>🎬</div>
          <h2 className='card-title justify-center text-error mb-2'>Media Browser Error</h2>
          <p className='text-base-content/70 mb-4'>
            We're having trouble loading or displaying your media content. This might be due to:
          </p>
          <ul className='text-left text-sm text-base-content/60 mb-4 space-y-1'>
            <li>• File system scanning issues</li>
            <li>• Corrupted media files</li>
            <li>• Thumbnail generation problems</li>
            <li>• Database synchronization errors</li>
          </ul>
          <div className='card-actions justify-center'>
            <button
              className='btn btn-primary btn-sm touch-manipulation'
              onClick={() => window.location.reload()}
            >
              Refresh Media Library
            </button>
            <button
              className='btn btn-ghost btn-sm touch-manipulation'
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handleContentBrowserError}>
      {children}
    </ErrorBoundary>
  );
};
