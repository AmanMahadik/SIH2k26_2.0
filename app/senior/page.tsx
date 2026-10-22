'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GovLayout from '@/components/gov/GovLayout';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Eye,
  BarChart3,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function SeniorOfficerDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');

  const reviewQueue = [
    {
      id: 'EA-2026-0430',
      institution: 'DEF Institute of Technology',
      flag: 'High',
      flagColor: 'bg-rose-50 text-[#B42318] border-rose-200',
      caseId: 'app-3',
      issue: 'Structural PDF update date gap & quota mismatch',
    },
    {
      id: 'EA-2026-0431',
      institution: 'GHI College of Engineering',
      flag: 'Medium',
      flagColor: 'bg-orange-50 text-[#E8801A] border-orange-200',
      caseId: 'app-2',
      issue: 'State NOC expired before 2026-27 session',
    },
    {
      id: 'EA-2026-0432',
      institution: 'JKL Technical Campus',
      flag: 'Info',
      flagColor: 'bg-blue-50 text-[#1D4E9E] border-blue-200',
      caseId: 'app-1',
      issue: 'Minor institution name character variation',
    },
    {
      id: 'EA-2026-0433',
      institution: 'National Institute of Management & Science',
      flag: 'Medium',
      flagColor: 'bg-orange-50 text-[#E8801A] border-orange-200',
      caseId: 'app-4',
      issue: 'Remote issuer endpoint timeout (HTTP 504)',
    },
  ];

  // Recharts Donut data: 78% Approved, 15% With Issues, 7% Rejected
  const chartData = [
    { name: 'Approved', value: 78, color: '#1D4E9E' },
    { name: 'With Issues', value: 15, color: '#E8801A' },
    { name: 'Rejected', value: 7, color: '#B42318' },
  ];

  return (
    <GovLayout role="senior" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HOME (Exact match to Mockup Bottom-Middle Montage)                 */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* 1. Three KPI Cards in a Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: For Review */}
              <div className="bg-[#EFEAFB] rounded-[6px] border border-[#D5C2F8] p-4.5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#6941C6] uppercase tracking-wide">For Review</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#6941C6] mt-1">32</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-purple-200 flex items-center justify-center text-[#6941C6]">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Approved */}
              <div className="bg-[#E6F4EA] rounded-[6px] border border-[#A6E9B9] p-4.5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1E7B34] uppercase tracking-wide">Approved</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E7B34] mt-1">186</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-green-200 flex items-center justify-center text-[#1E7B34]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Escalated */}
              <div className="bg-[#FDF0E3] rounded-[6px] border border-[#FCD5B5] p-4.5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#E8801A] uppercase tracking-wide">Escalated</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E8801A] mt-1">12</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-orange-200 flex items-center justify-center text-[#E8801A]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 2. Main Grid: Review Queue (Left) & Analytics Donut (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Panel: Review Queue Table (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-[#0B2E5C]">
                    Review Queue
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('review_applications')}
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
                        <th className="py-2.5 px-3">Flag</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {reviewQueue.slice(0, 3).map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">
                            {row.id}
                          </td>
                          <td className="py-3 px-3 font-medium">
                            {row.institution}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${row.flagColor}`}>
                              {row.flag}
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
                  <span>Showing 3 escalated cases</span>
                  <span className="font-semibold text-slate-600">Senior Oversight Portal</span>
                </div>
              </div>

              {/* Right Panel: Analytics Donut Chart (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-[#0B2E5C] border-b border-slate-100 pb-2">
                  Analytics
                </h2>

                {/* Donut Chart with 78% in Center */}
                <div className="relative h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-[#0B2E5C]">78%</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Approval Rate</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-around items-center text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D4E9E]" />
                    <span className="text-slate-700 font-medium text-[11px]">Approved</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E8801A]" />
                    <span className="text-slate-700 font-medium text-[11px]">With Issues</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]" />
                    <span className="text-slate-700 font-medium text-[11px]">Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REVIEW APPLICATIONS (Full Escalated Queue)                        */}
        {/* ========================================================================= */}
        {activeTab === 'review_applications' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Senior Officer Escalation Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">High-priority cases escalated by Scrutiny Officers for committee adjudication.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                  <tr>
                    <th className="py-2.5 px-3">Application ID</th>
                    <th className="py-2.5 px-3">Institution Name</th>
                    <th className="py-2.5 px-3">Flag Severity</th>
                    <th className="py-2.5 px-3">Primary Escalation Reason</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reviewQueue.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">{row.id}</td>
                      <td className="py-3 px-3 font-medium">{row.institution}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold border ${row.flagColor}`}>
                          {row.flag}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{row.issue}</td>
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
                <h2 className="text-base font-bold text-[#0B2E5C]">Executive Approval Analytics &amp; Reports</h2>
                <p className="text-xs text-slate-500 mt-0.5">National and regional statistics across technical education institutions.</p>
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
              <div className="p-4 border border-slate-200 rounded-[6px] bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase">National Approval Rate</span>
                <h3 className="text-2xl font-extrabold text-[#1D4E9E] mt-1">78.2%</h3>
                <p className="text-[11px] text-slate-500 mt-1">Based on 532 processed applications</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-[6px] bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase">Deficiency Resolution Rate</span>
                <h3 className="text-2xl font-extrabold text-[#1E7B34] mt-1">84.6%</h3>
                <p className="text-[11px] text-slate-500 mt-1">Resolved within first rectification round</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-[6px] bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Scrutiny Time</span>
                <h3 className="text-2xl font-extrabold text-[#E8801A] mt-1">1.42s</h3>
                <p className="text-[11px] text-slate-500 mt-1">78.5% reduction in manual inspection burden</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HELP & GOVERNANCE                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'help' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#0B2E5C] border-b border-slate-100 pb-3">Senior Committee Governance Protocol</h2>
            <p className="text-slate-600 leading-relaxed">
              Senior Scrutiny Officers hold final administrative review authority over all applications that trigger regulatory alerts or structural alteration triage.
            </p>
          </div>
        )}
      </div>
    </GovLayout>
  );
}
