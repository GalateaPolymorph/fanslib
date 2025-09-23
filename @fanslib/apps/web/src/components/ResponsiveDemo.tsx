export const ResponsiveDemo = () => (
  <div className='space-y-6'>
    {/* Responsive Grid Demo */}
    <section>
      <h3 className='text-lg font-semibold mb-4 text-base-content'>
        Responsive Grid (1 col → 2 cols → 4 cols)
      </h3>
      <div className='grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4'>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className='bg-base-200 p-4 rounded-lg text-center min-h-20 flex items-center justify-center'
          >
            <span className='font-medium'>Item {i + 1}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Responsive Text and Spacing */}
    <section>
      <h3 className='text-lg font-semibold mb-4 text-base-content'>
        Responsive Typography & Spacing
      </h3>
      <div className='bg-base-200 p-4 tablet:p-6 desktop:p-8 rounded-lg'>
        <h4 className='text-base tablet:text-lg desktop:text-xl font-bold mb-2 tablet:mb-3 desktop:mb-4'>
          This heading scales with screen size
        </h4>
        <p className='text-sm tablet:text-base desktop:text-lg text-base-content/80 mb-3 tablet:mb-4 desktop:mb-6'>
          This paragraph demonstrates responsive text sizing. Padding and
          margins also scale appropriately across different screen sizes to
          maintain optimal reading experience.
        </p>
        <div className='flex flex-col tablet:flex-row gap-2 tablet:gap-4'>
          <button className='btn btn-primary btn-sm tablet:btn-md desktop:btn-lg flex-1 tablet:flex-none'>
            Mobile First
          </button>
          <button className='btn btn-secondary btn-outline btn-sm tablet:btn-md desktop:btn-lg flex-1 tablet:flex-none'>
            Responsive
          </button>
        </div>
      </div>
    </section>

    {/* Touch-Friendly Elements */}
    <section>
      <h3 className='text-lg font-semibold mb-4 text-base-content'>
        Touch-Friendly Interface Elements
      </h3>
      <div className='grid grid-cols-1 tablet:grid-cols-2 gap-4'>
        <div className='bg-base-200 p-4 rounded-lg'>
          <h4 className='font-semibold mb-3'>Minimum 44px Touch Targets</h4>
          <div className='space-y-2'>
            <button className='btn btn-primary w-full min-h-11'>
              Touch-Friendly Button
            </button>
            <button className='btn btn-ghost w-full min-h-11'>
              44px+ Height Button
            </button>
          </div>
        </div>

        <div className='bg-base-200 p-4 rounded-lg'>
          <h4 className='font-semibold mb-3'>Channel Status Pills</h4>
          <div className='flex flex-wrap gap-2'>
            <span className='channel-reddit px-3 py-2 rounded-full text-xs font-medium min-h-8 flex items-center'>
              Reddit
            </span>
            <span className='channel-fansly px-3 py-2 rounded-full text-xs font-medium min-h-8 flex items-center'>
              Fansly
            </span>
            <span className='channel-bluesky px-3 py-2 rounded-full text-xs font-medium min-h-8 flex items-center'>
              Bluesky
            </span>
          </div>
        </div>
      </div>
    </section>

    {/* Content Status Demo */}
    <section>
      <h3 className='text-lg font-semibold mb-4 text-base-content'>
        Content Status Indicators
      </h3>
      <div className='grid grid-cols-2 tablet:grid-cols-4 gap-3'>
        <div className='bg-base-200 p-3 rounded-lg text-center'>
          <div className='status-draft inline-block mb-2'>Draft</div>
          <p className='text-xs text-base-content/60'>Not published</p>
        </div>
        <div className='bg-base-200 p-3 rounded-lg text-center'>
          <div className='status-scheduled inline-block mb-2'>Scheduled</div>
          <p className='text-xs text-base-content/60'>Ready to post</p>
        </div>
        <div className='bg-base-200 p-3 rounded-lg text-center'>
          <div className='status-published inline-block mb-2'>Published</div>
          <p className='text-xs text-base-content/60'>Live content</p>
        </div>
        <div className='bg-base-200 p-3 rounded-lg text-center'>
          <div className='status-archived inline-block mb-2'>Archived</div>
          <p className='text-xs text-base-content/60'>No longer active</p>
        </div>
      </div>
    </section>

    {/* Breakpoint Indicator */}
    <section>
      <h3 className='text-lg font-semibold mb-4 text-base-content'>
        Current Breakpoint Indicator
      </h3>
      <div className='bg-base-200 p-4 rounded-lg text-center'>
        <div className='font-mono text-sm'>
          <span className='inline tablet:hidden desktop:hidden'>
            📱 Mobile (&lt; 768px)
          </span>
          <span className='hidden tablet:inline desktop:hidden'>
            📟 Tablet (768px - 1023px)
          </span>
          <span className='hidden desktop:inline'>🖥️ Desktop (1024px+)</span>
        </div>
      </div>
    </section>
  </div>
);
