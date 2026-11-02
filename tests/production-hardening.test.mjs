import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// -----------------------------------------------------------------------------
// 1. HAVERSINE DISTANCE UNIT TESTS
// -----------------------------------------------------------------------------
function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

test('Haversine: Identical coordinates yield 0.0 meters', () => {
  const dist = haversineMeters(18.675620, 73.896710, 18.675620, 73.896710);
  assert.equal(dist, 0);
});

test('Haversine: MITAOE Computer Center to Robotics Lab is ~30m', () => {
  const dist = haversineMeters(18.675620, 73.896710, 18.675810, 73.896920);
  assert.ok(dist >= 25 && dist <= 35, `Distance was ${dist}m, expected 25-35m`);
});

test('Haversine: Equator 1-degree longitude difference is ~111.3km', () => {
  const dist = haversineMeters(0, 0, 0, 1);
  assert.ok(dist >= 111000 && dist <= 112000, `Equator degree was ${dist}m`);
});

test('Haversine: Pole crossing North (90, 0) to South (-90, 0) is half circumference (~20,015km)', () => {
  const dist = haversineMeters(90, 0, -90, 0);
  assert.ok(dist >= 20000000 && dist <= 20030000, `Pole crossing was ${dist}m`);
});

// -----------------------------------------------------------------------------
// 2. GEOFENCE STATUS WITH HYSTERESIS & ACCURACY-AWARE THRESHOLDS
// -----------------------------------------------------------------------------
function evaluateGeofence(distance, accuracy, radius, previousStatus = null) {
  const HYSTERESIS = 5.0; // 5 meters buffer

  if (previousStatus === 'INSIDE') {
    if (distance > radius + HYSTERESIS) {
      return distance - accuracy > radius ? 'OUTSIDE' : 'UNCERTAIN';
    }
    return 'INSIDE';
  }

  if (previousStatus === 'OUTSIDE') {
    if (distance <= radius - HYSTERESIS) {
      return 'INSIDE';
    }
    return distance - accuracy > radius ? 'OUTSIDE' : 'UNCERTAIN';
  }

  // Initial fix without prior history
  if (distance <= radius) {
    return 'INSIDE';
  } else if (distance - accuracy > radius) {
    return 'OUTSIDE';
  } else {
    return 'UNCERTAIN';
  }
}

test('Geofence: Inside statutory radius (12m <= 35m) returns INSIDE (GREEN)', () => {
  const status = evaluateGeofence(12.0, 2.0, 35.0);
  assert.equal(status, 'INSIDE');
});

test('Geofence: Far outside radius (140m with 3m acc > 35m) returns OUTSIDE (RED)', () => {
  const status = evaluateGeofence(140.0, 3.0, 35.0);
  assert.equal(status, 'OUTSIDE');
});

test('Geofence: Error ellipse spans boundary (38m with 10m acc, radius 35m) returns UNCERTAIN (AMBER)', () => {
  const status = evaluateGeofence(38.0, 10.0, 35.0);
  assert.equal(status, 'UNCERTAIN');
});

test('Geofence: 5m hysteresis prevents flickering when transitioning outside', () => {
  // Officer is currently INSIDE
  let status = evaluateGeofence(34.0, 2.0, 35.0, 'INSIDE');
  assert.equal(status, 'INSIDE');

  // Steps just beyond boundary to 37m (within 35 + 5m hysteresis)
  status = evaluateGeofence(37.0, 2.0, 35.0, 'INSIDE');
  assert.equal(status, 'INSIDE', 'Should remain INSIDE due to 5m hysteresis');

  // Steps to 42m (beyond 35 + 5m hysteresis)
  status = evaluateGeofence(42.0, 2.0, 35.0, 'INSIDE');
  assert.equal(status, 'OUTSIDE');
});

