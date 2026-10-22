const { Pool } = require('pg');
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) dbUrl = line.substring(13).trim();
}
const pool = new Pool({ connectionString: dbUrl.split('?')[0], ssl: { rejectUnauthorized: false } });

async function check() {
  const res = await pool.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
  `);
  const grouped = {};
  for (const r of res.rows) {
    if (!grouped[r.table_name]) grouped[r.table_name] = [];
    grouped[r.table_name].push(r.column_name + ' (' + r.data_type + ')');
  }
  console.log(JSON.stringify(grouped, null, 2));
  await pool.end();
}
check();
