import {
  shootsTable,
  type CreateShoot,
  type Shoot,
  type UpdateShoot,
} from '@fanslib/db';
import { eq } from 'drizzle-orm';
import { Data, Effect, Equal } from 'effect';
import { omit } from 'remeda';
import { omitNullValues } from '~/lib/null';
import { Database } from '~/services/database';

export type DatabaseShoot = Shoot;

const getShootByName = Effect.fn('getShootByName')(function* (name: string) {
  const db = yield* Database;

  const existingShoot = yield* Effect.tryPromise(() =>
    db.select().from(shootsTable).where(eq(shootsTable.name, name)).limit(1)
  );

  return existingShoot.at(0);
});

const shootEquals = (shoot: Shoot, data: UpdateShoot) => {
  const omittedShoot = omitNullValues(
    omit(shoot, ['id', 'createdAt', 'updatedAt'])
  );
  const omittedData = omitNullValues(omit(data, ['createdAt', 'updatedAt']));

  return Equal.equals(Data.struct(omittedShoot), Data.struct(omittedData));
};

const updateShoot = Effect.fn('updateShoot')(function* (
  id: number,
  data: UpdateShoot
) {
  const db = yield* Database;

  return yield* Effect.tryPromise(() =>
    db
      .update(shootsTable)
      .set(data)
      .where(eq(shootsTable.id, id))
      .returning()
      .then((results) => results.at(0))
  );
});

const createShoot = Effect.fn('createShoot')(function* (data: CreateShoot) {
  const db = yield* Database;

  return yield* Effect.tryPromise(() =>
    db
      .insert(shootsTable)
      .values(data)
      .returning()
      .then((results) => results.at(0))
  );
});

export const upsertShoot = Effect.fn('upsertShoot')(function* (
  data: CreateShoot
) {
  const existingShoot = yield* getShootByName(data.name);

  if (existingShoot) {
    if (shootEquals(existingShoot, data)) {
      return {
        result: 'unchanged' as const,
        shoot: existingShoot,
      };
    }

    const shoot = yield* updateShoot(existingShoot.id, data);
    yield* Effect.log(`Shoot with name "${data.name}" updated`);

    return {
      result: 'updated' as const,
      shoot,
    };
  }

  const shoot = yield* createShoot(data);
  yield* Effect.log(`Shoot with name "${data.name}" created`);

  return {
    result: 'created' as const,
    shoot,
  };
});
