import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL is not defined');
}

export default defineConfig({
  out: `./src/db/out`,
  schema: `./src/db/schema.ts`,
  dialect: `postgresql`,
  casing: `snake_case`,
  dbCredentials: {
    url,
  },
});
