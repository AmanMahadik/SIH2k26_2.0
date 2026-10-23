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
  X,
  ExternalLink,
  HelpCircle,
  Phone,
  Mail,
  Download,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function InstitutionDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Real client-side SHA-256 calculation
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(`Uploaded ${file.name} (SHA-256: ${sha256Hex.slice(0, 10)}...)`);
        setTimeout(() => setUploadSuccess(null), 6000);
      }, 1000);
    } catch (err) {
      setIsUploading(false);
    }
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

              {/* Quick Rectification / Upload Zone */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-[6px] border border-slate-200">
                <div className="flex items-center space-x-3 text-xs text-slate-700">
                  <UploadCloud className="w-5 h-5 text-[#1D4E9E] shrink-0" />
                  <div>
                    <span className="font-bold text-[#0B2E5C]">Need to upload a rectified certificate?</span>
                    <p className="text-[11px] text-slate-500">Supported formats: PDF up to 10MB. Instant SHA-256 seal computed in your browser.</p>
                  </div>
                </div>

                <label className="cursor-pointer bg-white border border-[#0B2E5C] text-[#0B2E5C] hover:bg-slate-100 text-xs font-bold px-4 py-2 rounded-[6px] transition-colors shrink-0">
                  <span>{isUploading ? 'Computing SHA-256...' : 'Upload Replacement'}</span>
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>

              {uploadSuccess && (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[#1E7B34] text-xs font-medium flex items-center space-x-2">
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}
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
    </GovLayout>
  );
}
