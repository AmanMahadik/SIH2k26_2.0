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
} from 'lucide-react';

export default function OfficerDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');

  const pendingApps = [
    {
      id: 'EA-2026-0452',
      institution: 'ABC Engineering College',
      submittedOn: '18 Oct 2026',
      status: 'Under Review',
      statusColor: 'bg-blue-50 text-[#1D4E9E] border-blue-200',
      caseId: 'app-1',
    },
    {
      id: 'EA-2026-0451',
      institution: 'XYZ Institute of Tech',
      submittedOn: '17 Oct 2026',
      status: 'Needs Clarification',
      statusColor: 'bg-orange-50 text-[#E8801A] border-orange-200',
      caseId: 'app-2',
    },
    {
      id: 'EA-2026-0450',
      institution: 'PQR College',
      submittedOn: '17 Oct 2026',
      status: 'Under Review',
      statusColor: 'bg-blue-50 text-[#1D4E9E] border-blue-200',
      caseId: 'app-3',
    },
  ];

  return (
    <GovLayout role="officer" activeTab={activeTab} onTabChange={setActiveTab}>
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
              <button className="text-xs font-semibold text-[#0B57D0] hover:underline">
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
                  {pendingApps.map((row) => (
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
              <Link
                href="/officer/app-1/report"
                className="w-full flex items-center justify-between p-3 border border-slate-200 hover:border-[#1D4E9E] hover:bg-[#E8F0FB] rounded-[6px] transition-all group"
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
              </Link>

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
                onClick={() => alert('Case escalation workflow submitted to Senior Scrutiny Committee.')}
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
    </GovLayout>
  );
}
