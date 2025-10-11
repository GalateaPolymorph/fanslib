import { createFileRoute } from '@tanstack/react-router';
import { MediaGrid, ScanProgress } from '../../components/media';

const MediaPage = () => (
  <div className='container mx-auto max-w-7xl'>
    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-base-content'>
      Media Library
    </h1>

    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      {/* Sidebar for filters and scan controls */}
      <div className='lg:col-span-1 space-y-6'>
        {/* Scan Progress Component */}
        <ScanProgress />

        {/* Filters */}
        <div className='bg-base-200 p-4 rounded-lg'>
          <h2 className='font-semibold mb-4'>Filters</h2>
          <div className='space-y-3'>
            <div>
              <label className='label label-text text-xs'>Media Type</label>
              <select className='select select-bordered select-sm w-full'>
                <option>All Types</option>
                <option>Photos</option>
                <option>Videos</option>
                <option>GIFs</option>
              </select>
            </div>
            <div>
              <label className='label label-text text-xs'>Channel</label>
              <select className='select select-bordered select-sm w-full'>
                <option>All Channels</option>
                <option>Reddit</option>
                <option>Fansly</option>
                <option>Bluesky</option>
              </select>
            </div>
            <div>
              <label className='label label-text text-xs'>Status</label>
              <select className='select select-bordered select-sm w-full'>
                <option>All Status</option>
                <option>Unused</option>
                <option>Scheduled</option>
                <option>Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className='lg:col-span-3'>
        <MediaGrid />
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/media/')({
  component: MediaPage,
});
