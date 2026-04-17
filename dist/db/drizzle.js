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
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
export function createDbClient(options) {
    const url = options.connectionString ?? process.env.POSTGRES_URL;
    if (!url) {
        throw new Error('@foundrylab/core: POSTGRES_URL is not set. Configure it in your environment or pass { connectionString } to createDbClient().');
    }
    // prepare: false is required for pooled connections (e.g. Supabase pooler, PgBouncer).
    const client = postgres(url, { prepare: false });
    const db = drizzle(client, { schema: options.schema });
    return { db, client };
}
//# sourceMappingURL=drizzle.js.map