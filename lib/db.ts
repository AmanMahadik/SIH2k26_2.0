// lib/db.ts - Connection Pool for Azure Database for PostgreSQL (Flexible Server)
import { Pool } from 'pg';

let poolInstance: Pool | null = null;

export function getPool(): Pool {
  if (!poolInstance) {
    const rawUrl = process.env.DATABASE_URL || '';
    // Strip query parameters like ?sslmode=require that can conflict with pg SSL options
    const connectionString = rawUrl.includes('?') ? rawUrl.split('?')[0] : rawUrl;

    poolInstance = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    poolInstance.on('error', (err) => {
      console.error('Unexpected Azure PostgreSQL pool error:', err);
    });
  }
  return poolInstance;
}

export const pool = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
  connect: () => getPool().connect(),
};

export async function query(text: string, params?: any[]) {
  const p = getPool();
  const start = Date.now();
  const res = await p.query(text, params);
  return res;
}
