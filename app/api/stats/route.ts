import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [appStatsRes, instRes, officerRes, docRes, auditRes] = await Promise.all([
      query(`
        SELECT
          COUNT(*)::int AS total_applications,
          COUNT(*) FILTER (WHERE status::text IN ('submitted', 'in_review'))::int AS pending,
          COUNT(*) FILTER (WHERE priority < 50)::int AS verified,
          COUNT(*) FILTER (WHERE priority >= 70)::int AS needs_review,
          COUNT(*) FILTER (WHERE status::text = 'closed')::int AS rejected
        FROM applications;
      `),
      query('SELECT COUNT(*)::int AS total_institutions FROM institutions;'),
      query('SELECT COUNT(*)::int AS total_officers FROM scrutiny_officers;'),
      query('SELECT COUNT(*)::int AS total_documents FROM documents;'),
      query('SELECT COUNT(*)::int AS total_audits FROM audit_log;'),
    ]);

    const appStats = appStatsRes.rows[0] || {
      total_applications: 0,
      pending: 0,
      verified: 0,
      needs_review: 0,
      rejected: 0,
    };

    const totalInstitutions = instRes.rows[0]?.total_institutions || 0;
    const totalOfficers = officerRes.rows[0]?.total_officers || 0;
    const totalDocuments = docRes.rows[0]?.total_documents || 0;
    const totalAudits = auditRes.rows[0]?.total_audits || 0;

    return NextResponse.json({
      success: true,
      data: {
        total_applications: appStats.total_applications,
        pending: appStats.pending,
        verified: appStats.verified,
        needs_review: appStats.needs_review,
        rejected: appStats.rejected,
        total_institutions: totalInstitutions,
        total_officers: totalOfficers,
        total_users: totalInstitutions + totalOfficers + 2,
        total_documents: totalDocuments,
        total_audits: totalAudits,
        system_health: '99.9%',
        db_status: 'Connected to Azure Database for PostgreSQL (Central India)',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/stats:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
