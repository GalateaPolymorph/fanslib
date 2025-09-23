import { selectMediaSchema, selectShootSchema } from '@fanslib/db';
import { electricCollectionOptions } from '@tanstack/electric-db-collection';
import { createCollection } from '@tanstack/react-db';
import { omit } from 'remeda';
import { trpc } from './trpc/client';

export const mediaCollection = createCollection(
  electricCollectionOptions({
    id: 'media',
    shapeOptions: {
      url: new URL(
        `/api/media`,
        typeof window !== `undefined`
          ? window.location.origin
          : `http://localhost:5173`
      ).toString(),
      parser: {
        timestamptz: (date: string) => new Date(date),
      },
    },
    schema: selectMediaSchema,
    getKey: (item) => item.id,
    onInsert: async () => {
      throw new Error('Creating media is not possible from the frontend.');
    },
    onUpdate: async ({ transaction }) => {
      const { modified: updatedMedia } = transaction.mutations[0];
      const result = await trpc.media.update.mutate({
        id: updatedMedia.id,
        data: {
          ...updatedMedia,
        },
      });

      return { txid: result.txid };
    },
    onDelete: async ({ transaction }) => {
      const { original: deletedMedia } = transaction.mutations[0];
      const result = await trpc.media.delete.mutate({
        id: deletedMedia.id,
      });

      return { txid: result.txid };
    },
  })
);

export const shootCollection = createCollection(
  electricCollectionOptions({
    id: 'shoots',
    shapeOptions: {
      url: new URL(
        `/api/shoots`,
        typeof window !== `undefined`
          ? window.location.origin
          : `http://localhost:5173`
      ).toString(),
      parser: {
        // Parse timestamp columns into JavaScript Date objects
        timestamptz: (date: string) => new Date(date),
      },
    },
    schema: selectShootSchema,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified: newShoot } = transaction.mutations[0];
      const result = await trpc.shoots.create.mutate({
        ...newShoot,
      });

      return { txid: result.txid };
    },
    onUpdate: async ({ transaction }) => {
      const { modified: updatedShoot } = transaction.mutations[0];
      const result = await trpc.shoots.update.mutate({
        id: updatedShoot.id,
        data: omit(updatedShoot, ['id']),
      });

      return { txid: result.txid };
    },
    onDelete: async ({ transaction }) => {
      const { original: deletedShoot } = transaction.mutations[0];
      const result = await trpc.shoots.delete.mutate({
        id: deletedShoot.id,
      });

      return { txid: result.txid };
    },
  })
);
