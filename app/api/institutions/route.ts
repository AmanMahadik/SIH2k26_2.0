import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// GET all institutions from Azure PostgreSQL
export async function GET() {
  try {
    const res = await query(`
      SELECT 
        i.id,
        i.aicte_id,
        i.name,
        i.state,
        i.university,
        i.created_at,
        r.payload AS records,
        COUNT(a.id)::int AS applications_count
      FROM institutions i
      LEFT JOIN institution_records r ON i.id = r.institution_id
      LEFT JOIN applications a ON i.id = a.institution_id
      GROUP BY i.id, i.aicte_id, i.name, i.state, i.university, i.created_at, r.payload
      ORDER BY i.created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      data: res.rows,
    });
  } catch (err: any) {
    console.error('Error fetching institutions:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST new institution to Azure PostgreSQL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, aicte_id, state, university, approved_intake } = body;

    if (!name || !aicte_id || !state) {
      return NextResponse.json(
        { success: false, error: 'Name, AICTE ID, and State are required fields.' },
        { status: 400 }
      );
    }

    const instId = crypto.randomUUID();
    const appId = crypto.randomUUID();

    // 1. Insert into institutions
    await query(
      `
      INSERT INTO institutions (id, aicte_id, name, state, university)
      VALUES ($1, $2, $3, $4, $5);
    `,
      [instId, aicte_id, name, state, university || 'State Technical University']
    );

    // 2. Insert into institution_records
    await query(
      `
      INSERT INTO institution_records (institution_id, record_type, payload)
      VALUES ($1, 'records', $2);
    `,
      [
        instId,
        JSON.stringify({
          aicte_id,
          approved_intake: approved_intake || '300',
          ter_status: 'paid',
          deficiency_status: 'clear',
        }),
      ]
    );

    // 3. Create initial application for cycle 2026-27
    await query(
      `
      INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
      VALUES ($1, $2, 'EOA_EXISTING', '2026-27', 'submitted', 20, $3, NOW());
    `,
      [appId, instId, `inst_${aicte_id.replace(/[^a-zA-Z0-9]/g, '_')}`]
    );

    // 4. Record cryptographic audit event in Azure DB
    const prevLogRes = await query('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1;');
    const prevHash = prevLogRes.rows[0]?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
    const auditPayload = {
      institution_id: instId,
      name,
      aicte_id,
      state,
      approved_intake: approved_intake || '300',
    };
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + JSON.stringify(auditPayload))
      .digest('hex');

    await query(
      `
      INSERT INTO audit_log (actor, action, entity, payload, prev_hash, hash, at)
      VALUES ('Admin Portal', 'INSTITUTION_REGISTERED', 'institutions', $1, $2, $3, NOW());
    `,
      [JSON.stringify(auditPayload), prevHash, eventHash]
    );

    return NextResponse.json({
      success: true,
      message: 'Institution successfully registered in Azure PostgreSQL!',
      data: {
        id: instId,
        aicte_id,
        name,
        state,
        university,
      },
    });
  } catch (err: any) {
    console.error('Error inserting institution into Azure DB:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
