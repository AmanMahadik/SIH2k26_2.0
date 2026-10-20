-- NirikshAI Initial Seed Data
-- 4 Demonstration Institutions & Scenarios

-- Clean existing data
truncate table reviews, findings, verifications, extracted_fields, documents, alerts, applications, institution_records, institutions, rule_sets, audit_log cascade;

-- Insert Rule Set: EOA_EXISTING.v1
insert into rule_sets (id, category, version, source_ref, rules, active)
values (
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

-- 1. Pune Institute of Computer Technology (Clean, Compliant)
insert into institutions (id, aicte_id, name, state, university)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1-10972348121', 'Pune Institute of Computer Technology', 'Maharashtra', 'Savitribai Phule Pune University');

insert into institution_records (institution_id, record_type, payload)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'records', '{
  "aicte_id": "1-10972348121",
  "approved_intake": "420",
  "ter_status": "paid",
  "deficiency_status": "clear",
  "eoa_history": [{"year": "2025-26", "letter_number": "Western/1-10972348121/2025/EOA", "status": "approved"}]
}'::jsonb);

insert into applications (id, institution_id, category, academic_year, status, priority, created_by)
values ('app-0001-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EOA_EXISTING', '2026-27', 'submitted', 10, 'inst_pict');

-- 2. Delhi Engineering College (Discrepancy: Expired NOC & Name Mismatch)
insert into institutions (id, aicte_id, name, state, university)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1-20491823901', 'Delhi College of Engineering & Technology', 'Delhi', 'Guru Gobind Singh Indraprastha University');

insert into institution_records (institution_id, record_type, payload)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'records', '{
  "aicte_id": "1-20491823901",
  "approved_intake": "360",
  "ter_status": "paid",
  "deficiency_status": "clear",
  "eoa_history": [{"year": "2025-26", "letter_number": "Northern/1-20491823901/2025/EOA", "status": "approved"}]
}'::jsonb);

insert into applications (id, institution_id, category, academic_year, status, priority, created_by)
values ('app-0002-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'EOA_EXISTING', '2026-27', 'in_review', 85, 'inst_dcet');

-- 3. Apex Technical Campus (Tamper Indicator: Metadata alteration & intake discrepancy)
insert into institutions (id, aicte_id, name, state, university)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', '1-30948192034', 'Apex Technical Campus', 'Karnataka', 'Visvesvaraya Technological University');

insert into institution_records (institution_id, record_type, payload)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'records', '{
  "aicte_id": "1-30948192034",
  "approved_intake": "240",
  "ter_status": "pending",
  "deficiency_status": "show_cause",
  "eoa_history": [{"year": "2025-26", "letter_number": "South-West/1-30948192034/2025/EOA", "status": "approved"}]
}'::jsonb);

insert into applications (id, institution_id, category, academic_year, status, priority, created_by)
values ('app-0003-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'EOA_EXISTING', '2026-27', 'in_review', 95, 'inst_apex');

-- 4. National Institute of Management (Source Unavailable -> Escalates to Manual Review)
insert into institutions (id, aicte_id, name, state, university)
values ('dddddddd-dddd-dddd-dddd-dddddddddddd', '1-40918204912', 'National Institute of Management & Science', 'Rajasthan', 'Rajasthan Technical University');

insert into institution_records (institution_id, record_type, payload)
values ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'records', '{
  "aicte_id": "1-40918204912",
  "approved_intake": "180",
  "ter_status": "paid",
  "deficiency_status": "clear",
  "eoa_history": [{"year": "2025-26", "letter_number": "North-West/1-40918204912/2025/EOA", "status": "approved"}]
}'::jsonb);

insert into applications (id, institution_id, category, academic_year, status, priority, created_by)
values ('app-0004-dddd-dddd-dddddddddddd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'EOA_EXISTING', '2026-27', 'in_review', 70, 'inst_nims');

-- Initial Hash-Chained Audit Log Entry (Genesis block)
insert into audit_log (id, actor, action, entity, payload, prev_hash, hash, at)
values (
  1,
  'system',
  'GENESIS_EVENT',
  'system',
  '{"system": "NirikshAI", "version": "2.0.0", "event": "Genesis ledger initialization"}'::jsonb,
  '0000000000000000000000000000000000000000000000000000000000000000',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  now()
);
