/**
 * @foundrylab/core/auth — auth() wrapper for Foundry-generated apps.
 *
 * In production, this is a thin pass-through to Clerk's `auth()` from
 * `@clerk/nextjs/server`. Generated pages, API routes, and server actions
 * should import `auth` from here instead of directly from `@clerk/nextjs/server`
 * so that Foundry can provide a test-mode bypass without every app needing
 * to wire up Clerk test tokens.
 *
 * Test mode (Sandbox only — NEVER production):
 *   process.env.FOUNDRY_TEST_MODE === 'true'
 *     → returns { userId: process.env.FOUNDRY_TEST_USER_ID ?? null }
 *     → skips Clerk entirely; no network call, no session validation
 *
 * Pairs with the test-mode bypass in `createMiddleware` — together they
 * let the Foundry Sandbox run full HTTP smoke tests against generated
 * pages and API routes without provisioning Clerk sessions per request.
 *
 * FOUNDRY_TEST_MODE MUST NEVER be set in production. Railway deployments
 * of founder apps do not set this variable; only the Sandbox runner does.
 */
import { auth as clerkAuth, currentUser as clerkCurrentUser, } from '@clerk/nextjs/server';
/**
 * Returns the current request's auth state.
 *
 * In production: delegates to `@clerk/nextjs/server`'s `auth()`.
 * In test mode (`FOUNDRY_TEST_MODE=true`): returns a synthetic auth object
 * with `userId` drawn from `FOUNDRY_TEST_USER_ID`. All other Clerk auth
 * fields are absent — generated code should only read `userId`.
 */
export async function auth() {
    if (process.env.FOUNDRY_TEST_MODE === 'true') {
        const userId = process.env.FOUNDRY_TEST_USER_ID ?? null;
        // Cast is load-bearing: the real Clerk AuthObject has many fields
        // (sessionId, orgId, sessionClaims, etc.). Generated code only reads
        // userId, so a partial shape matches in practice. If a generated
        // file ever reads another field in test mode, that read returns
        // undefined — which matches Clerk's behavior for unauthenticated
        // requests and will surface as a test failure naturally.
        return { userId };
    }
    return clerkAuth();
}
/**
 * Returns the current Clerk user record (name, email, etc.) or null.
 *
 * In test mode (`FOUNDRY_TEST_MODE=true`): returns null instead of hitting
 * Clerk. Callers that use this to populate a new local users row should
 * handle null by using empty-string defaults — `ensureUserExists` in
 * `@foundrylab/core/db/queries` already does so.
 *
 * Exposed so that core's own helpers (ensureUserExists) can delegate
 * through the same test-mode gate without each helper having to check
 * FOUNDRY_TEST_MODE directly.
 */
export async function currentUser() {
    if (process.env.FOUNDRY_TEST_MODE === 'true') {
        return null;
    }
    return clerkCurrentUser();
}
//# sourceMappingURL=index.js.map