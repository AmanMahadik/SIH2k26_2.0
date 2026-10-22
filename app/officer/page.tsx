'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GovLayout from '@/components/gov/GovLayout';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileX2,
  ListChecks,
  AlertOctagon,
  Eye,
  FileSpreadsheet,
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export default function OfficerDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allApps = [
    {
      id: 'EA-2026-0452',
      institution: 'ABC Engineering College (PICT)',
      submittedOn: '18 Oct 2026',
      status: 'Under Review',
      statusColor: 'bg-blue-50 text-[#1D4E9E] border-blue-200',
      caseId: 'app-1',
      category: 'Extension of Approval',
      deficiencies: 0,
    },
    {
      id: 'EA-2026-0451',
      institution: 'Delhi College of Engineering & Tech',
      submittedOn: '17 Oct 2026',
      status: 'Needs Clarification',
      statusColor: 'bg-orange-50 text-[#E8801A] border-orange-200',
      caseId: 'app-2',
      category: 'Extension of Approval',
      deficiencies: 2,
    },
    {
      id: 'EA-2026-0450',
      institution: 'Apex Technical Campus',
      submittedOn: '17 Oct 2026',
      status: 'Under Review',
      statusColor: 'bg-blue-50 text-[#1D4E9E] border-blue-200',
      caseId: 'app-3',
      category: 'Extension of Approval',
      deficiencies: 1,
    },
    {
      id: 'EA-2026-0449',
      institution: 'National Institute of Management & Science',
      submittedOn: '16 Oct 2026',
      status: 'Needs Clarification',
      statusColor: 'bg-orange-50 text-[#E8801A] border-orange-200',
      caseId: 'app-4',
      category: 'Extension of Approval',
      deficiencies: 1,
    },
    {
      id: 'EA-2026-0448',
      institution: 'Maharashtra Institute of Tech',
      submittedOn: '15 Oct 2026',
      status: 'Verified',
      statusColor: 'bg-emerald-50 text-[#1E7B34] border-emerald-200',
      caseId: 'app-1',
      category: 'Extension of Approval',
      deficiencies: 0,
    },
    {
      id: 'EA-2026-0447',
      institution: 'St. Xavier Technical Campus',
      submittedOn: '14 Oct 2026',
      status: 'Rejected',
      statusColor: 'bg-rose-50 text-[#B42318] border-rose-200',
      caseId: 'app-3',
      category: 'Extension of Approval',
      deficiencies: 3,
    },
  ];

  const filteredApps = allApps.filter((app) => {
    const matchesFilter = filterStatus === 'all' || app.status.toLowerCase().replace(/\s+/g, '_') === filterStatus;
    const matchesSearch = app.institution.toLowerCase().includes(searchQuery.toLowerCase()) || app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <GovLayout role="officer" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HOME (Exact match to Mockup Bottom-Left Montage)                   */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* 1. Four KPI Cards in a Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1: Pending */}
              <div className="bg-[#E8F0FB] rounded-[6px] border border-[#BBD5F8] p-4.5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1D4E9E] uppercase tracking-wide">Pending</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E5C] mt-1">48</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-blue-200 flex items-center justify-center text-[#1D4E9E]">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Verified */}
              <div className="bg-[#E6F4EA] rounded-[6px] border border-[#A6E9B9] p-4.5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1E7B34] uppercase tracking-wide">Verified</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E7B34] mt-1">120</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-green-200 flex items-center justify-center text-[#1E7B34]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Needs Review */}
              <div className="bg-[#FDF0E3] rounded-[6px] border border-[#FCD5B5] p-4.5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#E8801A] uppercase tracking-wide">Needs Review</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E8801A] mt-1">15</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-orange-200 flex items-center justify-center text-[#E8801A]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Rejected (Officer Decision) */}
              <div
                className="bg-[#FDECEA] rounded-[6px] border border-[#F5C2C7] p-4.5 shadow-xs flex items-center justify-between cursor-help"
                title="Rejected (officer decision). The system never makes automatic rejections."
              >
                <div>
                  <p className="text-xs font-bold text-[#B42318] uppercase tracking-wide">Rejected</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#B42318] mt-1">7</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-rose-200 flex items-center justify-center text-[#B42318]">
                  <FileX2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 2. Main Grid: Pending Applications (Left) & Quick Actions (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Panel: Pending Applications Table (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-[#0B2E5C]">
                    Pending Applications
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-semibold text-[#0B57D0] hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                      <tr>
                        <th className="py-2.5 px-3">Application ID</th>
                        <th className="py-2.5 px-3">Institution</th>
                        <th className="py-2.5 px-3">Submitted On</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {allApps.slice(0, 3).map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">
                            {row.id}
                          </td>
                          <td className="py-3 px-3 font-medium">
                            {row.institution}
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono">
                            {row.submittedOn}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${row.statusColor}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href={`/officer/${row.caseId}`}
                              className="inline-flex items-center space-x-1 px-3 py-1 border border-[#0B2E5C] text-[#0B2E5C] hover:bg-[#E8F0FB] text-xs font-bold rounded-[4px] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Review</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Showing 3 of 48 applications</span>
                  <span className="font-semibold text-slate-600">SYNTHETIC DATA – Academic Year 2026-27</span>
                </div>
              </div>

              {/* Right Panel: Quick Actions (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-[#0B2E5C] border-b border-slate-100 pb-3">
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('reports')}
                    className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-[#1D4E9E] hover:bg-[#E8F0FB] rounded-[6px] transition-all group text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-blue-50 text-[#1D4E9E] flex items-center justify-center group-hover:bg-[#1D4E9E] group-hover:text-white transition-colors">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#0B2E5C]">
                        View Reports
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-[#1D4E9E]">&rarr;</span>
                  </button>

                  <Link
                    href="/rules"
                    className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-[#1D4E9E] hover:bg-[#E8F0FB] rounded-[6px] transition-all group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-emerald-50 text-[#1E7B34] flex items-center justify-center group-hover:bg-[#1E7B34] group-hover:text-white transition-colors">
                        <ListChecks className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#0B2E5C]">
                        Verification Checklist
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-[#1E7B34]">&rarr;</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => alert('Case escalation workflow submitted to Senior Scrutiny Committee for review.')}
                    className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-[#E8801A] hover:bg-[#FDF0E3] rounded-[6px] transition-all group text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded bg-amber-50 text-[#E8801A] flex items-center justify-center group-hover:bg-[#E8801A] group-hover:text-white transition-colors">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#E8801A]">
                        Escalate Case
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-[#E8801A]">&rarr;</span>
                  </button>
                </div>

                {/* Advisory safeguard notice */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-[#0B2E5C]">AICTE Scrutiny Guideline:</span> AI extraction outputs are advisory decision-support. All final confirmations require scrutiny officer authorization.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: APPLICATIONS WORK QUEUE                                            */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Full Scrutiny Applications Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">Filter, search and scrutinize Extension of Approval applications.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                >
                  <option value="all">All Applications (6)</option>
                  <option value="under_review">Under Review</option>
                  <option value="needs_clarification">Needs Clarification</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Institution Name or Application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded text-slate-800 bg-white"
              />
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                  <tr>
                    <th className="py-2.5 px-3">Application ID</th>
                    <th className="py-2.5 px-3">Institution Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Submitted On</th>
                    <th className="py-2.5 px-3">Deficiencies</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredApps.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">{row.id}</td>
                      <td className="py-3 px-3 font-medium">{row.institution}</td>
                      <td className="py-3 px-3 text-slate-600">{row.category}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{row.submittedOn}</td>
                      <td className="py-3 px-3">
                        {row.deficiencies > 0 ? (
                          <span className="font-bold text-[#B42318]">{row.deficiencies} flagged</span>
                        ) : (
                          <span className="text-[#1E7B34] font-medium">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/officer/${row.caseId}`}
                          className="inline-flex items-center space-x-1 px-3 py-1 border border-[#0B2E5C] text-[#0B2E5C] hover:bg-[#E8F0FB] text-xs font-bold rounded-[4px] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Case</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REPORTS & ANALYTICS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Regulatory Scrutiny Reports &amp; Forensics</h2>
                <p className="text-xs text-slate-500 mt-0.5">Access official pre-scrutiny letterhead reports and forensic triage summaries.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 border border-slate-200 rounded-[6px] bg-slate-50 space-y-3">
                <div className="w-9 h-9 rounded bg-blue-100 text-[#0B2E5C] flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0B2E5C]">Official Pre-Scrutiny Letterheads</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generated deficiency reports with official AICTE headers, QR verification, and statutory clause citations.
                </p>
                <Link
                  href="/officer/app-1/report"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B57D0] hover:underline pt-1"
                >
                  <span>Open Sample Report (EA-2026-0452) &rarr;</span>
                </Link>
              </div>

              <div className="p-5 border border-slate-200 rounded-[6px] bg-slate-50 space-y-3">
                <div className="w-9 h-9 rounded bg-rose-100 text-[#B42318] flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#B42318]">Calibrated Tamper Forensics</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Structural PDF analysis inspecting incremental updates, font substitution, and metadata date gaps.
                </p>
                <Link
                  href="/tamper"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#B42318] hover:underline pt-1"
                >
                  <span>Open Tamper Triage Module (M5) &rarr;</span>
                </Link>
              </div>

              <div className="p-5 border border-slate-200 rounded-[6px] bg-slate-50 space-y-3">
                <div className="w-9 h-9 rounded bg-emerald-100 text-[#1E7B34] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1E7B34]">Empirical Benchmarks (R13)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quantitative performance metrics across 180 synthetic institutional documents under SIH PS 26261.
                </p>
                <Link
                  href="/metrics"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#1E7B34] hover:underline pt-1"
                >
                  <span>View Empirical Evaluation &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HELP & SOP                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'help' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Scrutiny Officer Standard Operating Procedure (SOP)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Authorized evaluation protocols per Approval Process Handbook (APH 2024-27).</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">Decision Governance Protocol</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li><strong>Human-in-the-Loop Principle:</strong> NirikshAI AI extraction is strictly advisory. The system is architecturally barred from auto-rejecting applications.</li>
                  <li><strong>Confirming Deficiencies:</strong> When a discrepancy is confirmed, the officer must record a mandatory note citing the relevant handbook clause.</li>
                  <li><strong>Dismissing Inaccuracies:</strong> If OCR extracts a blurred character incorrectly, officers can dismiss the advisory flag with one click.</li>
                  <li><strong>Case Escalation:</strong> High-risk cases (such as structural tampering or legal title divergence) should be escalated to the Senior Scrutiny Committee.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </GovLayout>
  );
}
