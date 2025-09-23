import { router } from '../server';
import { mediaRouter } from './media';
import { shootsRouter } from './shoots';

export const trpcRouter = router({
  media: mediaRouter,
  shoots: shootsRouter,
});
export type TRPCRouter = typeof trpcRouter;
