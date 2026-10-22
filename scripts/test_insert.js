const { Pool } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) dbUrl = line.substring(13).trim();
}

const cleanUrl = dbUrl.split('?')[0];
const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const instCount = await pool.query('SELECT count(*) FROM institutions;');
    const offCount = await pool.query('SELECT count(*) FROM scrutiny_officers;');
    const appCount = await pool.query('SELECT count(*) FROM applications;');
    const auditCount = await pool.query('SELECT count(*) FROM audit_log;');

    console.log('--- AZURE DATABASE FOR POSTGRESQL LIVE AUDIT ---');
    console.log(`Institutions Count: ${instCount.rows[0].count}`);
    console.log(`Officers Count:     ${offCount.rows[0].count}`);
    console.log(`Applications Count: ${appCount.rows[0].count}`);
    console.log(`Audit Log Count:    ${auditCount.rows[0].count}`);
  } catch (err) {
    console.error('Audit check error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
