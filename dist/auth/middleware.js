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
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
const DEFAULT_PUBLIC_ROUTES = ['/', '/sign-in(.*)', '/sign-up(.*)'];
const DEFAULT_LANDING = {
    authenticated: '/dashboard',
    unauthenticated: '/sign-in',
};
/**
 * Creates a Clerk middleware handler with Foundry's standard auth behavior.
 */
export function createMiddleware(options = {}) {
    const publicRoutes = options.publicRoutes ?? DEFAULT_PUBLIC_ROUTES;
    const landing = { ...DEFAULT_LANDING, ...(options.landingRedirect ?? {}) };
    const isPublicRoute = createRouteMatcher(publicRoutes);
    return clerkMiddleware(async (auth, request) => {
        // Test-mode bypass: Sandbox runners set FOUNDRY_TEST_MODE=true so that
        // HTTP smoke tests can hit protected routes without provisioning Clerk
        // sessions. Generated code consumes `auth()` from @foundrylab/core/auth,
        // which returns a synthetic { userId } in this mode. Railway production
        // deployments never set this variable. See src/auth/index.ts.
        if (process.env.FOUNDRY_TEST_MODE === 'true') {
            return;
        }
        const { userId } = await auth();
        if (request.nextUrl.pathname === '/') {
            if (userId && landing.authenticated) {
                return NextResponse.redirect(new URL(landing.authenticated, request.url));
            }
            if (!userId && landing.unauthenticated) {
                return NextResponse.redirect(new URL(landing.unauthenticated, request.url));
            }
        }
        if (!isPublicRoute(request)) {
            await auth.protect();
        }
    });
}
/**
 * Default Next.js middleware matcher config. Excludes static assets and
 * common file extensions so middleware only runs on page + API routes.
 */
export const defaultMatcherConfig = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
};
//# sourceMappingURL=middleware.js.map