import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/channels')({
  component: ChannelsPage,
});

function ChannelsPage() {
  return (
    <div className='container mx-auto max-w-7xl'>
      <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-base-content'>
        Channel Management
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Sidebar for channel actions */}
        <div className='lg:col-span-1'>
          <div className='bg-base-200 p-4 rounded-lg mb-4'>
            <h2 className='font-semibold mb-4'>Quick Actions</h2>
            <div className='space-y-2'>
              <button className='btn btn-primary btn-sm w-full'>
                Add Channel
              </button>
              <button className='btn btn-ghost btn-sm w-full'>
                Import Settings
              </button>
              <button className='btn btn-ghost btn-sm w-full'>
                Export Config
              </button>
            </div>
          </div>

          <div className='bg-base-200 p-4 rounded-lg'>
            <h2 className='font-semibold mb-4'>Channel Stats</h2>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Active Channels:</span>
                <span className='font-medium'>6</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Total Posts:</span>
                <span className='font-medium'>0</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Scheduled:</span>
                <span className='font-medium'>0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className='lg:col-span-2'>
          <div className='mb-4'>
            <p className='text-base-content/70'>Channel configuration and posting automation will be implemented in future stories.</p>
          </div>

          {/* Channel list */}
          <div className='space-y-4'>
            {[
              { name: 'Reddit', color: 'channel-reddit', status: 'Active', posts: '0', description: 'Automated posting to subreddits' },
              { name: 'Fansly', color: 'channel-fansly', status: 'Active', posts: '0', description: 'Premium content platform' },
              { name: 'ManyVids', color: 'channel-manyvids', status: 'Inactive', posts: '0', description: 'Video content marketplace' },
              { name: 'Bluesky', color: 'channel-bluesky', status: 'Active', posts: '0', description: 'Social media platform' },
              { name: 'RedGIFs', color: 'channel-redgifs', status: 'Active', posts: '0', description: 'GIF hosting and sharing' },
              { name: 'Clips4Sale', color: 'channel-clips4sale', status: 'Inactive', posts: '0', description: 'Video clip marketplace' },
            ].map((channel, i) => (
              <div
                key={i}
                className='card bg-base-100 shadow-sm border border-base-300'
              >
                <div className='card-body p-4'>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <span className={`${channel.color} px-3 py-1 rounded-full text-white text-sm font-medium`}>
                          {channel.name}
                        </span>
                        <span className={`badge badge-sm ${channel.status === 'Active' ? 'badge-success' : 'badge-ghost'}`}>
                          {channel.status}
                        </span>
                      </div>
                      <p className='text-sm text-base-content/70 mb-2'>
                        {channel.description}
                      </p>
                      <div className='flex items-center gap-4 text-xs text-base-content/60'>
                        <span>Posts: {channel.posts}</span>
                        <span>Last Activity: Never</span>
                        <span>Next Post: Not scheduled</span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <button className='btn btn-ghost btn-xs'>
                        Configure
                      </button>
                      <button className='btn btn-ghost btn-xs'>
                        View Posts
                      </button>
                      <div className='dropdown dropdown-end'>
                        <div tabIndex={0} role='button' className='btn btn-ghost btn-xs'>
                          •••
                        </div>
                        <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                          <li><a>Edit Settings</a></li>
                          <li><a>View Analytics</a></li>
                          <li><a>Export Data</a></li>
                          <li><a className='text-error'>Disable Channel</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 text-center text-base-content/70'>
            <p>Advanced channel automation features coming in Epic 6!</p>
            <p className='text-sm mt-1'>Including Reddit subreddit management, posting rules, and automated scheduling.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
