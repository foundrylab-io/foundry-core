#!/usr/bin/env node
/**
 * foundry-migrate — run all .sql migration files in order.
 *
 * Usage:
 *   foundry-migrate                          (defaults to ./lib/db/migrations)
 *   foundry-migrate ./lib/db/migrations
 *   foundry-migrate path/to/migrations
 *
 * Reads POSTGRES_URL from environment.
 * Splits each .sql file on `--> statement-breakpoint` and runs statements
 * individually. Errors with "already exists" are skipped (idempotent re-run).
 */

import postgres from 'postgres';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error('foundry-migrate: POSTGRES_URL not set');
  process.exit(1);
}

const migrationsDir = resolve(
  process.cwd(),
  process.argv[2] ?? './lib/db/migrations'
);

try {
  if (!statSync(migrationsDir).isDirectory()) {
    console.error(`foundry-migrate: ${migrationsDir} is not a directory`);
    process.exit(1);
  }
} catch {
  console.error(`foundry-migrate: migrations directory not found at ${migrationsDir}`);
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1 });

async function migrate() {
  const migrationFiles = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('foundry-migrate: no .sql files found — nothing to do');
    return;
  }

  console.log(`foundry-migrate: running ${migrationFiles.length} migrations from ${migrationsDir}`);

  for (const file of migrationFiles) {
    console.log(`\nRunning: ${file}`);
    const migrationSQL = readFileSync(join(migrationsDir, file), 'utf-8');

    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (let i = 0; i < statements.length; i++) {
      try {
        await sql.unsafe(statements[i]);
        console.log(`  Statement ${i + 1}/${statements.length} succeeded`);
      } catch (err) {
        if (err?.message?.includes('already exists')) {
          console.log(`  Statement ${i + 1}/${statements.length} skipped (already exists)`);
        } else {
          console.error(`  Statement ${i + 1}/${statements.length} failed:`, err.message);
          throw err;
        }
      }
    }
  }

  console.log('\nAll migrations complete.');
}

migrate()
  .catch((err) => {
    console.error('foundry-migrate failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end();
  });
