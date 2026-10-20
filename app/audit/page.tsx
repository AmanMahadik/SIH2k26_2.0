'use client';

import React, { useState, useEffect } from 'react';
import { AuditEvent } from '@/lib/types';
import { getStoredAuditLog, saveStoredAuditLog, resetDemoData } from '@/lib/store';
import { verifyAuditChain } from '@/lib/audit/audit';
import { Database, ShieldCheck, AlertOctagon, RefreshCw, CheckCircle2, Lock, ArrowDown } from 'lucide-react';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [verifyResult, setVerifyResult] = useState<{
    tested: boolean;
    valid?: boolean;
    brokenEventId?: number;
    error?: string;
  }>({ tested: false });

  useEffect(() => {
    setLogs(getStoredAuditLog());
    const handler = () => setLogs(getStoredAuditLog());
    window.addEventListener('nirikshai_audit_change', handler);
    return () => window.removeEventListener('nirikshai_audit_change', handler);
  }, []);

  const handleVerifyChain = () => {
    const res = verifyAuditChain(logs);
    setVerifyResult({
      tested: true,
      valid: res.valid,
      brokenEventId: res.brokenEventId,
      error: res.error,
    });
  };

  const handleSimulateTampering = () => {
    if (logs.length < 2) return;
    const targetIndex = Math.min(2, logs.length - 1);
    const tamperedLogs = [...logs];
    // Tamper with payload
    tamperedLogs[targetIndex] = {
      ...tamperedLogs[targetIndex],
      payload: { ...tamperedLogs[targetIndex].payload, tampered_unauthorized_edit: true },
    };
    saveStoredAuditLog(tamperedLogs);
    setLogs(tamperedLogs);
    const res = verifyAuditChain(tamperedLogs);
    setVerifyResult({
      tested: true,
      valid: res.valid,
      brokenEventId: res.brokenEventId,
      error: res.error,
    });
  };

  const handleResetLedger = () => {
    resetDemoData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Hash-Chained Audit Ledger</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Module M10
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Every document upload, OCR extraction, rule evaluation, and officer decision is cryptographically sealed via <code>SHA-256(prev_hash + canonical_event)</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleVerifyChain}
            className="flex items-center space-x-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Chain Integrity</span>
          </button>

          <button
            onClick={handleSimulateTampering}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Simulate DB Tampering</span>
          </button>

          <button
            onClick={handleResetLedger}
            className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-lg text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Verification Result Notification Card */}
      {verifyResult.tested && (
        <div
          className={`p-5 rounded-xl border flex items-start space-x-3 transition-all ${
            verifyResult.valid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {verifyResult.valid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-bold text-sm">
              {verifyResult.valid
                ? 'Cryptographic Audit Trail Integrity Confirmed'
                : 'Cryptographic Hash-Chain Breach Detected!'}
            </h3>
            <p className="text-xs mt-1 leading-relaxed">
              {verifyResult.valid
                ? `All ${logs.length} blocks in the regulatory ledger recomputed successfully. Zero broken links or modified payloads found.`
                : `${verifyResult.error} — The platform successfully prevented an undetected ledger alteration.`}
            </p>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>GENESIS: 0000000000000000000000000000000000000000000000000000000000000000</span>
          <span>{logs.length} Sequential Blocks</span>
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {logs.map((event, index) => {
            const isBroken = !verifyResult.valid && verifyResult.brokenEventId === event.id;

            return (
              <div
                key={event.id}
                className={`p-4 space-y-2 transition-colors ${
                  isBroken ? 'bg-rose-100/60 border-l-4 border-rose-600' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[11px]">
                      BLOCK #{event.id}
                    </span>
                    <span className="font-bold text-blue-900 uppercase">{event.action}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Actor: {event.actor}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">Entity: {event.entity}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{event.at}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1">
                  <div className="truncate">
                    <span className="font-bold text-slate-700">Prev Hash:</span> {event.prev_hash}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-700">Block Hash:</span> {event.hash}
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] overflow-x-auto text-slate-800">
                  <span className="text-slate-400 text-[10px] font-sans font-bold">Canonical Payload: </span>
                  {JSON.stringify(event.payload)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
