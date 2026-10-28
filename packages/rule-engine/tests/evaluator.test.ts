import test from 'node:test';
import assert from 'node:assert';
import { transitionState } from '../src/automaton';
import { stringSimilarity } from '../src/operators/crossFieldEqual';

test('stringSimilarity returns 1.0 for identical strings', () => {
  assert.strictEqual(stringSimilarity('AICTE Technical Campus', 'AICTE Technical Campus'), 1.0);
});

test('stringSimilarity normalizes whitespace and punctuation', () => {
  assert.strictEqual(stringSimilarity('Apex Institute, Pune', 'Apex Institute Pune'), 1.0);
});

test('transitionState moves to verification_pending on submit', () => {
  const next = transitionState('unsupported', 'submit');
  assert.strictEqual(next, 'verification_pending');
});

test('transitionState handles retries and timeout escalation', () => {
  const retry1 = transitionState('source_unavailable', 'issuer_timeout', { retryCount: 1, maxRetries: 3 });
  assert.strictEqual(retry1, 'source_unavailable');

  const escalated = transitionState('source_unavailable', 'issuer_timeout', { retryCount: 3, maxRetries: 3 });
  assert.strictEqual(escalated, 'manual_review_required');
});
