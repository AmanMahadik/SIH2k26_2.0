import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        a.id,
        a.application_id,
        a.type,
        a.to_role,
        a.message,
        a.sent_at,
        a.acknowledged_by,
        app.academic_year,
        app.priority,
        inst.name as institution_name,
        inst.aicte_id,
        inst.state
      FROM alerts a
      LEFT JOIN applications app ON a.application_id = app.id
      LEFT JOIN institutions inst ON app.institution_id = inst.id
      ORDER BY a.sent_at DESC;
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

// POST: Acknowledge or resolve an alert with SHA-256 audit trail
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { alert_id, action_type, resolution_notes, actor } = body;

    if (!alert_id) {
      return NextResponse.json({ success: false, error: 'alert_id is required.' }, { status: 400 });
    }

    const officer = actor || 'Dr. Priya Sharma (WRO)';

    // 1. Update alert in Azure PostgreSQL
    await query(
      `UPDATE alerts SET acknowledged_by = $1 WHERE id = $2;`,
      [officer, alert_id]
    );

    // 2. Chain event into audit_log with SHA-256
    const prevLogRes = await query('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1;');
    const prevHash = prevLogRes.rows[0]?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
    const auditPayload = {
      alert_id,
      action: action_type || 'ALERT_RESOLVED_MOBILE',
      notes: resolution_notes || 'Deficiency resolved via on-site corrective resubmission.',
      officer,
      resolved_at: new Date().toISOString(),
    };
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + '|' + JSON.stringify(auditPayload))
      .digest('hex');

    await query(
      `
      INSERT INTO audit_log (actor, action, entity, payload, prev_hash, hash, at)
      VALUES ($1, 'ALERT_RESOLVED', 'alerts', $2::jsonb, $3, $4, NOW());
    `,
      [officer, JSON.stringify(auditPayload), prevHash, eventHash]
    );

    return NextResponse.json({
      success: true,
      message: 'Alert resolved and cryptographically sealed into Azure PostgreSQL!',
      data: {
        alert_id,
        status: 'resolved',
        acknowledged_by: officer,
        audit_hash: eventHash,
      },
    });
  } catch (err: any) {
    console.error('Error resolving alert in Azure DB:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
