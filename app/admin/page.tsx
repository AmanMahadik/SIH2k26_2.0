'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GovLayout from '@/components/gov/GovLayout';
import {
  Users,
  FileSpreadsheet,
  Monitor,
  CheckCircle2,
  Settings,
  Plus,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  FileText,
  Database,
} from 'lucide-react';
import { RuleDefinition } from '@/lib/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [rules, setRules] = useState<RuleDefinition[]>([
    {
      id: 'R-DOC-AFFIDAVIT',
      type: 'required_document',
      doc_type: 'affidavit',
      clause: 'APH 2024-27 §4.1.2',
      description: 'Sworn affidavit on prescribed stamp paper is mandatory for Extension of Approval.',
    },
    {
      id: 'R-EXP-NOC',
      type: 'date_valid_for_year',
      doc_type: 'noc_state',
      field: 'valid_to',
      year: '2026-27',
      clause: 'APH 2024-27 §4.3.1',
      description: 'State NOC validity must cover up to at least Academic Year 2026-27.',
    },
    {
      id: 'R-REC-INTAKE',
      type: 'record_equals',
      field: 'eoa_letter.approved_intake',
      record: 'approved_intake',
      clause: 'APH 2024-27 §4.5.1',
      description: 'Intake claimed must not exceed sanctioned quota in AICTE national database.',
    },
  ]);
  const [ruleVersion, setRuleVersion] = useState(1);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handlePublishNewRule = () => {
    setRuleVersion((v) => v + 1);
    setIsPublishModalOpen(false);
    alert(`Success: Rule set updated! Published as APH_EOA_EXISTING.v${ruleVersion + 1}.json`);
  };

  return (
    <GovLayout role="admin" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* Tab 1: Home View (Matches Mockup 4.4) */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* System Overview: 2x2 Grid (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#0B2E5C] border-b border-slate-100 pb-3">
                System Overview
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* 1. Total Users */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Total Users</p>
                    <h3 className="text-2xl font-extrabold text-[#0B2E5C] mt-0.5">1,248</h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-blue-100 text-[#0B2E5C] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Applications */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Applications</p>
                    <h3 className="text-2xl font-extrabold text-[#0B2E5C] mt-0.5">532</h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-emerald-100 text-[#1E7B34] flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Active Sessions */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Active Sessions</p>
                    <h3 className="text-2xl font-extrabold text-[#0B2E5C] mt-0.5">324</h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-indigo-100 text-[#4338CA] flex items-center justify-center">
                    <Monitor className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. System Health */}
                <div className="bg-slate-50 border border-slate-200 rounded-[6px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">System Health</p>
                    <h3 className="text-2xl font-extrabold text-[#1E7B34] mt-0.5">99.9%</h3>
                  </div>
                  <div className="w-9 h-9 rounded bg-green-100 text-[#1E7B34] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>Infrastructure: Azure Central India Flexible Server</span>
                <span className="font-semibold text-emerald-700">Online &amp; Operational</span>
              </div>
            </div>

            {/* Recent Activities (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-[#0B2E5C]">
                  Recent Activities
                </h2>
                <button className="text-xs font-semibold text-[#0B57D0] hover:underline">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-2.5 pb-2 border-b border-slate-50">
                  <div className="w-7 h-7 rounded bg-blue-50 text-[#1D4E9E] flex items-center justify-center shrink-0 mt-0.5">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold leading-tight">New user registered – Inst1234</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">10 mins ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 pb-2 border-b border-slate-50">
                  <div className="w-7 h-7 rounded bg-amber-50 text-[#E8801A] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold leading-tight">Policy updated – EoA 2026</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded bg-emerald-50 text-[#1E7B34] flex items-center justify-center shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold leading-tight">Backup completed</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('config')}
                  className="w-full py-2 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold rounded-[4px] transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Handbook Rules</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Config / Rule Manager (Section 4.4) */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">
                  Regulatory Rule Sets (Rules as Versioned Data)
                </h2>
                <p className="text-xs text-[#5B6574] mt-0.5">
                  Active Rule Set: <span className="font-mono font-bold text-slate-800">EOA_EXISTING.v{ruleVersion}.json</span> (Handbook 2024-27)
                </p>
              </div>

              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="inline-flex items-center space-x-1.5 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold px-4 py-2 rounded-[6px] shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Version (v{ruleVersion + 1})</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                  <tr>
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Handbook Clause</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">{r.id}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{r.type}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{r.clause}</td>
                      <td className="py-3 px-3 text-slate-600">{r.description}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Active (v{ruleVersion})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confirm Publish Modal */}
            {isPublishModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#0B2E5C]">
                    Publish New Rule Set Version (v{ruleVersion + 1})
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This will create a new declarative rule snapshot <code className="font-bold">EOA_EXISTING.v{ruleVersion + 1}.json</code>. All newly submitted applications will be evaluated against this version without software redeployment.
                  </p>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setIsPublishModalOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishNewRule}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#8B1A1A] hover:bg-[#6E1414] rounded"
                    >
                      Confirm &amp; Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GovLayout>
  );
}
