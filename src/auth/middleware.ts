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
 *
 * Test-mode bypass: when FOUNDRY_TEST_MODE === 'true' the factory returns
 * a no-op middleware that never loads `@clerk/nextjs/server`. Pairs with
 * the bypass in `src/auth/index.ts`. The lazy load matters because
 * `@clerk/nextjs/server` pulls in Next.js bundler internals that plain
 * Node — and therefore the Sandbox's vitest — cannot resolve, so a
 * value-import at module-top would crash any vitest run that
 * transitively reaches this file (Phase 2.5 Step 2.8 — defense-in-depth
 * mirror of Step 2.6's lazy-load in src/auth/index.ts).
 */

// Type-only import for `NextMiddleware` so the production return type
// stays correct without a value dependency on '@clerk/nextjs/server'.
// `NextResponse` (from 'next/server') IS a value import, but next/server
// resolves cleanly under plain Node — only Clerk's server submodule
// pulls in bundler internals.
import type { NextMiddleware } from 'next/server';
import { NextResponse } from 'next/server';

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

const DEFAULT_PUBLIC_ROUTES = ['/', '/sign-in(.*)', '/sign-up(.*)'];
const DEFAULT_LANDING = {
  authenticated: '/dashboard' as string | null,
  unauthenticated: '/sign-in' as string | null,
};

/**
 * Creates a Clerk middleware handler with Foundry's standard auth behavior.
 */
export function createMiddleware(options: CreateMiddlewareOptions = {}): NextMiddleware {
  const publicRoutes = options.publicRoutes ?? DEFAULT_PUBLIC_ROUTES;
  const landing = { ...DEFAULT_LANDING, ...(options.landingRedirect ?? {}) };

  // Test-mode bypass: Sandbox runners set FOUNDRY_TEST_MODE=true so HTTP
  // smoke tests can hit protected routes without provisioning Clerk
  // sessions. Returning a no-op middleware that never imports
  // `@clerk/nextjs/server` keeps Clerk's barrel eval out of every code
  // path vitest can transitively reach. Railway production deployments
  // never set this variable.
  if (process.env.FOUNDRY_TEST_MODE === 'true') {
    return async () => undefined;
  }

  // Production path: lazy-init the Clerk-backed middleware on first
  // request and cache it. Putting the dynamic import inside the returned
  // function (rather than at module-top) is load-bearing — it ensures
  // any vitest run that transitively imports this module does NOT
  // evaluate Clerk's barrel (it never reaches a real request, so
  // `cached` stays null and the dynamic import is never called).
  let cached: NextMiddleware | null = null;
  return async (req, event) => {
    if (!cached) {
      const clerk = await import('@clerk/nextjs/server');
      const isPublicRoute = clerk.createRouteMatcher(publicRoutes);
      cached = clerk.clerkMiddleware(async (auth, request) => {
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
      }) as NextMiddleware;
    }
    return cached(req, event);
  };
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
