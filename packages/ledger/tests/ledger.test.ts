import test from 'node:test';
import assert from 'node:assert';
import { canonicalJson } from '../src/canonicalJson';
import { computeEventHash, GENESIS_HASH } from '../src/chain';
import { verifyAuditChain } from '../src/verify';

test('canonicalJson sorts keys alphabetically regardless of input order', () => {
  const obj1 = { b: 2, a: 1, c: { z: 26, y: 25 } };
  const obj2 = { a: 1, c: { y: 25, z: 26 }, b: 2 };
  assert.strictEqual(canonicalJson(obj1), canonicalJson(obj2));
});

test('verifyAuditChain validates untampered hash chain', () => {
  const event1Data = {
    actor: 'admin@aicte.gov.in',
    action: 'INIT',
    entity: 'SYSTEM',
    payload: { genesis: true },
    at: '2026-04-01T00:00:00Z',
  };
  const hash1 = computeEventHash(GENESIS_HASH, event1Data);
  const block1 = { id: 1, prev_hash: GENESIS_HASH, hash: hash1, ...event1Data };

  const event2Data = {
    actor: 'scrutiny@aicte.gov.in',
    action: 'VERIFY_DOC',
    entity: 'APP-2026-001',
    payload: { doc_type: 'affidavit', status: 'verified' },
    at: '2026-04-01T00:05:00Z',
  };
  const hash2 = computeEventHash(hash1, event2Data);
  const block2 = { id: 2, prev_hash: hash1, hash: hash2, ...event2Data };

  const report = verifyAuditChain([block1, block2]);
  assert.strictEqual(report.valid, true);
});

test('verifyAuditChain detects payload tampering', () => {
  const event1Data = {
    actor: 'admin@aicte.gov.in',
    action: 'INIT',
    entity: 'SYSTEM',
    payload: { genesis: true },
    at: '2026-04-01T00:00:00Z',
  };
  const hash1 = computeEventHash(GENESIS_HASH, event1Data);
  const block1 = { id: 1, prev_hash: GENESIS_HASH, hash: hash1, ...event1Data };

  // Tamper with payload
  const tamperedBlock = { ...block1, payload: { genesis: false } };

  const report = verifyAuditChain([tamperedBlock]);
  assert.strictEqual(report.valid, false);
  assert.match(report.error || '', /tampering detected/i);
});
