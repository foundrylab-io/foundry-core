# @foundrylab/core

Shared infrastructure for Foundry-generated SaaS apps: Clerk auth, Drizzle database setup, shadcn/ui primitives, and CI tooling.

Every Foundry-generated founder app installs this package as a dependency. It holds the stable plumbing so founder apps only contain their own business logic.

## Installation

Foundry-generated apps reference this package by git URL:

```json
{
  "dependencies": {
    "@foundrylab/core": "github:foundrylab-io/foundry-core#v0.1.0"
  }
}
```

Pin to a tag (e.g. `v0.1.0`) — bumping the version after testing.

## What's in the box

- **`@foundrylab/core/db`** — Drizzle client factory, base `users` table, query helpers
- **`@foundrylab/core/auth/middleware`** — Clerk middleware factory with configurable public routes
- **`@foundrylab/core/ui/*`** — All 25 shadcn/ui components (Button, Card, Dialog, Table, etc.)
- **CLI tools** — `foundry-migrate`, `foundry-schema-check`, `foundry-integration-smoke`

## Peer dependencies

Founder apps must install:

```
@clerk/nextjs ^7.0.0
drizzle-orm ^0.43.0
lucide-react ^0.511.0
next ^15.0.0
postgres ^3.4.0
radix-ui ^1.4.0
react ^19.0.0
react-dom ^19.0.0
```

## Usage — database

```ts
// lib/db/schema.ts
export { users } from '@foundrylab/core/db/schema';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
```

```ts
// lib/db/drizzle.ts
import { createDbClient } from '@foundrylab/core/db';
import * as schema from './schema';

export const { db, client } = createDbClient({ schema });
```

```ts
// lib/db/queries.ts
import { createQueries } from '@foundrylab/core/db/queries';
import { db } from './drizzle';
import { users } from './schema';

export const { ensureUserExists } = createQueries({ db, users });
```

## Usage — auth middleware

```ts
// middleware.ts
import { createMiddleware, defaultMatcherConfig } from '@foundrylab/core/auth/middleware';

export default createMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
  landingRedirect: {
    authenticated: '/dashboard',
    unauthenticated: '/sign-in',
  },
});

export const config = defaultMatcherConfig;
```

## Usage — UI components

```tsx
import { Button } from '@foundrylab/core/ui/button';
import { Card, CardHeader, CardContent } from '@foundrylab/core/ui/card';
```

The shadcn components use Tailwind classes. Your app's Tailwind config must scan the package for class names:

```ts
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@foundrylab/core/dist/ui/**/*.{js,ts,tsx}',
  ],
  // ...
};
```

## CLI tools

Reference these from your `package.json` scripts:

```json
{
  "scripts": {
    "db:migrate:safe": "foundry-migrate ./lib/db/migrations",
    "schema:check": "foundry-schema-check",
    "integration:smoke": "foundry-integration-smoke"
  }
}
```

- **`foundry-migrate [dir]`** — Runs all `.sql` files in the given directory (default `./lib/db/migrations`). Skips statements that already ran. Reads `POSTGRES_URL` from env.
- **`foundry-schema-check`** — Static analysis of Drizzle field references in `./lib/db/schema.ts`. Fails if any TypeScript file references a field that doesn't exist in the schema.
- **`foundry-integration-smoke`** — Post-build smoke test. Starts the Next.js production server, hits every discovered page + API route, fails on 500s or SSR crashes.

## Versioning

Tagged releases via git tags (e.g. `v0.1.0`). Founder apps pin to a tag. Foundry platform bumps the pinned version on founder app rebuilds as new package versions are released and validated.

## License

MIT
