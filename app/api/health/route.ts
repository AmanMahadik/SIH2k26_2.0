// app/api/health/route.ts
// Phase 5: Production Health Check Endpoint

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'DISCONNECTED';
  let dbLatency = -1;

  try {
    const dbRes = await query('SELECT 1 as ping;');
    if (dbRes && dbRes.rows && dbRes.rows[0]?.ping === 1) {
      dbStatus = 'CONNECTED';
      dbLatency = Date.now() - startTime;
    }
  } catch (err: any) {
    dbStatus = `ERROR: ${err.message}`;
  }

  const isHealthy = dbStatus === 'CONNECTED';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'NirikshAI 2.0 API & Scrutiny Engine',
      version: '2.0.0-PROD',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      database: {
        provider: 'Azure Database for PostgreSQL (Flexible Server, Central India)',
        status: dbStatus,
        latencyMs: dbLatency,
      },
      statutoryCompliance: {
        aicteAphStandard: 'APH 2024-27 §4.2.3',
        evidenceStandard: 'Section 65B Indian Evidence Act (Hardware Attested)',
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
