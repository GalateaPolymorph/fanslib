import {
  mediaTable,
  type CreateMedia,
  type Media,
  type UpdateMedia,
} from '@fanslib/db';
import { eq } from 'drizzle-orm';
import { Data, Effect, Equal } from 'effect';
import { omit } from 'remeda';
import { omitNullValues } from '~/lib/null';
import { Database } from '~/services/database';

export type DatabaseMedia = Media;

const getMediaByFilepath = Effect.fn('getMediaByFilepath')(function* (
  filepath: string
) {
  const db = yield* Database;

  const existingMedia = yield* Effect.tryPromise(() =>
    db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.filepath, filepath))
      .limit(1)
  );

  return existingMedia.at(0);
});

const mediaEquals = (media: Media, data: UpdateMedia) => {
  const omittedMedia = omitNullValues(
    omit(media, ['id', 'createdAt', 'updatedAt'])
  );
  const omittedData = omitNullValues(omit(data, ['createdAt', 'updatedAt']));

  return Equal.equals(Data.struct(omittedMedia), Data.struct(omittedData));
};

const updateMedia = Effect.fn('updateMedia')(function* (
  id: number,
  data: UpdateMedia
) {
  const db = yield* Database;

  return yield* Effect.tryPromise(() =>
    db.update(mediaTable).set(data).where(eq(mediaTable.id, id)).returning()
  );
});

const createMedia = Effect.fn('createMedia')(function* (data: CreateMedia) {
  const db = yield* Database;

  return yield* Effect.tryPromise(() =>
    db.insert(mediaTable).values(data).returning()
  );
});

export const upsertMedia = Effect.fn('upsertMedia')(function* (
  data: CreateMedia
) {
  const existingMedia = yield* getMediaByFilepath(data.filepath);

  if (existingMedia) {
    if (mediaEquals(existingMedia, data)) {
      return {
        result: 'unchanged' as const,
        media: existingMedia,
      };
    }

    const media = yield* updateMedia(existingMedia.id, data);
    yield* Effect.log(`Media with filepath "${data.filepath}" updated`);

    return {
      result: 'updated' as const,
      media,
    };
  }

  const media = yield* createMedia(data);
  yield* Effect.log(`Media with filepath "${data.filepath}" created`);

  return {
    result: 'created' as const,
    media,
  };
});
