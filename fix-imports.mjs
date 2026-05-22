#!/usr/bin/env node
/**
 * fix-imports.mjs
 *
 * Fixes wrong TypeScript import aliases in an Electron + Vite project.
 *
 * Strategy:
 *  1. Build an alias map from electron.vite.config  (or hard-coded below).
 *  2. For every alias, resolve its real absolute path.
 *  3. Walk all .ts / .tsx / .js / .jsx files under src/.
 *  4. For each import/require/export … from statement, resolve what the
 *     specifier actually points to on disk.
 *  5. Re-express that path using the *correct* alias (the one whose resolved
 *     root matches the file, preferring the longer / more specific alias).
 *  6. Dry-run by default; pass --fix to apply changes.
 *
 * Usage:
 *   node fix-imports.mjs            # dry-run: prints what would change
 *   node fix-imports.mjs --fix      # applies the fixes in-place
 *   node fix-imports.mjs --fix --verbose
 */

import fs   from 'fs';
import path from 'path';

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// Root of the project (where package.json lives). Adjust if running from elsewhere.
const PROJECT_ROOT = process.cwd();

/**
 * Alias map — mirrors electron.vite.config resolve.alias for the renderer.
 * Key   = alias prefix (without trailing slash)
 * Value = absolute path the alias resolves to
 *
 * Both @renderer and @ point to the same dir here, but we want ONLY @renderer
 * in source (@ is intentionally removed from tsconfig paths to avoid confusion).
 * The "canonical" alias is the FIRST entry whose root matches.
 */
const ALIAS_MAP = {
  '@renderer': path.resolve(PROJECT_ROOT, 'src/renderer/src'),
  '@':         path.resolve(PROJECT_ROOT, 'src/renderer/src'),
};

/**
 * Which alias is canonical? When we rewrite, we'll always pick this one.
 * If a file is under multiple alias roots (both @ and @renderer point to the
 * same place), the canonical one wins.
 */
const CANONICAL_ALIAS = '@renderer';

// Extensions to scan
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts']);

// Directories to skip entirely
const SKIP_DIRS = new Set(['node_modules', 'out', 'dist', '.git', 'build', 'resources']);

// ─── FLAGS ───────────────────────────────────────────────────────────────────
const FIX     = process.argv.includes('--fix');
const VERBOSE = process.argv.includes('--verbose');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Collect every source file under dir (recursive). */
function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, results);
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Given an import specifier like "@/lib/utils" and the file that contains it,
 * return the absolute path on disk that the specifier resolves to
 * (tries common extensions; returns null if nothing found).
 */
function resolveSpecifier(specifier, fromFile) {
  // Relative imports — resolve normally
  if (specifier.startsWith('.')) {
    return tryResolve(path.resolve(path.dirname(fromFile), specifier));
  }

  // Alias imports
  for (const [alias, aliasRoot] of Object.entries(ALIAS_MAP)) {
    const prefix = alias + '/';
    if (specifier.startsWith(prefix)) {
      const rest = specifier.slice(prefix.length);
      return tryResolve(path.join(aliasRoot, rest));
    }
    // bare alias (e.g. import '@renderer')
    if (specifier === alias) {
      return tryResolve(aliasRoot);
    }
  }

  return null; // third-party / node built-in
}

const EXTS = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js'];

