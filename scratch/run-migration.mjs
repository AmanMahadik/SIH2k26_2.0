// scratch/run-migration.mjs
import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Read DATABASE_URL from .env or .env.local
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)/);
  if (match) dbUrl = match[1];
}

if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const cleanUrl = dbUrl.includes('?') ? dbUrl.split('?')[0] : dbUrl;
const pool = new pg.Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const sql = fs.readFileSync(path.resolve('db/migrations/002_evc_inspections.sql'), 'utf8');
  console.log('Running migration: 002_evc_inspections.sql...');
  await pool.query(sql);
  console.log('Migration completed successfully!');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
