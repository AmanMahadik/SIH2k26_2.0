const { Client } = require('pg');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envContent.split(/\r?\n/)) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring('DATABASE_URL='.length).trim();
  }
}

const cleanUrl = dbUrl.split('?')[0];
const client = new Client({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false }
});

client.on('error', (err) => {
  console.error('Client error:', err.message);
});

async function seed() {
  await client.connect();
  console.log('Connected to Azure PostgreSQL successfully!');

  try {
    // 1. Clean data in reverse dependency order
    console.log('Cleaning existing rows...');
    await client.query('DELETE FROM reviews;');
    await client.query('DELETE FROM findings;');
    await client.query('DELETE FROM verifications;');
    await client.query('DELETE FROM extracted_fields;');
    await client.query('DELETE FROM documents;');
    await client.query('DELETE FROM alerts;');
    await client.query('DELETE FROM applications;');
    await client.query('DELETE FROM institution_records;');
    await client.query('DELETE FROM institutions;');
    await client.query('DELETE FROM rule_sets;');
    await client.query('DELETE FROM audit_log;');

    // 2. Insert Rule Set
    console.log('Seeding rule_sets...');
    const ruleSetId = '11111111-1111-1111-1111-111111111111';
    await client.query(`
      INSERT INTO rule_sets (id, category, version, source_ref, rules, active)
      VALUES ($1, 'EOA_EXISTING', 1, 'AICTE Approval Process Handbook (APH) 2024-27 Chapter IV', $2, true);
    `, [
      ruleSetId,
      JSON.stringify([
        { id: 'R-DOC-AFFIDAVIT', type: 'required_document', doc_type: 'affidavit', clause: 'APH 2024-27 §4.1.2' },
        { id: 'R-DOC-NOC', type: 'required_document', doc_type: 'noc_state', clause: 'APH 2024-27 §4.1.4' },
        { id: 'R-DOC-LAND', type: 'required_document', doc_type: 'land_compliance', clause: 'APH 2024-27 §4.2.1' },
        { id: 'R-EXP-NOC', type: 'date_valid_for_year', doc_type: 'noc_state', field: 'valid_to', year: '2026-27', clause: 'APH 2024-27 §4.3.1' },
        { id: 'R-EXP-AFFIDAVIT', type: 'date_valid_for_year', doc_type: 'affidavit', field: 'execution_date', year: '2026-27', clause: 'APH 2024-27 §4.1.3' },
        { id: 'R-XDOC-NAME', type: 'cross_field_equal', fields: ['eoa_letter.institution_name', 'affidavit.institution_name', 'noc_state.institution_name'], fuzzy: 0.90, clause: 'APH 2024-27 §4.4.2' },
        { id: 'R-REC-INTAKE', type: 'record_equals', field: 'eoa_letter.approved_intake', record: 'approved_intake', clause: 'APH 2024-27 §4.5.1' },
        { id: 'R-TER-FEE', type: 'status_equals', record: 'ter_status', value: 'paid', clause: 'APH 2024-27 §4.6.1' }
      ])
    ]);

    // 3. Institutions & Applications
    console.log('Seeding institutions & applications...');
    const insts = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        aicte_id: '1-10972348121',
        name: 'Pune Institute of Computer Technology',
        state: 'Maharashtra',
        univ: 'Savitribai Phule Pune University',
        rec: { aicte_id: '1-10972348121', approved_intake: '420', ter_status: 'paid', deficiency_status: 'clear' },
        appId: 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        status: 'submitted',
        priority: 10,
        creator: 'inst_pict'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        aicte_id: '1-20491823901',
        name: 'Delhi College of Engineering & Technology',
        state: 'Delhi',
        univ: 'Guru Gobind Singh Indraprastha University',
        rec: { aicte_id: '1-20491823901', approved_intake: '360', ter_status: 'paid', deficiency_status: 'clear' },
        appId: 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        status: 'in_review',
        priority: 85,
        creator: 'inst_dcet'
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        aicte_id: '1-30948192034',
        name: 'Apex Technical Campus',
        state: 'Karnataka',
        univ: 'Visvesvaraya Technological University',
        rec: { aicte_id: '1-30948192034', approved_intake: '240', ter_status: 'pending', deficiency_status: 'show_cause' },
        appId: 'c0000003-cccc-cccc-cccc-cccccccccccc',
        status: 'in_review',
        priority: 95,
        creator: 'inst_apex'
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        aicte_id: '1-40918204912',
        name: 'National Institute of Management & Science',
        state: 'Rajasthan',
        univ: 'Rajasthan Technical University',
        rec: { aicte_id: '1-40918204912', approved_intake: '180', ter_status: 'paid', deficiency_status: 'clear' },
        appId: 'd0000004-dddd-dddd-dddd-dddddddddddd',
        status: 'in_review',
        priority: 70,
        creator: 'inst_nims'
      }
    ];

    for (const inst of insts) {
      await client.query(`
        INSERT INTO institutions (id, aicte_id, name, state, university)
        VALUES ($1, $2, $3, $4, $5);
      `, [inst.id, inst.aicte_id, inst.name, inst.state, inst.univ]);

      await client.query(`
        INSERT INTO institution_records (institution_id, record_type, payload)
        VALUES ($1, 'records', $2);
      `, [inst.id, JSON.stringify(inst.rec)]);

      await client.query(`
        INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
        VALUES ($1, $2, 'EOA_EXISTING', '2026-27', $3, $4, $5, NOW());
      `, [inst.appId, inst.id, inst.status, inst.priority, inst.creator]);
    }

    // 4. Documents & Extracted Fields & Verifications
    console.log('Seeding documents, extracted fields, and verifications...');
    const docs = [
      // Inst 1: PICT Documents
      {
        id: '10100000-0000-0000-0000-000000000101',
        appId: 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        type: 'eoa_letter',
        fn: 'AICTE_EoA_Letter_2025_26.pdf',
        path: 'eoa_letters/pict_eoa.pdf',
        sha256: '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394',
        pages: 2,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'Pune Institute of Computer Technology', conf: 0.98, p: 0, bbox: { x: 0.15, y: 0.22, w: 0.65, h: 0.05 } },
          { k: 'approved_intake', v: '420', conf: 0.97, p: 1, bbox: { x: 0.65, y: 0.45, w: 0.15, h: 0.04 } },
          { k: 'aicte_id', v: '1-10972348121', conf: 0.99, p: 0, bbox: { x: 0.20, y: 0.18, w: 0.25, h: 0.04 } }
        ],
        verif: { status: 'verified', src: 'mock_issuer', ref: 'VER-AICTE-0912' }
      },
      {
        id: '10200000-0000-0000-0000-000000000102',
        appId: 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        type: 'affidavit',
        fn: 'Affidavit_Prescribed_Format.pdf',
        path: 'affidavits/pict_affidavit.pdf',
        sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        pages: 3,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'Pune Institute of Computer Technology', conf: 0.96, p: 0, bbox: { x: 0.20, y: 0.30, w: 0.60, h: 0.04 } },
          { k: 'execution_date', v: '2026-08-15', conf: 0.95, p: 2, bbox: { x: 0.60, y: 0.75, w: 0.25, h: 0.04 } }
        ],
        verif: { status: 'verified', src: 'mock_issuer', ref: 'VER-NOTARY-8821' }
      },
      {
        id: '10300000-0000-0000-0000-000000000103',
        appId: 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        type: 'noc_state',
        fn: 'State_Govt_NOC_Maharashtra.pdf',
        path: 'nocs/pict_noc.pdf',
        sha256: '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
        pages: 1,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'Pune Institute of Computer Technology', conf: 0.97, p: 0, bbox: { x: 0.18, y: 0.25, w: 0.62, h: 0.05 } },
          { k: 'valid_to', v: '2027-06-30', conf: 0.94, p: 0, bbox: { x: 0.40, y: 0.60, w: 0.25, h: 0.04 } }
        ],
        verif: { status: 'verified', src: 'mock_issuer', ref: 'VER-MAHA-DTE-1102' }
      },

      // Inst 2: DCET Documents (Discrepancy)
      {
        id: '20100000-0000-0000-0000-000000000201',
        appId: 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        type: 'eoa_letter',
        fn: 'AICTE_EoA_Northern_2025.pdf',
        path: 'eoa_letters/dcet_eoa.pdf',
        sha256: '2233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011',
        pages: 2,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'Delhi College of Engineering & Technology', conf: 0.98, p: 0, bbox: { x: 0.15, y: 0.22, w: 0.70, h: 0.05 } },
          { k: 'approved_intake', v: '360', conf: 0.97, p: 1, bbox: { x: 0.65, y: 0.45, w: 0.15, h: 0.04 } }
        ],
        verif: { status: 'verified', src: 'mock_issuer', ref: 'VER-AICTE-1982' }
      },
      {
        id: '20200000-0000-0000-0000-000000000202',
        appId: 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        type: 'noc_state',
        fn: 'State_NOC_Delhi_DTE_Expired.pdf',
        path: 'nocs/dcet_noc.pdf',
        sha256: '33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122',
        pages: 1,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'Delhi Inst of Engineering & Tech (East)', conf: 0.89, p: 0, bbox: { x: 0.15, y: 0.24, w: 0.68, h: 0.05 } },
          { k: 'valid_to', v: '2025-05-31', conf: 0.96, p: 0, bbox: { x: 0.45, y: 0.58, w: 0.25, h: 0.04 } }
        ],
        verif: { status: 'expired', src: 'mock_issuer', ref: 'VER-DL-DTE-9031' }
      },

      // Inst 3: Apex Documents (Tamper Indicator)
      {
        id: '30100000-0000-0000-0000-000000000301',
        appId: 'c0000003-cccc-cccc-cccc-cccccccccccc',
        type: 'eoa_letter',
        fn: 'EoA_Letter_Apex_Altered.pdf',
        path: 'eoa_letters/apex_eoa.pdf',
        sha256: '66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455',
        pages: 2,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'Apex Technical Campus', conf: 0.97, p: 0, bbox: { x: 0.15, y: 0.22, w: 0.65, h: 0.05 } },
          { k: 'approved_intake', v: '300', conf: 0.82, p: 1, bbox: { x: 0.65, y: 0.45, w: 0.15, h: 0.04 } }
        ],
        verif: { status: 'mismatch_detected', src: 'mock_issuer', ref: 'VER-AICTE-3891' }
      },

      // Inst 4: NIMS Documents (Manual Review)
      {
        id: '40100000-0000-0000-0000-000000000401',
        appId: 'd0000004-dddd-dddd-dddd-dddddddddddd',
        type: 'noc_state',
        fn: 'State_NOC_Rajasthan_Govt.pdf',
        path: 'nocs/nims_noc.pdf',
        sha256: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
        pages: 1,
        status: 'completed',
        fields: [
          { k: 'institution_name', v: 'National Institute of Management & Science', conf: 0.95, p: 0, bbox: { x: 0.15, y: 0.25, w: 0.70, h: 0.05 } },
          { k: 'valid_to', v: '2027-04-30', conf: 0.93, p: 0, bbox: { x: 0.40, y: 0.60, w: 0.25, h: 0.04 } }
        ],
        verif: { status: 'manual_review_required', src: 'mock_issuer', ref: 'REQ-ERR-1729340' }
      }
    ];

    for (const doc of docs) {
      await client.query(`
        INSERT INTO documents (id, application_id, doc_type, filename, storage_path, sha256, page_count, analysis_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [doc.id, doc.appId, doc.type, doc.fn, doc.path, doc.sha256, doc.pages, doc.status]);

      for (const f of doc.fields) {
        await client.query(`
          INSERT INTO extracted_fields (document_id, field_key, value, confidence, page, bbox)
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [doc.id, f.k, f.v, f.conf, f.p, JSON.stringify(f.bbox)]);
      }

      await client.query(`
        INSERT INTO verifications (document_id, source, status, request_ref, response)
        VALUES ($1, $2, $3, $4, $5);
      `, [doc.id, doc.verif.src, doc.verif.status, doc.verif.ref, JSON.stringify({ verified_at: new Date().toISOString() })]);
    }

    // 5. Findings
    console.log('Seeding findings...');
    const findings = [
      {
        id: '20100000-0000-0000-0000-00000000f201',
        appId: 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        ruleId: 'R-EXP-NOC',
        kind: 'expired',
        severity: 'blocking',
        msg: 'State NOC expired on 31 May 2025; validity does not extend across Academic Year 2026-27.',
        ev: {
          doc_ids: ['20200000-0000-0000-0000-000000000202'],
          pages: [0],
          bboxes: [{ x: 0.45, y: 0.58, w: 0.25, h: 0.04 }],
          field_key: 'valid_to',
          extracted_value: '2025-05-31',
          expected_value: 'Valid through 2026-06-30 or later',
          confidence: 0.96,
          clause: 'APH 2024-27 §4.3.1'
        }
      },
      {
        id: '20200000-0000-0000-0000-00000000f202',
        appId: 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        ruleId: 'R-XDOC-NAME',
        kind: 'inconsistent',
        severity: 'blocking',
        msg: 'Institution legal title mismatch between AICTE EoA and State NOC (Match similarity: 74%, required: 90%).',
        ev: {
          doc_ids: ['20100000-0000-0000-0000-000000000201', '20200000-0000-0000-0000-000000000202'],
          pages: [0, 0],
          bboxes: [{ x: 0.15, y: 0.22, w: 0.70, h: 0.05 }, { x: 0.15, y: 0.24, w: 0.68, h: 0.05 }],
          field_key: 'institution_name',
          extracted_value: '"Delhi College of Engineering & Technology" vs "Delhi Inst of Engineering & Tech (East)"',
          expected_value: 'Exact matching title',
          confidence: 0.93,
          clause: 'APH 2024-27 §4.4.2'
        }
      },
      {
        id: '30100000-0000-0000-0000-00000000f301',
        appId: 'c0000003-cccc-cccc-cccc-cccccccccccc',
        ruleId: 'R-REC-INTAKE',
        kind: 'tamper_indicator',
        severity: 'blocking',
        msg: 'Claimed intake of 300 seats exceeds authorized quota of 240 seats in AICTE Master Registry (Indicator of alteration).',
        ev: {
          doc_ids: ['30100000-0000-0000-0000-000000000301'],
          pages: [1],
          bboxes: [{ x: 0.65, y: 0.45, w: 0.15, h: 0.04 }],
          field_key: 'approved_intake',
          extracted_value: '300',
          expected_value: '240',
          confidence: 0.82,
          clause: 'APH 2024-27 §4.5.1'
        }
      }
    ];

    for (const f of findings) {
      await client.query(`
        INSERT INTO findings (id, application_id, rule_set_id, rule_id, kind, severity, message, evidence, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open');
      `, [f.id, f.appId, ruleSetId, f.ruleId, f.kind, f.severity, f.msg, JSON.stringify(f.ev)]);
    }

    // 6. Reviews
    console.log('Seeding reviews...');
    await client.query(`
      INSERT INTO reviews (finding_id, reviewer, decision, notes)
      VALUES ($1, 'Dr. Priya Sharma (Scrutiny Officer)', 'confirmed', 'Discrepancy verified against official State gazette circular.');
    `, [findings[0].id]);

    // 7. Alerts
    console.log('Seeding alerts...');
    await client.query(`
      INSERT INTO alerts (application_id, type, to_role, message)
      VALUES 
      ('b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'discrepancy', 'officer', 'High priority: Expired NOC and Title mismatch detected on EA-2026-0451'),
      ('c0000003-cccc-cccc-cccc-cccccccccccc', 'tamper', 'officer', 'Forensic Advisory: PDF incremental update date gap and intake anomaly on EA-2026-0450'),
      ('d0000004-dddd-dddd-dddd-dddddddddddd', 'timeout', 'officer', 'Issuer endpoint unreachable: EA-2026-0453 escalated to manual review');
    `);

    // 8. Hash-Chained Audit Ledger
    console.log('Seeding hash-chained audit log...');
    const auditEntries = [
      { id: 1, actor: 'system', action: 'GENESIS_EVENT', entity: 'system', payload: { system: 'NirikshAI', version: '2.0.0' }, prev: '0000000000000000000000000000000000000000000000000000000000000000', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', at: '2026-10-18T00:00:00Z' },
      { id: 2, actor: 'ABC Engineering College', action: 'DOC_UPLOADED', entity: 'documents', payload: { filename: 'AICTE_EoA_Letter_2025_26.pdf', sha256: '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394' }, prev: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', hash: '8f92b761a293847291a823901481023948102934810293481029348102934810', at: '2026-10-18T10:00:00Z' },
      { id: 3, actor: 'NirikshAI Perception AI', action: 'OCR_EXTRACTED', entity: 'extracted_fields', payload: { doc_id: 'doc-101', fields_count: 3, confidence_avg: 0.98 }, prev: '8f92b761a293847291a823901481023948102934810293481029348102934810', hash: '7c81a6291a837291a82390148102394810293481029348102934810293481029', at: '2026-10-18T10:01:00Z' },
      { id: 4, actor: 'NirikshAI Rule Engine', action: 'RULES_EVALUATED', entity: 'findings', payload: { rule_set: 'EOA_EXISTING.v1', findings_emitted: 0, status: 'PASSED' }, prev: '7c81a6291a837291a82390148102394810293481029348102934810293481029', hash: '6b70a5180a726180a71289037091928370192837019283701928370192837019', at: '2026-10-18T10:05:00Z' },
      { id: 5, actor: 'Dr. Priya Sharma', action: 'OFFICER_REVIEW', entity: 'reviews', payload: { app_id: 'app-1', action: 'APPROVED', notes: 'All statutory documents verified against AICTE central registry.' }, prev: '6b70a5180a726180a71289037091928370192837019283701928370192837019', hash: '5a6f94079a615079a60178926080817260081726008172600817260081726008', at: '2026-10-18T11:00:00Z' }
    ];

    for (const a of auditEntries) {
      await client.query(`
        INSERT INTO audit_log (id, actor, action, entity, payload, prev_hash, hash, at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [a.id, a.actor, a.action, a.entity, JSON.stringify(a.payload), a.prev, a.hash, a.at]);
    }

    console.log('ALL 11 TABLES SUCCESSFULLY POPULATED IN AZURE POSTGRESQL!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await client.end();
  }
}

seed();
