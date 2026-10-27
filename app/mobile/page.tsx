// app/mobile/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  MapPin,
  FileText,
  AlertTriangle,
  User,
  ShieldCheck,
  Search,
  Bell,
  Lock,
  ChevronRight,
  ExternalLink,
  Mic,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Home,
  Bookmark,
  Share2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'inspection' | 'scan' | 'alerts' | 'profile'>('home');
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedCount, setCapturedCount] = useState(3);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState<Record<string, boolean>>({
    'alert-1': false,
    'alert-2': false,
  });

  // Screen device frame toggle (full width vs mobile phone bezel)
  const [deviceFrame, setDeviceFrame] = useState(true);

  // Trigger camera capture with simulated GPS & SHA-256
  const triggerCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCapturedCount((c) => c + 1);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start py-4 px-2 sm:px-6">
      {/* Top Banner with SIH Demo Controls */}
      <div className="max-w-md w-full mb-3 flex items-center justify-between text-white text-xs px-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide">NirikshAI EVC Mobile APK (PS 26261)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDeviceFrame(!deviceFrame)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono text-[11px]"
          >
            {deviceFrame ? 'Full View' : 'Phone Frame'}
          </button>
          <Link
            href="/officer"
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[11px]"
          >
            Web Portal &rarr;
          </Link>
        </div>
      </div>

      {/* Mobile Device Frame */}
      <div
        className={`${
          deviceFrame
            ? 'w-[390px] h-[844px] rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden'
            : 'w-full max-w-md min-h-[820px] rounded-2xl shadow-xl overflow-hidden'
        } bg-[#F9F8F5] flex flex-col relative select-none`}
      >
        {/* Dynamic Island & Status Bar */}
        <div className="pt-2 px-6 flex items-center justify-between text-slate-800 text-[11px] font-bold z-30">
          <span>8:36</span>
          {/* Dynamic Island pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center space-x-1 px-2 text-[9px] text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[8px] font-mono">1 device</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px]">5G</span>
            <span>📶</span>
            <span>🔋 85%</span>
          </div>
        </div>

        {/* Global Mobile Header with Official NirikshAi Emblem Banner */}
        <header className="px-3 py-2 flex items-center justify-between border-b border-slate-200/60 bg-[#F9F8F5] z-20">
          <div className="flex items-center space-x-2">
            <img
              src="/nirikshai_banner_logo.png"
              alt="NirikshAi - AICTE Regulation Bureau"
              className="h-8 max-w-[170px] object-contain"
            />
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-full text-[10px] font-bold">
            {['EN', 'HI', 'MR', 'KN'].map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLang(l)}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  selectedLang === l ? 'bg-[#0B2E5C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Bell Icon */}
          <div className="relative w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm shadow-xs">
            <span>🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
          </div>
        </header>

        {/* Scrollable Main Screen Content */}
        <div className="flex-1 overflow-y-auto pb-24 px-4 pt-3 space-y-3">
          {/* ========================================================================= */}
          {/* TAB 1: HOME SCREEN                                                        */}
          {/* ========================================================================= */}
          {activeTab === 'home' && (
            <div className="space-y-3">
              {/* Dark Navy Hero Banner */}
              <div className="bg-[#0B2E5C] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <p className="text-xs font-bold text-blue-200">Namaste, Aman / Dr. Priya Sharma 🙏</p>
                <h2 className="text-base font-extrabold mt-0.5 leading-snug">
                  AICTE EVC Field Inspection &amp; Compliance Hub
                </h2>
                <p className="text-[10px] text-slate-300 mt-1">
                  Campus: Pune Institute of Computer Technology (PICT) • ID: 1-10972348121
                </p>

                {/* Hero Search Box */}
                <div className="mt-3 bg-white rounded-xl py-2 px-3 flex items-center text-slate-800 text-xs shadow-xs">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search campus, EOA records, or APH clause..."
                    className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                  <button onClick={() => setShowVoiceModal(true)} className="text-slate-500 hover:text-orange-500">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Metric Summary Badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl p-2.5 text-center border border-slate-200 shadow-xs">
                  <span className="text-base">🏛️</span>
                  <p className="text-sm font-extrabold text-[#0B2E5C] mt-0.5">4,788</p>
                  <p className="text-[9px] text-slate-500 font-semibold">Institutes</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center border border-slate-200 shadow-xs">
                  <span className="text-base">📍</span>
                  <p className="text-sm font-extrabold text-[#0B2E5C] mt-0.5">14 Visits</p>
                  <p className="text-[9px] text-slate-500 font-semibold">Active EVC</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center border border-slate-200 shadow-xs">
                  <span className="text-base">🔒</span>
                  <p className="text-sm font-extrabold text-emerald-700 mt-0.5">100%</p>
                  <p className="text-[9px] text-slate-500 font-semibold">SHA-256</p>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* THE 3 HIGH-IMPACT CAPABILITIES REQUESTED BY USER                     */}
              {/* ===================================================================== */}
              <p className="text-[10px] font-black tracking-wider text-[#0B2E5C] uppercase">
                Core Mobile Capabilities (SIH PS 26261)
              </p>

              {/* Capability 1: Field Inspection & Geotagging */}
              <div
                onClick={() => setActiveTab('inspection')}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-all flex items-start space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#0B2E5C]">1. Field Inspection &amp; Geotagging</h3>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-extrabold rounded">
                      EVC High Marks
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                    Camera &amp; GPS capture of labs, computer centers &amp; ramps with on-device SHA-256 seal.
                  </p>
                  <span className="text-[10px] font-bold text-[#FF8C00] mt-1 inline-block">
                    Open Geotagged Camera &rarr;
                  </span>
                </div>
              </div>

              {/* Capability 2: Document Fast-Scan & Hash */}
              <div
                onClick={() => setActiveTab('scan')}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all flex items-start space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#0B2E5C]">2. Document Fast-Scan &amp; Hashing</h3>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded">
                      Registrar
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                    Edge-detection auto-crop for State NOCs &amp; Affidavits. Pre-upload SHA-256 hashing.
                  </p>
                  <span className="text-[10px] font-bold text-[#0B2E5C] mt-1 inline-block">
                    Launch Fast Scanner &rarr;
                  </span>
                </div>
              </div>

              {/* Capability 3: Instant Deficiency Push Alerts */}
              <div
                onClick={() => setActiveTab('alerts')}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-start space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#0B2E5C]">3. Instant Deficiency Push Alerts</h3>
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-extrabold rounded">
                      2 Pending Fixes
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                    Real-time notifications on expired State NOCs &amp; quota mismatches with 1-click camera fix.
                  </p>
                  <span className="text-[10px] font-bold text-rose-600 mt-1 inline-block">
                    Review Active Alerts &rarr;
                  </span>
                </div>
              </div>

              {/* 6 Category Tiles */}
              <p className="text-[10px] font-black tracking-wider text-[#0B2E5C] uppercase pt-1">
                Browse Statutory Categories
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Computer Center', icon: '💻', count: '540 PCs' },
                  { name: 'Laboratories', icon: '🔬', count: '18 Labs' },
                  { name: 'Wheelchair Ramps', icon: '♿', count: '100% OK' },
                  { name: 'Fire Safety NOC', icon: '🧯', count: 'Valid' },
                  { name: 'Central Library', icon: '📚', count: '24k Vol' },
                  { name: 'Hostel & Sports', icon: '🏟️', count: 'Verified' },
                ].map((c, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="text-lg">{c.icon}</span>
                    <p className="text-[10px] font-bold text-[#0B2E5C] mt-1">{c.name}</p>
                    <p className="text-[8px] font-semibold text-emerald-600">{c.count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FIELD INSPECTION & GEOTAGGING (USE CASE 1)                         */}
          {/* ========================================================================= */}
          {activeTab === 'inspection' && (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                    EVC Camera
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                    GPS Geotagged
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-[#0B2E5C] mt-1">1. Field Inspection &amp; Geotagging</h3>
                <p className="text-[10px] text-slate-500">
                  Prevents fraudulent recycled photos by binding GPS coordinates and device timestamp to SHA-256 seal.
                </p>

                {/* Viewfinder Simulation Box */}
                <div className="mt-2.5 relative h-44 bg-slate-950 rounded-xl overflow-hidden flex flex-col justify-between p-2.5 border-2 border-dashed border-blue-400">
                  {/* Camera Reticle corners */}
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-wider">
                      ● LIVE GPS FIX
                    </span>
                    <span className="text-[9px] text-slate-300 font-mono">1080p · 60fps</span>
                  </div>

                  <div className="text-center my-auto">
                    <Camera className="w-7 h-7 text-cyan-400 mx-auto animate-pulse" />
                    <p className="text-[10px] font-bold text-white mt-1">Pune Institute of Computer Technology</p>
                    <p className="text-[8px] font-mono text-cyan-300">Advanced Computer Center (Lab #3)</p>
                  </div>

                  {/* Tamper-Proof Watermark HUD */}
                  <div className="bg-[#0B2E5C]/90 backdrop-blur-xs rounded p-1.5 text-[8px] font-mono text-cyan-100 space-y-0.5">
                    <p>📍 GPS: 18.457532° N, 73.850831° E (Accuracy: ±2.1m)</p>
                    <p>🕒 UTC: 2026-10-27T10:15:30Z • Inspector: Dr. Priya Sharma</p>
                    <p className="text-amber-300">🔒 SHA-256: 9a6b12a84358fa838d74883b4b8401348123984029348239048102394</p>
                  </div>
                </div>

                {/* Shutter Capture Button */}
                <button
                  onClick={triggerCapture}
                  disabled={isCapturing}
                  className="w-full mt-3 py-2.5 bg-[#FF8C00] hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isCapturing ? 'Computing SHA-256 & Stamping...' : 'Capture Geotagged Photo Evidence'}</span>
                </button>
              </div>

              {/* Logged Geotagged Evidences */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-[#0B2E5C]">
                  Sealed On-Site Photos ({capturedCount})
                </p>

                {[
                  {
                    title: 'Advanced Computer Center (540 PCs)',
                    lat: '18.457532° N, 73.850831° E',
                    time: '10:15 AM',
                    hash: '9a6b12a84358fa838d74883b4b84013481239840...',
                  },
                  {
                    title: 'Wheelchair Ramp & Barrier-Free Entry',
                    lat: '18.457812° N, 73.851042° E',
                    time: '10:30 AM',
                    hash: 'f4b1c2d3e4a5061728394a5b6c7d8e9f01234567...',
                  },
                  {
                    title: 'Mechanical Workshop & Fire Exits',
                    lat: '18.458021° N, 73.850419° E',
                    time: '11:05 AM',
                    hash: '8e7a6b5c4d3e2f1a0987654321fedcba98765432...',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[#0B2E5C]">{item.title}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold rounded">
                        ✓ Sealed in Azure DB
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-600">📍 {item.lat} • {item.time}</p>
                    <p className="text-[8px] font-mono text-slate-500 bg-slate-50 p-1 rounded truncate">
                      SHA-256: {item.hash}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DOCUMENT FAST-SCAN & HASH (USE CASE 2)                             */}
          {/* ========================================================================= */}
          {activeTab === 'scan' && (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                    College Registrar
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                    On-Device Hash
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-[#0B2E5C] mt-1">2. Document Fast-Scan &amp; Hashing</h3>
                <p className="text-[10px] text-slate-500">
                  Mobile camera acts as a scanner with auto-cropping and edge-detection. The app calculates SHA-256 on device before uploading.
                </p>

                {/* Laser scan animation container */}
                <div className="mt-3 relative h-36 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-700">
                  <div className="w-24 h-28 bg-white rounded p-1.5 flex flex-col justify-between relative shadow-md">
                    <div className="w-12 h-2 bg-[#0B2E5C] rounded-xs" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-slate-300 rounded-xs" />
                      <div className="w-4/5 h-1 bg-slate-300 rounded-xs" />
                      <div className="w-3/5 h-1 bg-slate-300 rounded-xs" />
                    </div>
                    <span className="text-[6px] font-bold text-blue-600">STATE NOC VERIFIED</span>
                    {/* Laser line */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                  </div>
                  <div className="absolute bottom-2 inset-x-2 text-center text-[8px] font-mono text-cyan-200">
                    ⚡ Auto-Edge Detect: 4 Corners Locked • SHA-256 Pre-Computed
                  </div>
                </div>

                <button
                  onClick={triggerCapture}
                  disabled={isCapturing}
                  className="w-full mt-3 py-2.5 bg-[#0A3678] hover:bg-[#0B2E5C] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isCapturing ? 'Auto-Cropping & Hashing...' : '📄 Scan Document & Compute SHA-256'}</span>
                </button>
              </div>

              {/* Scanned Documents List */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-[#0B2E5C]">
                  Hashed &amp; Scanned Documents
                </p>

                {[
                  {
                    type: 'State NOC Certificate (DTE Maharashtra)',
                    file: 'State_NOC_Govt_Maharashtra.pdf',
                    pages: '2 Pages · 2.4 MB',
                    clause: 'APH 2024-27 §4.3.1',
                    confidence: '98.4%',
                  },
                  {
                    type: 'Mandatory Affidavit (Format-1)',
                    file: 'Affidavit_Prescribed_Format.pdf',
                    pages: '3 Pages · 1.8 MB',
                    clause: 'APH 2024-27 §4.1.2',
                    confidence: '97.2%',
                  },
                  {
                    type: 'Municipal Fire Safety NOC',
                    file: 'Pune_PMC_Fire_NOC.pdf',
                    pages: '1 Page · 1.1 MB',
                    clause: 'APH 2024-27 §4.4.1',
                    confidence: '99.1%',
                  },
                ].map((doc, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[#0B2E5C]">{doc.type}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold rounded">
                        {doc.confidence} OCR
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-600">📎 {doc.file} ({doc.pages})</p>
                    <p className="text-[8px] text-amber-700 font-bold">⚖️ Statutory: {doc.clause}</p>
                    <p className="text-[8px] font-mono text-slate-500 bg-slate-50 p-1 rounded truncate">
                      SHA-256: 9a6b12a84358fa838d74883b4b8401348123984029348239048102394
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INSTANT DEFICIENCY PUSH ALERTS (USE CASE 3)                        */}
          {/* ========================================================================= */}
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded">
                    Mobile Push Alert
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                    Instant Resubmission
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-[#0B2E5C] mt-1">3. Instant Deficiency Push Alerts</h3>
                <p className="text-[10px] text-slate-500">
                  Real-time push notifications when an application has an expired State NOC or clause mismatch, allowing instant resubmission.
                </p>
              </div>

              {/* Alert 1 */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded ${
                    alertStatus['alert-1'] ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {alertStatus['alert-1'] ? '✓ RESOLVED & RE-VERIFIED' : 'CRITICAL DEFICIENCY'}
                  </span>
                  <span className="text-[9px] text-slate-400">Today, 08:30 AM</span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#0B2E5C]">Apex Technical Campus (1-30948192034)</h4>
                  <p className="text-[9px] font-bold text-amber-600">Clause: APH 2024-27 §4.3.1 (State NOC Expiry)</p>
                  <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                    State NOC expired on 2026-06-30. Regulations require an unexpired extension letter through academic year 2026-27.
                  </p>
                </div>

                {alertStatus['alert-1'] ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] text-emerald-800 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Replacement NOC uploaded via Mobile Scanner. Hash chained to block #6.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAlertStatus((prev) => ({ ...prev, 'alert-1': true }));
                    }}
                    className="w-full py-2 bg-[#FF8C00] hover:bg-orange-600 text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan &amp; Resubmit Corrective NOC</span>
                  </button>
                )}
              </div>

              {/* Alert 2 */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded ${
                    alertStatus['alert-2'] ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {alertStatus['alert-2'] ? '✓ RESOLVED & RE-VERIFIED' : 'WARNING DEFICIENCY'}
                  </span>
                  <span className="text-[9px] text-slate-400">Today, 09:15 AM</span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#0B2E5C]">Delhi College of Engineering &amp; Tech</h4>
                  <p className="text-[9px] font-bold text-amber-600">Clause: APH 2024-27 §4.5.1 (Intake Quota Ceiling)</p>
                  <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                    Submitted intake quota claims 360 seats, but affiliated university clearance allows 300 seats.
                  </p>
                </div>

                {alertStatus['alert-2'] ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] text-emerald-800 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>University Amendment Letter uploaded. Intake updated to 300 in Azure DB.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAlertStatus((prev) => ({ ...prev, 'alert-2': true }));
                    }}
                    className="w-full py-2 bg-[#0B2E5C] hover:bg-blue-900 text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload University Amendment Letter</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: OFFICER PROFILE & AZURE EVIDENCE VAULT                            */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              {/* Profile Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#0B2E5C] text-white flex items-center justify-center text-xl shrink-0 font-bold">
                    PS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-xs font-black text-[#0B2E5C]">Dr. Priya Sharma</h3>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[8px] font-bold rounded">
                        ✓ Entra ID
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">priya.sharma@aicte-india.org</p>
                    <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
                      🏢 Western Regional Office (WRO, Mumbai)
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Clearance Level:</span>
                    <span className="font-bold text-[#0B2E5C]">L2 - Field Scrutiny &amp; EVC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned College:</span>
                    <span className="font-bold text-[#0B2E5C]">PICT Pune (1-10972348121)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Azure Region:</span>
                    <span className="font-bold text-emerald-700">Central India (TLS 1.3)</span>
                  </div>
                </div>
              </div>

              {/* Azure Evidence Vault */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-[#0B2E5C]">📁 Azure EVC Evidence Vault</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                    3 Containers
                  </span>
                </div>
                <p className="text-[9px] text-slate-500">
                  Private Azure Blob Containers storing geotagged photos and forensic PDF scans.
                </p>

                {[
                  { name: 'evc-geotagged-photos', emoji: '📸', desc: 'GPS stamped on-site proofs', count: '14 Photos' },
                  { name: 'scanned-noc-affidavits', emoji: '📄', desc: 'Pre-upload SHA-256 documents', count: '6 Files' },
                  { name: 'audit_log (Cryptographic)', emoji: '⛓️', desc: 'PostgreSQL hash-chain', count: 'Synced' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{c.emoji}</span>
                      <div>
                        <p className="text-[10px] font-mono font-bold text-slate-800">{c.name}</p>
                        <p className="text-[8px] text-slate-500">{c.desc}</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[8px] font-bold rounded">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Return to Dashboard */}
              <Link
                href="/officer"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 border border-slate-300"
              >
                <span>Switch to AICTE Desktop Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Floating Pill Bottom Navigation Bar (Matching Mockups) */}
        <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md rounded-full py-2 px-3 flex items-center justify-between shadow-xl border border-slate-200 z-40">
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center px-2 py-1 rounded-full transition-all ${
              activeTab === 'home' ? 'bg-[#EBF3FE] text-[#0B2E5C] font-black' : 'text-slate-500'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Home</span>
          </button>

          {/* Tab 2: Geotag (Use Case 1) */}
          <button
            onClick={() => setActiveTab('inspection')}
            className={`flex flex-col items-center px-2 py-1 rounded-full transition-all ${
              activeTab === 'inspection' ? 'bg-[#EBF3FE] text-[#0B2E5C] font-black' : 'text-slate-500'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">EVC Geo</span>
          </button>

          {/* Center Floating Mic / Scan FAB (Use Case 2) */}
          <button
            onClick={() => setActiveTab('scan')}
            className="w-12 h-12 rounded-full bg-[#FF8C00] text-white flex items-center justify-center shadow-lg -translate-y-3 border-2 border-white hover:scale-105 transition-all"
            title="Fast Document Scan"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Tab 4: Alerts (Use Case 3) */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center px-2 py-1 rounded-full transition-all relative ${
              activeTab === 'alerts' ? 'bg-[#EBF3FE] text-[#0B2E5C] font-black' : 'text-slate-500'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Alerts</span>
            <span className="absolute top-0 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Tab 5: Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center px-2 py-1 rounded-full transition-all ${
              activeTab === 'profile' ? 'bg-[#EBF3FE] text-[#0B2E5C] font-black' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Officer</span>
          </button>
        </div>

        {/* AI Voice Assistant Modal */}
        {showVoiceModal && (
          <div className="absolute inset-0 bg-[#0B2E5C]/70 backdrop-blur-xs z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 space-y-3 animate-in slide-in-from-bottom-6">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />
              <div className="text-center">
                <h3 className="text-sm font-extrabold text-[#0B2E5C]">🎙️ Jan-Sahayak AI Voice Assistant</h3>
                <p className="text-[10px] text-amber-600 font-semibold">Listening in English, Hindi, or Marathi...</p>
              </div>

              <div className="w-16 h-16 rounded-full bg-orange-500 text-white mx-auto flex items-center justify-center animate-pulse text-2xl shadow-lg">
                🎙️
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center text-xs font-mono text-slate-700">
                &ldquo;Check State NOC validity for Pune Institute of Computer Technology&rdquo;
              </div>

              <button
                onClick={() => setShowVoiceModal(false)}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl"
              >
                Close Assistant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
