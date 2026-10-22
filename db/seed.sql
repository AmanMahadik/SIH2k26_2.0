-- NirikshAI Initial Seed Data (Complete Production Seed)
-- 4 Demonstration Institutions & Scenarios across All 11 Tables

-- 1. Clean existing data
DELETE FROM reviews;
DELETE FROM findings;
DELETE FROM verifications;
DELETE FROM extracted_fields;
DELETE FROM documents;
DELETE FROM alerts;
DELETE FROM applications;
DELETE FROM institution_records;
DELETE FROM institutions;
DELETE FROM rule_sets;
DELETE FROM audit_log;

-- 2. Insert Rule Set: EOA_EXISTING.v1 (APH 2024-27 Chapter IV)
INSERT INTO rule_sets (id, category, version, source_ref, rules, active)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'EOA_EXISTING',
  1,
  'AICTE Approval Process Handbook (APH) 2024-27 Chapter IV',
  '[
    {"id": "R-DOC-AFFIDAVIT", "type": "required_document", "doc_type": "affidavit", "clause": "APH 2024-27 §4.1.2"},
    {"id": "R-DOC-NOC", "type": "required_document", "doc_type": "noc_state", "clause": "APH 2024-27 §4.1.4"},
    {"id": "R-DOC-LAND", "type": "required_document", "doc_type": "land_compliance", "clause": "APH 2024-27 §4.2.1"},
    {"id": "R-EXP-NOC", "type": "date_valid_for_year", "doc_type": "noc_state", "field": "valid_to", "year": "2026-27", "clause": "APH 2024-27 §4.3.1"},
    {"id": "R-EXP-AFFIDAVIT", "type": "date_valid_for_year", "doc_type": "affidavit", "field": "execution_date", "year": "2026-27", "clause": "APH 2024-27 §4.1.3"},
    {"id": "R-XDOC-NAME", "type": "cross_field_equal", "fields": ["eoa_letter.institution_name", "affidavit.institution_name", "noc_state.institution_name"], "fuzzy": 0.90, "clause": "APH 2024-27 §4.4.2"},
    {"id": "R-REC-INTAKE", "type": "record_equals", "field": "eoa_letter.approved_intake", "record": "approved_intake", "clause": "APH 2024-27 §4.5.1"},
    {"id": "R-TER-FEE", "type": "status_equals", "record": "ter_status", "value": "paid", "clause": "APH 2024-27 §4.6.1"}
  ]'::jsonb,
  true
);

-- 3. Institutions & Applications
-- 3.1 Pune Institute of Computer Technology (Clean, Compliant)
INSERT INTO institutions (id, aicte_id, name, state, university)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1-10972348121', 'Pune Institute of Computer Technology', 'Maharashtra', 'Savitribai Phule Pune University');

INSERT INTO institution_records (institution_id, record_type, payload)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'records', '{
  "aicte_id": "1-10972348121",
  "approved_intake": "420",
  "ter_status": "paid",
  "deficiency_status": "clear",
  "eoa_history": [{"year": "2025-26", "letter_number": "Western/1-10972348121/2025/EOA", "status": "approved"}]
}'::jsonb);

INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
VALUES ('a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EOA_EXISTING', '2026-27', 'submitted', 10, 'inst_pict', NOW());

-- 3.2 Delhi College of Engineering & Technology (Discrepancy: Expired NOC & Name Mismatch)
INSERT INTO institutions (id, aicte_id, name, state, university)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1-20491823901', 'Delhi College of Engineering & Technology', 'Delhi', 'Guru Gobind Singh Indraprastha University');

INSERT INTO institution_records (institution_id, record_type, payload)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'records', '{
  "aicte_id": "1-20491823901",
  "approved_intake": "360",
  "ter_status": "paid",
  "deficiency_status": "clear",
  "eoa_history": [{"year": "2025-26", "letter_number": "Northern/1-20491823901/2025/EOA", "status": "approved"}]
}'::jsonb);

INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
VALUES ('b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'EOA_EXISTING', '2026-27', 'in_review', 85, 'inst_dcet', NOW());

-- 3.3 Apex Technical Campus (Tamper Indicator: Altered Intake & Incremental Update)
INSERT INTO institutions (id, aicte_id, name, state, university)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', '1-30948192034', 'Apex Technical Campus', 'Karnataka', 'Visvesvaraya Technological University');

INSERT INTO institution_records (institution_id, record_type, payload)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'records', '{
  "aicte_id": "1-30948192034",
  "approved_intake": "240",
  "ter_status": "pending",
  "deficiency_status": "show_cause",
  "eoa_history": [{"year": "2025-26", "letter_number": "South-West/1-30948192034/2025/EOA", "status": "approved"}]
}'::jsonb);

INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
VALUES ('c0000003-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'EOA_EXISTING', '2026-27', 'in_review', 95, 'inst_apex', NOW());

-- 3.4 National Institute of Management & Science (Source Unavailable -> Escalates to Manual Review)
INSERT INTO institutions (id, aicte_id, name, state, university)
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', '1-40918204912', 'National Institute of Management & Science', 'Rajasthan', 'Rajasthan Technical University');

INSERT INTO institution_records (institution_id, record_type, payload)
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'records', '{
  "aicte_id": "1-40918204912",
  "approved_intake": "180",
  "ter_status": "paid",
  "deficiency_status": "clear",
  "eoa_history": [{"year": "2025-26", "letter_number": "North-West/1-40918204912/2025/EOA", "status": "approved"}]
}'::jsonb);

INSERT INTO applications (id, institution_id, category, academic_year, status, priority, created_by, submitted_at)
VALUES ('d0000004-dddd-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'EOA_EXISTING', '2026-27', 'in_review', 70, 'inst_nims', NOW());

-- 4. Documents & Extracted Fields & Verifications
-- 4.1 PICT Documents
INSERT INTO documents (id, application_id, doc_type, filename, storage_path, sha256, page_count, analysis_status)
VALUES 
('10100000-0000-0000-0000-000000000101', 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eoa_letter', 'AICTE_EoA_Letter_2025_26.pdf', 'eoa_letters/pict_eoa.pdf', '9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394', 2, 'completed'),
('10200000-0000-0000-0000-000000000102', 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'affidavit', 'Affidavit_Prescribed_Format.pdf', 'affidavits/pict_affidavit.pdf', 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0', 3, 'completed'),
('10300000-0000-0000-0000-000000000103', 'a0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'noc_state', 'State_Govt_NOC_Maharashtra.pdf', 'nocs/pict_noc.pdf', '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344', 1, 'completed');

INSERT INTO extracted_fields (document_id, field_key, value, confidence, page, bbox)
VALUES 
('10100000-0000-0000-0000-000000000101', 'institution_name', 'Pune Institute of Computer Technology', 0.98, 0, '{"x": 0.15, "y": 0.22, "w": 0.65, "h": 0.05}'::jsonb),
('10100000-0000-0000-0000-000000000101', 'approved_intake', '420', 0.97, 1, '{"x": 0.65, "y": 0.45, "w": 0.15, "h": 0.04}'::jsonb),
('10100000-0000-0000-0000-000000000101', 'aicte_id', '1-10972348121', 0.99, 0, '{"x": 0.20, "y": 0.18, "w": 0.25, "h": 0.04}'::jsonb),
('10200000-0000-0000-0000-000000000102', 'institution_name', 'Pune Institute of Computer Technology', 0.96, 0, '{"x": 0.20, "y": 0.30, "w": 0.60, "h": 0.04}'::jsonb),
('10200000-0000-0000-0000-000000000102', 'execution_date', '2026-08-15', 0.95, 2, '{"x": 0.60, "y": 0.75, "w": 0.25, "h": 0.04}'::jsonb),
('10300000-0000-0000-0000-000000000103', 'institution_name', 'Pune Institute of Computer Technology', 0.97, 0, '{"x": 0.18, "y": 0.25, "w": 0.62, "h": 0.05}'::jsonb),
('10300000-0000-0000-0000-000000000103', 'valid_to', '2027-06-30', 0.94, 0, '{"x": 0.40, "y": 0.60, "w": 0.25, "h": 0.04}'::jsonb);

INSERT INTO verifications (document_id, source, status, request_ref, response)
VALUES 
('10100000-0000-0000-0000-000000000101', 'mock_issuer', 'verified', 'VER-AICTE-0912', '{"verified_at": "2026-10-18T10:05:00Z"}'::jsonb),
('10200000-0000-0000-0000-000000000102', 'mock_issuer', 'verified', 'VER-NOTARY-8821', '{"verified_at": "2026-10-18T10:05:00Z"}'::jsonb),
('10300000-0000-0000-0000-000000000103', 'mock_issuer', 'verified', 'VER-MAHA-DTE-1102', '{"verified_at": "2026-10-18T10:05:00Z"}'::jsonb);

-- 4.2 DCET Documents (Discrepancy)
INSERT INTO documents (id, application_id, doc_type, filename, storage_path, sha256, page_count, analysis_status)
VALUES 
('20100000-0000-0000-0000-000000000201', 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eoa_letter', 'AICTE_EoA_Northern_2025.pdf', 'eoa_letters/dcet_eoa.pdf', '2233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011', 2, 'completed'),
('20200000-0000-0000-0000-000000000202', 'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'noc_state', 'State_NOC_Delhi_DTE_Expired.pdf', 'nocs/dcet_noc.pdf', '33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122', 1, 'completed');

INSERT INTO extracted_fields (document_id, field_key, value, confidence, page, bbox)
VALUES 
('20100000-0000-0000-0000-000000000201', 'institution_name', 'Delhi College of Engineering & Technology', 0.98, 0, '{"x": 0.15, "y": 0.22, "w": 0.70, "h": 0.05}'::jsonb),
('20100000-0000-0000-0000-000000000201', 'approved_intake', '360', 0.97, 1, '{"x": 0.65, "y": 0.45, "w": 0.15, "h": 0.04}'::jsonb),
('20200000-0000-0000-0000-000000000202', 'institution_name', 'Delhi Inst of Engineering & Tech (East)', 0.89, 0, '{"x": 0.15, "y": 0.24, "w": 0.68, "h": 0.05}'::jsonb),
('20200000-0000-0000-0000-000000000202', 'valid_to', '2025-05-31', 0.96, 0, '{"x": 0.45, "y": 0.58, "w": 0.25, "h": 0.04}'::jsonb);

INSERT INTO verifications (document_id, source, status, request_ref, response)
VALUES 
('20100000-0000-0000-0000-000000000201', 'mock_issuer', 'verified', 'VER-AICTE-1982', '{"verified_at": "2026-10-19T08:40:00Z"}'::jsonb),
('20200000-0000-0000-0000-000000000202', 'mock_issuer', 'expired', 'VER-DL-DTE-9031', '{"verified_at": "2026-10-19T08:41:00Z", "notes": "State NOC expired"}'::jsonb);

-- 4.3 Apex Documents (Tamper Indicator)
INSERT INTO documents (id, application_id, doc_type, filename, storage_path, sha256, page_count, analysis_status)
VALUES 
('30100000-0000-0000-0000-000000000301', 'c0000003-cccc-cccc-cccc-cccccccccccc', 'eoa_letter', 'EoA_Letter_Apex_Altered.pdf', 'eoa_letters/apex_eoa.pdf', '66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455', 2, 'completed');

INSERT INTO extracted_fields (document_id, field_key, value, confidence, page, bbox)
VALUES 
('30100000-0000-0000-0000-000000000301', 'institution_name', 'Apex Technical Campus', 0.97, 0, '{"x": 0.15, "y": 0.22, "w": 0.65, "h": 0.05}'::jsonb),
('30100000-0000-0000-0000-000000000301', 'approved_intake', '300', 0.82, 1, '{"x": 0.65, "y": 0.45, "w": 0.15, "h": 0.04}'::jsonb);

INSERT INTO verifications (document_id, source, status, request_ref, response)
VALUES 
('30100000-0000-0000-0000-000000000301', 'mock_issuer', 'mismatch_detected', 'VER-AICTE-3891', '{"verified_at": "2026-10-19T11:15:00Z"}'::jsonb);

-- 4.4 NIMS Documents (Manual Review Escalation)
INSERT INTO documents (id, application_id, doc_type, filename, storage_path, sha256, page_count, analysis_status)
VALUES 
('40100000-0000-0000-0000-000000000401', 'd0000004-dddd-dddd-dddd-dddddddddddd', 'noc_state', 'State_NOC_Rajasthan_Govt.pdf', 'nocs/nims_noc.pdf', '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566', 1, 'completed');

INSERT INTO extracted_fields (document_id, field_key, value, confidence, page, bbox)
VALUES 
('40100000-0000-0000-0000-000000000401', 'institution_name', 'National Institute of Management & Science', 0.95, 0, '{"x": 0.15, "y": 0.25, "w": 0.70, "h": 0.05}'::jsonb),
('40100000-0000-0000-0000-000000000401', 'valid_to', '2027-04-30', 0.93, 0, '{"x": 0.40, "y": 0.60, "w": 0.25, "h": 0.04}'::jsonb);

INSERT INTO verifications (document_id, source, status, request_ref, response)
VALUES 
('40100000-0000-0000-0000-000000000401', 'mock_issuer', 'manual_review_required', 'REQ-ERR-1729340', '{"verified_at": "2026-10-19T14:20:00Z"}'::jsonb);

-- 5. Findings with Exact Evidence Bounding Boxes
INSERT INTO findings (id, application_id, rule_set_id, rule_id, kind, severity, message, evidence, status)
VALUES 
(
  '20100000-0000-0000-0000-00000000f201',
  'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'R-EXP-NOC',
  'expired',
  'blocking',
  'State NOC expired on 31 May 2025; validity does not extend across Academic Year 2026-27.',
  '{"doc_ids": ["20200000-0000-0000-0000-000000000202"], "pages": [0], "bboxes": [{"x": 0.45, "y": 0.58, "w": 0.25, "h": 0.04}], "field_key": "valid_to", "extracted_value": "2025-05-31", "expected_value": "Valid through 2026-06-30 or later", "confidence": 0.96, "clause": "APH 2024-27 §4.3.1"}'::jsonb,
  'open'
),
(
  '20200000-0000-0000-0000-00000000f202',
  'b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'R-XDOC-NAME',
  'inconsistent',
  'blocking',
  'Institution legal title mismatch between AICTE EoA and State NOC (Match similarity: 74%, required: 90%).',
  '{"doc_ids": ["20100000-0000-0000-0000-000000000201", "20200000-0000-0000-0000-000000000202"], "pages": [0, 0], "bboxes": [{"x": 0.15, "y": 0.22, "w": 0.70, "h": 0.05}, {"x": 0.15, "y": 0.24, "w": 0.68, "h": 0.05}], "field_key": "institution_name", "extracted_value": "\"Delhi College of Engineering & Technology\" vs \"Delhi Inst of Engineering & Tech (East)\"", "expected_value": "Exact matching title", "confidence": 0.93, "clause": "APH 2024-27 §4.4.2"}'::jsonb,
  'open'
),
(
  '30100000-0000-0000-0000-00000000f301',
  'c0000003-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'R-REC-INTAKE',
  'tamper_indicator',
  'blocking',
  'Claimed intake of 300 seats exceeds authorized quota of 240 seats in AICTE Master Registry (Indicator of alteration).',
  '{"doc_ids": ["30100000-0000-0000-0000-000000000301"], "pages": [1], "bboxes": [{"x": 0.65, "y": 0.45, "w": 0.15, "h": 0.04}], "field_key": "approved_intake", "extracted_value": "300", "expected_value": "240", "confidence": 0.82, "clause": "APH 2024-27 §4.5.1"}'::jsonb,
  'open'
);

-- 6. Reviews
INSERT INTO reviews (finding_id, reviewer, decision, notes)
VALUES ('20100000-0000-0000-0000-00000000f201', 'Dr. Priya Sharma (Scrutiny Officer)', 'confirmed', 'Discrepancy verified against official State gazette circular.');

-- 7. Alerts
INSERT INTO alerts (application_id, type, to_role, message)
VALUES 
('b0000002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'discrepancy', 'officer', 'High priority: Expired NOC and Title mismatch detected on EA-2026-0451'),
('c0000003-cccc-cccc-cccc-cccccccccccc', 'tamper', 'officer', 'Forensic Advisory: PDF incremental update date gap and intake anomaly on EA-2026-0450'),
('d0000004-dddd-dddd-dddd-dddddddddddd', 'timeout', 'officer', 'Issuer endpoint unreachable: EA-2026-0453 escalated to manual review');

-- 8. Hash-Chained Audit Ledger
INSERT INTO audit_log (id, actor, action, entity, payload, prev_hash, hash, at)
VALUES 
(1, 'system', 'GENESIS_EVENT', 'system', '{"system": "NirikshAI", "version": "2.0.0"}'::jsonb, '0000000000000000000000000000000000000000000000000000000000000000', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '2026-10-18T00:00:00Z'),
(2, 'ABC Engineering College', 'DOC_UPLOADED', 'documents', '{"filename": "AICTE_EoA_Letter_2025_26.pdf", "sha256": "9a6b12a84358fa838d74883b4b84013481239840293482390481023948102394"}'::jsonb, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '8f92b761a293847291a823901481023948102934810293481029348102934810', '2026-10-18T10:00:00Z'),
(3, 'NirikshAI Perception AI', 'OCR_EXTRACTED', 'extracted_fields', '{"doc_id": "doc-101", "fields_count": 3, "confidence_avg": 0.98}'::jsonb, '8f92b761a293847291a823901481023948102934810293481029348102934810', '7c81a6291a837291a82390148102394810293481029348102934810293481029', '2026-10-18T10:01:00Z'),
(4, 'NirikshAI Rule Engine', 'RULES_EVALUATED', 'findings', '{"rule_set": "EOA_EXISTING.v1", "findings_emitted": 0, "status": "PASSED"}'::jsonb, '7c81a6291a837291a82390148102394810293481029348102934810293481029', '6b70a5180a726180a71289037091928370192837019283701928370192837019', '2026-10-18T10:05:00Z'),
(5, 'Dr. Priya Sharma', 'OFFICER_REVIEW', 'reviews', '{"app_id": "app-1", "action": "APPROVED", "notes": "All statutory documents verified against AICTE central registry."}'::jsonb, '6b70a5180a726180a71289037091928370192837019283701928370192837019', '5a6f94079a615079a60178926080817260081726008172600817260081726008', '2026-10-18T11:00:00Z');