function tryResolve(base) {
  for (const ext of EXTS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Convert an absolute resolved path back to the canonical alias specifier.
 * Returns null if the file doesn't live under any known alias root.
 */
function toCanonicalSpecifier(absPath) {
  const root = ALIAS_MAP[CANONICAL_ALIAS];
  if (!absPath.startsWith(root + path.sep) && absPath !== root) return null;

  let rel = absPath.slice(root.length);
  // Normalise path separator to forward slash
  rel = rel.replace(/\\/g, '/');

  // Strip common index suffixes
  rel = rel
    .replace(/\/index\.(ts|tsx|js|jsx|mts|cts)$/, '')
    .replace(/\.(ts|tsx|js|jsx|mts|cts)$/, '');

  return CANONICAL_ALIAS + rel; // e.g. "@renderer/lib/utils"
}

// ─── IMPORT REGEX ────────────────────────────────────────────────────────────
// Matches:
//   import ... from 'specifier'
//   import ... from "specifier"
//   export ... from 'specifier'
//   require('specifier')
//   import('specifier')          (dynamic)
const IMPORT_RE =
  /(?:(?:import|export)\s+(?:[\s\S]*?)\s+from\s+|require\s*\(\s*|import\s*\(\s*)(['"])((?:@[^'"]+|\.{1,2}\/[^'"]+))(\1)/g;

// ─── MAIN ────────────────────────────────────────────────────────────────────

const files    = walkDir(path.join(PROJECT_ROOT, 'src'));
let   total    = 0;
let   changed  = 0;

console.log(`\n🔍  Scanning ${files.length} files  (${FIX ? 'FIX mode' : 'DRY-RUN mode'})\n`);

const summary = []; // { file, changes: [{line, before, after}] }

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const lines    = original.split('\n');
  let   dirty    = false;
  const fileChanges = [];

  const newLines = lines.map((line, idx) => {
    // Reset lastIndex for global regex reuse
    IMPORT_RE.lastIndex = 0;
    let newLine = line;
    let match;

    // We'll collect replacements for this line then apply all at once
    const replacements = [];

    while ((match = IMPORT_RE.exec(line)) !== null) {
      const specifier = match[2];

      // Already uses canonical alias?
      if (specifier.startsWith(CANONICAL_ALIAS + '/')) continue;

      // Is it an alias import we know about?
      const isAliasImport = Object.keys(ALIAS_MAP).some(a =>
        specifier.startsWith(a + '/') || specifier === a
      );
      if (!isAliasImport) continue;

      const absResolved = resolveSpecifier(specifier, file);
      if (!absResolved) {
        if (VERBOSE) {
          console.warn(`  ⚠️  Cannot resolve: ${specifier}  in  ${path.relative(PROJECT_ROOT, file)}:${idx + 1}`);
        }
        continue;
      }

      const canonical = toCanonicalSpecifier(absResolved);
      if (!canonical) continue;
      if (canonical === specifier) continue; // already correct

      replacements.push({ from: specifier, to: canonical });
    }

    if (replacements.length) {
      for (const { from, to } of replacements) {
        // Replace all occurrences on this line (both quote styles)
        newLine = newLine.replace(
          new RegExp(`(['"])${escapeRegex(from)}\\1`, 'g'),
          `$1${to}$1`
        );
        fileChanges.push({ line: idx + 1, before: from, after: to });
      }
      dirty = true;
    }

    return newLine;
  });

  if (dirty) {
    changed++;
    summary.push({ file: path.relative(PROJECT_ROOT, file), changes: fileChanges });

    if (FIX) {
      fs.writeFileSync(file, newLines.join('\n'), 'utf8');
    }
  }
  total++;
}

// ─── REPORT ──────────────────────────────────────────────────────────────────

if (summary.length === 0) {
  console.log('✅  No incorrect alias imports found.\n');
} else {
  for (const { file, changes } of summary) {
    console.log(`\n📄  ${file}  (${changes.length} fix${changes.length > 1 ? 'es' : ''})`);
    for (const { line, before, after } of changes) {
      console.log(`    L${String(line).padStart(4)}  ${before.padEnd(40)} → ${after}`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`  Files scanned : ${total}`);
  console.log(`  Files affected: ${changed}`);
  console.log(`  Total fixes   : ${summary.reduce((n, f) => n + f.changes.length, 0)}`);

  if (!FIX) {
    console.log('\n💡  Run with --fix to apply all changes:\n');
    console.log('    node fix-imports.mjs --fix\n');
  } else {
    console.log('\n✅  All fixes applied.\n');
  }
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
