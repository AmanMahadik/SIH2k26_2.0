'use client';

import React, { useState, useEffect } from 'react';
import GovLayout from '@/components/gov/GovLayout';
import {
  BarChart3,
  Download,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  FileText,
  Lock,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { verifyAuditChain } from '@/lib/audit/audit';
import { getStoredAuditLog, saveStoredAuditLog, resetDemoData } from '@/lib/store';

export default function AuditorDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [logs, setLogs] = useState(getStoredAuditLog());
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/audit')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Format into AuditEvent shape
          const formatted = data.data.map((row: any) => ({
            id: Number(row.id),
            actor: row.actor,
            action: row.action,
            entity: row.entity,
            payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : (row.payload || {}),
            prev_hash: row.prev_hash || '',
            prevHash: row.prev_hash || '',
            hash: row.hash || '',
            at: row.at || '',
          })).sort((a: any, b: any) => a.id - b.id);
          setLogs(formatted);
        }
      })
      .catch((err) => console.error('Error fetching audit logs:', err));
  }, []);
  const [verifyStatus, setVerifyStatus] = useState<{
    tested: boolean;
    valid?: boolean;
    brokenEventId?: number;
    error?: string;
  }>({ tested: false });

  // 92% Completed, 5% In Progress, 3% Pending
  const donutData = [
    { name: 'Completed', value: 92, color: '#1E7B34' },
    { name: 'In Progress', value: 5, color: '#E8801A' },
    { name: 'Pending', value: 3, color: '#B42318' },
  ];

  const handleVerifyChain = () => {
    const res = verifyAuditChain(logs);
    setVerifyStatus({
      tested: true,
      valid: res.valid,
      brokenEventId: res.brokenEventId,
      error: res.error,
    });
  };

  const handleSimulateTamper = () => {
    if (logs.length < 2) return;
    const tampered = [...logs];
    tampered[1] = {
      ...tampered[1],
      payload: { ...tampered[1].payload, unauthorized_tampered_flag: true },
    };
    setLogs(tampered);
    const res = verifyAuditChain(tampered);
    setVerifyStatus({
      tested: true,
      valid: res.valid,
      brokenEventId: res.brokenEventId,
      error: res.error,
    });
  };

  const handleReset = () => {
    fetch('/api/audit')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map((row: any) => ({
            id: Number(row.id),
            actor: row.actor,
            action: row.action,
            entity: row.entity,
            payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : (row.payload || {}),
            prev_hash: row.prev_hash || '',
            prevHash: row.prev_hash || '',
            hash: row.hash || '',
            at: row.at || '',
          })).sort((a: any, b: any) => a.id - b.id);
          setLogs(formatted);
        } else {
          setLogs(getStoredAuditLog());
        }
      })
      .catch(() => setLogs(getStoredAuditLog()));
    setVerifyStatus({ tested: false });
  };

  return (
    <GovLayout role="auditor" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HOME (Exact match to Mockup Bottom-Right 2)                         */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Top Section: Audit Dashboard & Audit Status Donut */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Card: Total Audits (6 cols) */}
              <div className="md:col-span-6 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs flex flex-col justify-between">
                <h2 className="text-sm font-bold text-[#0B2E5C] border-b border-slate-100 pb-2">
                  Audit Dashboard
                </h2>

                <div className="py-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Total Audits
                    </p>
                    <h3 className="text-4xl font-extrabold text-[#0B2E5C] mt-1">{logs.length}</h3>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      100% Cryptographically Sealed via SHA-256
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded bg-[#E8F0FB] text-[#1D4E9E] flex items-center justify-center">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                </div>

                <button
                  onClick={() => alert('Official AICTE Audit Ledger exported as CSV/PDF.')}
                  className="w-full py-2.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold rounded-[4px] transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Audit Report</span>
                </button>
              </div>

              {/* Card: Audit Status Donut (6 cols) */}
              <div className="md:col-span-6 bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs flex flex-col justify-between">
                <h2 className="text-sm font-bold text-[#0B2E5C] border-b border-slate-100 pb-2">
                  Audit Status
                </h2>

                <div className="relative h-44 flex items-center justify-center">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-28 h-28 rounded-full border-8 border-emerald-600/30 animate-pulse" />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-[#1E7B34]">92%</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Completed</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-around items-center text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E7B34]" />
                    <span className="text-slate-700 font-medium text-[11px]">Completed (92%)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E8801A]" />
                    <span className="text-slate-700 font-medium text-[11px]">In Progress (5%)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]" />
                    <span className="text-slate-700 font-medium text-[11px]">Pending (3%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Hash-Chained Audit Ledger */}
            <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0B2E5C]">
                    Cryptographic Hash-Chained Audit Trail
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Formula: <code className="font-bold text-slate-700">SHA-256(prev_hash + canonical_event)</code>. Demonstrates non-repudiation under administrative law.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleVerifyChain}
                    className="px-3 py-1.5 bg-[#1E7B34] hover:bg-[#166527] text-white text-xs font-bold rounded-[4px] shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Chain</span>
                  </button>

                  <button
                    onClick={handleSimulateTamper}
                    className="px-3 py-1.5 border border-[#B42318] text-[#B42318] hover:bg-rose-50 text-xs font-bold rounded-[4px] transition-colors"
                  >
                    Simulate DB Tampering
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded border border-slate-200 hover:bg-slate-50"
                    title="Reset ledger"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Verification Banner */}
              {verifyStatus.tested && (
                <div
                  className={`p-3 rounded-[6px] text-xs font-semibold flex items-center space-x-2 ${
                    verifyStatus.valid
                      ? 'bg-emerald-50 text-[#1E7B34] border border-emerald-200'
                      : 'bg-rose-50 text-[#B42318] border border-rose-200'
                  }`}
                >
                  {verifyStatus.valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1E7B34]" />
                      <span>Chain Intact: All cryptographic block hashes verified successfully (100% Match).</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 shrink-0 text-[#B42318]" />
                      <span>
                        Tampering Detected! Broken link at event #{verifyStatus.brokenEventId}: hash signature mismatch.
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#EEF3FA] text-[#0B2E5C] font-bold border-y border-[#D0D7E2]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Actor</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Entity</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3 font-mono">Current Hash (SHA-256)</th>
                      <th className="py-2.5 px-3 font-mono">Prev Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {logs.slice(0, 6).map((item: any) => {
                      const prevHashVal = item.prev_hash || item.prevHash || '';
                      const hashVal = item.hash || '';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 font-mono text-[11px]">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{item.id}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-700 font-semibold">{item.actor}</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                              {item.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-600">{item.entity}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-sans" suppressHydrationWarning>
                            {mounted && item.at ? new Date(item.at).toLocaleTimeString('en-IN') : item.at || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-800 font-semibold">
                            {hashVal ? `${hashVal.slice(0, 12)}...` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {prevHashVal ? `${prevHashVal.slice(0, 10)}...` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AUDIT LOGS (Expanded Explorer)                                     */}
        {/* ========================================================================= */}
        {activeTab === 'audit_logs' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Full Cryptographic Ledger Explorer</h2>
                <p className="text-xs text-slate-500 mt-0.5">Inspect all canonical event payloads and cryptographic signatures.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {logs.map((event: any) => (
                <div key={event.id} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                  <div className="flex justify-between items-center font-sans">
                    <span className="font-bold text-slate-800">Block #{event.id} • {event.action}</span>
                    <span className="text-[11px] text-slate-400">{event.at}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    <strong>Hash:</strong> {event.hash || '—'}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    <strong>Prev:</strong> {event.prev_hash || event.prevHash || '—'}
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-[10px] text-slate-700">
                    <strong>Payload:</strong> {JSON.stringify(event.payload || {})}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REPORTS                                                            */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Auditor Compliance Reports &amp; Export</h2>
                <p className="text-xs text-slate-500 mt-0.5">Generate compliance certificates and legal non-repudiation exports.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
              <h3 className="font-bold text-slate-800">Official Audit Ledger Certificate</h3>
              <p className="text-slate-600 leading-relaxed">
                All 124 institutional audits recorded in this cycle are cryptographically linked from Genesis block <code>#1</code>. Export includes complete SHA-256 signatures for legal submission.
              </p>
              <button
                onClick={() => alert('Exporting official signed audit package (ZIP)...')}
                className="px-4 py-2 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white font-bold rounded shadow-xs"
              >
                Download Signed Audit Package
              </button>
            </div>
          </div>
        )}
      </div>
    </GovLayout>
  );
}
