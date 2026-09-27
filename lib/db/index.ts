import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

declare global {
  var pgClient: postgres.Sql | undefined;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

// Use connection pooling, but handle hot reloads in Next.js development
let client: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  client = postgres(connectionString, { prepare: false });
} else {
  if (!global.pgClient) {
    global.pgClient = postgres(connectionString, { prepare: false });
  }
  client = global.pgClient;
}

export const db = drizzle(client, { schema });
