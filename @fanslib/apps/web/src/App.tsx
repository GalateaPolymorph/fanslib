import { AppLayout } from './components/layout/app-layout';
import { ResponsiveDemo } from './components/layout/responsive-demo';
import { ErrorBoundary } from './components/shared';
import { Button } from './components/ui/Button';

export const App = () => {
  return (
    <ErrorBoundary>
      <AppLayout>
        <div className='container mx-auto max-w-7xl'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8 text-base-content'>
            FansLib Content Management
          </h1>

          {/* Test different button colors */}
          <div className='mb-6 lg:mb-8'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-base-content'>
              Button Colors
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-3 lg:gap-4 lg:justify-center'>
              <button className='btn btn-primary btn-sm lg:btn-md touch-manipulation'>
                Primary
              </button>
              <button className='btn btn-secondary btn-sm lg:btn-md touch-manipulation'>
                Secondary
              </button>
              <button className='btn btn-accent btn-sm lg:btn-md touch-manipulation'>Accent</button>
              <button className='btn btn-neutral btn-sm lg:btn-md touch-manipulation'>
                Neutral
              </button>
              <button className='btn btn-info btn-sm lg:btn-md touch-manipulation'>Info</button>
              <button className='btn btn-success btn-sm lg:btn-md touch-manipulation'>
                Success
              </button>
              <button className='btn btn-warning btn-sm lg:btn-md touch-manipulation'>
                Warning
              </button>
              <button className='btn btn-error btn-sm lg:btn-md touch-manipulation'>Error</button>
            </div>
          </div>

          {/* Test button styles */}
          <div className='mb-6 lg:mb-8'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-base-content'>
              Button Styles
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4 lg:justify-center'>
              <button className='btn btn-primary btn-sm lg:btn-md touch-manipulation'>
                Default
              </button>
              <button className='btn btn-primary btn-outline btn-sm lg:btn-md touch-manipulation'>
                Outline
              </button>
              <button className='btn btn-primary btn-ghost btn-sm lg:btn-md touch-manipulation'>
                Ghost
              </button>
              <button className='btn btn-link btn-sm lg:btn-md touch-manipulation'>Link</button>
            </div>
          </div>

          {/* Test button sizes */}
          <div className='mb-6 lg:mb-8'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-base-content'>
              Button Sizes
            </h2>
            <div className='flex flex-wrap gap-3 lg:gap-4 justify-center items-end'>
              <button className='btn btn-primary btn-xs touch-manipulation'>XS</button>
              <button className='btn btn-primary btn-sm touch-manipulation'>Small</button>
              <button className='btn btn-primary touch-manipulation'>Medium</button>
              <button className='btn btn-primary btn-lg touch-manipulation'>Large</button>
            </div>
          </div>

          {/* Test custom UI library button */}
          <div className='text-center mb-8'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-base-content'>
              Custom UI Library Button
            </h2>
            <Button variant='primary' size='lg' className='touch-manipulation'>
              Get Started
            </Button>
          </div>

          {/* Responsive Design Demo */}
          <div className='border-t border-base-300 pt-8'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold mb-6 text-base-content'>
              Responsive Design Foundation Demo
            </h2>
            <ResponsiveDemo />
          </div>
        </div>
      </AppLayout>
    </ErrorBoundary>
  );
};
