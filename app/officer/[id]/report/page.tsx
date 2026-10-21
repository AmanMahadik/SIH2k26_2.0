'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GovLayout from '@/components/gov/GovLayout';
import { Application } from '@/lib/types';
import { getStoredApplications } from '@/lib/store';
import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle2, AlertTriangle, FileText, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function FormalReportPage() {
  const params = useParams();
  const router = useRouter();
  const appId = (params?.id as string) || 'app-1';

  const [apps, setApps] = useState<Application[]>([]);
  const [reportType, setReportType] = useState<'deficiency_notice' | 'eoa_order'>('deficiency_notice');

  useEffect(() => {
    const loaded = getStoredApplications();
    setApps(loaded);
    const curr = loaded.find((a) => a.id === appId);
    if (curr && (curr.findings?.length || 0) === 0) {
      setReportType('eoa_order');
    }
  }, [appId]);

  const app = apps.find((a) => a.id === appId) || apps[0];
  if (!app) return null;

  const hasDeficiencies = app.findings && app.findings.length > 0;
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <GovLayout role="officer" activeTab="reports">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Action Bar (Hidden in Print) */}
        <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-[6px] border border-[#D0D7E2] shadow-xs">
          <Link
            href={`/officer/${app.id}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0B2E5C] hover:text-[#1D4E9E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Case Cockpit</span>
          </Link>

          {/* Toggle Report Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setReportType('deficiency_notice')}
              className={`text-xs font-bold px-3 py-1.5 rounded-[4px] border transition-all ${
                reportType === 'deficiency_notice'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Pre-Scrutiny Deficiency Report
            </button>
            <button
              onClick={() => setReportType('eoa_order')}
              className={`text-xs font-bold px-3 py-1.5 rounded-[4px] border transition-all ${
                reportType === 'eoa_order'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Formal EoA Approval Order
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white px-3.5 py-1.5 rounded-[4px] shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Official Government Letterhead Sheet */}
        <div className="bg-white p-8 sm:p-12 rounded-[6px] border border-[#D0D7E2] shadow-xs print:border-none print:shadow-none print:p-0 space-y-6 text-[#1A1A1A]">
          {/* Header Strip with Ashoka Pillar & AICTE Official Headers */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
            <p className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
              Government of India • Ministry of Education
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              All India Council for Technical Education
            </h1>
            <p className="text-xs text-slate-600">
              Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 | Phone: 011-29581000 | Website: www.aicte-india.org
            </p>
            <p className="text-xs font-bold text-blue-950 uppercase tracking-wide pt-1">
              Regulation Bureau • Extension of Approval (EoA) Scrutiny Committee
            </p>
          </div>

          {/* Letter Metadata */}
          <div className="flex justify-between items-start text-xs border-b border-slate-200 pb-3 font-mono">
            <div>
              <p>
                <strong>Ref. No:</strong> AICTE/REG/2026/SCRUTINY/{app.institution?.state?.substring(0, 3).toUpperCase()}-{app.institution?.aicte_id}
              </p>
              <p>
                <strong>Application ID:</strong> {app.id.toUpperCase()} (Cycle {app.academic_year})
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Date of Scrutiny:</strong> {today}
              </p>
              <p>
                <strong>Mode:</strong> AICTE NirikshAI Decision-Support System
              </p>
            </div>
          </div>

          {/* Recipient Institution Address */}
          <div className="text-xs space-y-1 text-slate-800">
            <p className="font-bold">To,</p>
            <p className="font-bold text-slate-900 text-sm">{app.institution?.name}</p>
            <p className="text-slate-600">Affiliated to: {app.institution?.university}</p>
            <p className="text-slate-600">State: {app.institution?.state} | Permanent AICTE Institute ID: {app.institution?.aicte_id}</p>
          </div>

          {/* Subject Line */}
          <div className="bg-amber-50/80 border-l-4 border-amber-500 p-3 text-xs">
            <p className="font-bold text-slate-900 uppercase">
              {reportType === 'deficiency_notice'
                ? 'Subject: Pre-Scrutiny Deficiency Notice under AICTE Approval Process Handbook (APH 2024-27)'
                : 'Subject: Grant of Extension of Approval (EoA) for Academic Year 2026-27'}
            </p>
          </div>

          {/* Body Content */}
          <div className="text-xs space-y-4 leading-relaxed text-slate-800">
            <p>Sir / Madam,</p>

            {reportType === 'deficiency_notice' ? (
              <>
                <p>
                  In terms of the provisions under the All India Council for Technical Education (Grant of Approvals for Technical Institutions) Regulations and norms prescribed under the Approval Process Handbook 2024-27, the initial pre-scrutiny examination of your application submitted for Extension of Approval (EoA) 2026-27 has been processed by the Scrutiny Division.
                </p>
                <p>
                  During the AI-assisted regulatory verification, the following <strong className="text-rose-700">regulatory discrepancies and deficiency findings</strong> were detected across the uploaded documentation and official registry cross-checks:
                </p>

                {/* Deficiencies Table */}
                <div className="border border-slate-300 rounded overflow-hidden mt-3">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300">#</th>
                        <th className="p-2 border-r border-slate-300">Handbook Clause</th>
                        <th className="p-2 border-r border-slate-300">Deficiency Description</th>
                        <th className="p-2 border-r border-slate-300">Extracted vs Expected Value</th>
                        <th className="p-2">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {app.findings?.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 border-r border-slate-300 font-bold">{idx + 1}</td>
                          <td className="p-2 border-r border-slate-300 font-mono font-semibold text-blue-900">
                            {f.evidence?.clause || 'APH 2024-27 §4.1'}
                          </td>
                          <td className="p-2 border-r border-slate-300">
                            <p className="font-semibold text-slate-900">{f.message}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Rule ID: {f.rule_id}</p>
                          </td>
                          <td className="p-2 border-r border-slate-300 font-mono text-[11px]">
                            <p><span className="text-slate-500">Submitted:</span> <span className="text-rose-700 font-bold">{f.evidence?.extracted_value || 'None'}</span></p>
                            <p><span className="text-slate-500">Required:</span> <span className="text-emerald-700 font-bold">{f.evidence?.expected_value || 'Compliant'}</span></p>
                          </td>
                          <td className="p-2 uppercase font-bold text-[10px]">
                            <span className={f.severity === 'blocking' ? 'text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-200' : 'text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200'}>
                              {f.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-100 p-3 rounded border border-slate-200 mt-4 text-[11px] space-y-1">
                  <p className="font-bold text-slate-900">Instructions for Rectification:</p>
                  <p>1. The institution is requested to rectify the deficiencies noted above and upload self-attested supporting certificates through the NirikshAI Institution Portal within <strong>14 calendar days</strong> from the receipt of this communication.</p>
                  <p>2. Re-scrutiny will be conducted automatically upon submission. In the event of non-compliance, the case shall be placed before the Regional Hearing Committee (RHC) for appropriate regulatory action.</p>
                </div>
              </>
            ) : (
              <>
                <p>
                  In terms of the provisions under the All India Council for Technical Education (Grant of Approvals for Technical Institutions) Regulations, the Council hereby conveys its <strong className="text-emerald-700">Extension of Approval (EoA)</strong> to <strong>{app.institution?.name}</strong> to conduct technical programmes with the approved intakes for the Academic Year 2026-27.
                </p>

                {/* Approved Courses Table */}
                <div className="border border-slate-300 rounded overflow-hidden mt-3">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300">Programme</th>
                        <th className="p-2 border-r border-slate-300">Level</th>
                        <th className="p-2 border-r border-slate-300">Affiliating Body</th>
                        <th className="p-2">Sanctioned Intake (2026-27)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">Engineering &amp; Technology</td>
                        <td className="p-2 border-r border-slate-300">Under Graduate</td>
                        <td className="p-2 border-r border-slate-300">{app.institution?.university}</td>
                        <td className="p-2 font-bold text-emerald-800">420 Seats (Approved)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-200 mt-4 text-[11px] text-emerald-900">
                  <p className="font-bold">Compliance Status: Fully Verified (Zero Deficiencies)</p>
                  <p>All mandatory documents (affidavits, state NOC, fee settlement, land compliance) have been cryptographically validated against authorized AICTE registries.</p>
                </div>
              </>
            )}
          </div>

          {/* Official Signatures & Digital Seal */}
          <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-xs">
            {/* QR Verification Seal */}
            <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded border border-slate-200">
              <QrCode className="w-12 h-12 text-slate-800 shrink-0" />
              <div className="text-[10px] text-slate-600 font-mono">
                <p className="font-bold text-slate-900">Digital Verification QR</p>
                <p>Scan to verify legal validity</p>
                <p className="text-[9px] text-slate-400">SHA-256: 7f8a9b2c...sealed</p>
              </div>
            </div>

            {/* Officer Sign-off Block */}
            <div className="text-right space-y-1">
              <div className="font-bold text-slate-900 text-sm">Member Secretary / Advisor (Approval)</div>
              <p className="text-slate-600">Regulation Bureau, AICTE</p>
              <p className="text-[10px] text-slate-500 font-mono">Digitally signed on: {today}</p>
            </div>
          </div>
        </div>
      </div>
    </GovLayout>
  );
}
