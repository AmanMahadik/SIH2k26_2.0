import pg from 'pg';

async function main() {
  const pool = new pg.Pool({
    connectionString: 'postgresql://nirikshai_admin:Aicte%402006@aicte-nirikshai-db.postgres.database.azure.com:5432/nirikshai',
    ssl: { rejectUnauthorized: false }
  });
  await pool.query("ALTER TABLE inspections ADD COLUMN IF NOT EXISTS photo_url TEXT;");
  console.log('Successfully ensured photo_url column exists on inspections table!');
  await pool.end();
}

main().catch(console.error);
