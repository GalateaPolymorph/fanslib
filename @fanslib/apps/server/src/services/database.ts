import { drizzle } from 'drizzle-orm/node-postgres';
import { Config, Effect, Redacted } from 'effect';

export class Database extends Effect.Service<Database>()('Database', {
  effect: Effect.gen(function* () {
    const url = yield* Config.redacted(Config.string('DATABASE_URL'));
    return drizzle(Redacted.value(url), { casing: `snake_case` });
  }),
  accessors: true,
}) {}
