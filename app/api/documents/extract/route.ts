// app/api/documents/extract/route.ts - Next.js API Route for Real PDF Upload, OCR & Forensics
import { NextRequest, NextResponse } from 'next/server';
import { extractAndAnalyzePdf } from '@/lib/pdf/extractor';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function canonicalJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalJson).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(',') + '}';
}

function computeEventHash(prevHash: string, eventData: any): string {
  const content = prevHash + '|' + canonicalJson(eventData);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const applicationId = (formData.get('application_id') as string) || 'app-1';
    const actor = (formData.get('actor') as string) || 'Technical Institution Applicant';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No PDF file provided in request.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run extraction & forensics analysis
    const docId = `doc-${Date.now()}`;
    const result = await extractAndAnalyzePdf(buffer, file.name, docId);

    // Record into Azure PostgreSQL Audit Log with real hash chaining
    try {
      const lastAuditRes = await query('SELECT id, hash FROM audit_log ORDER BY id DESC LIMIT 1;');
      const lastRow = lastAuditRes.rows[0];
      const prevHash = lastRow?.hash || '0'.repeat(64);
      const at = new Date().toISOString();

      const eventData = {
        actor,
        action: 'DOC_EXTRACT_OCR',
        entity: `document:${docId}`,
        payload: {
          filename: file.name,
          sha256: result.sha256,
          page_count: result.pageCount,
          doc_type: result.docType,
          extracted_count: result.extractedFields.length,
          tamper_alerts: result.tamperIndicators.length,
        },
        at,
      };

      const newHash = computeEventHash(prevHash, eventData);

      await query(
        `INSERT INTO audit_log (actor, action, entity, payload, prev_hash, hash, at)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          eventData.actor,
          eventData.action,
          eventData.entity,
          JSON.stringify(eventData.payload),
          prevHash,
          newHash,
          at,
        ]
      );
    } catch (auditErr: any) {
      console.warn('Audit log insert warning (continuing extraction):', auditErr.message);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error('Error in /api/documents/extract:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal error parsing PDF.' },
      { status: 500 }
    );
  }
}
