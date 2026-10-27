import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        a.id,
        a.institution_id,
        a.category,
        a.academic_year,
        a.status,
        a.priority,
        a.created_by,
        a.submitted_at,
        i.name AS institution_name,
        i.aicte_id,
        i.state,
        i.university,
        COUNT(f.id) FILTER (WHERE f.status = 'open')::int AS deficiencies_count
      FROM applications a
      LEFT JOIN institutions i ON a.institution_id = i.id
      LEFT JOIN findings f ON a.id = f.application_id
      GROUP BY a.id, i.name, i.aicte_id, i.state, i.university
      ORDER BY a.priority DESC, a.submitted_at DESC;
    `);

    // Map rows to UI friendly shape
    const formatted = res.rows.map((row: any, index: number) => {
      // Map to caseId (app-1..app-4) for compatibility with existing dynamic routes
      let caseId = 'app-1';
      if (row.id.startsWith('b0000002')) caseId = 'app-2';
      else if (row.id.startsWith('c0000003')) caseId = 'app-3';
      else if (row.id.startsWith('d0000004')) caseId = 'app-4';
      else caseId = `app-${(index % 4) + 1}`;

      // Display application code
      const displayId = `EA-${row.academic_year?.split('-')[0] || '2026'}-045${4 - index}`;

      let statusLabel = 'Under Review';
      let statusColor = 'bg-blue-50 text-[#1D4E9E] border-blue-200';

      if (row.deficiencies_count > 0 || row.priority >= 85) {
        statusLabel = 'Needs Clarification';
        statusColor = 'bg-orange-50 text-[#E8801A] border-orange-200';
      } else if (row.status === 'approved' || row.status === 'verified') {
        statusLabel = 'Verified';
        statusColor = 'bg-emerald-50 text-[#1E7B34] border-emerald-200';
      } else if (row.status === 'rejected') {
        statusLabel = 'Rejected';
        statusColor = 'bg-rose-50 text-[#B42318] border-rose-200';
      } else if (row.status === 'submitted') {
        statusLabel = 'Submitted';
        statusColor = 'bg-slate-50 text-slate-700 border-slate-200';
      }

      const dateObj = row.submitted_at ? new Date(row.submitted_at) : new Date();
      const submittedOn = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      return {
        id: displayId,
        rawId: row.id,
        institution: row.institution_name,
        aicteId: row.aicte_id,
        state: row.state,
        university: row.university,
        submittedOn,
        status: statusLabel,
        statusColor,
        caseId,
        category: row.category === 'EOA_EXISTING' ? 'Extension of Approval' : row.category,
        deficiencies: row.deficiencies_count || 0,
        priority: row.priority,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching applications from Azure DB:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// POST: Submit or update an EoA application from the Institution Portal
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      aicte_id,
      institution_name,
      category = 'EOA_EXISTING',
      academic_year = '2026-27',
      documents = [],
      status = 'submitted',
    } = body;

    // Check if institution exists in Azure DB; if not, find or create
    let instId = null;
    const instCheck = await query('SELECT id FROM institutions WHERE aicte_id = $1 LIMIT 1;', [aicte_id || '1-10972348121']);
    if (instCheck.rows.length > 0) {
      instId = instCheck.rows[0].id;
    } else {
      instId = crypto.randomUUID();
      await query(
        `INSERT INTO institutions (id, aicte_id, name, state, university) VALUES ($1, $2, $3, $4, $5);`,
        [instId, aicte_id || '1-10972348121', institution_name || 'Pune Institute of Computer Technology', 'Maharashtra', 'Savitribai Phule Pune University']
      );
    }

    const appId = crypto.randomUUID();
    const displayRef = `AICTE/${academic_year}/WZ/${(aicte_id || '1-5592509').replace(/[^a-zA-Z0-9]/g, '')}/${Math.floor(1000 + Math.random() * 9000)}`;

    await query(
      `INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
       VALUES ($1, $2, $3, $4, $5, 20, $6, NOW());`,
      [appId, instId, category, academic_year, status, `inst_${(aicte_id || 'pict').replace(/[^a-zA-Z0-9]/g, '_')}`]
    );

    // Cryptographic audit log entry
    const prevLogRes = await query('SELECT hash FROM audit_log ORDER BY id DESC LIMIT 1;');
    const prevHash = prevLogRes.rows[0]?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
    const auditPayload = {
      application_id: appId,
      reference_no: displayRef,
      aicte_id,
      institution_name,
      documents_count: documents.length,
      category,
      academic_year,
      status,
    };
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + JSON.stringify(auditPayload))
      .digest('hex');

    await query(
      `INSERT INTO audit_log (actor, action, entity, payload, prev_hash, hash, at)
       VALUES ('Institution Portal', 'APPLICATION_SUBMITTED', 'applications', $1, $2, $3, NOW());`,
      [JSON.stringify(auditPayload), prevHash, eventHash]
    );

    return NextResponse.json({
      success: true,
      message: 'Application successfully registered in AICTE Central Scrutiny Queue!',
      data: {
        id: appId,
        reference_no: displayRef,
        hash: eventHash,
        status: 'SUBMITTED / PENDING SCRUTINY OFFICER CLEARANCE',
        submitted_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Error submitting application to Azure DB:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
