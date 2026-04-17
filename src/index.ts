/**
 * @foundrylab/core — shared infrastructure for Foundry-generated SaaS apps.
 *
 * Most consumers should use the subpath exports for clarity:
 *
 *   import { createDbClient } from '@foundrylab/core/db';
 *   import { createMiddleware } from '@foundrylab/core/auth/middleware';
 *   import { Button } from '@foundrylab/core/ui/button';
 *
 * This barrel re-exports the most common primitives for convenience.
 */

export { createDbClient, createQueries } from './db/index.js';
export type { CreateDbClientOptions, DbClient, CreateQueriesOptions, Queries } from './db/index.js';
export { createMiddleware, defaultMatcherConfig } from './auth/middleware.js';
export type { CreateMiddlewareOptions } from './auth/middleware.js';
export { cn } from './lib/utils.js';
