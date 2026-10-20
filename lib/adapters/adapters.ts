// lib/adapters/adapters.ts - Seven-State Verification Adapter Framework
// SIH 2026 Problem Statement 26261 Requirement R6

import { DocumentItem, ExtractedField, VerifResult, VerifStatus } from '../types';

export interface VerificationAdapter {
  name: string;
  supports(docType: string): boolean;
  verify(doc: DocumentItem, fields: ExtractedField[], options?: { simulateFault?: boolean }): Promise<VerifResult>;
}

/**
 * Mock Issuing Authority Adapter (DigiLocker / State DTE / University Portal)
 */
export class MockIssuerAdapter implements VerificationAdapter {
  name = 'mock_issuer';

  supports(docType: string): boolean {
    return ['noc_state', 'affidavit', 'accreditation_cert', 'eoa_letter'].includes(docType);
  }

  async verify(doc: DocumentItem, fields: ExtractedField[], options?: { simulateFault?: boolean }): Promise<VerifResult> {
    const timestamp = new Date().toISOString();

    // Fault injection for demonstration of fail-safe degradation
    if (options?.simulateFault || doc.filename.includes('fault') || doc.filename.includes('unavail')) {
      return {
        status: 'source_unavailable',
        source: 'mock_issuer',
        timestamp,
        request_ref: `REQ-ERR-${Date.now()}`,
        comparison: [],
        notes: 'Remote issuer endpoint timed out (HTTP 504 Gateway Timeout). Scheduled for backoff retry.',
      };
    }

    // Inspect fields for simulated outcomes
    const validToField = fields.find(f => f.field_key === 'valid_to');
    if (validToField && new Date(validToField.value) < new Date('2026-06-01')) {
      return {
        status: 'expired',
        source: 'mock_issuer',
        timestamp,
        request_ref: `REQ-EXP-${Date.now()}`,
        comparison: [
          {
            field_key: 'valid_to',
            submitted_value: validToField.value,
            source_value: validToField.value,
            match: false,
          },
        ],
        notes: 'Document expired in official issuer database.',
      };
    }

    const nameField = fields.find(f => f.field_key === 'institution_name');
    if (nameField && nameField.value.includes('Technology') && !nameField.value.includes('Science')) {
      // Check if this is the discrepancy test case
      if (doc.filename.includes('mismatch') || doc.application_id.includes('bbbb')) {
        return {
          status: 'mismatch_detected',
          source: 'mock_issuer',
          timestamp,
          request_ref: `REQ-MIS-${Date.now()}`,
          comparison: [
            {
              field_key: 'institution_name',
              submitted_value: nameField.value,
              source_value: 'Delhi Institute of Engineering',
              match: false,
            },
          ],
          notes: 'Issuer registry returned legal title mismatch.',
        };
      }
    }

    // Default clean verified
    return {
      status: 'verified',
      source: 'mock_issuer',
      timestamp,
      request_ref: `REQ-VER-${Date.now().toString().slice(-6)}`,
      comparison: fields.map(f => ({
        field_key: f.field_key,
        submitted_value: f.value,
        source_value: f.value,
        match: true,
      })),
      notes: 'Cryptographically verified with issuing registry.',
    };
  }
}

/**
 * Seven-State Verification State Machine Resolver
 * Implements retry backoff and fail-safe routing to MANUAL_REVIEW_REQUIRED
 */
export function transitionVerificationStatus(
  currentStatus: VerifStatus,
  action: 'retry' | 'fail_timeout' | 'officer_override' | 'issuer_response',
  newStatus?: VerifStatus
): VerifStatus {
  switch (action) {
    case 'issuer_response':
      return newStatus || 'verification_pending';
    case 'retry':
      return 'verification_pending';
    case 'fail_timeout':
      // Source unavailable that exceeds retries escalates to manual review
      return 'manual_review_required';
    case 'officer_override':
      return newStatus || 'manual_review_required';
    default:
      return currentStatus;
  }
}
