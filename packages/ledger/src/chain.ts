// packages/ledger/src/chain.ts
import crypto from 'crypto';
import { canonicalJson } from './canonicalJson';

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export interface AuditBlockPayload {
  actor: string;
  action: string;
  entity: string;
  payload: any;
  at: string;
}

/**
 * Computes deterministic SHA-256 hash for a block linked to prev_hash
 */
export function computeEventHash(prevHash: string, eventData: AuditBlockPayload): string {
  const content = prevHash + '|' + canonicalJson({
    actor: eventData.actor,
    action: eventData.action,
    entity: eventData.entity,
    payload: eventData.payload,
    at: eventData.at,
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}
