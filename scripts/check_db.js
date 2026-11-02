const fs = require('fs');
const { Pool } = require('pg');

const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
let dbUrl = '';
for (const line of lines) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim().replace(/^['"]|['"]$/g, '');
    break;
  }
}

const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function run() {
  const alerts = await pool.query('SELECT * FROM alerts;');
  console.log('Total alerts in DB:', alerts.rows.length);
  console.log(alerts.rows);
  const audits = await pool.query('SELECT count(*) FROM audit_log;');
  console.log('Audit log count in DB:', audits.rows[0].count);
  await pool.end();
}
run();
