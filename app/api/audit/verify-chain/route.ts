import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOG } from '@/lib/supabase';
import { verifyAuditChain } from '@/lib/audit/audit';

export async function GET() {
  const result = verifyAuditChain(INITIAL_AUDIT_LOG);
  return NextResponse.json({
    success: true,
    ...result,
  });
}
