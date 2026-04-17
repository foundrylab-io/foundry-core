/**
 * Clerk middleware factory.
 *
 * Usage in a founder app:
 *
 *   // middleware.ts
 *   import { createMiddleware, defaultMatcherConfig } from '@foundrylab/core/auth/middleware';
 *
 *   export default createMiddleware({
 *     publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
 *     landingRedirect: {
 *       authenticated: '/dashboard',
 *       unauthenticated: '/sign-in',
 *     },
 *   });
 *
 *   export const config = defaultMatcherConfig;
 *
 * The factory handles the common cases: public-route protection and
 * landing-page redirects based on auth state. Founder apps can override
 * either by passing configuration.
 */
export interface CreateMiddlewareOptions {
    /**
     * Routes that do NOT require authentication. Supports the same pattern
     * syntax as Clerk's createRouteMatcher (glob-like patterns).
     * Defaults to ['/', '/sign-in(.*)', '/sign-up(.*)'].
     */
    publicRoutes?: string[];
    /**
     * Landing page ("/") redirect behavior based on auth state.
     * Set either field to `null` to disable the redirect for that state.
     * Defaults to { authenticated: '/dashboard', unauthenticated: '/sign-in' }.
     */
    landingRedirect?: {
        authenticated?: string | null;
        unauthenticated?: string | null;
    };
}
/**
 * Creates a Clerk middleware handler with Foundry's standard auth behavior.
 */
export declare function createMiddleware(options?: CreateMiddlewareOptions): import("next/server").NextMiddleware;
/**
 * Default Next.js middleware matcher config. Excludes static assets and
 * common file extensions so middleware only runs on page + API routes.
 */
export declare const defaultMatcherConfig: {
    matcher: string[];
};
//# sourceMappingURL=middleware.d.ts.map