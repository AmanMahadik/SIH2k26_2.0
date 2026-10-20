'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, CheckCircle2, AlertTriangle, FileText, ArrowRight, Database, ExternalLink, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { setStoredRole, resetDemoData } from '@/lib/store';

export default function HomePage() {
  const scenarios = [
    {
      id: 'app-1',
      title: 'Scenario 1: 100% Clean Application',
      institution: 'Pune Institute of Computer Technology (PICT)',
      badge: 'CLEAN / COMPLIANT',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'All mandatory documents present, unexpired, legal title matches AICTE master records, intake claimed matches sanctioned quota (420 seats).',
      href: '/officer/app-1',
      actionText: 'Inspect Clean Case',
    },
    {
      id: 'app-2',
      title: 'Scenario 2: Discrepancy & Expiry Flag',
      institution: 'Delhi College of Engineering & Technology',
      badge: 'DISCREPANCY DETECTED',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'State NOC expired prior to Academic Year 2026-27. Name mismatch between EoA letter and University affiliation certificate.',
      href: '/officer/app-2',
      actionText: 'Review Discrepancies',
    },
    {
      id: 'app-3',
      title: 'Scenario 3: Tamper Indicator Advisory',
      institution: 'Apex Technical Campus',
      badge: 'TAMPER ADVISORY',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'Multiple incremental revision tables in PDF, 14-month date gap between creation and modification, claimed intake altered from 240 to 300 seats.',
      href: '/officer/app-3',
      actionText: 'Analyze Forensics',
    },
    {
      id: 'app-4',
      title: 'Scenario 4: Seven-State Fail-Safe Escalation',
      institution: 'National Institute of Management & Science',
      badge: 'FAIL-SAFE ROUTED',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'State issuing authority API unavailable after automated retries. System safely degrades to MANUAL_REVIEW_REQUIRED with zero silent passes.',
      href: '/officer/app-4',
      actionText: 'Test Fail-Safe Workflow',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-2xl text-white p-8 sm:p-12 shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-800/60 border border-blue-700/80 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart India Hackathon 2026 Prototype — Problem Statement 26261</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            NirikshAI <span className="text-blue-400 font-normal">(निरीक्षAI)</span>
          </h1>

          <p className="text-lg text-slate-300 font-light leading-relaxed">
            AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification decision-support engine for the <strong>AICTE Regulation Bureau</strong>.
          </p>

          <div className="pt-2 text-sm italic text-amber-300 font-mono">
            &ldquo;Check early. Prove everything. Humans decide.&rdquo;
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/officer"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg shadow-md transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>Launch Scrutiny Officer Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/institution"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Institution Self-Check Portal</span>
            </Link>

            <Link
              href="/audit"
              className="inline-flex items-center space-x-2 bg-blue-900/50 hover:bg-blue-800 text-blue-200 font-medium px-4 py-2.5 rounded-lg border border-blue-700/50 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Verify Cryptographic Audit Chain</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Quick Demonstration Scenarios */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Interactive Demonstration Scenarios</h2>
            <p className="text-sm text-slate-600">
              Four pre-configured test scenarios ready for live scrutiny officer review.
            </p>
          </div>
          <button
            onClick={resetDemoData}
            className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{sc.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{sc.title}</h3>
                <p className="text-xs font-semibold text-blue-800">{sc.institution}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{sc.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  href={sc.href}
                  className="inline-flex items-center space-x-1 text-sm font-semibold text-blue-900 hover:text-blue-700"
                >
                  <span>{sc.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Core Innovations Grid */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-bold text-slate-900">Key Architectural Safeguards & Innovations</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900">Evidence-Linked Findings</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every flag links directly to the specific document, page number, and visual bounding box coordinate, citing the exact AICTE Handbook clause.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900">Rules as Versioned Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Checklists derived from APH 2024-27 are stored as versioned JSON rule sets, enabling AICTE policy staff to update norms without software redeployment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900">Seven-State State Machine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uniform verification states: <code>VERIFIED</code>, <code>MISMATCH</code>, <code>EXPIRED</code>, <code>PENDING</code>, <code>UNAVAILABLE</code>, <code>MANUAL_REVIEW</code>. Timeouts gracefully degrade with no silent passes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-slate-900">Calibrated Tamper Triage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Outputs explainable risk indicators (PDF structure, incremental updates, metadata dates, font diffs) without making reckless automated forgery accusations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="font-bold text-slate-900">Hash-Chained Audit Trail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every upload, OCR extraction, rule evaluation, and officer decision is cryptographically chained using <code>SHA-256(prev_hash + canonical_event)</code> for legal tamper-evidence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              6
            </div>
            <h3 className="font-bold text-slate-900">Human-In-The-Loop Finality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero automated rejection states. Every adverse regulatory outcome requires a formal Scrutiny Officer action with documented notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
