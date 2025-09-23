import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../../routes/api/trpc/$';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
      headers: async () => ({
        cookie: typeof document !== 'undefined' ? document.cookie : '',
      }),
    }),
  ],
});
