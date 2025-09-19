import { createFileRoute } from '@tanstack/react-router';
import { PostsErrorBoundary } from './PostsErrorBoundary';

export const Route = createFileRoute('/posts')({
  component: PostsPage,
});

function PostsPage() {
  return (
    <PostsErrorBoundary>
      <div className='container mx-auto max-w-7xl'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-base-content'>
          Post Management
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Sidebar for post filters */}
          <div className='lg:col-span-1'>
            <div className='bg-base-200 p-4 rounded-lg'>
              <h2 className='font-semibold mb-4'>Post Filters</h2>
              <div className='space-y-3'>
                <div>
                  <label className='label label-text text-xs'>Status</label>
                  <select className='select select-bordered select-sm w-full'>
                    <option>All Posts</option>
                    <option>Draft</option>
                    <option>Scheduled</option>
                    <option>Published</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div>
                  <label className='label label-text text-xs'>Channel</label>
                  <select className='select select-bordered select-sm w-full'>
                    <option>All Channels</option>
                    <option>Reddit</option>
                    <option>Fansly</option>
                    <option>Bluesky</option>
                    <option>Redgifs</option>
                  </select>
                </div>
                <div>
                  <label className='label label-text text-xs'>Date Range</label>
                  <select className='select select-bordered select-sm w-full'>
                    <option>All Time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>This Month</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className='lg:col-span-3'>
            <div className='flex justify-between items-center mb-4'>
              <p className='text-base-content/70'>Post composition and management will be implemented in future stories.</p>
              <button className='btn btn-primary btn-sm'>
                Create Post
              </button>
            </div>

            {/* Placeholder post list */}
            <div className='space-y-4'>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className='card bg-base-200 shadow-sm'
                >
                  <div className='card-body p-4'>
                    <div className='flex justify-between items-start'>
                      <div className='flex-1'>
                        <h3 className='card-title text-base'>Sample Post {i + 1}</h3>
                        <p className='text-sm text-base-content/70 mt-1'>
                          This is a placeholder for post content. Full post composition features coming soon.
                        </p>
                        <div className='flex items-center gap-2 mt-3'>
                          <span className='status-draft'>Draft</span>
                          <span className='channel-reddit px-2 py-1 rounded text-xs'>Reddit</span>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button className='btn btn-ghost btn-xs'>Edit</button>
                        <button className='btn btn-ghost btn-xs'>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PostsErrorBoundary>
  );
}
