// packages/rule-engine/src/evaluator.ts
// Deterministic Regulatory Rule Evaluator for NirikshAI

import { Application, Finding, InstitutionRecordPayload, RuleSet } from '@nirikshai/shared-types';
import { evaluateRequiredDocument } from './operators/requiredDocument';
import { evaluateDateValidForYear } from './operators/dateValidForYear';
import { evaluateCrossFieldEqual, stringSimilarity } from './operators/crossFieldEqual';
import { evaluateRecordEquals } from './operators/recordEquals';

export { stringSimilarity };

export function evaluateRules(
  application: Application,
  ruleSet: RuleSet,
  records?: InstitutionRecordPayload
): Finding[] {
  const findings: Finding[] = [];

  for (const rule of ruleSet.rules) {
    let finding: Finding | null = null;

    switch (rule.type) {
      case 'required_document':
        finding = evaluateRequiredDocument(application, rule, ruleSet.id);
        break;

      case 'date_valid_for_year':
        finding = evaluateDateValidForYear(application, rule, ruleSet.id);
        break;

      case 'cross_field_equal':
        finding = evaluateCrossFieldEqual(application, rule, ruleSet.id);
        break;

      case 'record_equals':
        finding = evaluateRecordEquals(application, rule, ruleSet.id, records);
        break;

      default:
        break;
    }

    if (finding) {
      findings.push(finding);
    }
  }

  // Also verify TER payment if status is not paid/exempted
  if (application.ter_payment_status === 'pending') {
    findings.push({
      id: `finding-ter-pending-${Date.now()}`,
      application_id: application.id,
      rule_set_id: ruleSet.id,
      rule_id: 'R-TER-PAYMENT',
      kind: 'payment_deficiency',
      severity: 'blocking',
      message: 'TER (Technical Education Regulatory) processing fee payment is pending.',
      evidence: {
        doc_ids: [],
        pages: [],
        bboxes: [],
        field_key: 'ter_payment_status',
        extracted_value: 'pending',
        expected_value: 'paid',
        confidence: 1.0,
        clause: 'APH 2024-27 §1.8.4',
      },
      status: 'open',
      created_at: new Date().toISOString(),
    });
  }

  return findings;
}
