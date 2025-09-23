/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
import { AppLayout } from '~/components/AppLayout';
import { NotFound } from '~/components/NotFound';
import { seo } from '~/lib/seo';
import appCss from '~/styles.css?url';

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html>
    <head>
      <HeadContent />
    </head>
    <body>
      <AppLayout>{children}</AppLayout>
      <TanStackRouterDevtools position='bottom-right' />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Fanslib',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [],
  }),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});
