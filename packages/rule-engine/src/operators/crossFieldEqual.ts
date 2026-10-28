import { Application, DocumentItem, ExtractedField, Finding, RuleDefinition } from '@nirikshai/shared-types';

export function stringSimilarity(str1: string, str2: string): number {
  const s1 = (str1 || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const s2 = (str2 || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return 1.0 - distance / maxLen;
}

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

export function evaluateCrossFieldEqual(
  application: Application,
  rule: RuleDefinition,
  ruleSetId: string
): Finding | null {
  const fieldRefs = rule.fields || [];
  if (fieldRefs.length < 2) return null;

  const documents = application.documents || [];
  const extractedPairs = fieldRefs.map(ref => ({ ref, ...findField(documents, ref) }));
  const resolved = extractedPairs.filter(p => p.field && p.field.value);

  if (resolved.length >= 2) {
    const base = resolved[0];
    const threshold = rule.fuzzy ?? 1.0;

    for (let i = 1; i < resolved.length; i++) {
      const compareWith = resolved[i];
      const similarity = stringSimilarity(base.field!.value, compareWith.field!.value);

      if (similarity < threshold) {
        return {
          id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          application_id: application.id,
          rule_set_id: ruleSetId,
          rule_id: rule.id,
          kind: 'inconsistent',
          severity: 'blocking',
          message: `Cross-document mismatch between '${base.ref}' ("${base.field!.value}") and '${compareWith.ref}' ("${compareWith.field!.value}") [Similarity: ${(similarity * 100).toFixed(1)}%]`,
          evidence: {
            doc_ids: [base.doc!.id, compareWith.doc!.id],
            pages: [base.field!.source_page || 1, compareWith.field!.source_page || 1],
            bboxes: [base.field!.bbox, compareWith.field!.bbox].filter(Boolean) as any,
            field_key: `${base.ref} vs ${compareWith.ref}`,
            extracted_value: compareWith.field!.value,
            expected_value: base.field!.value,
            confidence: Math.min(base.field!.confidence, compareWith.field!.confidence),
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
