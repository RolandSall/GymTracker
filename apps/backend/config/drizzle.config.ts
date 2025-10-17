import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { resolve, join } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

export default defineConfig({
  schema: join(__dirname, '../category-management/src/infrastructure/persistence/index.ts'),
  out: join(__dirname, '../resources/migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/gym_tracker',
  },
  verbose: true,
  strict: true,
});
