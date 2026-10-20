import { NextResponse } from 'next/server';
import { INITIAL_APPLICATIONS } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_APPLICATIONS,
  });
}
