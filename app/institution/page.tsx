'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function InstitutionDashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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
        setTimeout(() => setUploadSuccess(null), 5000);
      }, 1000);
    } catch (err) {
      setIsUploading(false);
    }
  };

  return (
    <GovLayout role="institution" activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* 1. Welcome Banner */}
        <div className="bg-[#E8F0FB] border border-[#BBD5F8] rounded-[6px] px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm text-[#0B2E5C] shadow-xs">
          <div>
            <span className="font-extrabold text-[#0B2E5C]">Welcome, ABC Engineering College!</span>{' '}
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
                  ABC Engineering College
                </h3>
                <p className="text-xs text-[#5B6574] mt-0.5 font-mono">
                  (AICTE ID: AICTE-12345)
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Affiliated: Savitribai Phule Pune Univ.
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
              <button className="text-xs font-semibold text-[#0B57D0] hover:underline inline-flex items-center space-x-1">
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
              <a href="#deficiencies" className="text-xs font-bold text-[#B42318] hover:underline inline-flex items-center space-x-1">
                <span>View Details &rarr;</span>
              </a>
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
                  <div className="text-slate-800 font-medium leading-tight">Upload window extended to 31 Oct 2026</div>
                  <div className="text-[10px] text-slate-400">1 day ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#1D4E9E] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-slate-800 font-medium leading-tight">EoA guidelines updated</div>
                  <div className="text-[10px] text-slate-400">2 days ago</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <a href="#alerts" className="text-xs font-semibold text-[#0B57D0] hover:underline">
                View All &rarr;
              </a>
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

            <button className="inline-flex items-center space-x-2 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold px-4 py-2.5 rounded-[6px] shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-gov-warning">
              <span>Continue Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
                <div className="w-10 h-10 rounded-full bg-[#1D4E9E] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-4 ring-blue-100">
                  3
                </div>
                <span className="text-xs font-bold text-[#0B2E5C] mt-2">3. Pre-scrutiny Report</span>
                <span className="text-[10px] text-[#1D4E9E] font-semibold">Under Review</span>
              </div>

              {/* Step 4: Fix and Resubmit (Pending) */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
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
    </GovLayout>
  );
}
