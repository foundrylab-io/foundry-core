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
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
export function createQueries(options) {
    const { db, users } = options;
    async function ensureUserExists(clerkId) {
        const { userId } = await auth();
        if (!userId)
            throw new Error('Unauthorized');
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, clerkId))
            .limit(1);
        if (existing.length > 0)
            return existing[0];
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
//# sourceMappingURL=queries.js.map