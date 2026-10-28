import { Application, Finding, RuleDefinition } from '@nirikshai/shared-types';

export function evaluateRequiredDocument(
  application: Application,
  rule: RuleDefinition,
  ruleSetId: string
): Finding | null {
  const documents = application.documents || [];
  const found = documents.some(
    d => d.doc_type === rule.doc_type && d.analysis_status !== 'failed'
  );

  if (!found) {
    return {
      id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      application_id: application.id,
      rule_set_id: ruleSetId,
      rule_id: rule.id,
      kind: 'missing',
      severity: 'blocking',
      message: `Mandatory document missing: ${(rule.doc_type || '').replace(/_/g, ' ').toUpperCase()}`,
      evidence: {
        doc_ids: [],
        pages: [],
        bboxes: [],
        field_key: rule.doc_type || '',
        extracted_value: null,
        expected_value: `Uploaded copy of ${rule.doc_type}`,
        confidence: 1.0,
        clause: rule.clause,
      },
      status: 'open',
      created_at: new Date().toISOString(),
    };
  }

  return null;
}