// -----------------------------------------------------------------------------
// 3. BLOCKCHAIN AUDIT LOG HASH CHAIN INTEGRITY TESTS (Section 65B)
// -----------------------------------------------------------------------------
function computeBlockHash(prevHash, canonicalEvent) {
  const data = prevHash + JSON.stringify(canonicalEvent);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function verifyAuditChain(blocks) {
  for (let i = 1; i < blocks.length; i++) {
    const prev = blocks[i - 1];
    const curr = blocks[i];
    if (curr.prevHash !== prev.hash) {
      return { valid: false, brokenIndex: i, reason: 'Broken prevHash linkage' };
    }
    const expectedHash = computeBlockHash(curr.prevHash, curr.event);
    if (curr.hash !== expectedHash) {
      return { valid: false, brokenIndex: i, reason: 'Mutated event payload' };
    }
  }
  return { valid: true, length: blocks.length };
}

test('Hash Chain: Valid genesis and consecutive sealed blocks verify cleanly', () => {
  const genesis = {
    id: 1,
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    event: { type: 'GENESIS', timestamp: '2026-10-01T00:00:00Z' },
  };
  genesis.hash = computeBlockHash(genesis.prevHash, genesis.event);

  const block2 = {
    id: 2,
    prevHash: genesis.hash,
    event: { type: 'EVC_INSPECTION_SUBMITTED', labId: 'lab-comp-center', officer: 'Dr. Priya Sharma' },
  };
  block2.hash = computeBlockHash(block2.prevHash, block2.event);

  const block3 = {
    id: 3,
    prevHash: block2.hash,
    event: { type: 'EVC_INSPECTION_APPROVED', labId: 'lab-comp-center', decisionBy: 'Super Admin' },
  };
  block3.hash = computeBlockHash(block3.prevHash, block3.event);

  const chain = [genesis, block2, block3];
  const res = verifyAuditChain(chain);
  assert.equal(res.valid, true);
  assert.equal(res.length, 3);
});

test('Hash Chain: Mutating a single character in a sealed block fails verification immediately', () => {
  const genesis = {
    id: 1,
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    event: { type: 'GENESIS', timestamp: '2026-10-01T00:00:00Z' },
  };
  genesis.hash = computeBlockHash(genesis.prevHash, genesis.event);

  const block2 = {
    id: 2,
    prevHash: genesis.hash,
    event: { type: 'EVC_INSPECTION_SUBMITTED', labId: 'lab-comp-center', officer: 'Dr. Priya Sharma' },
  };
  block2.hash = computeBlockHash(block2.prevHash, block2.event);

  // Attacker tampers with officer name in block2
  block2.event.officer = 'Imposter Attacker';

  const chain = [genesis, block2];
  const res = verifyAuditChain(chain);
  assert.equal(res.valid, false);
  assert.equal(res.brokenIndex, 1);
});

// -----------------------------------------------------------------------------
// 4. UPLOAD QUEUE IDEMPOTENCY TEST
// -----------------------------------------------------------------------------
class MockInspectionQueue {
  constructor() {
    this.items = new Map();
  }

  enqueue(capture) {
    if (this.items.has(capture.imageHash)) {
      return { inserted: false, item: this.items.get(capture.imageHash), status: 'DUPLICATE_IGNORED' };
    }
    const record = { ...capture, status: 'QUEUED', queuedAt: new Date().toISOString() };
    this.items.set(capture.imageHash, record);
    return { inserted: true, item: record, status: 'ENQUEUED' };
  }

  size() {
    return this.items.size;
  }
}

test('Upload Queue: Duplicate submission with identical SHA-256 is idempotent', () => {
  const queue = new MockInspectionQueue();
  const capture1 = {
    imageHash: '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394',
    labId: 'lab-comp-center',
    lat: 18.675620,
    lng: 73.896710,
    timestamp: '2026-10-31T09:15:30Z',
  };

  const res1 = queue.enqueue(capture1);
  assert.equal(res1.inserted, true);
  assert.equal(queue.size(), 1);

  // Second identical capture
  const res2 = queue.enqueue(capture1);
  assert.equal(res2.inserted, false);
  assert.equal(res2.status, 'DUPLICATE_IGNORED');
  assert.equal(queue.size(), 1, 'Queue size must remain exactly 1');
});
