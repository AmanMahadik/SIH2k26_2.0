import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// GET all scrutiny officers from Azure PostgreSQL
export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id,
        name,
        email,
        regional_office,
        clearance_level,
        status,
        created_at
      FROM scrutiny_officers
      ORDER BY created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (err: any) {
    console.error('Error fetching scrutiny officers:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST new scrutiny officer to Azure PostgreSQL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, regional_office, clearance_level } = body;

    if (!name || !email || !regional_office) {
      return NextResponse.json(
        { success: false, error: 'Name, Email, and Regional Office are required fields.' },
        { status: 400 }
      );
    }

    const officerId = crypto.randomUUID();

    // 1. Insert into scrutiny_officers
    await query(
      `
      INSERT INTO scrutiny_officers (id, name, email, regional_office, clearance_level, status, created_at)
      VALUES ($1, $2, $3, $4, $5, 'active', NOW());
    `,
      [officerId, name, email, regional_office, clearance_level || 'L1_SCRUTINY']
    );

    // 2. Record cryptographic audit event in Azure DB
    const prevLogRes = await query('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1;');
    const prevHash = prevLogRes.rows[0]?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
    const auditPayload = {
      officer_id: officerId,
      name,
      email,
      regional_office,
      clearance_level: clearance_level || 'L1_SCRUTINY',
    };
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + JSON.stringify(auditPayload))
      .digest('hex');

    await query(
      `
      INSERT INTO audit_log (actor, action, entity, payload, prev_hash, hash, at)
      VALUES ('Admin Portal', 'OFFICER_ONBOARDED', 'scrutiny_officers', $1, $2, $3, NOW());
    `,
      [JSON.stringify(auditPayload), prevHash, eventHash]
    );

    return NextResponse.json({
      success: true,
      message: 'Scrutiny Officer successfully onboarded in Azure PostgreSQL!',
      data: {
        id: officerId,
        name,
        email,
        regional_office,
        clearance_level: clearance_level || 'L1_SCRUTINY',
        status: 'active',
      },
    });
  } catch (err: any) {
    console.error('Error inserting officer into Azure DB:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
