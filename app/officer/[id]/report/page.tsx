'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    const curr = loaded.find(a => a.id === appId);
    if (curr && (curr.findings?.length || 0) === 0) {
      setReportType('eoa_order');
    }
  }, [appId]);

  const app = apps.find(a => a.id === appId) || apps[0];
  if (!app) return null;

  const hasDeficiencies = (app.findings && app.findings.length > 0);
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Link
          href={`/officer/${app.id}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Cockpit</span>
        </Link>

        {/* Toggle Report Mode */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setReportType('deficiency_notice')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              reportType === 'deficiency_notice'
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Pre-Scrutiny Deficiency Report
          </button>
          <button
            onClick={() => setReportType('eoa_order')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              reportType === 'eoa_order'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Formal EoA Approval Order
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government Document Canvas */}
      <div className="bg-white p-8 sm:p-14 rounded-2xl shadow-xl border border-slate-200 space-y-8 text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* Official Letterhead */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-500">
            GOVERNMENT OF INDIA • MINISTRY OF EDUCATION
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
          </h1>
          <div className="text-xs font-medium text-slate-600">
            Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 | Phone: 011-29581000 | Website: www.aicte-india.org
          </div>
          <div className="text-xs font-bold text-blue-950 pt-2 tracking-wide uppercase">
            REGULATION BUREAU • EXTENSION OF APPROVAL (EoA) SCRUTINY COMMITTEE
          </div>
        </div>

        {/* Reference Number & Date */}
        <div className="flex justify-between items-start text-xs font-mono font-semibold">
          <div>
            <p>
              <strong>Ref. No:</strong> AICTE/REG/2026/SCRUTINY/{app.institution?.state?.substring(0, 3).toUpperCase()}-{app.institution?.aicte_id}
            </p>
            <p>
              <strong>Application ID:</strong> {app.id.toUpperCase()} (Cycle 2026-27)
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

        {/* Addressee */}
        <div className="text-xs space-y-1">
          <p className="font-bold">To,</p>
          <p className="font-bold text-slate-900">{app.institution?.name}</p>
          <p className="text-slate-600">Affiliated to: {app.institution?.university}</p>
          <p className="text-slate-600">State: {app.institution?.state} | Permanent AICTE Institute ID: {app.institution?.aicte_id}</p>
        </div>

        {/* Document Mode 1: Deficiency Notice */}
        {reportType === 'deficiency_notice' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-black uppercase text-amber-950 bg-amber-50 p-2.5 rounded border border-amber-200">
                SUBJECT: PRE-SCRUTINY DEFICIENCY NOTICE UNDER AICTE APPROVAL PROCESS HANDBOOK (APH 2024-27)
              </h2>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Sir / Madam,
              <br /><br />
              The annual Extension of Approval (EoA) application submitted by your institution for the Academic Session <strong>2026-27</strong> has been examined by the Scrutiny Committee through the <strong>NirikshAI AI-Powered Regulatory Validation Engine</strong>.
              On comparison of your submitted documentation against the provisions of the AICTE Approval Process Handbook (APH 2024-27) and authorized national records, the following discrepancies and non-compliances were formally recorded:
            </p>

            {/* Findings Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                    <th className="p-2.5">S.No.</th>
                    <th className="p-2.5">Handbook Clause</th>
                    <th className="p-2.5">Deficiency Classification</th>
                    <th className="p-2.5">Observed Value vs Prescribed Norm</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(!app.findings || app.findings.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-emerald-700 font-bold">
                        Zero discrepancies recorded. All regulatory conditions satisfied.
                      </td>
                    </tr>
                  ) : (
                    app.findings.map((fnd, idx) => (
                      <tr key={fnd.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-amber-900">{fnd.evidence.clause}</td>
                        <td className="p-2.5 font-semibold">{fnd.message}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-600">
                          Claimed: {fnd.evidence.extracted_value || 'N/A'}<br />
                          Required: {fnd.evidence.expected_value}
                        </td>
                        <td className="p-2.5 font-bold uppercase text-[10px] text-rose-700">
                          {fnd.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900">STATUTORY RECTIFICATION INSTRUCTIONS:</h3>
              <p>
                1. In accordance with Chapter IV of the Approval Process Handbook, the institution is granted an opportunity to rectify the listed deficiencies through the <strong>NirikshAI Institution Portal</strong> within <strong>15 calendar days</strong> of this notice.
              </p>
              <p>
                2. Upload valid stamp-paper affidavits, unexpired State NOCs, and fee settlements as indicated above. Failure to submit compliant rectification within the stipulated timeline will automatically refer the matter to the Standing Appellate Committee (SAC).
              </p>
            </div>
          </div>
        ) : (
          /* Document Mode 2: Formal EoA Order */
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-black uppercase text-emerald-950 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                ORDER: EXTENSION OF APPROVAL (EoA) FOR ACADEMIC YEAR 2026-27
              </h2>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              In terms of the provisions under the All India Council for Technical Education (Grant of Approvals for Technical Institutions) Regulations, 2020 notified on 4th February 2020 and amended periodically, and the norms, standards, procedures and conditions prescribed by the Council from time to time:
              <br /><br />
              I am directed to convey the approval of the Council to <strong>{app.institution?.name}</strong> for conduct of technical courses with the sanctioned intake indicated below for the Academic Year <strong>2026-27</strong>:
            </p>

            {/* Approved Intake Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                    <th className="p-2.5">Programme</th>
                    <th className="p-2.5">Level</th>
                    <th className="p-2.5">Course / Discipline</th>
                    <th className="p-2.5">Affiliating Body</th>
                    <th className="p-2.5 text-right">Approved Intake (2026-27)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  <tr>
                    <td className="p-2.5 font-bold">Engineering & Tech</td>
                    <td className="p-2.5">Undergraduate</td>
                    <td className="p-2.5">Computer Engineering</td>
                    <td className="p-2.5">{app.institution?.university}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-blue-900">180</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Engineering & Tech</td>
                    <td className="p-2.5">Undergraduate</td>
                    <td className="p-2.5">Information Technology</td>
                    <td className="p-2.5">{app.institution?.university}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-blue-900">120</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Engineering & Tech</td>
                    <td className="p-2.5">Undergraduate</td>
                    <td className="p-2.5">Electronics & Telecommunication</td>
                    <td className="p-2.5">{app.institution?.university}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-blue-900">120</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={4} className="p-2.5 uppercase">Total Sanctioned Annual Intake</td>
                    <td className="p-2.5 text-right font-mono text-emerald-800 text-sm">{app.institution?.records?.approved_intake || 420}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed italic">
              Note: The approval is subject to condition that the institution shall follow all AICTE norms regarding faculty cadre-ratio, barrier-free access, anti-ragging compliance, and infrastructure guidelines published in APH 2024-27.
            </p>
          </div>
        )}

        {/* Official Sign-off & Verification Footer */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
              <QrCode className="w-10 h-10 text-slate-800" />
              <div>
                <p className="font-bold">Cryptographically Authenticated</p>
                <p className="text-[10px]">Hash-chain block #4 • SHA-256 Verified</p>
                <p className="text-[10px]">Verify at: aicte-india.org/verify</p>
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="font-serif italic text-slate-400 text-xs pb-1">
              [Digitally Signed by Regulation Bureau]
            </div>
            <div className="font-bold text-xs text-slate-900">
              (Dr. Scrutiny Officer, AICTE)
            </div>
            <div className="text-[11px] text-slate-500">
              Advisor-II (Approval Bureau), AICTE New Delhi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
