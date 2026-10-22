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
    SELECT 
      a.id,
      a.institution_id,
      a.category,
      a.academic_year,
      a.status,
      a.priority,
      a.created_by,
      a.submitted_at,
      i.name AS institution_name,
      i.aicte_id,
      i.state,
      i.university,
      COUNT(f.id) FILTER (WHERE f.status = 'open')::int AS deficiencies_count
    FROM applications a
    LEFT JOIN institutions i ON a.institution_id = i.id
    LEFT JOIN findings f ON a.id = f.application_id
    GROUP BY a.id, i.name, i.aicte_id, i.state, i.university
    ORDER BY a.priority DESC, a.submitted_at DESC;
  `);
  console.log('Applications joined rows:', res.rows.length);
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}
check();
