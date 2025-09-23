import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from '@tanstack/react-router';
import { NotFound } from './components/NotFound';
import { routeTree } from './routeTree.gen';

export const createRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    defaultSsr: false,
  });

  return router;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
