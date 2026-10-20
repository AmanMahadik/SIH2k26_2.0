'use client';

import React, { useState } from 'react';
import { RuleDefinition, RuleSet } from '@/lib/types';
import { Layers, Plus, CheckCircle, ShieldCheck, FileCode, ArrowRight, BookOpen } from 'lucide-react';

const INITIAL_RULES: RuleDefinition[] = [
  {
    id: 'R-DOC-AFFIDAVIT',
    type: 'required_document',
    doc_type: 'affidavit',
    clause: 'APH 2024-27 §4.1.2',
    description: 'Submission of sworn affidavit on prescribed stamp paper is mandatory for Extension of Approval.',
  },
  {
    id: 'R-DOC-NOC',
    type: 'required_document',
    doc_type: 'noc_state',
    clause: 'APH 2024-27 §4.1.4',
    description: 'NOC from State Government / Affiliating University is mandatory for continuing courses.',
  },
  {
    id: 'R-DOC-LAND',
    type: 'required_document',
    doc_type: 'land_compliance',
    clause: 'APH 2024-27 §4.2.1',
    description: 'Proof of barrier-free campus land compliance and infrastructure certification.',
  },
  {
    id: 'R-EXP-NOC',
    type: 'date_valid_for_year',
    doc_type: 'noc_state',
    field: 'valid_to',
    year: '2026-27',
    clause: 'APH 2024-27 §4.3.1',
    description: 'State/University NOC validity must extend across the academic year 2026-27.',
  },
  {
    id: 'R-EXP-AFFIDAVIT',
    type: 'date_valid_for_year',
    doc_type: 'affidavit',
    field: 'execution_date',
    year: '2026-27',
    clause: 'APH 2024-27 §4.1.3',
    description: 'Affidavit execution date must be within 180 days of the EoA application filing.',
  },
  {
    id: 'R-XDOC-NAME',
    type: 'cross_field_equal',
    fields: ['eoa_letter.institution_name', 'affidavit.institution_name', 'noc_state.institution_name'],
    fuzzy: 0.90,
    clause: 'APH 2024-27 §4.4.2',
    description: 'Legal institution name must be identical across all submitted documents and AICTE master records.',
  },
  {
    id: 'R-REC-INTAKE',
    type: 'record_equals',
    field: 'eoa_letter.approved_intake',
    record: 'approved_intake',
    clause: 'APH 2024-27 §4.5.1',
    description: 'Total claimed intake must not exceed the sanctioned intake recorded in the AICTE national registry.',
  },
  {
    id: 'R-TER-FEE',
    type: 'status_equals',
    record: 'ter_status',
    value: 'paid',
    clause: 'APH 2024-27 §4.6.1',
    description: 'Technical Education Regulatory (TER) fee payment status must be fully settled and confirmed.',
  },
];

export default function RulesManagerPage() {
  const [rules, setRules] = useState<RuleDefinition[]>(INITIAL_RULES);
  const [selectedCategory, setSelectedCategory] = useState<string>('EOA_EXISTING');
  const [version, setVersion] = useState<number>(1);
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<RuleDefinition>>({
    id: 'R-NEW-CUSTOM',
    type: 'required_document',
    doc_type: 'faculty_list',
    clause: 'APH 2024-27 §5.1.0',
    description: 'Certified faculty roster conforming to cadre-ratio guidelines.',
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.id || !newRule.clause || !newRule.description) return;
    setRules([...rules, newRule as RuleDefinition]);
    setVersion(v => v + 1);
    setIsNewRuleOpen(false);
    alert(`Rule ${newRule.id} added! New rule set published as version v${version + 1}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Regulatory Rule Manager</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Rules as Versioned Data
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Checklists derived from AICTE Approval Process Handbook (APH 2024-27) versioned as declarative JSON data.
          </p>
        </div>

        <button
          onClick={() => setIsNewRuleOpen(!isNewRuleOpen)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Rule (v{version + 1})</span>
        </button>
      </div>

      {/* New Rule Modal / Drawer */}
      {isNewRuleOpen && (
        <form onSubmit={handleAddRule} className="bg-white p-6 rounded-xl border-2 border-blue-600 shadow-md space-y-4">
          <h3 className="text-base font-bold text-slate-900">Add New Regulatory Rule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Rule ID</label>
              <input
                type="text"
                value={newRule.id}
                onChange={e => setNewRule({ ...newRule, id: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded p-2 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Rule Type</label>
              <select
                value={newRule.type}
                onChange={e => setNewRule({ ...newRule, type: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded p-2 text-xs bg-slate-50"
              >
                <option value="required_document">required_document</option>
                <option value="date_valid_for_year">date_valid_for_year</option>
                <option value="cross_field_equal">cross_field_equal</option>
                <option value="record_equals">record_equals</option>
                <option value="status_equals">status_equals</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700">Handbook Clause Citation</label>
              <input
                type="text"
                value={newRule.clause}
                onChange={e => setNewRule({ ...newRule, clause: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded p-2 text-xs"
                placeholder="APH 2024-27 §4.X.X"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Rule Description & Norm</label>
            <input
              type="text"
              value={newRule.description}
              onChange={e => setNewRule({ ...newRule, description: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded p-2 text-xs"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsNewRuleOpen(false)}
              className="text-xs px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-bold px-4 py-1.5 rounded bg-blue-900 text-white"
            >
              Save & Activate
            </button>
          </div>
        </form>
      )}

      {/* Rules Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-bold text-slate-700">ACTIVE RULESET:</span>
            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">
              {selectedCategory}.v{version}.json
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Source: APH 2024-27 Chapter IV</span>
          </div>
          <span className="text-emerald-700 font-bold flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Active in Scrutiny Engine</span>
          </span>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-white border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Rule ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Clause Citation</th>
              <th className="py-3 px-4">Description & Regulatory Logic</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-950 text-xs">
                  {rule.id}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {rule.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-amber-800">
                  {rule.clause}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-700 max-w-md">
                  {rule.description}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
