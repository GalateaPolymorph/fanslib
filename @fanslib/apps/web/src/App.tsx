import { Button } from './components/ui/Button';

export const App = () => {
  return (
    <main className='min-h-screen bg-base-100 p-8'>
      <div className='container mx-auto max-w-4xl'>
        <h1 className='text-4xl font-bold text-center mb-8 text-base-content'>
          FansLib Content Management
        </h1>

        {/* Test different button colors */}
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-base-content'>Button Colors</h2>
          <div className='flex flex-wrap gap-4 justify-center'>
            <button className='btn btn-primary'>Primary</button>
            <button className='btn btn-secondary'>Secondary</button>
            <button className='btn btn-accent'>Accent</button>
            <button className='btn btn-neutral'>Neutral</button>
            <button className='btn btn-info'>Info</button>
            <button className='btn btn-success'>Success</button>
            <button className='btn btn-warning'>Warning</button>
            <button className='btn btn-error'>Error</button>
          </div>
        </div>

        {/* Test button styles */}
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-base-content'>Button Styles</h2>
          <div className='flex flex-wrap gap-4 justify-center'>
            <button className='btn btn-primary'>Default</button>
            <button className='btn btn-primary btn-outline'>Outline</button>
            <button className='btn btn-primary btn-ghost'>Ghost</button>
            <button className='btn btn-link'>Link</button>
          </div>
        </div>

        {/* Test button sizes */}
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-base-content'>Button Sizes</h2>
          <div className='flex flex-wrap gap-4 justify-center items-end'>
            <button className='btn btn-primary btn-xs'>XS</button>
            <button className='btn btn-primary btn-sm'>Small</button>
            <button className='btn btn-primary'>Medium</button>
            <button className='btn btn-primary btn-lg'>Large</button>
            <button className='btn btn-primary btn-xl'>XL</button>
          </div>
        </div>

        {/* Test custom UI library button */}
        <div className='text-center'>
          <h2 className='text-2xl font-semibold mb-4 text-base-content'>
            Custom UI Library Button
          </h2>
          <Button variant='primary' size='lg'>
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
};
