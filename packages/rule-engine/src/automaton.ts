// packages/rule-engine/src/automaton.ts
// 7-State Verification State Machine
// Governed by AICTE Approval Process Handbook (APH) verification requirements

import { VerifStatus } from '@nirikshai/shared-types';

export type AutomatonAction =
  | 'submit'
  | 'issuer_verified'
  | 'issuer_mismatch'
  | 'issuer_expired'
  | 'issuer_timeout'
  | 'retry'
  | 'officer_override'
  | 'officer_clear'
  | 'manual_escalate';

export const VERIFICATION_STATES: VerifStatus[] = [
  'verification_pending',
  'verified',
  'mismatch_detected',
  'expired',
  'source_unavailable',
  'manual_review_required',
  'unsupported',
];

/**
 * Deterministic transition automaton for regulatory verification state transitions
 */
export function transitionState(
  currentState: VerifStatus,
  action: AutomatonAction,
  context?: { retryCount?: number; maxRetries?: number; reason?: string }
): VerifStatus {
  const retries = context?.retryCount ?? 0;
  const maxRetries = context?.maxRetries ?? 3;

  switch (action) {
    case 'submit':
      return 'verification_pending';

    case 'issuer_verified':
      return 'verified';

    case 'issuer_mismatch':
      return 'mismatch_detected';

    case 'issuer_expired':
      return 'expired';

    case 'issuer_timeout':
      if (retries >= maxRetries) {
        return 'manual_review_required';
      }
      return 'source_unavailable';

    case 'retry':
      return 'verification_pending';

    case 'officer_override':
    case 'officer_clear':
      return 'verified';

    case 'manual_escalate':
      return 'manual_review_required';

    default:
      return currentState;
  }
}

/**
 * Returns true if the state requires human scrutiny / intervention
 */
export function isHumanInterventionRequired(status: VerifStatus): boolean {
  return ['mismatch_detected', 'expired', 'manual_review_required'].includes(status);
}

/**
 * Returns true if the state is final and successfully verified
 */
export function isTerminalCompliant(status: VerifStatus): boolean {
  return status === 'verified';
}
