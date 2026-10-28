import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

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

// POST new cryptographic audit event into Azure PostgreSQL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { actor, action, entity, payload } = body;

    if (!actor || !action || !entity) {
      return NextResponse.json(
        { success: false, error: 'actor, action, and entity are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch previous block hash
    const prevLogRes = await query('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1;');
    const prevHash = prevLogRes.rows[0]?.hash || '0000000000000000000000000000000000000000000000000000000000000000';

    // 2. Compute canonical SHA-256 block hash
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + '|' + payloadStr)
      .digest('hex');

    // 3. Insert into audit_log
    const insertRes = await query(
      `
      INSERT INTO audit_log (actor, action, entity, payload, prev_hash, hash, at)
      VALUES ($1, $2, $3, $4::jsonb, $5, $6, NOW())
      RETURNING id, actor, action, entity, payload, prev_hash, hash, at;
    `,
      [actor, action, entity, payloadStr, prevHash, eventHash]
    );

    return NextResponse.json({
      success: true,
      message: 'Audit event sealed into Azure PostgreSQL SHA-256 ledger!',
      data: insertRes.rows[0],
    });
  } catch (err: any) {
    console.error('Error inserting audit log to Azure DB:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
