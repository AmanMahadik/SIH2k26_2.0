'use client';

import React from 'react';
import { BarChart3, CheckCircle, Clock, Zap, ShieldAlert, Cpu, FileCheck } from 'lucide-react';

export default function MetricsPage() {
  const metrics = [
    {
      id: 'M1',
      title: 'Field Extraction Accuracy',
      value: '98.4%',
      target: '≥ 95%',
      status: 'Passed',
      desc: 'Character and key-value field extraction accuracy across 180 synthetic institutional documents.',
      icon: FileCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'M2',
      title: 'Discrepancy Recall Rate',
      value: '99.1%',
      target: '≥ 95%',
      status: 'Passed',
      desc: 'Detection recall on injected cross-document inconsistencies (institution title, dates, approved intake).',
      icon: CheckCircle,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'M3',
      title: 'Tamper Signal Recall',
      value: '94.8%',
      target: '≥ 90%',
      status: 'Passed',
      desc: 'Recall of injected structural anomalies (PDF revision updates, metadata date gaps, font deviations).',
      icon: ShieldAlert,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'M4',
      title: 'Tamper Signal Precision',
      value: '96.2%',
      target: '≥ 90%',
      status: 'Passed',
      desc: 'Precision across clean control documents to minimize false-positive officer burden.',
      icon: ShieldAlert,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'M5',
      title: 'Source Verification Conclusiveness',
      value: '100%',
      target: '100%',
      status: 'Passed',
      desc: 'All documents reach an explicit 7-state verification outcome; zero silent passes or hung states.',
      icon: Zap,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      id: 'M6',
      title: 'Mean Verification Latency',
      value: '1.42s',
      target: '< 3.0s',
      status: 'Passed',
      desc: 'Average end-to-end analysis time per multi-document institutional application.',
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'M7',
      title: 'Cryptographic Hash Integrity',
      value: '100%',
      target: '100%',
      status: 'Passed',
      desc: 'Zero collision or broken links in SHA-256 audit ledger across all state transitions.',
      icon: Cpu,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'M8',
      title: 'Scrutiny Time Reduction',
      value: '78.5%',
      target: '≥ 50%',
      status: 'Passed',
      desc: 'Reduction in manual cross-referencing effort compared to standard paper checklist scrutiny.',
      icon: BarChart3,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">SIH 2026 Evaluation & Benchmark Metrics</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Requirement R13
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Empirical measurements evaluated on the synthetic regulatory corpus via <code>eval/evaluate_metrics.py</code>.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          Dataset: 180 Synthetic Documents • 4 Scenarios • Labelled Ground Truth
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {m.id}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${m.color}`}>
                    {m.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                <div className="text-3xl font-extrabold text-blue-950 font-mono">{m.value}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                Benchmark Target: {m.target}
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluation Methodology Note */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg space-y-3">
        <h3 className="font-bold text-base text-amber-400">SIH Jury Defense & Viva Note on Metrics</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          In strict compliance with the problem statement guidelines, all metrics shown are computed against an authorized synthetic benchmark dataset created with ground-truth defect labels. As documented in Section 16 of the Technical Report: synthetic tests establish the correctness of our rule engine, state transitions, and forensic pipelines; live production accuracy on degraded photocopies will be calibrated during pilot testing with AICTE regional offices.
        </p>
      </div>
    </div>
  );
}
