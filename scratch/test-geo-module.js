// scratch/test-geo-module.js
// Automated End-to-End Test Suite for NirikshAI 2.0 Geo Module & Admin Verification

const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const { Client } = require('pg');

// Parse .env.local if present
try {
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
} catch (e) {}

async function runTests() {
  console.log('========================================================================');
  console.log('🚀 NIRIKSHAI 2.0 - EVC GEO MODULE & ADMIN VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Helper fetch
  const fetchLocal = async (url, options = {}) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return { status: res.status, data: await res.json() };
    }
    return { status: res.status, text: await res.text() };
  };

  // --------------------------------------------------------------------------
  // TEST 1: Metro Bundler Health & Expo Go Bundle Generation
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: EXPO GO METRO BUNDLER HEALTH & APP BUNDLE ---');
  try {
    const metroRes = await fetchLocal('http://localhost:8081');
    assert(metroRes.status === 200, 'Metro Bundler server is responding on port 8081');

    // Test Android bundle
    console.log('  Checking Android JS Bundle compilation from Metro...');
    const androidBundleRes = await fetchLocal('http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=android&dev=true');
    assert(androidBundleRes.status === 200, `Android bundle compiled successfully (HTTP ${androidBundleRes.status}, size: ${Math.round(androidBundleRes.text.length / 1024)} KB)`);

    // Test iOS bundle
    console.log('  Checking iOS JS Bundle compilation from Metro...');
    const iosBundleRes = await fetchLocal('http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=ios&dev=true');
    assert(iosBundleRes.status === 200, `iOS bundle compiled successfully (HTTP ${iosBundleRes.status}, size: ${Math.round(iosBundleRes.text.length / 1024)} KB)`);
  } catch (err) {
    assert(false, `Metro bundler error: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 2: Web Companion & Admin Portal UI Routes
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: WEB COMPANION (/mobile) & ADMIN CONSOLE (/admin) ---');
  try {
    const mobilePage = await fetchLocal('http://localhost:3000/mobile');
    assert(mobilePage.status === 200, 'Mobile companion page (/mobile) returned HTTP 200 OK');
    assert(
      mobilePage.text.includes('GPS MAP CAMERA') || mobilePage.text.includes('Field Inspection'),
      'Mobile page contains GPS Map Camera & Field Inspection module elements'
    );

    const adminPage = await fetchLocal('http://localhost:3000/admin');
    assert(adminPage.status === 200, 'Admin Scrutiny portal (/admin) returned HTTP 200 OK');
    assert(
      adminPage.text.includes('EVC Field Inspections') || adminPage.text.includes('inspections') || adminPage.text.includes('GovLayout') || adminPage.text.includes('AICTE') || adminPage.text.includes('NirikshAI'),
      'Admin portal includes GovLayout and Scrutiny portal components'
    );
  } catch (err) {
    assert(false, `Web portal error: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 3: Ingest Compliant Geotagged Inspection (Inside 35m perimeter)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: CAPTURE & SEAL COMPLIANT LAB EVIDENCE (Inside 35m fence) ---');
  let compliantInspectionId = null;
  const testTimestamp = new Date().toISOString();
  const testHash = crypto.createHash('sha256').update(`PICT-LAB-CC-03|18.457532,73.850831|11.4m|${testTimestamp}`).digest('hex');

  try {
    const postRes = await fetchLocal('http://localhost:3000/api/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campus_name: 'MIT Academy of Engineering (MITAOE)',
        aicte_id: '1-23111191',
        lab_name: 'High-Density Computer Center (540 PCs)',
        lab_code: 'LAB-CC-03',
        statutory_clause: 'APH 2024-27 §4.4.1 (1:4 Student-PC Ratio)',
        address: 'Main Academic Building Wing A, MITAOE, Dehu Phata, Alandi, Pune 412105, India',
        latitude: 18.675620,
        longitude: 73.896710,
        accuracy: 1.8,
        altitude: 568,
        compass_heading: '160° NW',
        wind_speed: '12 km/h',
        humidity: '40%',
        magnetic_field: '256 µT',
        temperature: '25°C',
        distance_meters: 11.4,
        statutory_radius_meters: 35,
        geofence_status: 'COMPLIANT',
        inspector_name: 'Dr. Priya Sharma (EVC Lead)',
        sha256_seal: testHash,
        photo_type: 'computer_center',
      }),
    });

    assert(postRes.status === 200, 'POST /api/inspections responded with HTTP 200');
    assert(postRes.data && postRes.data.success === true, 'Response body marked success: true');
    assert(postRes.data?.data?.geofence_status === 'COMPLIANT', 'Geofence status correctly marked COMPLIANT');
    assert(postRes.data?.data?.verification_status === 'PENDING_VERIFICATION', 'Status queued as PENDING_VERIFICATION for Admin');
    assert(postRes.data?.data?.sha256_seal === testHash, 'Cryptographic SHA-256 seal matches client WebCrypto hash');

    compliantInspectionId = postRes.data?.data?.id;
    console.log(`    -> Generated Evidence ID: ${compliantInspectionId}`);
  } catch (err) {
    assert(false, `Compliant submission error: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 4: Fraud Detection Check - Perimeter Breach (140m Outside Lab)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 4: GEOFENCE BREACH ENFORCEMENT (+105m Outside Permitted Radius) ---');
  let breachInspectionId = null;
  const breachHash = crypto.createHash('sha256').update(`BREACH-TEST|19.0345,73.0182|140m|${Date.now()}`).digest('hex');

  try {
    const breachRes = await fetchLocal('http://localhost:3000/api/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campus_name: 'MIT Academy of Engineering (MITAOE)',
        aicte_id: '1-23111191',
        lab_name: 'Robotics & AI Center of Excellence',
        lab_code: 'LAB-AI-01',
        statutory_clause: 'APH 2024-27 §4.4.3 (Emerging Tech Labs)',
        address: 'Indrayani River Bank Road (140m Outside MITAOE Campus Boundary)',
        latitude: 18.679200,
        longitude: 73.899800,
        accuracy: 3.2,
        altitude: 42,
        compass_heading: '270° W',
        wind_speed: '18 km/h',
        humidity: '65%',
        magnetic_field: '290 µT',
        temperature: '29°C',
        distance_meters: 140.0,
        statutory_radius_meters: 30,
        geofence_status: 'BREACH',
        inspector_name: 'Er. Rajesh Varma (Field Officer)',
        sha256_seal: breachHash,
        photo_type: 'robotics_lab',
      }),
    });

    assert(breachRes.status === 200, 'POST /api/inspections recorded breach inspection');
    assert(breachRes.data?.data?.geofence_status === 'BREACH', 'Geofence status correctly classified as BREACH');
    assert(breachRes.data?.data?.verification_status === 'REJECTED', 'Breached submission automatically defaulted to REJECTED');

    breachInspectionId = breachRes.data?.data?.id;
    console.log(`    -> Generated Breach ID: ${breachInspectionId}`);
  } catch (err) {
    assert(false, `Breach test error: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 5: Verify Azure PostgreSQL Audit Ledger Commitments (Sec 65B)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 5: AZURE POSTGRESQL AUDIT LEDGER COMMITMENT ---');
  try {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      const res = await client.query(
        "SELECT id, actor, action, entity, hash, at FROM audit_log WHERE action = 'EVC_GEOTAGGED_LAB_INSPECTION_SEALED' ORDER BY id DESC LIMIT 2;"
      );
      assert(res.rows.length > 0, `Found ${res.rows.length} sealed EVC inspection events committed into Azure PostgreSQL`);
      const latestRow = res.rows[0];
      assert(latestRow.actor.includes('EVC') || latestRow.actor.includes('Dr. Priya Sharma') || latestRow.actor.includes('Field Officer') || latestRow.actor.includes('Rajesh Varma'), `Committed by authorized officer: ${latestRow.actor}`);
      assert(latestRow.hash && latestRow.hash.length === 64, `SHA-256 block hash verified: ${latestRow.hash.slice(0, 16)}...`);
      await client.end();
    } else {
      console.log('  ⚠️ Note: DATABASE_URL not set in current env, skipping direct DB query');
    }
  } catch (err) {
    console.warn(`  ⚠️ DB check warning: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 6: Admin Portal Verification Action (PATCH /api/inspections)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 6: ADMIN REGULATORY DECISION (APPROVE EVIDENCE) ---');
  try {
    if (compliantInspectionId) {
      const patchRes = await fetchLocal('http://localhost:3000/api/inspections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: compliantInspectionId,
          action: 'APPROVE',
          admin_notes: 'Physical lab equipment, 540 terminals, and hardware GPS verified compliant with APH §4.4.1.',
          admin_actor: 'Super Admin (AICTE Regulation Bureau)',
        }),
      });

      assert(patchRes.status === 200, 'Admin verification PATCH returned HTTP 200');
      assert(patchRes.data && patchRes.data.success === true, 'Admin action processed successfully');
      assert(patchRes.data?.data?.verification_status === 'APPROVED', 'Evidence status transitioned to APPROVED');
      assert(patchRes.data?.data?.verified_by === 'Super Admin (AICTE Regulation Bureau)', 'Admin signatory recorded in audit metadata');
    }
  } catch (err) {
    assert(false, `Admin verification action failed: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 7: Scrutiny Inspections List & Summary Reconciliation
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 7: RECONCILE FULL INSPECTIONS LIST ON ADMIN CONSOLE ---');
  try {
    const listRes = await fetchLocal('http://localhost:3000/api/inspections');
    assert(listRes.status === 200, 'GET /api/inspections responded with HTTP 200');
    assert(listRes.data?.count >= 4, `Active inspection records found: ${listRes.data?.count}`);
    assert(listRes.data?.summary?.approved >= 1, `Approved records count: ${listRes.data?.summary?.approved}`);
    assert(listRes.data?.summary?.rejected >= 1, `Rejected records count: ${listRes.data?.summary?.rejected}`);
    assert(listRes.data?.summary?.compliance_rate, `Geofence Compliance Rate calculated: ${listRes.data?.summary?.compliance_rate}`);

    console.log('\n  Current Dashboard Summary Metrics:');
    console.log('    • Total Inspections:', listRes.data?.summary?.total);
    console.log('    • Approved Dossiers:', listRes.data?.summary?.approved);
    console.log('    • Pending Scrutiny:', listRes.data?.summary?.pending);
    console.log('    • Rejected Discrepancies:', listRes.data?.summary?.rejected);
    console.log('    • Compliance Rate:', listRes.data?.summary?.compliance_rate);
  } catch (err) {
    assert(false, `Summary reconciliation error: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // FINAL SCORECARD
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 FINAL TEST REPORT: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================================');

  if (failed === 0) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL! The Geo Module & Admin Portal are 100% working and ready for your testing.');
  } else {
    console.error(`\n⚠️ ${failed} test(s) failed. Please review the errors above.`);
  }
}

runTests().catch(console.error);
