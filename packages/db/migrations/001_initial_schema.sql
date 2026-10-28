-- 001_initial_schema.sql
-- Production PostgreSQL schema for NirikshAI AICTE Regulatory Compliance Platform

CREATE TABLE IF NOT EXISTS institutions (
  id VARCHAR(64) PRIMARY KEY,
  legal_name VARCHAR(255) NOT NULL,
  permanent_id VARCHAR(64) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  state VARCHAR(64) NOT NULL,
  region VARCHAR(64) NOT NULL,
  approved_intake INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  institution_id VARCHAR(64) REFERENCES institutions(id) ON DELETE CASCADE,
  application_number VARCHAR(64) UNIQUE NOT NULL,
  academic_year VARCHAR(16) NOT NULL DEFAULT '2026-27',
  category VARCHAR(64) NOT NULL,
  status VARCHAR(64) NOT NULL DEFAULT 'draft',
  ter_payment_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  ter_receipt_ref VARCHAR(128),
  overall_compliance_score NUMERIC(5,2),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(64) PRIMARY KEY,
  application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
  doc_type VARCHAR(64) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  page_count INTEGER NOT NULL DEFAULT 1,
  ocr_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  analysis_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  verification_status VARCHAR(64) NOT NULL DEFAULT 'verification_pending',
  forensics_json JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extracted_fields (
  id VARCHAR(64) PRIMARY KEY,
  document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
  field_key VARCHAR(128) NOT NULL,
  value TEXT NOT NULL,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 1.000,
  source_page INTEGER DEFAULT 1,
  bbox_json JSONB,
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS findings (
  id VARCHAR(64) PRIMARY KEY,
  application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
  rule_set_id VARCHAR(64) NOT NULL,
  rule_id VARCHAR(64) NOT NULL,
  kind VARCHAR(64) NOT NULL,
  severity VARCHAR(32) NOT NULL,
  message TEXT NOT NULL,
  evidence_json JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  rectification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  prev_hash VARCHAR(64) NOT NULL,
  hash VARCHAR(64) NOT NULL,
  actor VARCHAR(255) NOT NULL,
  action VARCHAR(64) NOT NULL,
  entity VARCHAR(128) NOT NULL,
  payload_json JSONB NOT NULL,
  at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_apps_institution ON applications(institution_id);
CREATE INDEX IF NOT EXISTS idx_docs_app ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_fields_doc ON extracted_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_findings_app ON findings(application_id);
CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_events(at);
