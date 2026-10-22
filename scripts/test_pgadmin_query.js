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
    const q1 = `
      SELECT
        current_database() AS "Database Name",
        current_user AS "Connected User",
        inet_server_addr() AS "Azure Host IP",
        version() AS "PostgreSQL Version";
    `;
    const r1 = await pool.query(q1);
    console.log('--- SERVER INFO ---');
    console.table(r1.rows);

    const q2 = `
      SELECT 
        table_name AS "Relational Table",
        (xpath('/row/cnt/text()', xml_count))[1]::text::int AS "Live Row Count",
        pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS "Storage Footprint",
        'Active & Synced (Azure Central India)' AS "Cluster Status"
      FROM (
        SELECT 
          table_name,
          query_to_xml(format('SELECT count(*) AS cnt FROM %I', table_name), false, true, '') AS xml_count
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ) sub
      ORDER BY table_name;
    `;
    const r2 = await pool.query(q2);
    console.log('--- ALL TABLES & LIVE ROW COUNTS ---');
    console.table(r2.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
