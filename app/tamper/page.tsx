'use client';

import React, { useState, useEffect } from 'react';
import GovLayout from '@/components/gov/GovLayout';
import { Application, DocumentItem, TamperIndicator } from '@/lib/types';
import { getStoredApplications } from '@/lib/store';
import { AlertTriangle, ShieldAlert, FileText, Search, CheckCircle, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TamperForensicsPage() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    setApps(getStoredApplications());
  }, []);

  // Collect all documents with tamper indicators or forensic data
  const flaggedDocs: { app: Application; doc: DocumentItem; indicators: TamperIndicator[] }[] = [];

  apps.forEach(app => {
    app.documents?.forEach(doc => {
      if (doc.tamper_indicators && doc.tamper_indicators.length > 0) {
        flaggedDocs.push({ app, doc, indicators: doc.tamper_indicators });
      }
    });
  });

  return (
    <GovLayout role="officer" activeTab="reports">
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Calibrated Tamper Triage & Forensics</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Module M5
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Layered PDF structural analysis, incremental update inspection, font discrepancies, and perceptual hashing.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2 rounded-lg max-w-sm flex items-start space-x-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Official Safeguard:</strong> Signals are preliminary risk indicators requiring human verification. The platform never makes definitive automated forgery accusations.
          </span>
        </div>
      </div>

      {/* Forensic Signal Explanations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Signal 1</span>
          <h3 className="text-sm font-bold text-slate-900">PDF Incremental Updates</h3>
          <p className="text-xs text-slate-600">
            Detects appended trailer xref dictionaries and byte-range modifications made to signed PDFs.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Signal 2</span>
          <h3 className="text-sm font-bold text-slate-900">Metadata Date Gaps</h3>
          <p className="text-xs text-slate-600">
            Flags implausible spans between PDF <code>CreationDate</code> and <code>ModDate</code> (&gt;180 days).
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Signal 3</span>
          <h3 className="text-sm font-bold text-slate-900">Perceptual Hashing (pHash)</h3>
          <p className="text-xs text-slate-600">
            Detects duplicate certificates re-used across different institutions or past application cycles.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Signal 4</span>
          <h3 className="text-sm font-bold text-slate-900">Text-Layer vs OCR Diff</h3>
          <p className="text-xs text-slate-600">
            Flags hidden digital text layers differing from the visually rasterized OCR glyphs on the canvas.
          </p>
        </div>
      </div>

      {/* Flagged Cases for Triage */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">Forensic Triage Worklist</h2>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {flaggedDocs.length} Document(s) Flagged for Review
          </span>
        </div>

        <div className="space-y-6">
          {flaggedDocs.map(({ app, doc, indicators }, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{doc.filename}</h3>
                  <div className="text-xs text-slate-500 font-mono flex items-center space-x-2 mt-0.5">
                    <span>Institution: {app.institution?.name}</span>
                    <span>•</span>
                    <span>AICTE ID: {app.institution?.aicte_id}</span>
                  </div>
                </div>

                <Link
                  href={`/officer/${app.id}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  <span>Open in Scrutiny Cockpit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Indicators List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indicators.map((ind, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg border border-rose-200 shadow-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        {ind.signal.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Level: {ind.risk_level.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900">{ind.reason}</p>
                    <div className="bg-slate-50 p-2 rounded text-[11px] font-mono text-slate-600 border border-slate-200">
                      {ind.evidence_detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </GovLayout>
  );
}
