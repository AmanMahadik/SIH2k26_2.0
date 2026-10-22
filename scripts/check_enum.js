const { Pool } = require('pg');
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) dbUrl = line.substring(13).trim();
}
const pool = new Pool({ connectionString: dbUrl.split('?')[0], ssl: { rejectUnauthorized: false } });

async function checkEnum() {
  try {
    const res = await pool.query('SELECT enum_range(NULL::app_status);');
    console.log('app_status ENUM VALUES:', res.rows[0].enum_range);
  } catch (err) {
    console.error('Enum check error:', err.message);
  } finally {
    await pool.end();
  }
}

checkEnum();
