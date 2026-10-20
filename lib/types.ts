// lib/types.ts - Core TypeScript Data Models for NirikshAI

export type AppRole = 'institution' | 'officer' | 'admin' | 'auditor';

export type AppStatus = 'draft' | 'analysing' | 'submitted' | 'in_review' | 'closed';

export type FindingKind =
  | 'missing'
  | 'expired'
  | 'inconsistent'
  | 'tamper_indicator'
  | 'duplicate'
  | 'infra_advisory'
  | 'record_mismatch';

export type FindingSeverity = 'blocking' | 'warning' | 'info';

export type FindingStatus = 'open' | 'confirmed' | 'dismissed';

export type VerifStatus =
  | 'verified'
  | 'mismatch_detected'
  | 'expired'
  | 'verification_pending'
  | 'source_unavailable'
  | 'manual_review_required';

export interface BoundingBox {
  x: number; // 0.0 to 1.0 (normalized)
  y: number;
  w: number;
  h: number;
}

export interface ExtractedField {
  id: string;
  document_id: string;
  field_key: string;
  value: string;
  confidence: number;
  page: number;
  bbox?: BoundingBox;
}

export interface DocumentItem {
  id: string;
  application_id: string;
  doc_type: string;
  filename: string;
  storage_path: string;
  sha256: string;
  phash?: string;
  page_count: number;
  analysis_status: 'queued' | 'processing' | 'completed' | 'failed';
  uploaded_at: string;
  extracted_fields?: ExtractedField[];
  tamper_indicators?: TamperIndicator[];
  verification?: VerifResult;
}

export interface TamperIndicator {
  signal: 'pdf_incremental_updates' | 'metadata_date_gap' | 'duplicate_hash' | 'text_layer_diff' | 'font_anomaly';
  severity: 'low' | 'medium' | 'high';
  risk_level: 'none' | 'review' | 'priority_review';
  reason: string;
  evidence_detail: string;
}

export interface FindingEvidence {
  doc_ids: string[];
  pages: number[];
  bboxes: BoundingBox[];
  field_key: string;
  extracted_value: string | null;
  expected_value: string | null;
  confidence: number | null;
  clause: string;
}

export interface Finding {
  id: string;
  application_id: string;
  rule_set_id?: string;
  rule_id: string;
  kind: FindingKind;
  severity: FindingSeverity;
  message: string;
  evidence: FindingEvidence;
  status: FindingStatus;
  created_at: string;
  review?: {
    reviewer: string;
    decision: 'confirmed' | 'dismissed';
    notes?: string;
    at: string;
  };
}

export interface VerifResult {
  status: VerifStatus;
  source: 'mock_issuer' | 'digilocker' | 'qr_lookup' | 'manual';
  timestamp: string;
  request_ref: string | null;
  comparison: {
    field_key: string;
    submitted_value: string;
    source_value: string | null;
    match: boolean | null;
  }[];
  notes?: string;
}

export interface InstitutionRecordPayload {
  aicte_id: string;
  approved_intake: string;
  ter_status: 'paid' | 'pending' | 'overdue';
  deficiency_status: 'clear' | 'pending' | 'show_cause';
  eoa_history: {
    year: string;
    letter_number: string;
    status: string;
  }[];
}

export interface Institution {
  id: string;
  aicte_id: string;
  name: string;
  state: string;
  university: string;
  records?: InstitutionRecordPayload;
}

export interface Application {
  id: string;
  institution_id: string;
  category: string;
  academic_year: string;
  status: AppStatus;
  priority: number;
  created_by: string;
  submitted_at?: string;
  created_at: string;
  institution?: Institution;
  documents?: DocumentItem[];
  findings?: Finding[];
  completeness_score?: number;
}

export interface RuleDefinition {
  id: string;
  type: string;
  doc_type?: string;
  field?: string;
  fields?: string[];
  year?: string;
  record?: string;
  value?: string;
  fuzzy?: number;
  clause: string;
  description: string;
}

export interface RuleSet {
  id: string;
  category: string;
  version: number;
  source_ref: string;
  rules: RuleDefinition[];
  active: boolean;
}

export interface AuditEvent {
  id: number;
  actor: string;
  action: string;
  entity: string;
  payload: Record<string, any>;
  prev_hash: string;
  hash: string;
  at: string;
}
