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

import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { auth, currentUser } from '../auth/index.js';
import type { users as UsersTable, User } from './schema/base.js';

// auth/currentUser are imported from @foundrylab/core's own auth wrapper,
// not from @clerk/nextjs/server directly. This routes through the
// FOUNDRY_TEST_MODE bypass so the Sandbox can exercise these helpers
// without a Clerk session. In production both wrappers delegate to
// the real Clerk calls, so behaviour is unchanged.

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
   * Returns the internal user record, or undefined if provisioning failed.
   *
   * Typed as `User | undefined` (not `unknown`) so that generated code can
   * use `user.id` after a null-check. With `unknown`, the null-check narrows
   * to `{}` and any property access fails TypeScript compilation — this
   * caused every StudioBook build to fail with "Property 'id' does not
   * exist on type '{}'" for months.
   *
   * Throws if the current request is unauthenticated.
   */
  ensureUserExists: (clerkId: string) => Promise<User | undefined>;
}

export function createQueries<TSchema extends Record<string, unknown>>(
  options: CreateQueriesOptions<TSchema>
): Queries {
  const { db, users } = options;

  async function ensureUserExists(clerkId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (existing.length > 0) return existing[0];

    const clerkUser = await currentUser();
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId,
        name: clerkUser?.fullName ?? '',
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? '',
      })
      .returning();

    return newUser;
  }

  return { ensureUserExists };
}
