import { createMediaSchema, mediaTable, updateMediaSchema } from '@fanslib/db';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import { generateTxId, procedure, router } from '../server';

export const mediaRouter = router({
  create: procedure
    .input(createMediaSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [newItem] = await tx.insert(mediaTable).values(input).returning();
        return { item: newItem, txid };
      });

      return result;
    }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        data: updateMediaSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [updatedItem] = await tx
          .update(mediaTable)
          .set(input.data)
          .where(eq(mediaTable.id, input.id))
          .returning();

        if (!updatedItem) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Media not found',
          });
        }

        return { item: updatedItem, txid };
      });

      return result;
    }),

  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [deletedItem] = await tx
          .delete(mediaTable)
          .where(eq(mediaTable.id, input.id))
          .returning();

        if (!deletedItem) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Media not found',
          });
        }

        return { item: deletedItem, txid };
      });

      return result;
    }),
});
