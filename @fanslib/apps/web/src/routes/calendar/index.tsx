import { createFileRoute } from '@tanstack/react-router';

const CalendarPage = () => (
  <div className='container mx-auto max-w-7xl'>
    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-base-content'>
      Content Calendar
    </h1>

    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      {/* Sidebar for calendar controls */}
      <div className='lg:col-span-1'>
        <div className='bg-base-200 p-4 rounded-lg mb-4'>
          <h2 className='font-semibold mb-4'>Calendar View</h2>
          <div className='space-y-3'>
            <div>
              <label className='label label-text text-xs'>View Type</label>
              <select className='select select-bordered select-sm w-full'>
                <option>Month View</option>
                <option>Week View</option>
                <option>Day View</option>
              </select>
            </div>
            <div>
              <label className='label label-text text-xs'>Show Channels</label>
              <div className='space-y-2'>
                <label className='label cursor-pointer'>
                  <span className='label-text text-xs'>Reddit</span>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-xs'
                    defaultChecked
                  />
                </label>
                <label className='label cursor-pointer'>
                  <span className='label-text text-xs'>Fansly</span>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-xs'
                    defaultChecked
                  />
                </label>
                <label className='label cursor-pointer'>
                  <span className='label-text text-xs'>Bluesky</span>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-xs'
                    defaultChecked
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-base-200 p-4 rounded-lg'>
          <h2 className='font-semibold mb-4'>Quick Stats</h2>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>This Week:</span>
              <span className='font-medium'>0 posts</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Next Week:</span>
              <span className='font-medium'>0 posts</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>This Month:</span>
              <span className='font-medium'>0 posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main calendar area */}
      <div className='lg:col-span-3'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-4'>
            <button className='btn btn-ghost btn-sm'>&larr;</button>
            <h2 className='text-lg font-semibold'>December 2024</h2>
            <button className='btn btn-ghost btn-sm'>&rarr;</button>
          </div>
          <button className='btn btn-primary btn-sm'>Schedule Content</button>
        </div>

        {/* Calendar grid placeholder */}
        <div className='bg-base-100 border border-base-300 rounded-lg overflow-hidden'>
          {/* Calendar header */}
          <div className='grid grid-cols-7 bg-base-200'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className='p-3 text-center text-sm font-medium border-r border-base-300 last:border-r-0'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar body */}
          <div className='grid grid-cols-7'>
            {Array.from({ length: 35 }, (_, i) => {
              const dayNumber = i - 2; // Start from day -2 to show prev month days
              const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
              const isToday = dayNumber === 15; // Simulate today

              return (
                <div
                  key={i}
                  className={`min-h-24 p-2 border-r border-b border-base-300 last:border-r-0 ${
                    isCurrentMonth ? 'bg-base-100' : 'bg-base-50'
                  } ${isToday ? 'bg-primary/10' : ''}`}
                >
                  <div
                    className={`text-sm ${isCurrentMonth ? 'text-base-content' : 'text-base-content/30'} ${isToday ? 'font-bold' : ''}`}
                  >
                    {dayNumber > 0 && dayNumber <= 31 ? dayNumber : ''}
                  </div>
                  {/* Placeholder scheduled posts */}
                  {isCurrentMonth && dayNumber % 7 === 0 && (
                    <div className='mt-1'>
                      <div className='bg-channel-reddit text-xs px-1 py-0.5 rounded text-white mb-1'>
                        Reddit Post
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='mt-4 text-center text-base-content/70'>
          <p>
            Integrated scheduling workflow will be implemented in future
            stories.
          </p>
          <p className='text-sm mt-1'>
            Drag-and-drop content scheduling coming soon!
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/calendar/')({
  component: CalendarPage,
});
