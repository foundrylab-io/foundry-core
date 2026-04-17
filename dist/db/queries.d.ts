/**
 * Query helpers factory.
 *
 * Usage in a founder app:
 *
 *   // lib/db/queries.ts
 *   import { createQueries } from '@foundrylab/core/db/queries';
 *   import { db } from './drizzle';
 *   import { users } from './schema';
 *
 *   export const { ensureUserExists } = createQueries({ db, users });
 *
 * The factory pattern keeps the package decoupled from the founder's schema
 * while still providing the standard auth helpers.
 */
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { users as UsersTable } from './schema/base.js';
export interface CreateQueriesOptions<TSchema extends Record<string, unknown>> {
    /** Drizzle database client (from createDbClient). */
    db: PostgresJsDatabase<TSchema>;
    /** The `users` table — founder re-exports it from @foundrylab/core/db/schema. */
    users: typeof UsersTable;
}
export interface Queries {
    /**
     * Ensure a `users` row exists for the given Clerk user ID.
     * Creates the row on first call (just-in-time provisioning).
     * Returns the internal user record.
     *
     * Throws if the current request is unauthenticated.
     */
    ensureUserExists: (clerkId: string) => Promise<unknown>;
}
export declare function createQueries<TSchema extends Record<string, unknown>>(options: CreateQueriesOptions<TSchema>): Queries;
//# sourceMappingURL=queries.d.ts.map