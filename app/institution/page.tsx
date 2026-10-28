'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GovLayout from '@/components/gov/GovLayout';
import {
  Building2,
  AlertCircle,
  Bell,
  Check,
  ArrowRight,
  FileText,
  Clock,
  UploadCloud,
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  Search,
  BookOpen,
  X,
  ExternalLink,
  HelpCircle,
  Phone,
  Mail,
  Download,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Copy,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function InstitutionDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Real PDF Extraction & OCR Modal State
  const [extractedDocResult, setExtractedDocResult] = useState<any>(null);
  const [isExtractionModalOpen, setIsExtractionModalOpen] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'fields' | 'canvas' | 'compliance' | 'tamper' | 'text'>('canvas');
  const [ocrPage, setOcrPage] = useState<number>(0);
  const [ocrSearch, setOcrSearch] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeficienciesModalOpen, setIsDeficienciesModalOpen] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Institution Profile State
  const [profileData, setProfileData] = useState({
    name: 'Pune Institute of Computer Technology',
    aicteId: '1-10972348121',
    affiliation: 'Savitribai Phule Pune University',
    established: '1983',
    principal: 'Dr. P. T. Kulkarni',
    email: 'principal@pict.edu',
    phone: '+91 20 2437 1101',
    landArea: '18.5 Acres (Barrier-free compliant)',
  });

  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const [profileLookupStatus, setProfileLookupStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [profileLookupMessage, setProfileLookupMessage] = useState<string | null>(null);

  const handleProfileAicteLookup = async (newId: string) => {
    setProfileData((prev) => ({ ...prev, aicteId: newId }));
    const trimmed = newId.trim();
    if (trimmed.length < 3) {
      setProfileLookupStatus('idle');
      setProfileLookupMessage(null);
      return;
    }
    setProfileLookupStatus('loading');
    try {
      const res = await fetch(`/api/institutions/lookup?id=${encodeURIComponent(trimmed)}`);
      const result = await res.json();
      if (result.success && result.found && result.data) {
        setProfileData((prev) => ({
          ...prev,
          aicteId: result.data.aicte_id || newId,
          name: result.data.name || prev.name,
          affiliation: result.data.university || prev.affiliation,
        }));
        setProfileLookupStatus('found');
        setProfileLookupMessage(`Found: ${result.data.name} (${result.data.state})`);
      } else {
        setProfileLookupStatus('not_found');
        setProfileLookupMessage(null);
      }
    } catch (e) {
      setProfileLookupStatus('not_found');
    }
  };

  useEffect(() => {
    fetch('/api/institutions')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const first = data.data[0];
          setProfileData((prev) => ({
            ...prev,
            name: first.name,
            aicteId: first.aicte_id,
            affiliation: first.university || prev.affiliation,
          }));
        }
      })
      .catch((err) => console.error('Error fetching institution profile:', err));

    fetch('/api/alerts')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setLiveAlerts(data.data);
        }
      })
      .catch((err) => console.error('Error fetching alerts:', err));
  }, []);

  const renderHighlightedPageText = (text: string, search: string) => {
    if (!text) return 'No text layer detected for this page.';
    if (!search || !search.trim()) return text;
    const cleanSearch = search.trim();
    try {
      const regex = new RegExp(`(${cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <mark key={i} className="bg-amber-300 text-slate-900 font-bold px-0.5 rounded shadow-xs">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  const processPdfFile = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('actor', `${profileData.name} (Institution Applicant)`);

      const res = await fetch('/api/documents/extract', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      setIsUploading(false);

      if (json.success && json.data) {
        setExtractedDocResult(json.data);
        setIsExtractionModalOpen(true);
        setActiveResultTab(json.data.extractedFields?.length > 0 ? 'fields' : 'canvas');
        setOcrPage(0);
        setOcrSearch('');
        setUploadSuccess(`Extracted: ${file.name} (SHA-256: ${json.data.sha256.slice(0, 10)}...)`);
      } else {
        alert(json.error || 'Failed to parse PDF.');
      }
    } catch (err: any) {
      setIsUploading(false);
      alert('Upload failed: ' + err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processPdfFile(file);
    e.target.value = '';
  };

  const handleLoadSamplePdf = async (sampleFileName: string) => {
    setIsUploading(true);
    try {
      const res = await fetch(`/sample_docs/${sampleFileName}`);
      const blob = await res.blob();
      const file = new File([blob], sampleFileName, { type: 'application/pdf' });
      await processPdfFile(file);
    } catch (err: any) {
      setIsUploading(false);
      alert('Failed to load sample: ' + err.message);
    }
  };

  const handleCopyHash = () => {
    if (!extractedDocResult?.sha256) return;
    navigator.clipboard.writeText(extractedDocResult.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSavedMsg(true);
    setTimeout(() => {
      setProfileSavedMsg(false);
      setIsProfileModalOpen(false);
    }, 1200);
  };

  return (
    <GovLayout role="institution" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HOME (Exact match to Mockup Top-Right Montage)                    */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* 1. Welcome Banner */}
            <div className="bg-[#E8F0FB] border border-[#BBD5F8] rounded-[6px] px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm text-[#0B2E5C] shadow-xs">
              <div>
                <span className="font-extrabold text-[#0B2E5C]">Welcome, {profileData.name}!</span>{' '}
                <span className="text-slate-700">Let&apos;s complete your EoA application for 2026-27.</span>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-semibold bg-white border border-[#BBD5F8] px-2.5 py-0.5 rounded-full text-[#1D4E9E]">
                Cycle 2026-27 Active
              </span>
            </div>

            {/* 2. Top Row of 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Your Profile */}
              <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#0B2E5C] uppercase tracking-wide border-b border-slate-100 pb-2.5">
                  <Building2 className="w-4 h-4 text-[#1D4E9E]" />
                  <span>Your Profile</span>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0B2E5C] leading-snug">
                      {profileData.name}
                    </h3>
                    <p className="text-xs text-[#5B6574] mt-0.5 font-mono">
                      (AICTE ID: {profileData.aicteId})
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Affiliated: {profileData.affiliation}
                    </p>
                  </div>

                  {/* Circular Progress Ring: 85% */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#1E7B34]"
                          strokeDasharray="85, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-extrabold text-[#1E7B34]">85%</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1">Profile Complete</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-right">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-xs font-semibold text-[#0B57D0] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Manage Profile</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2: Deficiencies to Fix (Red-tinted) */}
              <div className="bg-[#FDECEA] rounded-[6px] border border-[#F5C2C7] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#B42318] uppercase tracking-wide border-b border-rose-200 pb-2.5">
                  <AlertCircle className="w-4 h-4 text-[#B42318]" />
                  <span>Deficiencies to Fix</span>
                </div>

                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#5B6574]">Action Required:</p>
                    <p className="text-[11px] text-[#B42318] font-medium mt-1">
                      Expired State NOC &amp; Land Built-Up Area Clarification
                    </p>
                  </div>
                  <div className="text-5xl sm:text-6xl font-extrabold text-[#B42318] leading-none pr-3">
                    2
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-200 text-right">
                  <button
                    type="button"
                    onClick={() => setIsDeficienciesModalOpen(true)}
                    className="text-xs font-bold text-[#B42318] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View Details &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Recent Alerts */}
              <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-[#0B2E5C] uppercase tracking-wide border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-[#E8801A]" />
                    <span>Recent Alerts</span>
                  </div>
                </div>

                <div className="py-2.5 space-y-2.5 text-xs">
                  {liveAlerts.length > 0 ? (
                    liveAlerts.slice(0, 3).map((a, i) => (
                      <div key={a.id || i} className="flex items-start space-x-2">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          a.type === 'tamper' ? 'bg-[#B42318]' : a.type === 'discrepancy' ? 'bg-[#E8801A]' : 'bg-[#1D4E9E]'
                        }`} />
                        <div className="flex-1">
                          <div className="text-slate-800 font-medium leading-tight">{a.message}</div>
                          <div className="text-[10px] text-slate-400">
                            {a.sent_at ? new Date(a.sent_at).toLocaleDateString() : 'Active'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#E8801A] mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="text-slate-800 font-medium leading-tight">Document verification pending</div>
                          <div className="text-[10px] text-slate-400">2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#1E7B34] mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="text-slate-800 font-medium leading-tight">Upload window active for AY 2026-27</div>
                          <div className="text-[10px] text-slate-400">Azure Sync</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 text-right">
                  <button
                    type="button"
                    onClick={() => setActiveTab('alerts')}
                    className="text-xs font-semibold text-[#0B57D0] hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Section: Application Progress – EoA 2026-27 */}
            <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#0B2E5C]">
                    Application Progress – EoA 2026-27
                  </h2>
                  <p className="text-xs text-[#5B6574] mt-0.5">
                    Current Application ID: <span className="font-mono font-semibold text-slate-700">EA-2026-0452</span> | Category: Extension of Approval (Existing Institution)
                  </p>
                </div>

                <Link
                  href="/officer/app-1/report"
                  className="inline-flex items-center space-x-2 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold px-4 py-2.5 rounded-[6px] shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-gov-warning"
                >
                  <span>Continue Application</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 5-Step Horizontal Stepper */}
              <div className="relative py-2">
                <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-200 z-0" />
                <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
                  {/* Step 1: Select Category (Completed) */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1E7B34] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 mt-2">1. Select Category</span>
                    <span className="text-[10px] text-[#1E7B34] font-medium">Completed</span>
                  </div>

                  {/* Step 2: Upload Documents (Completed) */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1E7B34] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 mt-2">2. Upload Documents</span>
                    <span className="text-[10px] text-[#1E7B34] font-medium">Completed</span>
                  </div>

                  {/* Step 3: Pre-scrutiny Report (Current Active) */}
                  <div className="flex flex-col items-center">
                    <Link href="/officer/app-1/report" className="w-10 h-10 rounded-full bg-[#1D4E9E] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-4 ring-blue-100 hover:scale-105 transition-transform">
                      3
                    </Link>
                    <span className="text-xs font-bold text-[#0B2E5C] mt-2">3. Pre-scrutiny Report</span>
                    <span className="text-[10px] text-[#1D4E9E] font-semibold">Under Review</span>
                  </div>

                  {/* Step 4: Fix and Resubmit (Pending) */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setIsDeficienciesModalOpen(true)}
                      className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm hover:bg-slate-300 transition-colors"
                    >
                      4
                    </button>
                    <span className="text-xs font-medium text-slate-500 mt-2">4. Fix &amp; Resubmit</span>
                    <span className="text-[10px] text-slate-400">Pending</span>
                  </div>

                  {/* Step 5: Submit (Final) */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <span className="text-xs font-medium text-slate-500 mt-2">5. Final Submission</span>
                    <span className="text-[10px] text-slate-400">Pending</span>
                  </div>
                </div>
              </div>

              {/* Real PDF Upload & Live OCR Inspection Zone */}
              <div className="pt-4 border-t border-slate-100 space-y-3 bg-gradient-to-r from-blue-50/50 to-slate-50 p-4 rounded-[6px] border border-blue-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3 text-xs text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-[#E8F0FB] text-[#1D4E9E] flex items-center justify-center shrink-0">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#0B2E5C] text-sm">Real PDF Upload & AI Pre-Scrutiny Engine</span>
                        <span className="text-[10px] font-bold bg-[#1E7B34] text-white px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Upload any institutional certificate (PDF) to run instant text extraction, metadata forensics, and APH 2024-27 rule checks.
                      </p>
                    </div>
                  </div>

                  <label className="cursor-pointer bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold px-4 py-2.5 rounded-[6px] transition-colors shrink-0 shadow-xs flex items-center space-x-1.5">
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Parsing & Extracting...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Any PDF</span>
                      </>
                    )}
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>

                {/* 1-Click Interactive Test Samples */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Or test with 1-click samples:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadSamplePdf('1_PICT_Clean_EoA_2026_27.pdf')}
                    disabled={isUploading}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#1E7B34] border border-emerald-300 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>🟢 Sample 1: Clean Valid EoA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSamplePdf('2_Delhi_College_Expired_NOC.pdf')}
                    disabled={isUploading}
                    className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#E8801A] border border-orange-300 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>🟠 Sample 2: Expired State NOC</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSamplePdf('3_Apex_Tampered_Intake_Certificate.pdf')}
                    disabled={isUploading}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-[#B42318] border border-rose-300 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>🔴 Sample 3: Tampered Intake Revisions</span>
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[#1E7B34] text-xs font-semibold flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileCheck2 className="w-4 h-4 shrink-0" />
                      <span>{uploadSuccess}</span>
                    </div>
                    {extractedDocResult && (
                      <button
                        type="button"
                        onClick={() => setIsExtractionModalOpen(true)}
                        className="text-[11px] font-bold underline hover:text-emerald-800 cursor-pointer"
                      >
                        View Full Extraction Dossier &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY APPLICATIONS                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">My Extension of Approval (EoA) Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">Track your past and active AICTE annual approval applications.</p>
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
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Academic Year</th>
                    <th className="py-2.5 px-3">Submitted On</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">EA-2026-0452</td>
                    <td className="py-3 px-3 font-medium">Extension of Approval (Existing)</td>
                    <td className="py-3 px-3 font-mono">2026-27</td>
                    <td className="py-3 px-3 font-mono">18 Oct 2026</td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#1D4E9E] border border-blue-200">
                        Pre-Scrutiny (Under Review)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Link
                        href="/officer/app-1/report"
                        className="inline-flex items-center space-x-1 px-3 py-1 border border-[#0B2E5C] text-[#0B2E5C] hover:bg-[#E8F0FB] text-xs font-bold rounded-[4px] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Pre-Scrutiny Report</span>
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#0B2E5C]">EA-2025-0198</td>
                    <td className="py-3 px-3 font-medium">Extension of Approval</td>
                    <td className="py-3 px-3 font-mono">2025-26</td>
                    <td className="py-3 px-3 font-mono">14 Nov 2025</td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-[#1E7B34] border border-emerald-200">
                        Approved (Issued)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert('Downloading official AICTE EoA Letter 2025-26 (PDF)...')}
                        className="inline-flex items-center space-x-1 px-3 py-1 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-[4px] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Letter</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ALERTS & NOTICES                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">Institutional Alerts &amp; Regulatory Notices</h2>
                <p className="text-xs text-slate-500 mt-0.5">Critical notifications from AICTE Regulation Bureau regarding your application.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-[6px] border border-rose-200 bg-rose-50/60 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-[#B42318] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#B42318]">Action Required: 2 Deficiencies Flagged</h4>
                    <p className="text-xs text-slate-700 mt-1">
                      Your pre-scrutiny report has flagged 1 expired State NOC and 1 Land Area clarification. Please submit rectified documents before 31 Oct 2026.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">1 day ago • Official Bureau Notice</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeficienciesModalOpen(true)}
                  className="px-3 py-1.5 bg-[#B42318] hover:bg-[#911c13] text-white text-xs font-bold rounded shadow-xs shrink-0"
                >
                  Resolve Now
                </button>
              </div>

              <div className="p-4 rounded-[6px] border border-amber-200 bg-amber-50/60 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#E8801A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Document Verification Pending</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Statutory verification of your submitted sworn affidavit is underway by the Western Regional Scrutiny Committee.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">2 hours ago • System Update</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">In Progress</span>
              </div>

              <div className="p-4 rounded-[6px] border border-blue-200 bg-blue-50/60 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <Bell className="w-5 h-5 text-[#1D4E9E] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Upload Window Extended to 31 Oct 2026</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Per AICTE Circular No. AICTE/AB/EoA/2026-27, the deadline for uploading deficiency responses has been extended for all affiliated institutions.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">1 day ago • Public Circular</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">Info</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HELP & GUIDELINES                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'help' && (
          <div className="bg-white rounded-[6px] border border-[#D0D7E2] p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#0B2E5C]">AICTE Approval Process Handbook (APH 2024-27) Support</h2>
                <p className="text-xs text-slate-500 mt-0.5">Guidelines and helpdesk contacts for technical institutions.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs font-bold text-[#0B57D0] hover:underline"
              >
                &larr; Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#0B2E5C] uppercase tracking-wide">Frequently Asked Questions</h3>

                <div className="space-y-2 text-xs">
                  <details className="p-3 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                    <summary className="font-bold text-slate-800">What documents are mandatory for EoA 2026-27?</summary>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      Per APH 2024-27 Chapter IV, institutions must submit: (1) Sworn Affidavit on ₹100 stamp paper (§4.1.2), (2) State Govt / University NOC (§4.1.4), (3) Land Barrier-Free Compliance certificate (§4.2.1), and (4) TER fee payment confirmation (§4.6.1).
                    </p>
                  </details>

                  <details className="p-3 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                    <summary className="font-bold text-slate-800">What happens if my State NOC has expired?</summary>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      Per §4.3.1, NOCs must be valid through at least the commencement of Academic Year 2026-27. If expired, submit the provisional renewal receipt or extension letter from the State DTE.
                    </p>
                  </details>

                  <details className="p-3 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                    <summary className="font-bold text-slate-800">How does the Pre-Scrutiny validation work?</summary>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      NirikshAI runs automated checks on uploaded documents, computing cryptographic SHA-256 hashes and cross-referencing fields with the national AICTE registry to provide an immediate deficiency checklist.
                    </p>
                  </details>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#0B2E5C] uppercase tracking-wide">AICTE Regulation Bureau Helpdesk</h3>

                <div className="p-4 bg-[#EEF3FA] rounded border border-[#D0D7E2] space-y-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Phone className="w-4 h-4 text-[#1D4E9E]" />
                    <span><strong>Toll-Free Helpline:</strong> 1800-11-2026 (Mon-Sat, 9:30 AM - 5:30 PM)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Mail className="w-4 h-4 text-[#1D4E9E]" />
                    <span><strong>Support Email:</strong> helpdesk-eoa@aicte-india.org</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Building2 className="w-4 h-4 text-[#1D4E9E]" />
                    <span><strong>Bureau Office:</strong> Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: MANAGE PROFILE                                                   */}
      {/* ========================================================================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="bg-[#0B2E5C] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <h3 className="text-sm font-bold">Manage Institutional Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4 text-xs">
              {/* AICTE Permanent ID with Instant Auto-Fetch */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AICTE Permanent ID (Auto-Fetch Enabled)</span>
                  </label>
                  {profileLookupStatus === 'loading' && (
                    <span className="text-[10px] text-blue-600 flex items-center space-x-1 font-semibold">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Searching...</span>
                    </span>
                  )}
                  {profileLookupStatus === 'found' && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.2 rounded font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={profileData.aicteId}
                  onChange={(e) => handleProfileAicteLookup(e.target.value)}
                  placeholder="e.g. 1-5592509"
                  className="w-full px-3 py-2 border-2 border-blue-400 focus:border-blue-600 rounded text-slate-900 bg-white font-mono font-semibold"
                />

                {profileLookupMessage && (
                  <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 p-1.5 rounded border border-emerald-200">
                    ✓ {profileLookupMessage}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Institution Legal Name (Auto-Populated)</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Established Year</label>
                  <input
                    type="text"
                    value={profileData.established}
                    onChange={(e) => setProfileData({ ...profileData, established: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Affiliating University (Auto-Populated)</label>
                  <input
                    type="text"
                    value={profileData.affiliation}
                    onChange={(e) => setProfileData({ ...profileData, affiliation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Principal / Director</label>
                  <input
                    type="text"
                    value={profileData.principal}
                    onChange={(e) => setProfileData({ ...profileData, principal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Land Area (Acres)</label>
                  <input
                    type="text"
                    value={profileData.landArea}
                    onChange={(e) => setProfileData({ ...profileData, landArea: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>

              {profileSavedMsg && (
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white rounded font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DEFICIENCIES DETAILS (From Deficiencies to Fix Card)              */}
      {/* ========================================================================= */}
      {isDeficienciesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full border border-rose-300 overflow-hidden">
            <div className="bg-[#B42318] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <h3 className="text-sm font-bold">Identified Deficiencies to Fix (Cycle 2026-27)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDeficienciesModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                AICTE Pre-Scrutiny has flagged <strong>2 items</strong> requiring resolution before your application can proceed to Senior Review:
              </p>

              {/* Deficiency 1 */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-[6px] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#B42318] uppercase tracking-wide text-[10px]">Deficiency 1 • Expired Document</span>
                  <span className="font-mono text-[10px] text-rose-700 font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200">Clause §4.3.1</span>
                </div>
                <p className="text-slate-800 font-semibold">State Government NOC has expired (Validity: 31 May 2025)</p>
                <p className="text-slate-600 text-[11px]">
                  Under APH norms, state NOC validity must cover through Academic Year 2026-27.
                </p>
                <div className="pt-1">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 text-xs font-bold text-[#B42318] hover:underline">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Renewed State NOC (PDF)</span>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Deficiency 2 */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[6px] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-800 uppercase tracking-wide text-[10px]">Deficiency 2 • Area Verification</span>
                  <span className="font-mono text-[10px] text-amber-800 font-bold bg-white px-1.5 py-0.5 rounded border border-amber-200">Clause §4.2.1</span>
                </div>
                <p className="text-slate-800 font-semibold">Land Built-Up Area Clarification Required</p>
                <p className="text-slate-600 text-[11px]">
                  Barrier-free access ramp certificate page 2 lacks authorized municipal architect endorsement stamp.
                </p>
                <div className="pt-1">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 hover:underline">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Certified Architect Endorsement (PDF)</span>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <Link
                  href="/officer/app-1/report"
                  className="text-xs font-bold text-[#0B57D0] hover:underline inline-flex items-center space-x-1"
                >
                  <span>View Full Pre-Scrutiny Letterhead Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDeficienciesModalOpen(false)}
                  className="px-4 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white rounded font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Real AI Extraction, OCR & Regulatory Dossier Modal              */}
      {/* ========================================================================= */}
      {isExtractionModalOpen && extractedDocResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full border border-slate-300 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#0B2E5C] text-white px-5 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    Document AI Extraction &amp; Forensics Dossier
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    File: {extractedDocResult.filename} • {extractedDocResult.pageCount} Page(s) • {(extractedDocResult.fileSizeBytes / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExtractionModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cryptographic Seal Bar */}
            <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-700">
                <span className="font-bold text-slate-900 font-sans">SHA-256 Fingerprint:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[11px] text-emerald-700 font-bold">
                  {extractedDocResult.sha256}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[11px] font-sans font-semibold text-[#0B57D0] hover:underline flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-bold text-slate-600 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveResultTab('fields')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeResultTab === 'fields'
                    ? 'border-[#0B2E5C] text-[#0B2E5C] bg-white font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Extracted Fields ({extractedDocResult.extractedFields.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveResultTab('canvas')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeResultTab === 'canvas'
                    ? 'border-[#0B2E5C] text-[#0B2E5C] bg-white font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#1D4E9E]" />
                <span className="flex items-center space-x-1">
                  <span>Visual OCR Canvas</span>
                  <span className="bg-blue-100 text-[#0B2E5C] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {extractedDocResult.pageCount || 1}p
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveResultTab('compliance')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeResultTab === 'compliance'
                    ? 'border-[#0B2E5C] text-[#0B2E5C] bg-white font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Regulatory Rules ({extractedDocResult.complianceFlags.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveResultTab('tamper')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeResultTab === 'tamper'
                    ? 'border-[#0B2E5C] text-[#0B2E5C] bg-white font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>
                  Forensic Tamper Triage
                  {extractedDocResult.tamperIndicators.length > 0 && (
                    <span className="ml-1.5 bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {extractedDocResult.tamperIndicators.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveResultTab('text')}
                className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeResultTab === 'text'
                    ? 'border-[#0B2E5C] text-[#0B2E5C] bg-white font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Raw Stream</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Classification Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-[6px] bg-blue-50 border border-blue-200 text-xs gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-600">Identified Document Type: </span>
                    <span className="font-bold text-[#0B2E5C] uppercase tracking-wide">
                      {extractedDocResult.docType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Extracted: <span className="font-bold text-slate-700">{extractedDocResult.wordCount?.toLocaleString() || 0} words</span> across <span className="font-bold text-slate-700">{extractedDocResult.pageCount || 1} pages</span> ({extractedDocResult.characterCount?.toLocaleString() || 0} characters)
                  </div>
                </div>
                <span className="bg-white border border-blue-200 text-[#1D4E9E] font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                  Classification Confidence: {(extractedDocResult.docTypeConfidence * 100).toFixed(0)}%
                </span>
              </div>

              {/* TAB 1: Extracted Regulatory Fields */}
              {activeResultTab === 'fields' && (
                <div className="space-y-3">
                  <table className="w-full text-xs text-left border border-slate-200 rounded overflow-hidden">
                    <thead className="bg-slate-100 text-[#0B2E5C] font-bold">
                      <tr>
                        <th className="py-2 px-3">Field Key</th>
                        <th className="py-2 px-3">Extracted Value</th>
                        <th className="py-2 px-3">Confidence</th>
                        <th className="py-2 px-3">Location</th>
                        <th className="py-2 px-3 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {extractedDocResult.extractedFields.length > 0 ? (
                        extractedDocResult.extractedFields.map((fld: any) => (
                          <tr key={fld.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-700 capitalize">
                              {fld.field_key.replace(/_/g, ' ')}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#0B2E5C]">
                              {fld.value}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-block bg-emerald-50 text-[#1E7B34] border border-emerald-200 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                                {(fld.confidence * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono">
                              Page {fld.page + 1}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setOcrPage(fld.page || 0);
                                  setOcrSearch(fld.value);
                                  setActiveResultTab('canvas');
                                }}
                                className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#0B57D0] hover:text-[#0B2E5C] hover:underline cursor-pointer"
                              >
                                <span>Inspect in OCR</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">
                            No specific institutional form fields recognized in this PDF. Switch to the <strong>Visual OCR Canvas</strong> tab to inspect full pages.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 2: Visual OCR Document Canvas */}
              {activeResultTab === 'canvas' && (
                <div className="space-y-4">
                  {/* Canvas Navigation Toolbar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-100 p-3 rounded-[6px] border border-slate-200">
                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setOcrPage(0)}
                        disabled={ocrPage === 0}
                        className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 cursor-pointer text-[11px]"
                        title="First Page"
                      >
                        &laquo; First
                      </button>
                      <button
                        type="button"
                        onClick={() => setOcrPage((p) => Math.max(0, p - 1))}
                        disabled={ocrPage === 0}
                        className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-700" />
                      </button>

                      <div className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800 text-xs shadow-xs">
                        <span>Page</span>
                        <select
                          value={ocrPage}
                          onChange={(e) => setOcrPage(Number(e.target.value))}
                          className="font-bold text-[#0B2E5C] bg-transparent outline-none cursor-pointer"
                        >
                          {Array.from({ length: extractedDocResult.pageCount || 1 }).map((_, i) => (
                            <option key={i} value={i}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-500">of {extractedDocResult.pageCount || 1}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOcrPage((p) => Math.min((extractedDocResult.pageCount || 1) - 1, p + 1))}
                        disabled={ocrPage >= (extractedDocResult.pageCount || 1) - 1}
                        className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Next Page"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setOcrPage((extractedDocResult.pageCount || 1) - 1)}
                        disabled={ocrPage >= (extractedDocResult.pageCount || 1) - 1}
                        className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 cursor-pointer text-[11px]"
                        title="Last Page"
                      >
                        Last &raquo;
                      </button>
                    </div>

                    {/* In-text Live Search */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={ocrSearch}
                        onChange={(e) => setOcrSearch(e.target.value)}
                        placeholder="Search OCR text on page..."
                        className="w-full pl-8 pr-7 py-1 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {ocrSearch && (
                        <button
                          type="button"
                          onClick={() => setOcrSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 border border-slate-200 rounded">
                      <span className="text-[10px] text-slate-500 block">Total Pages</span>
                      <span className="font-bold text-slate-800 text-sm">{extractedDocResult.pageCount || 1}</span>
                    </div>
                    <div className="bg-slate-50 p-2 border border-slate-200 rounded">
                      <span className="text-[10px] text-slate-500 block">Extracted Words</span>
                      <span className="font-bold text-[#1D4E9E] text-sm">{(extractedDocResult.wordCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-2 border border-slate-200 rounded">
                      <span className="text-[10px] text-slate-500 block">Current Page Words</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {((extractedDocResult.pagesText?.[ocrPage] || '').trim().split(/\s+/).filter(Boolean).length).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 border border-slate-200 rounded">
                      <span className="text-[10px] text-slate-500 block">OCR Parser State</span>
                      <span className="font-bold text-emerald-700 text-xs flex items-center justify-center space-x-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Stream Live</span>
                      </span>
                    </div>
                  </div>

                  {/* Detected Entities on this page */}
                  {extractedDocResult.extractedFields.filter((f: any) => f.page === ocrPage).length > 0 && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#0B2E5C] text-[11px] flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Entities Anchored to Page {ocrPage + 1}:</span>
                      </span>
                      {extractedDocResult.extractedFields
                        .filter((f: any) => f.page === ocrPage)
                        .map((f: any) => (
                          <span
                            key={f.id}
                            className="bg-white border border-blue-300 text-blue-900 font-semibold px-2 py-0.5 rounded text-[11px] shadow-xs"
                          >
                            {f.field_key.replace(/_/g, ' ')}: <span className="font-bold text-[#0B2E5C]">{f.value}</span>
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Document Canvas Sheet */}
                  <div className="bg-slate-200/70 p-4 sm:p-6 rounded-lg border border-slate-300 flex justify-center">
                    <div className="w-full max-w-3xl bg-white shadow-lg border border-slate-300 rounded p-6 sm:p-8 min-h-[440px] flex flex-col justify-between">
                      {/* Document Sheet Header */}
                      <div className="border-b border-slate-200 pb-2.5 mb-4 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        <span>{extractedDocResult.filename} • PAGE {ocrPage + 1} OF {extractedDocResult.pageCount || 1}</span>
                        <span className="text-emerald-700 font-semibold">100% Native Text Layer</span>
                      </div>

                      {/* Document Page Content */}
                      <div className="text-slate-800 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap font-sans flex-1 overflow-y-auto max-h-[460px] pr-2">
                        {renderHighlightedPageText(
                          extractedDocResult.pagesText?.[ocrPage] ||
                            (ocrPage === 0 ? extractedDocResult.rawTextPreview : '') ||
                            'No text layer extracted for this specific page.',
                          ocrSearch
                        )}
                      </div>

                      {/* Document Sheet Footer */}
                      <div className="border-t border-slate-200 pt-3 mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>Digest: {extractedDocResult.sha256.slice(0, 20)}...</span>
                        <span>Page {ocrPage + 1} / {extractedDocResult.pageCount || 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Statutory Compliance Rules */}
              {activeResultTab === 'compliance' && (
                <div className="space-y-3">
                  {extractedDocResult.complianceFlags.map((flag: any, i: number) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-[6px] border text-xs space-y-1.5 ${
                        flag.status === 'PASSED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : flag.status === 'FLAGGED'
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                              flag.status === 'PASSED'
                                ? 'bg-[#1E7B34]'
                                : flag.status === 'FLAGGED'
                                ? 'bg-[#B42318]'
                                : 'bg-[#E8801A]'
                            }`}
                          >
                            {flag.status}
                          </span>
                          <span className="font-bold text-slate-900">{flag.ruleId}</span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                          {flag.clause}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium">{flag.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Forensic Tamper Triage */}
              {activeResultTab === 'tamper' && (
                <div className="space-y-3">
                  {extractedDocResult.tamperIndicators.length === 0 ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[6px] text-center space-y-2">
                      <ShieldCheck className="w-10 h-10 text-[#1E7B34] mx-auto" />
                      <h4 className="font-bold text-[#1E7B34] text-sm">
                        Zero Structural Anomalies Detected
                      </h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        PDF structure is clean. Single-pass xref trailer dictionary, coherent creation metadata, and no post-signature byte revisions detected.
                      </p>
                    </div>
                  ) : (
                    extractedDocResult.tamperIndicators.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="p-4 bg-rose-50 border border-rose-200 rounded-[6px] space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#B42318] uppercase tracking-wide flex items-center space-x-1.5">
                            <ShieldAlert className="w-4 h-4 text-[#B42318]" />
                            <span>Signal: {t.signal}</span>
                          </span>
                          <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            {t.severity} Severity
                          </span>
                        </div>
                        <p className="font-bold text-slate-900">{t.reason}</p>
                        <p className="text-slate-700 bg-white/70 p-2 rounded border border-rose-100 font-mono text-[11px]">
                          {t.evidence_detail}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: Raw Text Stream */}
              {activeResultTab === 'text' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Parsed via Node.js PDFParse text-layer stream</span>
                    <span>{extractedDocResult.rawTextPreview.length} characters preview</span>
                  </div>
                  <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-[6px] overflow-x-auto whitespace-pre-wrap max-h-72">
                    {extractedDocResult.rawTextPreview || '(No text layer detected)'}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Cryptographically logged into Azure PostgreSQL audit trail
              </span>
              <button
                type="button"
                onClick={() => setIsExtractionModalOpen(false)}
                className="px-4 py-2 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold rounded-[4px] transition-colors"
              >
                Accept &amp; Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </GovLayout>
  );
}
