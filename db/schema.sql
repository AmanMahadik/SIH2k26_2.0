-- NirikshAI Database Schema (PostgreSQL / Supabase)
-- SIH 2026 Problem Statement 26261

create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type app_status as enum ('draft', 'analysing', 'submitted', 'in_review', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type finding_kind as enum ('missing', 'expired', 'inconsistent', 'tamper_indicator', 'duplicate', 'infra_advisory', 'record_mismatch');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verif_status as enum ('verified', 'mismatch_detected', 'expired', 'verification_pending', 'source_unavailable', 'manual_review_required');
exception when duplicate_object then null; end $$;

-- 1. Institutions
create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  aicte_id text unique not null,
  name text not null,
  state text not null,
  university text not null,
  created_at timestamptz default now()
);

-- 2. Applications
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references institutions(id) on delete cascade,
  category text not null default 'EOA_EXISTING',
  academic_year text not null default '2026-27',
  status app_status default 'draft',
  priority int default 0,
  created_by text not null default 'system',
  submitted_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  doc_type text not null,
  filename text not null,
  storage_path text not null,
  sha256 text not null,
  phash text,
  page_count int default 1,
  analysis_status text default 'queued',
  uploaded_at timestamptz default now()
);
create index if not exists idx_documents_sha256 on documents(sha256);

-- 4. Extracted Fields
create table if not exists extracted_fields (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  field_key text not null,
  value text,
  confidence numeric,
  page int default 0,
  bbox jsonb
);

-- 5. Rule Sets
create table if not exists rule_sets (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  version int not null,
  source_ref text,
  rules jsonb not null,
  active boolean default false,
  unique (category, version)
);

-- 6. Findings
create table if not exists findings (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  rule_set_id uuid references rule_sets(id),
  rule_id text not null,
  kind finding_kind not null,
  severity text not null default 'warning', -- 'blocking', 'warning', 'info'
  message text not null,
  evidence jsonb not null default '{}'::jsonb,
  status text default 'open',              -- 'open', 'confirmed', 'dismissed'
  created_at timestamptz default now()
);

-- 7. Reviews (Officer decisions on findings)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid references findings(id) on delete cascade,
  reviewer text not null,
  decision text not null, -- 'confirmed', 'dismissed'
  notes text,
  at timestamptz default now()
);

-- 8. Verifications (7-state verification model)
create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  source text not null,   -- 'mock_issuer', 'digilocker', 'qr_lookup', 'manual'
  status verif_status not null default 'verification_pending',
  request_ref text,
  response jsonb,
  checked_at timestamptz default now()
);

-- 9. Institution Records (Authoritative AICTE records)
create table if not exists institution_records (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references institutions(id) on delete cascade,
  record_type text not null,
  payload jsonb not null,
  valid_from date,
  valid_to date
);

-- 10. Alerts
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  type text not null,
  to_role text not null,
  message text not null,
  sent_at timestamptz default now(),
  acknowledged_by text
);

-- 11. Hash-Chained Audit Log
create table if not exists audit_log (
  id bigserial primary key,
  actor text not null,
  action text not null,
  entity text not null,
  payload jsonb not null,
  prev_hash text,
  hash text not null,
  at timestamptz default now()
);
