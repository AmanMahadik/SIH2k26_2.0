import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
