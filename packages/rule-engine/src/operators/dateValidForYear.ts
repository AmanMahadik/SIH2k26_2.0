import { Application, DocumentItem, ExtractedField, Finding, RuleDefinition } from '@nirikshai/shared-types';

export function evaluateDateValidForYear(
  application: Application,
  rule: RuleDefinition,
  ruleSetId: string
): Finding | null {
  const documents = application.documents || [];
  const targetDoc = documents.find(d => d.doc_type === rule.doc_type);
  if (!targetDoc) return null; // Missing document rule handles absence

  const dateField = targetDoc.extracted_fields?.find(f => f.field_key === rule.field);
  if (!dateField || !dateField.value) {
    return {
      id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      application_id: application.id,
      rule_set_id: ruleSetId,
      rule_id: rule.id,
      kind: 'incomplete',
      severity: 'blocking',
      message: `Date field '${rule.field}' unreadable or missing in ${rule.doc_type}`,
      evidence: {
        doc_ids: [targetDoc.id],
        pages: dateField?.source_page ? [dateField.source_page] : [1],
        bboxes: dateField?.bbox ? [dateField.bbox] : [],
        field_key: rule.field || '',
        extracted_value: null,
        expected_value: `Valid date string within ${rule.year || '2026-27'}`,
        confidence: 0.0,
        clause: rule.clause,
      },
      status: 'open',
      created_at: new Date().toISOString(),
    };
  }

  const parsedDate = new Date(dateField.value);
  if (isNaN(parsedDate.getTime())) {
    return {
      id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      application_id: application.id,
      rule_set_id: ruleSetId,
      rule_id: rule.id,
      kind: 'inconsistent',
      severity: 'blocking',
      message: `Invalid date format '${dateField.value}' in ${rule.doc_type}`,
      evidence: {
        doc_ids: [targetDoc.id],
        pages: dateField.source_page ? [dateField.source_page] : [1],
        bboxes: dateField.bbox ? [dateField.bbox] : [],
        field_key: rule.field || '',
        extracted_value: dateField.value,
        expected_value: 'YYYY-MM-DD standard date',
        confidence: dateField.confidence,
        clause: rule.clause,
      },
      status: 'open',
      created_at: new Date().toISOString(),
    };
  }

  // Academic year EoA 2026-27 requires validity extending at least to 2026-06-30
  const minThreshold = new Date('2026-06-01');
  if (parsedDate < minThreshold) {
    return {
      id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      application_id: application.id,
      rule_set_id: ruleSetId,
      rule_id: rule.id,
      kind: 'expired',
      severity: 'blocking',
      message: `Document ${rule.doc_type} expired on ${dateField.value}. Must be valid for ${rule.year || '2026-27'}.`,
      evidence: {
        doc_ids: [targetDoc.id],
        pages: dateField.source_page ? [dateField.source_page] : [1],
        bboxes: dateField.bbox ? [dateField.bbox] : [],
        field_key: rule.field || '',
        extracted_value: dateField.value,
        expected_value: `>= 2026-06-30`,
        confidence: dateField.confidence,
        clause: rule.clause,
      },
      status: 'open',
      created_at: new Date().toISOString(),
    };
  }

  return null;
}
