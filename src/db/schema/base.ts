/**
 * Base schema tables shared across all Foundry-generated apps.
 * Founder apps extend this by importing these tables and adding their own:
 *
 *   // founder's lib/db/schema.ts
 *   export { users } from '@foundrylab/core/db/schema';
 *   export const projects = pgTable('projects', { ... });
 */

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * The `users` table. Every Foundry app has one.
 * Rows are created just-in-time on first Clerk sign-in via `ensureUserExists()`.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  name: text('name'),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
