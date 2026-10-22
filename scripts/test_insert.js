const { Client } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
}

// Remove sslmode query param from URL and specify ssl explicitly in config
const cleanUrl = dbUrl.split('?')[0];

const client = new Client({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false }
});

client.on('error', (err) => {
  console.error('Client background error:', err.message);
});

async function run() {
  await client.connect();
  console.log('Connected successfully!');
  
  try {
    const res = await client.query('SELECT count(*) FROM institutions;');
    console.log('Institutions count:', res.rows[0].count);
    
    // Test inserting 1 document
    const docRes = await client.query(`
      INSERT INTO documents (id, application_id, doc_type, filename, storage_path, sha256, page_count, analysis_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING
      RETURNING id;
    `, [
      '10100000-0000-0000-0000-000000000101',
      'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'eoa_letter',
      'AICTE_EoA_Letter_2025_26.pdf',
      'eoa_letters/pict_eoa.pdf',
      '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394',
      2,
      'completed'
    ]);
    console.log('Inserted doc:', docRes.rows);
  } catch (e) {
    console.error('Query error:', e.message);
  } finally {
    await client.end();
  }
}

run();
