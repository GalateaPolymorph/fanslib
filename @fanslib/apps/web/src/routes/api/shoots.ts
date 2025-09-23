import { createServerFileRoute } from '@tanstack/react-start/server';
import { prepareElectricUrl, proxyElectricRequest } from '~/lib/electric-proxy';

const serve = async ({ request }: { request: Request }) => {
  const originUrl = prepareElectricUrl(request.url);
  originUrl.searchParams.set('table', 'shoots');
  // originUrl.searchParams.set("where", filter)
  return proxyElectricRequest(originUrl);
};

export const ServerRoute = createServerFileRoute('/api/shoots').methods({
  GET: serve,
});
