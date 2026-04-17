/**
 * Drizzle client factory.
 *
 * Usage in a founder app:
 *
 *   // lib/db/drizzle.ts
 *   import { createDbClient } from '@foundrylab/core/db';
 *   import * as schema from './schema';
 *
 *   export const { db, client } = createDbClient({ schema });
 *
 * Reads POSTGRES_URL from process.env unless a connectionString is provided.
 */

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

export interface CreateDbClientOptions<TSchema extends Record<string, unknown>> {
  /** Merged Drizzle schema — base tables from @foundrylab/core plus founder domain tables. */
  schema: TSchema;
  /** Override POSTGRES_URL env var. Primarily for tests. */
  connectionString?: string;
}

export interface DbClient<TSchema extends Record<string, unknown>> {
  db: PostgresJsDatabase<TSchema>;
  client: Sql;
}

export function createDbClient<TSchema extends Record<string, unknown>>(
  options: CreateDbClientOptions<TSchema>
): DbClient<TSchema> {
  const url = options.connectionString ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      '@foundrylab/core: POSTGRES_URL is not set. Configure it in your environment or pass { connectionString } to createDbClient().'
    );
  }

  // prepare: false is required for pooled connections (e.g. Supabase pooler, PgBouncer).
  const client = postgres(url, { prepare: false });
  const db = drizzle(client, { schema: options.schema });

  return { db, client };
}
