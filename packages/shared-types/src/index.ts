// packages/shared-types/src/index.ts
// Canonical shared type definitions for NirikshAI AICTE Regulatory Compliance Platform

export type Role = 'institution' | 'scrutiny_officer' | 'committee_member' | 'admin' | 'auditor';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_scrutiny'
  | 'deficiency_communicated'
  | 'rectified'
  | 'approved'
  | 'rejected'
  | 'flagged_for_inspection';

export type VerifStatus =
  | 'verified'
  | 'mismatch_detected'
  | 'expired'
  | 'verification_pending'
  | 'source_unavailable'
  | 'manual_review_required'
  | 'unsupported';

export type FindingSeverity = 'blocking' | 'flag' | 'info';

export type FindingKind =
  | 'missing'
  | 'incomplete'
  | 'expired'
  | 'inconsistent'
  | 'alteration'
  | 'duplicate'
  | 'infrastructure_gap'
  | 'payment_deficiency';

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ExtractedField {
  id?: string;
  field_key: string;
  value: string;
  confidence: number;
  source_page?: number;
  bbox?: BoundingBox;
  raw_text?: string;
}

export interface DocumentForensics {
  is_altered: boolean;
  tamper_risk: 'low' | 'medium' | 'high' | 'critical';
  incremental_updates_count: number;
  font_inconsistencies: string[];
  producer_metadata?: string;
  modification_date?: string;
  duplicate_hash_match?: string;
}

export interface DocumentItem {
  id: string;
  application_id: string;
  doc_type: string;
  filename: string;
  file_url: string;
  sha256_hash: string;
  page_count: number;
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  verification_status: VerifStatus;
  forensics?: DocumentForensics;
  extracted_fields?: ExtractedField[];
  uploaded_at: string;
}

export interface FindingEvidence {
  doc_ids: string[];
  pages: number[];
  bboxes: BoundingBox[];
  field_key: string;
  extracted_value: string | null;
  expected_value: string | null;
  confidence: number;
  clause?: string;
}

export interface Finding {
  id: string;
  application_id: string;
  rule_set_id: string;
  rule_id: string;
  kind: FindingKind;
  severity: FindingSeverity;
  message: string;
  evidence: FindingEvidence;
  status: 'open' | 'rectified' | 'waived' | 'overridden';
  rectification_notes?: string;
  created_at: string;
}

export interface VerifComparison {
  field_key: string;
  submitted_value: string;
  source_value: string;
  match: boolean;
}

export interface VerifResult {
  status: VerifStatus;
  source: string;
  timestamp: string;
  request_ref: string;
  comparison: VerifComparison[];
  notes?: string;
}

export interface Application {
  id: string;
  institution_id: string;
  application_number: string;
  academic_year: string;
  category: 'EOA_EXISTING' | 'NEW_INSTITUTION' | 'INCREASE_INTAKE' | 'EXTENSION_VOCATIONAL';
  status: ApplicationStatus;
  submitted_at?: string;
  ter_payment_status: 'paid' | 'pending' | 'exempted';
  ter_receipt_ref?: string;
  documents?: DocumentItem[];
  findings?: Finding[];
  overall_compliance_score?: number;
  created_at: string;
  updated_at: string;
}

export interface InstitutionRecordPayload {
  institution_id: string;
  legal_name: string;
  permanent_id: string;
  current_address: string;
  approved_intake: number;
  programmes: string[];
  eoa_history_years: string[];
  land_acres: number;
  deficiency_status: 'none' | 'cleared' | 'active';
  ter_received: boolean;
}

export interface AuditEvent {
  id: number;
  prev_hash: string;
  hash: string;
  actor: string;
  action: string;
  entity: string;
  payload: any;
  at: string;
}

export interface RuleDefinition {
  id: string;
  type: 'required_document' | 'date_valid_for_year' | 'cross_field_equal' | 'record_equals' | 'infra_threshold';
  doc_type?: string;
  field?: string;
  fields?: string[];
  year?: string;
  expected?: string | number;
  min_value?: number;
  fuzzy?: number;
  clause: string;
  description: string;
}

export interface RuleSet {
  id: string;
  category: string;
  version: number;
  rules: RuleDefinition[];
}
