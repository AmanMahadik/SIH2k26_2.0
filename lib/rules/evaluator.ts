// lib/rules/evaluator.ts - Deterministic Rule Evaluator for NirikshAI
// Evaluates APH 2024-27 Regulatory Rules against extracted fields & official records

import { Application, DocumentItem, ExtractedField, Finding, FindingKind, FindingSeverity, InstitutionRecordPayload, RuleDefinition, RuleSet } from '../types';

/**
 * Normalizes strings and computes basic Levenshtein-based similarity (0.0 to 1.0)
 */
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

/**
 * Extracts a specific field value by "doc_type.field_key" or "field_key"
 */
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

/**
 * Evaluates all rules in the rule set for an application
 */
export function evaluateRules(
  application: Application,
  ruleSet: RuleSet,
  records?: InstitutionRecordPayload
): Finding[] {
  const findings: Finding[] = [];
  const documents = application.documents || [];

  for (const rule of ruleSet.rules) {
    const timestamp = new Date().toISOString();

    switch (rule.type) {
      // 1. Required Document check
      case 'required_document': {
        const found = documents.some(
          d => d.doc_type === rule.doc_type && d.analysis_status !== 'failed'
        );
        if (!found) {
          findings.push({
            id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            application_id: application.id,
            rule_set_id: ruleSet.id,
            rule_id: rule.id,
            kind: 'missing',
            severity: 'blocking',
            message: `Mandatory document missing: ${rule.doc_type.replace(/_/g, ' ').toUpperCase()}`,
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
            created_at: timestamp,
          });
        }
        break;
      }

      // 2. Field Present check
      case 'field_present': {
        const { doc, field } = findField(documents, `${rule.doc_type}.${rule.field}`);
        if (!field || !field.value || field.value.trim() === '') {
          findings.push({
            id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            application_id: application.id,
            rule_set_id: ruleSet.id,
            rule_id: rule.id,
            kind: 'missing',
            severity: 'warning',
            message: `Required field '${rule.field}' is missing or unreadable in ${rule.doc_type}`,
            evidence: {
              doc_ids: doc ? [doc.id] : [],
              pages: field ? [field.page] : [0],
              bboxes: field?.bbox ? [field.bbox] : [],
              field_key: rule.field || '',
              extracted_value: null,
              expected_value: 'Legible non-empty value',
              confidence: field?.confidence || 0,
              clause: rule.clause,
            },
            status: 'open',
            created_at: timestamp,
          });
        }
        break;
      }

      // 3. Date Valid For Year check
      case 'date_valid_for_year': {
        const { doc, field } = findField(documents, `${rule.doc_type}.${rule.field}`);
        if (field && field.value) {
          // Parse date
          const dateStr = field.value;
          const parsed = new Date(dateStr);
          // For EoA 2026-27, validity must cover up to at least 2026-06-30
          const cutoff = new Date('2026-06-01');
          if (!isNaN(parsed.getTime()) && parsed < cutoff) {
            findings.push({
              id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              application_id: application.id,
              rule_set_id: ruleSet.id,
              rule_id: rule.id,
              kind: 'expired',
              severity: 'blocking',
              message: `Document expired: ${rule.doc_type} expired on ${dateStr}, prior to Academic Year 2026-27.`,
              evidence: {
                doc_ids: doc ? [doc.id] : [],
                pages: [field.page],
                bboxes: field.bbox ? [field.bbox] : [],
                field_key: rule.field || '',
                extracted_value: field.value,
                expected_value: 'Valid until at least June 2026',
                confidence: field.confidence,
                clause: rule.clause,
              },
              status: 'open',
              created_at: timestamp,
            });
          }
        }
        break;
      }

      // 4. Cross Field Equal check
      case 'cross_field_equal': {
        const fieldRefs = rule.fields || [];
        const extractedItems = fieldRefs.map(ref => ({ ref, ...findField(documents, ref) }));
        const validItems = extractedItems.filter(item => item.field && item.field.value);

        if (validItems.length >= 2) {
          const first = validItems[0];
          const threshold = rule.fuzzy || 0.90;

          for (let i = 1; i < validItems.length; i++) {
            const current = validItems[i];
            const sim = stringSimilarity(first.field!.value, current.field!.value);
            if (sim < threshold) {
              findings.push({
                id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                application_id: application.id,
                rule_set_id: ruleSet.id,
                rule_id: rule.id,
                kind: 'inconsistent',
                severity: 'blocking',
                message: `Cross-document mismatch detected for '${first.ref}' vs '${current.ref}' (Match score: ${(sim * 100).toFixed(0)}%, required ${threshold * 100}%).`,
                evidence: {
                  doc_ids: [first.doc!.id, current.doc!.id],
                  pages: [first.field!.page, current.field!.page],
                  bboxes: [first.field!.bbox, current.field!.bbox].filter(Boolean) as any,
                  field_key: first.ref,
                  extracted_value: `"${first.field!.value}" vs "${current.field!.value}"`,
                  expected_value: 'Identical institution legal name',
                  confidence: Math.min(first.field!.confidence, current.field!.confidence),
                  clause: rule.clause,
                },
                status: 'open',
                created_at: timestamp,
              });
              break;
            }
          }
        }
        break;
      }

      // 5. Record Equals check (against AICTE records)
      case 'record_equals': {
        const { doc, field } = findField(documents, rule.field || '');
        if (field && records) {
          const officialVal = (records as any)[rule.record || ''];
          if (officialVal && field.value !== officialVal) {
            findings.push({
              id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              application_id: application.id,
              rule_set_id: ruleSet.id,
              rule_id: rule.id,
              kind: 'record_mismatch',
              severity: 'blocking',
              message: `Official record discrepancy: submitted ${field.field_key} (${field.value}) does not match authorized AICTE record (${officialVal}).`,
              evidence: {
                doc_ids: doc ? [doc.id] : [],
                pages: [field.page],
                bboxes: field.bbox ? [field.bbox] : [],
                field_key: field.field_key,
                extracted_value: field.value,
                expected_value: officialVal,
                confidence: field.confidence,
                clause: rule.clause,
              },
              status: 'open',
              created_at: timestamp,
            });
          }
        }
        break;
      }

      // 6. Status Equals check
      case 'status_equals': {
        if (records) {
          const actualStatus = (records as any)[rule.record || ''];
          if (actualStatus && actualStatus !== rule.value) {
            findings.push({
              id: `finding-${rule.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              application_id: application.id,
              rule_set_id: ruleSet.id,
              rule_id: rule.id,
              kind: 'record_mismatch',
              severity: 'blocking',
              message: `Regulatory condition failed: ${rule.record} is '${actualStatus}', required '${rule.value}'.`,
              evidence: {
                doc_ids: [],
                pages: [],
                bboxes: [],
                field_key: rule.record || '',
                extracted_value: actualStatus,
                expected_value: rule.value || 'paid',
                confidence: 1.0,
                clause: rule.clause,
              },
              status: 'open',
              created_at: timestamp,
            });
          }
        }
        break;
      }
    }
  }

  return findings;
}
