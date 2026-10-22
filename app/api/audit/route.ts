import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id,
        actor,
        action,
        entity,
        payload,
        prev_hash,
        hash,
        at
      FROM audit_log
      ORDER BY id DESC;
    `);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (err: any) {
    console.error('Error fetching audit logs:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
