import { Loader2 } from 'lucide-react';
import { useScanCancel, useScanMutation, useScanStatus } from '../../query';
import { Button } from '../ui/Button/Button';

export const ScanProgress = () => {
  const {
    data: scanStatus,
    error: statusError,
    isLoading: isStatusLoading,
  } = useScanStatus();

  const scanMutation = useScanMutation();
  const cancelMutation = useScanCancel();

  const handleStartScan = () => {
    const contentPath = import.meta.env.VITE_MEDIA_ROOT || '/media';
    scanMutation.mutate(contentPath);
  };

  const handleCancelScan = () => {
    cancelMutation.mutate();
  };

  const isScanning = scanStatus?.status === 'scanning';
  const hasError = scanStatus?.status === 'error' || statusError;

  const getStatusColor = () => {
    switch (scanStatus?.status) {
      case 'scanning':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'cancelled':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (scanStatus?.status) {
      case 'scanning':
        return 'Scanning in progress...';
      case 'completed':
        return 'Scan completed successfully';
      case 'error':
        return 'Scan failed with errors';
      case 'cancelled':
        return 'Scan was cancelled';
      case 'idle':
        return 'Ready to scan';
      default:
        return 'Unknown status';
    }
  };

  const progressPercentage = scanStatus?.progress || 0;

  if (isStatusLoading) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6 max-w-md mx-auto'>
        <div className='flex items-center space-x-2'>
          <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
          <span className='text-gray-600'>Loading scan status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6 max-w-md mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>Media Library Scan</h3>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {isScanning && (
        <div className='mb-4'>
          <div className='flex justify-between text-sm text-gray-600 mb-2'>
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-blue-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {scanStatus?.currentFile && (
            <div className='mt-2 text-xs text-gray-500 truncate'>
              Processing: {scanStatus.currentFile}
            </div>
          )}
          <div className='mt-2 text-sm text-gray-600'>
            {scanStatus?.processedFiles || 0} of {scanStatus?.totalFiles || 0}{' '}
            files
          </div>
        </div>
      )}

      {scanStatus?.status === 'completed' && (
        <div className='mb-4 text-sm text-gray-600'>
          <div>Total files: {scanStatus.totalFiles}</div>
          <div>Processed: {scanStatus.processedFiles}</div>
          {scanStatus.startTime && scanStatus.endTime && (
            <div>
              Duration:{' '}
              {Math.round(
                (new Date(scanStatus.endTime).getTime() -
                  new Date(scanStatus.startTime).getTime()) /
                  1000
              )}
              s
            </div>
          )}
        </div>
      )}

      {hasError && (
        <div className='mb-4'>
          <div className='text-red-600 text-sm font-medium mb-2'>
            Error Details:
          </div>
          <div className='text-red-500 text-xs bg-red-50 p-2 rounded max-h-20 overflow-y-auto'>
            {statusError?.message || 'An unknown error occurred'}
            {scanStatus?.errors && scanStatus.errors.length > 0 && (
              <ul className='mt-1 list-disc list-inside'>
                {scanStatus.errors.map((error: string, index: number) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className='flex gap-2'>
        <Button
          onClick={handleStartScan}
          disabled={isScanning || scanMutation.isPending}
          className='flex-1'
        >
          {scanMutation.isPending ? 'Starting...' : 'Start Scan'}
        </Button>

        {isScanning && (
          <Button
            onClick={handleCancelScan}
            disabled={cancelMutation.isPending}
            variant='secondary'
            className='flex-1'
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
          </Button>
        )}
      </div>
    </div>
  );
};
