import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className='container mx-auto max-w-7xl'>
      <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-base-content'>
        Settings
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Settings navigation */}
        <div className='lg:col-span-1'>
          <div className='bg-base-200 p-4 rounded-lg'>
            <h2 className='font-semibold mb-4'>Settings Categories</h2>
            <div className='menu menu-sm space-y-1'>
              <li><a className='active'>General</a></li>
              <li><a>Channels</a></li>
              <li><a>Content Library</a></li>
              <li><a>Scheduling</a></li>
              <li><a>Tagging</a></li>
              <li><a>Import/Export</a></li>
              <li><a>Advanced</a></li>
            </div>
          </div>
        </div>

        {/* Settings content */}
        <div className='lg:col-span-3'>
          <div className='space-y-6'>
            {/* General Settings */}
            <div className='card bg-base-100 shadow-sm border border-base-300'>
              <div className='card-body p-6'>
                <h2 className='card-title text-lg mb-4'>General Settings</h2>

                <div className='space-y-4'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Application Theme</span>
                    </label>
                    <select className='select select-bordered w-full max-w-xs'>
                      <option>Auto (System)</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>

                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Default Content View</span>
                    </label>
                    <select className='select select-bordered w-full max-w-xs'>
                      <option>Grid View</option>
                      <option>List View</option>
                      <option>Card View</option>
                    </select>
                  </div>

                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-4'>
                      <input type='checkbox' className='checkbox' defaultChecked />
                      <span className='label-text'>Enable keyboard shortcuts</span>
                    </label>
                  </div>

                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-4'>
                      <input type='checkbox' className='checkbox' defaultChecked />
                      <span className='label-text'>Show file system notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Library Settings */}
            <div className='card bg-base-100 shadow-sm border border-base-300'>
              <div className='card-body p-6'>
                <h2 className='card-title text-lg mb-4'>Content Library</h2>

                <div className='space-y-4'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Content Directory Path</span>
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        placeholder='/path/to/content/library'
                        className='input input-bordered flex-1'
                        defaultValue='/Users/creator/FansLib/content'
                      />
                      <button className='btn btn-outline'>Browse</button>
                    </div>
                  </div>

                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>Thumbnail Quality</span>
                    </label>
                    <select className='select select-bordered w-full max-w-xs'>
                      <option>High (Slow)</option>
                      <option>Medium (Balanced)</option>
                      <option>Low (Fast)</option>
                    </select>
                  </div>

                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-4'>
                      <input type='checkbox' className='checkbox' defaultChecked />
                      <span className='label-text'>Auto-scan for new content</span>
                    </label>
                  </div>

                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-4'>
                      <input type='checkbox' className='checkbox' />
                      <span className='label-text'>Delete thumbnails when content is removed</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Backup & Data */}
            <div className='card bg-base-100 shadow-sm border border-base-300'>
              <div className='card-body p-6'>
                <h2 className='card-title text-lg mb-4'>Backup & Data Management</h2>

                <div className='space-y-4'>
                  <div className='alert alert-info'>
                    <span>💾 Database backup and restore functionality will be implemented in future stories.</span>
                  </div>

                  <div className='flex flex-wrap gap-3'>
                    <button className='btn btn-outline btn-sm'>
                      Export Settings
                    </button>
                    <button className='btn btn-outline btn-sm'>
                      Import Settings
                    </button>
                    <button className='btn btn-outline btn-sm'>
                      Clear Cache
                    </button>
                    <button className='btn btn-error btn-outline btn-sm'>
                      Reset All Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className='card bg-base-100 shadow-sm border border-base-300'>
              <div className='card-body p-6'>
                <h2 className='card-title text-lg mb-4'>System Information</h2>

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>FansLib Version:</span>
                    <span className='font-mono'>1.2.0-dev</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Database:</span>
                    <span className='font-mono'>PostgreSQL + ElectricSQL</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Runtime:</span>
                    <span className='font-mono'>Bun + React</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Content Items:</span>
                    <span className='font-mono'>0</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Storage Used:</span>
                    <span className='font-mono'>0 MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className='flex justify-end gap-3'>
              <button className='btn btn-ghost'>
                Reset to Defaults
              </button>
              <button className='btn btn-primary'>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
