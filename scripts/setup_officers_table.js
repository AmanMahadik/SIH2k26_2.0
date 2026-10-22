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
    console.log('Connecting to Azure PostgreSQL...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scrutiny_officers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        regional_office TEXT NOT NULL,
        clearance_level TEXT NOT NULL DEFAULT 'L1_SCRUTINY',
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table scrutiny_officers verified/created.');

    // Seed initial officers if empty
    const checkRes = await pool.query('SELECT count(*) FROM scrutiny_officers;');
    if (parseInt(checkRes.rows[0].count, 10) === 0) {
      console.log('Seeding initial scrutiny officers...');
      await pool.query(`
        INSERT INTO scrutiny_officers (name, email, regional_office, clearance_level, status)
        VALUES 
        ('Dr. Priya Sharma', 'priya.sharma@aicte-india.org', 'Western Regional Office (WRO, Mumbai)', 'L2_SENIOR', 'active'),
        ('Er. Rajesh Verma', 'rajesh.verma@aicte-india.org', 'Northern Regional Office (NRO, Kanpur)', 'L1_SCRUTINY', 'active'),
        ('Dr. A. K. Sengupta', 'ak.sengupta@aicte-india.org', 'Central Regional Office (CRO, Bhopal)', 'L2_SENIOR', 'active');
      `);
      console.log('Seeded 3 initial scrutiny officers.');
    } else {
      console.log(`Found ${checkRes.rows[0].count} existing scrutiny officers.`);
    }

    const listRes = await pool.query('SELECT name, email, regional_office, clearance_level FROM scrutiny_officers;');
    console.log('Current officers in DB:', listRes.rows);
  } catch (err) {
    console.error('Error setting up officers table:', err.message);
  } finally {
    await pool.end();
  }
}

run();
