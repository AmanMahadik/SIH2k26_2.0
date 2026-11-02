import pg from 'pg';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)/);
const dbUrl = match[1].split('?')[0];

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const inspections = await pool.query('SELECT id, campus_name, institute_id, lab_name, latitude, longitude FROM inspections LIMIT 10;');
  console.log('Inspections count:', inspections.rowCount);
  console.log(inspections.rows);
  const labs = await pool.query('SELECT * FROM labs LIMIT 10;');
  console.log('Labs count:', labs.rowCount);
  console.log(labs.rows);
  await pool.end();
}

run().catch(console.error);
