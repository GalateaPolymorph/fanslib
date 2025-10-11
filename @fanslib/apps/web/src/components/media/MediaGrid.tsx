import { Image, Loader2, Video } from 'lucide-react';
import { useMedia } from '../../query';
import { log } from 'console';

export type MediaGridProps = {
  className?: string;
  shootId?: number | null;
};

export const MediaGrid = ({ className = '', shootId }: MediaGridProps) => {
  const mediaQuery = useMedia({ shootId });

  if (mediaQuery.isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className='flex items-center space-x-2'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
          <span className='text-gray-600'>Loading media...</span>
        </div>
      </div>
    );
  }

  if (mediaQuery.isError) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className='text-red-600 mb-2'>Failed to load media</div>
        <div className='text-sm text-gray-500'>Error loading media data</div>
      </div>
    );
  }

  const media = mediaQuery.data || [];
  console.log(media);

  return (
    <div className={`${className}`}>
      {media.length === 0 ? (
        <div className='text-center py-12'>
          <Image className='w-16 h-16 mx-auto mb-4 text-gray-300' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No media found
          </h3>
          <p className='text-gray-500 mb-4'>
            {shootId
              ? 'No media files found for this shoot'
              : 'Start a scan to discover media files in your library'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
          {media.map((item) => (
            <div
              key={item.id}
              className='aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow relative'
            >
              {item.thumbnailPath ? (
                <img
                  src={item.thumbnailPath}
                  alt={item.filepath.split('/').pop() || 'Media file'}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <div className='text-center'>
                    {item.mimeType.startsWith('video/') ? (
                      <Video className='w-8 h-8 mx-auto mb-1' />
                    ) : (
                      <Image className='w-8 h-8 mx-auto mb-1' />
                    )}
                    <div className='text-xs truncate px-1'>
                      {item.filepath.split('/').pop()}
                    </div>
                  </div>
                </div>
              )}

              {/* Media info overlay */}
              <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end opacity-0 group-hover:opacity-100'>
                <div className='p-2 text-white text-xs w-full'>
                  <div className='truncate font-medium'>
                    {item.filepath.split('/').pop()}
                  </div>
                  <div className='text-gray-300'>
                    {item.mimeType.split('/')[0]} •{' '}
                    {Math.round(Number(item.filesize) / 1024)} KB
                  </div>
                  {item.width && item.height && (
                    <div className='text-gray-300'>
                      {item.width} × {item.height}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
