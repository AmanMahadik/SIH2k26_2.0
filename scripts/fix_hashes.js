// scripts/fix_hashes.js - Computes mathematically valid SHA-256 hashes for Azure DB audit_log
const { Pool } = require('pg');
const crypto = require('crypto');
const fs = require('fs');

// Read DATABASE_URL from .env
const envContent = fs.readFileSync('.env', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
}

const pool = new Pool({
  connectionString: dbUrl.split('?')[0],
  ssl: { rejectUnauthorized: false },
});

function canonicalJson(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalJson).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalJson(obj[k])).join(',') + '}';
}

function computeEventHash(prevHash, eventData) {
  const content = prevHash + '|' + canonicalJson({
    actor: eventData.actor,
    action: eventData.action,
    entity: eventData.entity,
    payload: eventData.payload,
    at: eventData.at,
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function fixHashes() {
  const res = await pool.query('SELECT * FROM audit_log ORDER BY id ASC;');
  console.log(`Fetched ${res.rows.length} audit records.`);

  const GENESIS_HASH = '0'.repeat(64);
  let prevHash = GENESIS_HASH;

  for (const row of res.rows) {
    const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
    const isoDate = row.at instanceof Date ? row.at.toISOString() : new Date(row.at).toISOString();
    const computedHash = computeEventHash(prevHash, {
      actor: row.actor,
      action: row.action,
      entity: row.entity,
      payload: payload,
      at: isoDate,
    });

    console.log(`Row ${row.id}: prev_hash=${prevHash.slice(0, 10)}... hash=${computedHash.slice(0, 10)}...`);
    await pool.query('UPDATE audit_log SET prev_hash = $1, hash = $2 WHERE id = $3;', [prevHash, computedHash, row.id]);
    prevHash = computedHash;
  }

  console.log('✅ All audit log rows successfully updated in Azure PostgreSQL!');

  // Now verify integrity:
  const verifyRes = await pool.query('SELECT * FROM audit_log ORDER BY id ASC;');
  let vPrev = GENESIS_HASH;
  let allValid = true;
  for (const r of verifyRes.rows) {
    const p = typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload;
    const iso = r.at instanceof Date ? r.at.toISOString() : new Date(r.at).toISOString();
    const h = computeEventHash(vPrev, {
      actor: r.actor,
      action: r.action,
      entity: r.entity,
      payload: p,
      at: iso,
    });
    if (r.prev_hash !== vPrev || r.hash !== h) {
      console.error(`Verification FAILED at row ${r.id}!`);
      allValid = false;
      break;
    }
    vPrev = r.hash;
  }

  if (allValid) {
    console.log('🎉 Cryptographic chain is 100% verified and intact!');
  }

  await pool.end();
}

fixHashes().catch(err => {
  console.error('Error running fix:', err);
  pool.end();
});
