const { Pool } = require('pg');
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) dbUrl = line.substring(13).trim();
}
const pool = new Pool({ connectionString: dbUrl.split('?')[0], ssl: { rejectUnauthorized: false } });

async function testAll() {
  try {
    const statsRes = await pool.query(`
      SELECT
        COUNT(*)::int AS total_applications,
        COUNT(*) FILTER (WHERE status::text IN ('submitted', 'in_review'))::int AS pending,
        COUNT(*) FILTER (WHERE priority < 50)::int AS verified,
        COUNT(*) FILTER (WHERE priority >= 70)::int AS needs_review,
        COUNT(*) FILTER (WHERE status::text = 'closed')::int AS rejected
      FROM applications;
    `);
    console.log('STATS:', statsRes.rows[0]);

    const instsRes = await pool.query('SELECT name, aicte_id, state FROM institutions;');
    console.log('INSTITUTIONS:', instsRes.rows);

    const officersRes = await pool.query('SELECT name, email, regional_office, clearance_level FROM scrutiny_officers;');
    console.log('OFFICERS:', officersRes.rows);

    const auditRes = await pool.query('SELECT id, actor, action, entity, at FROM audit_log ORDER BY id DESC LIMIT 5;');
    console.log('AUDIT LOGS:', auditRes.rows);
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await pool.end();
  }
}

testAll();
