// packages/db/src/pool.ts
import { Pool, QueryResult } from 'pg';

let poolInstance: Pool | null = null;

export function getPool(): Pool {
  if (!poolInstance) {
    const rawUrl = process.env.DATABASE_URL || '';
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
      console.error('[NirikshAI DB Pool] Unexpected client error:', err);
    });
  }
  return poolInstance;
}

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const p = getPool();
  return p.query<T>(text, params);
}
