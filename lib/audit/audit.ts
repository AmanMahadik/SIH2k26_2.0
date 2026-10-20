// lib/audit/audit.ts - Hash-Chained Regulatory Audit Logger
// Computes SHA-256(prev_hash + canonical_json(event))

import crypto from 'crypto';
import { AuditEvent } from '../types';

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Returns a canonical deterministic JSON string with sorted keys
 */
export function canonicalJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJson).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(',') + '}';
}

/**
 * Computes SHA-256 hash for an event chained to prev_hash
 */
export function computeEventHash(prevHash: string, eventData: {
  actor: string;
  action: string;
  entity: string;
  payload: any;
  at: string;
}): string {
  const content = prevHash + '|' + canonicalJson({
    actor: eventData.actor,
    action: eventData.action,
    entity: eventData.entity,
    payload: eventData.payload,
    at: eventData.at,
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validates the cryptographic integrity of the entire audit chain
 */
export function verifyAuditChain(chain: AuditEvent[]): {
  valid: boolean;
  brokenIndex?: number;
  brokenEventId?: number;
  expectedHash?: string;
  actualHash?: string;
  error?: string;
} {
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
        error: `Broken link at event #${current.id}: prev_hash does not match preceding block's hash.`,
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
        error: `Payload tampering detected at event #${current.id}: block hash does not match computed digest.`,
      };
    }
  }

  return { valid: true };
}
