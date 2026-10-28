import { Application, DocumentItem, ExtractedField, Finding, InstitutionRecordPayload, RuleDefinition } from '@nirikshai/shared-types';
import { stringSimilarity } from './crossFieldEqual';

function findField(documents: DocumentItem[], fieldRef: string): { doc?: DocumentItem; field?: ExtractedField } {
  let docType: string | undefined;
  let key = fieldRef;

  if (fieldRef.includes('.')) {
    const parts = fieldRef.split('.');
    docType = parts[0];
    key = parts[1];
  }

  for (const doc of documents) {
    if (docType && doc.doc_type !== docType) continue;
    const f = doc.extracted_fields?.find(item => item.field_key === key);
    if (f) return { doc, field: f };
  }
  return {};
}

export function evaluateRecordEquals(
  application: Application,
  rule: RuleDefinition,
  ruleSetId: string,
  records?: InstitutionRecordPayload
): Finding | null {
  if (!records) return null;

  const targetDocType = rule.doc_type || 'eoa_letter';
  const targetField = rule.field || 'institution_name';
  const documents = application.documents || [];
  const { doc, field } = findField(documents, `${targetDocType}.${targetField}`);

  if (doc && field && field.value) {
    let expectedVal = '';
    if (targetField === 'institution_name') expectedVal = records.legal_name;
    else if (targetField === 'permanent_id') expectedVal = records.permanent_id;
    else if (targetField === 'approved_intake') expectedVal = String(records.approved_intake);

    if (expectedVal) {
      const sim = stringSimilarity(field.value, expectedVal);
      const threshold = rule.fuzzy ?? 0.85;

      if (sim < threshold) {
        return {
          id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          application_id: application.id,
          rule_set_id: ruleSetId,
          rule_id: rule.id,
          kind: 'inconsistent',
          severity: 'blocking',
          message: `Submitted ${targetField} ("${field.value}") conflicts with AICTE Master Registry ("${expectedVal}")`,
          evidence: {
            doc_ids: [doc.id],
            pages: field.source_page ? [field.source_page] : [1],
            bboxes: field.bbox ? [field.bbox] : [],
            field_key: targetField,
            extracted_value: field.value,
            expected_value: expectedVal,
            confidence: field.confidence,
            clause: rule.clause,
          },
          status: 'open',
          created_at: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}
