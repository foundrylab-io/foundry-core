#!/usr/bin/env node
/**
 * schema-validator.mjs — Static analysis of Drizzle schema field references.
 *
 * Parses lib/db/schema.ts to extract table names and their TypeScript field
 * names, then scans all .ts/.tsx files that import from the schema for field
 * references that don't exist. Catches bugs like referencing `billable` when
 * the field was renamed to `isBillable`.
 *
 * Exit code 0: all references valid.
 * Exit code 1: mismatched references found.
 *
 * This is a generic validator — works for any Drizzle schema regardless of
 * domain. No hardcoded table or column names.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = process.cwd();
const SCHEMA_PATH = join(ROOT, "lib/db/schema.ts");

// Field names that are NEVER Drizzle columns — they're JS built-ins, Drizzle
// internals, or shared property names. Matching `someVar.trim()` where
// `someVar` happens to share a name with a table would otherwise produce a
// false positive. The validator is a generic tool; it must not flag valid
// JavaScript just because a variable collides with a table name.
const SKIP_FIELDS = new Set([
  // Drizzle internals
  "$inferInsert", "$inferSelect", "_", "getSQL", "mapWith",
  "findMany", "findFirst", "findUnique",
  // JS String methods + properties
  "trim", "trimStart", "trimEnd", "toLowerCase", "toUpperCase",
  "charAt", "charCodeAt", "codePointAt", "concat", "includes",
  "indexOf", "lastIndexOf", "match", "matchAll", "normalize",
  "padEnd", "padStart", "repeat", "replace", "replaceAll",
  "search", "slice", "split", "startsWith", "endsWith",
  "substring", "substr", "at", "localeCompare",
  // JS Array methods
  "push", "pop", "shift", "unshift", "map", "filter", "reduce",
  "reduceRight", "forEach", "find", "findIndex", "findLast",
  "findLastIndex", "some", "every", "flat", "flatMap",
  "join", "sort", "reverse", "copyWithin", "fill", "entries",
  "from", "of", "isArray",
  // JS shared / Object / Promise
  "length", "size", "constructor", "prototype", "hasOwnProperty",
  "isPrototypeOf", "propertyIsEnumerable", "toLocaleString",
  "toString", "valueOf", "name", "keys", "values", "then",
  "catch", "finally",
  // JSON / Date / Number common methods that might appear on dotted access
  "toFixed", "toPrecision", "toExponential", "toISOString",
  "toJSON", "getTime", "getFullYear", "getMonth", "getDate",
  "getHours", "getMinutes", "getSeconds",
]);

// ── Parse schema.ts ──────────────────────────────────────────────────────────

function parseSchema(schemaContent) {
  const tables = {};

  // Match: export const tableName = pgTable("sql_name", { ... })
  // We need to extract the TypeScript property names (camelCase), not the SQL
  // column names — because that's what consuming code references.
  const tableRegex =
    /export\s+const\s+(\w+)\s*=\s*pgTable\s*\(\s*["'](\w+)["']\s*,\s*\{/g;

  let match;
  while ((match = tableRegex.exec(schemaContent)) !== null) {
    const tsName = match[1]; // e.g. "timeEntries"
    const startIdx = match.index + match[0].length;

    // Find the matching closing brace by counting braces
    let depth = 1;
    let i = startIdx;
    while (i < schemaContent.length && depth > 0) {
      if (schemaContent[i] === "{") depth++;
      if (schemaContent[i] === "}") depth--;
      i++;
    }

    const body = schemaContent.slice(startIdx, i - 1);

    // Extract field names: lines like `fieldName: type(...)` or `fieldName: type(...).notNull()`
    const fieldRegex = /^\s*(\w+)\s*:/gm;
    const fields = new Set();
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(body)) !== null) {
      fields.add(fieldMatch[1]);
    }

    // Always-present implicit fields
    fields.add("id");
    fields.add("createdAt");
    fields.add("updatedAt");

    tables[tsName] = fields;
  }

  return tables;
}

// ── Find all .ts/.tsx files ──────────────────────────────────────────────────

function walkDir(dir, files = []) {
  const skipDirs = new Set([
    "node_modules",
    ".next",
    ".git",
    "components",
    "scripts",
  ]);

  for (const entry of readdirSync(dir)) {
    if (skipDirs.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, files);
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".d.ts")) {
      files.push(full);
    }
  }
  return files;
}

// ── Check field references ───────────────────────────────────────────────────

function checkFile(filePath, content, tables) {
  const errors = [];

  // Skip schema.ts itself and migration files
  const rel = relative(ROOT, filePath);
  if (rel === "lib/db/schema.ts") return errors;
  if (rel.includes("migrations/")) return errors;
  if (rel === "lib/db/drizzle.ts") return errors;
  if (rel === "lib/db/queries.ts") return errors;
  if (rel === "lib/db/migrate.ts") return errors;

  // Only check files that import from the schema
  if (
    !content.includes("@/lib/db/schema") &&
    !content.includes("./schema") &&
    !content.includes("../schema")
  ) {
    return errors;
  }

  // For each table name referenced in the file, check field accesses
  for (const [tableName, fields] of Object.entries(tables)) {
    // Pattern: tableName.fieldName (property access)
    const accessRegex = new RegExp(
      `${tableName}\\.(\\w+)`,
      "g"
    );
    let accessMatch;
    while ((accessMatch = accessRegex.exec(content)) !== null) {
      const fieldName = accessMatch[1];

      // Skip Drizzle internals and JS built-in method/property names.
      if (SKIP_FIELDS.has(fieldName)) continue;

      if (!fields.has(fieldName)) {
        const lineNum =
          content.slice(0, accessMatch.index).split("\n").length;
        errors.push({
          file: rel,
          line: lineNum,
          table: tableName,
          field: fieldName,
          available: [...fields].sort().join(", "),
        });
      }
    }
  }

  return errors;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  let schemaContent;
  try {
    schemaContent = readFileSync(SCHEMA_PATH, "utf-8");
  } catch {
    console.log("schema-validator: lib/db/schema.ts not found — skipping");
    process.exit(0);
  }

  const tables = parseSchema(schemaContent);
  const tableNames = Object.keys(tables);
  console.log(
    `schema-validator: parsed ${tableNames.length} tables: ${tableNames.join(", ")}`
  );
  for (const [name, fields] of Object.entries(tables)) {
    console.log(`  ${name}: ${[...fields].sort().join(", ")}`);
  }

  const files = walkDir(ROOT);
  console.log(`schema-validator: scanning ${files.length} source files`);

  const allErrors = [];
  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const errors = checkFile(filePath, content, tables);
      allErrors.push(...errors);
    } catch {
      // Skip unreadable files
    }
  }

  if (allErrors.length === 0) {
    console.log("schema-validator: all field references are valid");
    process.exit(0);
  }

  console.error(
    `\nschema-validator: found ${allErrors.length} invalid field reference(s):\n`
  );
  // Deduplicate by table+field
  const seen = new Set();
  for (const err of allErrors) {
    const key = `${err.file}:${err.table}.${err.field}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.error(
      `  ${err.file}:${err.line} — ${err.table}.${err.field} does not exist`
    );
    console.error(`    Available fields: ${err.available}`);
  }
  console.error("");
  process.exit(1);
}

main();
