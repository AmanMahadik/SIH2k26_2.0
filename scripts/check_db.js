const { Pool } = require('pg');
const fs = require('fs');

// Read .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
}

console.log('Connecting to DB URL:', dbUrl ? dbUrl.replace(/:[^:@]+@/, ':***@') : 'NONE');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function run() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;");
    console.log(`Found ${res.rows.length} tables:`);
    for (const r of res.rows) {
      try {
        const countRes = await pool.query(`SELECT count(*) FROM "${r.table_name}";`);
        console.log(`  - ${r.table_name}: ${countRes.rows[0].count} rows`);
      } catch (e) {
        console.log(`  - ${r.table_name}: error reading (${e.message})`);
      }
    }
  } catch (err) {
    console.error('Error connecting to Azure DB:', err.message);
  } finally {
    await pool.end();
  }
}

run();
