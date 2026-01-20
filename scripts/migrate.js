#!/usr/bin/env node
// ============================================================
// DATABASE MIGRATION RUNNER
// Simple migration system for Uplift
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '../database/migrations');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function getExecutedMigrations() {
  const result = await pool.query('SELECT name FROM _migrations ORDER BY id');
  return result.rows.map(r => r.name);
}

async function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    return [];
  }
  
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  return files;
}

async function runMigration(filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Run migration
    await client.query(sql);
    
    // Record migration
    await client.query(
      'INSERT INTO _migrations (name) VALUES ($1)',
      [filename]
    );
    
    await client.query('COMMIT');
    console.log(`✅ ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function migrate() {
  console.log('🚀 Running database migrations...\n');
  
  try {
    await ensureMigrationsTable();
    
    const executed = await getExecutedMigrations();
    const files = await getMigrationFiles();
    
    const pending = files.filter(f => !executed.includes(f));
    
    if (pending.length === 0) {
      console.log('✨ No pending migrations\n');
      return;
    }
    
    console.log(`📋 ${pending.length} migration(s) to run:\n`);
    
    for (const file of pending) {
      await runMigration(file);
    }
    
    console.log('\n✨ All migrations complete!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function rollback(count = 1) {
  console.log(`🔙 Rolling back ${count} migration(s)...\n`);
  
  try {
    await ensureMigrationsTable();
    
    const result = await pool.query(
      'SELECT name FROM _migrations ORDER BY id DESC LIMIT $1',
      [count]
    );
    
    if (result.rows.length === 0) {
      console.log('✨ No migrations to rollback\n');
      return;
    }
    
    for (const row of result.rows) {
      const downFile = row.name.replace('.sql', '.down.sql');
      const downPath = path.join(MIGRATIONS_DIR, downFile);
      
      if (fs.existsSync(downPath)) {
        const sql = fs.readFileSync(downPath, 'utf8');
        await pool.query(sql);
        console.log(`⬇️  Rolled back: ${row.name}`);
      } else {
        console.log(`⚠️  No down migration for: ${row.name}`);
      }
      
      await pool.query('DELETE FROM _migrations WHERE name = $1', [row.name]);
    }
    
    console.log('\n✨ Rollback complete!\n');
  } catch (error) {
    console.error('\n❌ Rollback failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function create(name) {
  if (!name) {
    console.error('❌ Migration name required');
    process.exit(1);
  }
  
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const filename = `${timestamp}_${name}.sql`;
  const downFilename = `${timestamp}_${name}.down.sql`;
  
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }
  
  const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- Write your migration SQL here

`;

  const downTemplate = `-- Rollback: ${name}
-- Created: ${new Date().toISOString()}

-- Write your rollback SQL here

`;

  fs.writeFileSync(path.join(MIGRATIONS_DIR, filename), template);
  fs.writeFileSync(path.join(MIGRATIONS_DIR, downFilename), downTemplate);
  
  console.log(`✅ Created migrations:`);
  console.log(`   ${filename}`);
  console.log(`   ${downFilename}`);
}

async function status() {
  console.log('📊 Migration Status\n');
  
  try {
    await ensureMigrationsTable();
    
    const executed = await getExecutedMigrations();
    const files = await getMigrationFiles();
    
    console.log(`Total migrations: ${files.length}`);
    console.log(`Executed: ${executed.length}`);
    console.log(`Pending: ${files.length - executed.length}\n`);
    
    for (const file of files) {
      const status = executed.includes(file) ? '✅' : '⏳';
      console.log(`${status} ${file}`);
    }
    
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// CLI
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'up':
  case 'migrate':
    migrate();
    break;
  case 'down':
  case 'rollback':
    rollback(parseInt(arg) || 1);
    break;
  case 'create':
    create(arg);
    break;
  case 'status':
    status();
    break;
  default:
    console.log(`
Uplift Database Migration Tool

Usage:
  node migrate.js <command> [options]

Commands:
  up, migrate      Run pending migrations
  down, rollback   Rollback last migration (or specify count)
  create <name>    Create new migration files
  status           Show migration status

Examples:
  node migrate.js migrate
  node migrate.js create add_skills_table
  node migrate.js rollback 2
  node migrate.js status
`);
}
