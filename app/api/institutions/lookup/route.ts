import { NextResponse } from 'next/server';
import { lookupAicteInstitution, searchAicteInstitutions } from '@/lib/aicte-directory';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '8', 10);

    // 1. Autocomplete Search by Query
    if (q) {
      const results = searchAicteInstitutions(q, limit);
      return NextResponse.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    // 2. Direct ID Lookup
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Parameter "id" or "q" is required.' },
        { status: 400 }
      );
    }

    // Try AICTE Master Registry from PDF Dataset first
    const masterInst = lookupAicteInstitution(id);
    if (masterInst) {
      return NextResponse.json({
        success: true,
        found: true,
        source: 'AICTE Master Registry (APH 2024-27)',
        data: {
          aicte_id: masterInst.permanent_id,
          application_no: masterInst.application_no,
          name: masterInst.name,
          state: masterInst.state,
          university: masterInst.university,
          approved_intake: masterInst.approved_intake || 360,
          sno: masterInst.sno,
        },
      });
    }

    // Fallback: Check Live Azure PostgreSQL DB
    const dbRes = await query(
      `SELECT id, aicte_id, name, state, university FROM institutions WHERE aicte_id = $1 LIMIT 1;`,
      [id.trim()]
    );

    if (dbRes.rows.length > 0) {
      const row = dbRes.rows[0];
      return NextResponse.json({
        success: true,
        found: true,
        source: 'Azure PostgreSQL institutions',
        data: {
          aicte_id: row.aicte_id,
          name: row.name,
          state: row.state,
          university: row.university,
          approved_intake: 360,
        },
      });
    }

    return NextResponse.json({
      success: true,
      found: false,
      message: `AICTE Permanent ID "${id}" not found in AICTE Master Registry.`,
    });
  } catch (err: any) {
    console.error('Error in institution lookup:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
