'use client';

import React, { useState, useEffect } from 'react';
import GovLayout from '@/components/gov/GovLayout';
import { useParams, useRouter } from 'next/navigation';
import { Application, DocumentItem, Finding, FindingStatus, VerifStatus } from '@/lib/types';
import { getStoredApplications, saveStoredApplications, appendAuditEvent } from '@/lib/store';
import {
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Eye,
  CornerDownRight,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Send,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function OfficerCaseScrutinyPage() {
  const params = useParams();
  const router = useRouter();
  const appId = (params?.id as string) || 'app-1';

  const [apps, setApps] = useState<Application[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [activeHighlightBbox, setActiveHighlightBbox] = useState<any>(null);
  const [activeHighlightField, setActiveHighlightField] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getStoredApplications();
    setApps(loaded);
    const curr = loaded.find(a => a.id === appId) || loaded[0];
    if (curr && curr.documents && curr.documents.length > 0) {
      setSelectedDocId(curr.documents[0].id);
    }
  }, [appId]);

  const app = apps.find(a => a.id === appId) || apps[0];
  if (!app) return null;

  const currentDoc = app.documents?.find(d => d.id === selectedDocId) || app.documents?.[0];

  const isFieldActive = (fieldKey: string) => {
    if (activeHighlightField === fieldKey) return true;
    if (activeHighlightBbox && currentDoc?.extracted_fields) {
      const f = currentDoc.extracted_fields.find(
        fld => fld.field_key === fieldKey && fld.bbox && fld.bbox.x === activeHighlightBbox.x
      );
      if (f) return true;
    }
    return false;
  };

  const handleReviewFinding = (findingId: string, decision: 'confirmed' | 'dismissed') => {
    setIsActionLoading(true);
    const notes = prompt(`Please provide regulatory reason for ${decision.toUpperCase()} this finding:`, decision === 'confirmed' ? 'Verified discrepancy against AICTE master handbook.' : 'Verified as typographical error; within permissible deviation.');
    if (notes === null) {
      setIsActionLoading(false);
      return;
    }

    const updatedFindings = app.findings?.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          status: decision as FindingStatus,
          review: {
            reviewer: 'scrutiny_officer_w1',
            decision,
            notes,
            at: new Date().toISOString(),
          },
        };
      }
      return f;
    });

    const updatedApp: Application = {
      ...app,
      findings: updatedFindings,
    };

    const updatedApps = apps.map(a => (a.id === app.id ? updatedApp : a));
    saveStoredApplications(updatedApps);
    setApps(updatedApps);

    appendAuditEvent(
      'scrutiny_officer_w1',
      'FINDING_REVIEWED',
      `finding:${findingId}`,
      { decision, notes, rule_id: app.findings?.find(f => f.id === findingId)?.rule_id }
    );

    setIsActionLoading(false);
  };

  const handleTriggerReverification = (docId: string) => {
    setIsActionLoading(true);
    setTimeout(() => {
      const updatedDocs = app.documents?.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            verification: {
              status: 'verified' as VerifStatus,
              source: 'mock_issuer' as const,
              timestamp: new Date().toISOString(),
              request_ref: `RE-VER-${Date.now().toString().slice(-4)}`,
              comparison: [{ field_key: 're_verification', submitted_value: 'OK', source_value: 'OK', match: true }],
              notes: 'Manual re-query successful. Issuing authority confirmed record.',
            },
          };
        }
        return d;
      });

      const updatedApp = { ...app, documents: updatedDocs };
      const updatedApps = apps.map(a => (a.id === app.id ? updatedApp : a));
      saveStoredApplications(updatedApps);
      setApps(updatedApps);

      appendAuditEvent(
        'scrutiny_officer_w1',
        'ISSUER_REVERIFIED',
        `document:${docId}`,
        { outcome: 'verified' }
      );

      setIsActionLoading(false);
    }, 1000);
  };

  const handleFinalDecision = (decisionType: string) => {
    const confirmation = confirm(`Confirm final decision: ${decisionType} for ${app.institution?.name}?`);
    if (!confirmation) return;

    appendAuditEvent(
      'scrutiny_officer_w1',
      'OFFICER_FINAL_DECISION',
      `application:${app.id}`,
      { decision: decisionType, notes: decisionNotes || 'Final scrutiny review completed.' }
    );

    const updatedApp: Application = {
      ...app,
      status: 'closed',
    };
    const updatedApps = apps.map(a => (a.id === app.id ? updatedApp : a));
    saveStoredApplications(updatedApps);
    setApps(updatedApps);

    alert(`Decision "${decisionType}" recorded to hash-chained audit log successfully!`);
    router.push('/officer');
  };

  const handleFocusEvidence = (finding: Finding) => {
    if (finding.evidence.doc_ids && finding.evidence.doc_ids.length > 0) {
      const targetDoc = app.documents?.find(d => finding.evidence.doc_ids.includes(d.id));
      if (targetDoc) {
        setSelectedDocId(targetDoc.id);
      }
    }
    if (finding.evidence.bboxes && finding.evidence.bboxes.length > 0) {
      let targetField = finding.evidence.field_key || '';
      if (!targetField) {
        if (finding.rule_id?.includes('INTAKE') || finding.message?.toLowerCase().includes('intake')) {
          targetField = 'approved_intake';
        } else if (
          finding.rule_id?.includes('NAME') ||
          finding.rule_id?.includes('TITLE') ||
          finding.message?.toLowerCase().includes('name') ||
          finding.message?.toLowerCase().includes('title')
        ) {
          targetField = 'institution_name';
        } else if (
          finding.rule_id?.includes('NOC') ||
          finding.rule_id?.includes('EXP') ||
          finding.message?.toLowerCase().includes('expired') ||
          finding.message?.toLowerCase().includes('valid')
        ) {
          targetField = 'valid_to';
        }
      }
      setActiveHighlightField(targetField);
      setActiveHighlightBbox(finding.evidence.bboxes[0]);
    }
  };

  return (
    <GovLayout role="officer" activeTab="applications">
      <div className="space-y-6">
      {/* Back button & Case Header */}
      <div className="space-y-4">
        <Link
          href="/officer"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scrutiny Work Queue</span>
        </Link>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-slate-900">{app.institution?.name}</h1>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                app.status === 'closed' ? 'bg-slate-200 text-slate-800' : 'bg-blue-100 text-blue-900'
              }`}>
                {app.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono mt-1">
              <span>AICTE ID: {app.institution?.aicte_id}</span>
              <span>•</span>
              <span>Category: {app.category}</span>
              <span>•</span>
              <span>Academic Year: {app.academic_year}</span>
              <span>•</span>
              <span>Affiliating Univ: {app.institution?.university}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/officer/${app.id}/report`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-2 rounded-lg shadow-xs transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-blue-900" />
              <span>Generate Official Report / EoA</span>
            </Link>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Priority Rating</div>
              <div className="text-xl font-black text-rose-600">P-{app.priority}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cockpit Split: Left Document Viewer / Right Findings & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Document Evidence Viewer with Bounding Box Overlay (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-900" />
              <h2 className="text-sm font-bold text-slate-900">Document Evidence Viewer</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {currentDoc?.page_count || 1} Page(s) • SHA-256 Verified
            </span>
          </div>

          {/* Document Switcher Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {app.documents?.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDocId(d.id);
                  setActiveHighlightBbox(null);
                  setActiveHighlightField(null);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                  selectedDocId === d.id
                    ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {d.doc_type.replace(/_/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Visual Document Canvas Simulation */}
          <div className="relative bg-slate-900 rounded-lg p-3 min-h-[460px] flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded backdrop-blur">
              <span className="font-mono truncate max-w-[280px]">{currentDoc?.filename}</span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-amber-300">
                  OCR: 96.8% Confidence
                </span>
                <span className="text-emerald-400 text-xs font-bold">100% Page 1</span>
              </div>
            </div>

            {/* Document Content Canvas with Simulated Paper & Real Bounding Boxes */}
            <div className="my-3 bg-white rounded shadow-2xl p-6 text-slate-800 text-xs font-serif leading-relaxed relative min-h-[380px] border border-slate-300 select-none">
              {/* Simulated Official Header */}
              <div className="text-center border-b border-slate-300 pb-3 mb-4 space-y-1">
                <div className="font-bold text-slate-900 uppercase tracking-widest text-[13px]">
                  ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
                </div>
                <div className="text-[10px] text-slate-500">
                  Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 | www.aicte-india.org
                </div>
                <div className="text-[11px] font-bold text-slate-700">
                  {currentDoc?.doc_type === 'eoa_letter'
                    ? 'EXTENSION OF APPROVAL (EoA) ORDER 2025-26'
                    : currentDoc?.doc_type === 'noc_state'
                    ? 'STATE GOVERNMENT NO OBJECTION CERTIFICATE'
                    : currentDoc?.doc_type === 'affidavit'
                    ? 'AFFIDAVIT ON NOTARIZED STAMP PAPER (APH CHAPTER IV)'
                    : 'LAND & INFRASTRUCTURE COMPLIANCE RECORD'}
                </div>
              </div>

              {/* Document Body with Direct-Anchored Precision OCR Bounding Boxes */}
              <div className="space-y-3.5 font-sans text-[11px] pt-1">
                {/* Application Reference */}
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700 min-w-[170px]">Application Reference:</span>
                  <span className="font-mono text-slate-800 font-semibold">{app.id.toUpperCase()}-REG</span>
                </div>

                {/* Institution Title with Pinpoint OCR Bounding Box */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700 min-w-[170px]">Institution Title:</span>
                  <div
                    onClick={() => setActiveHighlightField(activeHighlightField === 'institution_name' ? null : 'institution_name')}
                    title="OCR Bounding Box: institution_name (Click to toggle)"
                    className={`relative inline-flex items-center rounded-md transition-all duration-300 p-1 px-2.5 cursor-pointer select-text ${
                      isFieldActive('institution_name')
                        ? 'border-2 border-rose-600 bg-rose-500/20 ring-4 ring-rose-400/50 shadow-md animate-pulse'
                        : 'border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                    }`}
                  >
                    <span className="font-bold text-slate-900 text-xs">
                      {currentDoc?.extracted_fields?.find(f => f.field_key === 'institution_name')?.value || app.institution?.name}
                    </span>
                    <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase ${
                      isFieldActive('institution_name') ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                    }`}>
                      institution_name
                    </span>
                  </div>
                </div>

                {/* AICTE National Permanent ID */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700 min-w-[170px]">AICTE Permanent ID:</span>
                  {currentDoc?.extracted_fields?.some(f => f.field_key === 'aicte_id') ? (
                    <div
                      onClick={() => setActiveHighlightField(activeHighlightField === 'aicte_id' ? null : 'aicte_id')}
                      title="OCR Bounding Box: aicte_id (Click to toggle)"
                      className={`relative inline-flex items-center rounded-md transition-all duration-300 p-1 px-2.5 cursor-pointer select-text ${
                        isFieldActive('aicte_id')
                          ? 'border-2 border-rose-600 bg-rose-500/20 ring-4 ring-rose-400/50 shadow-md animate-pulse'
                          : 'border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                      }`}
                    >
                      <span className="font-mono font-bold text-slate-900 text-xs">{app.institution?.aicte_id}</span>
                      <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase ${
                        isFieldActive('aicte_id') ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                      }`}>
                        aicte_id
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-slate-800 font-semibold">{app.institution?.aicte_id}</span>
                  )}
                </div>

                {/* Approved Sanctioned Intake with Pinpoint OCR Bounding Box */}
                {currentDoc?.extracted_fields?.some(f => f.field_key === 'approved_intake') && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700 min-w-[170px]">Approved Intake (Claimed):</span>
                    <div
                      onClick={() => setActiveHighlightField(activeHighlightField === 'approved_intake' ? null : 'approved_intake')}
                      title="OCR Bounding Box: approved_intake (Click to toggle)"
                      className={`relative inline-flex items-center rounded-md transition-all duration-300 p-1 px-2.5 cursor-pointer select-text ${
                        isFieldActive('approved_intake')
                          ? 'border-2 border-rose-600 bg-rose-500/20 ring-4 ring-rose-400/50 shadow-md animate-pulse'
                          : 'border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                      }`}
                    >
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {currentDoc.extracted_fields.find(f => f.field_key === 'approved_intake')?.value} Seats
                      </span>
                      <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase ${
                        isFieldActive('approved_intake') ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                      }`}>
                        approved_intake
                      </span>
                    </div>
                  </div>
                )}

                {/* Certificate Validity Till */}
                {currentDoc?.extracted_fields?.some(f => f.field_key === 'valid_to') && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700 min-w-[170px]">Certificate Validity Till:</span>
                    <div
                      onClick={() => setActiveHighlightField(activeHighlightField === 'valid_to' ? null : 'valid_to')}
                      title="OCR Bounding Box: valid_to (Click to toggle)"
                      className={`relative inline-flex items-center rounded-md transition-all duration-300 p-1 px-2.5 cursor-pointer select-text ${
                        isFieldActive('valid_to')
                          ? 'border-2 border-rose-600 bg-rose-500/20 ring-4 ring-rose-400/50 shadow-md animate-pulse'
                          : 'border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                      }`}
                    >
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {currentDoc.extracted_fields.find(f => f.field_key === 'valid_to')?.value}
                      </span>
                      <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase ${
                        isFieldActive('valid_to') ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                      }`}>
                        valid_to
                      </span>
                    </div>
                  </div>
                )}

                {/* Execution Date */}
                {currentDoc?.extracted_fields?.some(f => f.field_key === 'execution_date') && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700 min-w-[170px]">Execution Date:</span>
                    <div
                      onClick={() => setActiveHighlightField(activeHighlightField === 'execution_date' ? null : 'execution_date')}
                      title="OCR Bounding Box: execution_date (Click to toggle)"
                      className={`relative inline-flex items-center rounded-md transition-all duration-300 p-1 px-2.5 cursor-pointer select-text ${
                        isFieldActive('execution_date')
                          ? 'border-2 border-rose-600 bg-rose-500/20 ring-4 ring-rose-400/50 shadow-md animate-pulse'
                          : 'border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                      }`}
                    >
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {currentDoc.extracted_fields.find(f => f.field_key === 'execution_date')?.value}
                      </span>
                      <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase ${
                        isFieldActive('execution_date') ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                      }`}>
                        execution_date
                      </span>
                    </div>
                  </div>
                )}

                {/* Carpet Area */}
                {currentDoc?.extracted_fields?.some(f => f.field_key === 'carpet_area_sqm') && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700 min-w-[170px]">Built-up Carpet Area:</span>
                    <div
                      onClick={() => setActiveHighlightField(activeHighlightField === 'carpet_area_sqm' ? null : 'carpet_area_sqm')}
                      title="OCR Bounding Box: carpet_area_sqm (Click to toggle)"
                      className={`relative inline-flex items-center rounded-md transition-all duration-300 p-1 px-2.5 cursor-pointer select-text ${
                        isFieldActive('carpet_area_sqm')
                          ? 'border-2 border-rose-600 bg-rose-500/20 ring-4 ring-rose-400/50 shadow-md animate-pulse'
                          : 'border-2 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20'
                      }`}
                    >
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {currentDoc.extracted_fields.find(f => f.field_key === 'carpet_area_sqm')?.value} Sq. Metres
                      </span>
                      <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase ${
                        isFieldActive('carpet_area_sqm') ? 'bg-rose-600 text-white' : 'bg-blue-900 text-white'
                      }`}>
                        carpet_area_sqm
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-slate-500 text-[10px] pt-3 border-t border-slate-100">
                  Note: This document has been read by NirikshAI Document AI OCR engine. All fields, timestamps, and cryptographic digital signatures have been extracted for regulatory verification. Click any field or &ldquo;Locate Evidence Box&rdquo; to highlight findings.
                </p>
              </div>
            </div>

            {/* Extracted Fields Metadata Strip */}
            <div className="bg-slate-800/90 rounded p-2.5 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 uppercase text-[10px]">Extracted OCR Key-Value Tuples (Click to Locate):</span>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                {currentDoc?.extracted_fields?.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveHighlightField(activeHighlightField === f.field_key ? null : f.field_key)}
                    className={`px-2 py-0.5 rounded border transition-all text-[10px] flex items-center space-x-1 cursor-pointer ${
                      isFieldActive(f.field_key)
                        ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                        : 'bg-slate-700/80 hover:bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    <span className={isFieldActive(f.field_key) ? 'text-white' : 'text-slate-400'}>{f.field_key}:</span>
                    <span className="font-semibold text-white">{f.value}</span>
                    <span className="text-[9px] opacity-75">({Math.round(f.confidence * 100)}%)</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

                {/* Right Side: Evidence-Linked Findings & 7-State Verification (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Findings Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">Evidence-Linked Findings</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {app.findings?.length || 0} Total Flag(s)
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {(!app.findings || app.findings.length === 0) ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center space-x-3 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Zero Regulatory Discrepancies</p>
                    <p className="text-emerald-700">All rules verified against AICTE records. Application is compliant.</p>
                  </div>
                </div>
              ) : (
                app.findings.map((fnd) => (
                  <div
                    key={fnd.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      fnd.status === 'confirmed'
                        ? 'border-rose-300 bg-rose-50/50'
                        : fnd.status === 'dismissed'
                        ? 'border-slate-300 bg-slate-50 opacity-60'
                        : 'border-amber-300 bg-amber-50/60 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                        {fnd.kind.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-bold">
                        {fnd.evidence.clause}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 leading-snug">{fnd.message}</p>

                    <div className="bg-white/80 p-2.5 rounded border border-slate-200 text-[11px] space-y-1">
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700">Claimed Value:</span> {fnd.evidence.extracted_value || 'None'}
                      </div>
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700">Required Norm:</span> {fnd.evidence.expected_value}
                      </div>
                    </div>

                    {/* Evidence Locator Button */}
                    <div className="flex justify-between items-center pt-1">
                      <button
                        onClick={() => handleFocusEvidence(fnd)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-blue-900 hover:text-blue-700 underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Locate Evidence Box</span>
                      </button>

                      {/* Confirm / Dismiss Action Controls */}
                      <div className="flex items-center space-x-2">
                        {fnd.status === 'open' ? (
                          <>
                            <button
                              onClick={() => handleReviewFinding(fnd.id, 'dismissed')}
                              disabled={isActionLoading}
                              className="text-xs font-semibold px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleReviewFinding(fnd.id, 'confirmed')}
                              disabled={isActionLoading}
                              className="text-xs font-bold px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                            >
                              Confirm
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${
                            fnd.status === 'confirmed' ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {fnd.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Seven-State Verification Adapter Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-900" />
                <h2 className="text-sm font-bold text-slate-900">Seven-State Issuer Verification</h2>
              </div>
              <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                R6 State Machine
              </span>
            </div>

            <div className="space-y-3">
              {app.documents?.map((doc) => {
                const status = doc.verification?.status || 'verification_pending';
                return (
                  <div key={doc.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">{doc.doc_type.replace(/_/g, ' ').toUpperCase()}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Source: {doc.verification?.source || 'mock_issuer'} • Ref: {doc.verification?.request_ref || 'PENDING'}
                      </div>
                      {doc.verification?.notes && (
                        <p className="text-[10px] text-slate-600 italic">{doc.verification.notes}</p>
                      )}
                    </div>

                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'mismatch_detected' || status === 'expired'
                          ? 'bg-rose-100 text-rose-800'
                          : status === 'manual_review_required'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {status.replace(/_/g, ' ')}
                      </span>

                      {status === 'manual_review_required' && (
                        <button
                          onClick={() => handleTriggerReverification(doc.id)}
                          disabled={isActionLoading}
                          className="text-[10px] font-bold text-purple-900 bg-purple-200/80 hover:bg-purple-300 px-2 py-0.5 rounded transition-all"
                        >
                          Retry Verification
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Scrutiny Decision Cockpit */}
          <div className="bg-slate-900 text-white rounded-xl shadow-lg p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold">Officer Final Regulatory Action</h3>
            </div>

            <textarea
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Enter official remarks or compliance justification for the permanent regulatory audit log..."
              className="w-full text-xs p-2.5 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 min-h-[60px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleFinalDecision('RECOMMEND_APPROVAL')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-2 rounded shadow-sm transition-all"
              >
                Recommend EoA
              </button>

              <button
                onClick={() => handleFinalDecision('DEFICIENCY_NOTICE')}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 px-2 rounded shadow-sm transition-all"
              >
                Deficiency Notice
              </button>

              <button
                onClick={() => handleFinalDecision('PHYSICAL_INSPECTION')}
                className="bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold py-2 px-2 rounded shadow-sm transition-all"
              >
                Physical Inspect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </GovLayout>
  );
}
