import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id,
        application_id,
        type,
        to_role,
        message,
        sent_at
      FROM alerts
      ORDER BY sent_at DESC;
    `);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (err: any) {
    console.error('Error fetching alerts from Azure DB:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
