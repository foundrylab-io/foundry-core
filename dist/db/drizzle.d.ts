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
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type Sql } from 'postgres';
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
export declare function createDbClient<TSchema extends Record<string, unknown>>(options: CreateDbClientOptions<TSchema>): DbClient<TSchema>;
//# sourceMappingURL=drizzle.d.ts.map