// packages/ledger/src/verify.ts
import { AuditEvent } from '@nirikshai/shared-types';
import { computeEventHash, GENESIS_HASH } from './chain';

export interface ChainVerificationReport {
  valid: boolean;
  brokenIndex?: number;
  brokenEventId?: number;
  expectedHash?: string;
  actualHash?: string;
  error?: string;
}

/**
 * Validates cryptographic continuity and tamper-freedom of an audit ledger
 */
export function verifyAuditChain(chain: AuditEvent[]): ChainVerificationReport {
  if (!chain || chain.length === 0) {
    return { valid: true };
  }

  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];
    const prevHash = i === 0 ? GENESIS_HASH : chain[i - 1].hash;

    if (current.prev_hash !== prevHash) {
      return {
        valid: false,
        brokenIndex: i,
        brokenEventId: current.id,
        expectedHash: prevHash,
        actualHash: current.prev_hash,
        error: `Broken link at event #${current.id}: prev_hash does not match preceding block hash.`,
      };
    }

    const computed = computeEventHash(prevHash, {
      actor: current.actor,
      action: current.action,
      entity: current.entity,
      payload: current.payload,
      at: current.at,
    });

    if (current.hash !== computed) {
      return {
        valid: false,
        brokenIndex: i,
        brokenEventId: current.id,
        expectedHash: computed,
        actualHash: current.hash,
        error: `Payload tampering detected at event #${current.id}: hash digest mismatch.`,
      };
    }
  }

  return { valid: true };
}
