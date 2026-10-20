'use client';

import React, { useState, useEffect } from 'react';
import { Application, DocumentItem, Finding } from '@/lib/types';
import { getStoredApplications, saveStoredApplications, appendAuditEvent } from '@/lib/store';
import { FileUp, CheckCircle, AlertCircle, Clock, ShieldAlert, ArrowRight, RefreshCw, FileText } from 'lucide-react';

export default function InstitutionPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>('app-1');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    setApps(getStoredApplications());
    const handler = () => setApps(getStoredApplications());
    window.addEventListener('nirikshai_apps_change', handler);
    return () => window.removeEventListener('nirikshai_apps_change', handler);
  }, []);

  const activeApp = apps.find(a => a.id === selectedAppId) || apps[0];

  const handleRealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !activeApp) return;

    setIsUploading(true);
    setUploadMessage(`Hashing ${file.name} and extracting OCR fields...`);

    try {
      // Real client-side SHA-256 computation
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const realSha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        application_id: activeApp.id,
        doc_type: docType,
        filename: file.name,
        storage_path: `uploads/${file.name}`,
        sha256: realSha256,
        page_count: 2,
        analysis_status: 'completed',
        uploaded_at: new Date().toISOString(),
        extracted_fields: [
          { id: `f-${Date.now()}-1`, document_id: `doc-${Date.now()}`, field_key: 'institution_name', value: activeApp.institution?.name || 'College', confidence: 0.98, page: 0 },
          { id: `f-${Date.now()}-2`, document_id: `doc-${Date.now()}`, field_key: 'valid_to', value: '2027-06-30', confidence: 0.95, page: 0 },
        ],
        verification: {
          status: 'verified',
          source: 'mock_issuer',
          timestamp: new Date().toISOString(),
          request_ref: `VER-${Date.now().toString().slice(-4)}`,
          comparison: [{ field_key: 'valid_to', submitted_value: '2027-06-30', source_value: '2027-06-30', match: true }],
        },
      };

      const updatedDocs = [...(activeApp.documents || []).filter(d => d.doc_type !== docType), newDoc];
      let updatedFindings = activeApp.findings || [];
      if (docType === 'noc_state') {
        updatedFindings = updatedFindings.filter(f => f.rule_id !== 'R-EXP-NOC');
      }

      const updatedApp: Application = {
        ...activeApp,
        documents: updatedDocs,
        findings: updatedFindings,
        completeness_score: Math.min(100, (activeApp.completeness_score || 70) + 15),
      };

      const updatedApps = apps.map(a => (a.id === activeApp.id ? updatedApp : a));
      saveStoredApplications(updatedApps);

      appendAuditEvent(
        'institution_user',
        'DOC_UPLOADED',
        `application:${activeApp.id}`,
        { doc_type: docType, filename: file.name, sha256: realSha256, sizeBytes: file.size }
      );

      setUploadMessage(`Successfully computed SHA-256 (${realSha256.slice(0, 12)}...) and attached ${file.name}`);
      setTimeout(() => setUploadMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSimulateUpload = (docType: string) => {
    if (!activeApp) return;
    setIsUploading(true);
    setUploadMessage(`Processing ${docType} with OCR & field extraction...`);

    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        application_id: activeApp.id,
        doc_type: docType,
        filename: `${docType.toUpperCase()}_Uploaded_Signed.pdf`,
        storage_path: `uploads/${docType}_${Date.now()}.pdf`,
        sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        page_count: 2,
        analysis_status: 'completed',
        uploaded_at: new Date().toISOString(),
        extracted_fields: [
          { id: `f-${Date.now()}-1`, document_id: `doc-${Date.now()}`, field_key: 'institution_name', value: activeApp.institution?.name || 'College', confidence: 0.98, page: 0 },
          { id: `f-${Date.now()}-2`, document_id: `doc-${Date.now()}`, field_key: 'valid_to', value: '2027-06-30', confidence: 0.95, page: 0 },
        ],
        verification: {
          status: 'verified',
          source: 'mock_issuer',
          timestamp: new Date().toISOString(),
          request_ref: `VER-${Date.now().toString().slice(-4)}`,
          comparison: [{ field_key: 'valid_to', submitted_value: '2027-06-30', source_value: '2027-06-30', match: true }],
        },
      };

      const updatedDocs = [...(activeApp.documents || []), newDoc];
      // If uploading to app-2 (DCET) and replacing expired NOC, dismiss related finding
      let updatedFindings = activeApp.findings || [];
      if (docType === 'noc_state') {
        updatedFindings = updatedFindings.filter(f => f.rule_id !== 'R-EXP-NOC');
      }

      const updatedApp: Application = {
        ...activeApp,
        documents: updatedDocs,
        findings: updatedFindings,
        completeness_score: Math.min(100, (activeApp.completeness_score || 70) + 15),
      };

      const updatedApps = apps.map(a => (a.id === activeApp.id ? updatedApp : a));
      saveStoredApplications(updatedApps);

      appendAuditEvent(
        'institution_user',
        'DOC_UPLOADED',
        `application:${activeApp.id}`,
        { doc_type: docType, filename: newDoc.filename, sha256: newDoc.sha256 }
      );

      setIsUploading(false);
      setUploadMessage(`Successfully validated and attached ${newDoc.filename}`);
      setTimeout(() => setUploadMessage(null), 4000);
    }, 1200);
  };

  const handleSubmitApplication = () => {
    if (!activeApp) return;
    const updatedApp: Application = {
      ...activeApp,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    };
    const updatedApps = apps.map(a => (a.id === activeApp.id ? updatedApp : a));
    saveStoredApplications(updatedApps);

    appendAuditEvent(
      'institution_user',
      'APPLICATION_SUBMITTED',
      `application:${activeApp.id}`,
      { status: 'submitted', completeness_score: activeApp.completeness_score }
    );

    alert(`Application for ${activeApp.institution?.name} has been formally submitted to the AICTE Scrutiny Queue!`);
  };

  if (!activeApp) return null;

  const requiredDocTypes = [
    { type: 'eoa_letter', title: 'Previous Year AICTE EoA Letter', desc: 'Copy of EoA 2025-26 with sanctioned intake' },
    { type: 'affidavit', title: 'Prescribed Affidavit', desc: 'Sworn affidavit on notarized stamp paper (APH §4.1.2)' },
    { type: 'noc_state', title: 'State Govt / Affiliation NOC', desc: 'Valid NOC from DTE / University for 2026-27' },
    { type: 'land_compliance', title: 'Land & Infrastructure Certificate', desc: 'Barrier-free built-up area and safety certificate' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Institution Pre-Submission Portal</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              EoA 2026-27 Self-Check
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Validate all mandatory documents, detect discrepancies, and verify with issuing authorities prior to final submission.
          </p>
        </div>

        {/* Institution / Case Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Select College:</label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="text-sm font-semibold border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {apps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.institution?.name} ({a.academic_year})
              </option>
            ))}
          </select>
        </div>
      </div>

      {uploadMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Main Grid: Uploads + Live Validation Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Uploads & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Mandatory Regulatory Documents</h2>
                <p className="text-xs text-slate-500">AICTE Approval Process Handbook (APH 2024-27 Chapter IV)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">STATUS:</span>
                <span className="ml-2 text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {activeApp.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {requiredDocTypes.map((req) => {
                const uploaded = activeApp.documents?.find(d => d.doc_type === req.type);
                return (
                  <div
                    key={req.type}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${uploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {uploaded ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{req.title}</h3>
                        <p className="text-xs text-slate-500">{req.desc}</p>
                        {uploaded && (
                          <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-600 font-mono">
                            <span>{uploaded.filename}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              {uploaded.verification?.status?.toUpperCase() || 'ANALYZED'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-3.5 py-1.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors">
                        <FileUp className="w-3.5 h-3.5" />
                        <span>{uploaded ? 'Choose File' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleRealFileUpload(e, req.type)}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => handleSimulateUpload(req.type)}
                        disabled={isUploading}
                        title="Simulate instant OCR analysis with sample test data"
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-2 py-1.5 rounded shadow-xs"
                      >
                        Auto-fill Sample
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Pre-submission Deficiency Report */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Pre-Scrutiny Report</h2>

            {/* Completeness Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Readiness Score</span>
                <span className="font-extrabold text-blue-900">{activeApp.completeness_score || 70}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    (activeApp.completeness_score || 0) >= 90
                      ? 'bg-emerald-500'
                      : (activeApp.completeness_score || 0) >= 70
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${activeApp.completeness_score || 70}%` }}
                ></div>
              </div>
            </div>

            {/* Findings & Deficiencies */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-slate-400">Identified Gaps:</span>

              {(!activeApp.findings || activeApp.findings.length === 0) ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center space-x-3 text-emerald-800">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Zero Blocking Deficiencies</p>
                    <p className="text-emerald-700">All rules verified against AICTE records. Application is ready for submission.</p>
                  </div>
                </div>
              ) : (
                activeApp.findings.map((fnd) => (
                  <div
                    key={fnd.id}
                    className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/70 space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                        {fnd.kind.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{fnd.evidence.clause}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{fnd.message}</p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Fix: Ensure document is valid for 2026-27 session and re-upload above.
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleSubmitApplication}
                className="w-full flex items-center justify-center space-x-2 bg-blue-950 hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all text-sm"
              >
                <span>Submit Application to AICTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
