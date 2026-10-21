'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UtilityStrip from '@/components/gov/UtilityStrip';
import GovHeader from '@/components/gov/GovHeader';
import GovFooter from '@/components/gov/GovFooter';
import GovCaptcha from '@/components/gov/GovCaptcha';
import {
  GraduationCap,
  UserCheck,
  Users,
  Settings,
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { DEMO_USERS, GovRole, setClientAuthCookie } from '@/lib/mock-auth';

export default function LoginPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<GovRole>('institution');
  const [userId, setUserId] = useState('inst@demo.ai');
  const [password, setPassword] = useState('demo123');
  const [captchaInput, setCaptchaInput] = useState('');
  const [activeCaptchaCode, setActiveCaptchaCode] = useState('');
  const [captchaRefreshTrigger, setCaptchaRefreshTrigger] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const triggerCaptchaRefresh = () => {
    setCaptchaRefreshTrigger((prev) => prev + 1);
  };

  const handleRoleSelect = (role: GovRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    const demo = DEMO_USERS[role];
    if (demo) {
      setUserId(demo.email);
      setPassword('demo123');
    }
    triggerCaptchaRefresh();
    setCaptchaInput('');
  };

  const handleUseDemoAccount = () => {
    const demo = DEMO_USERS[selectedRole];
    if (demo) {
      setUserId(demo.email);
      setPassword('demo123');
      setCaptchaInput(activeCaptchaCode);
      setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Validate User ID
    if (!userId.trim()) {
      setErrorMsg('Please enter a valid User ID');
      triggerCaptchaRefresh();
      setCaptchaInput('');
      return;
    }

    // 2. Validate Dynamic Captcha
    if (captchaInput.trim().toUpperCase() !== activeCaptchaCode) {
      setErrorMsg('Captcha does not match');
      triggerCaptchaRefresh();
      setCaptchaInput('');
      return;
    }

    // 3. Match Target Role User
    const targetUser = DEMO_USERS[selectedRole];
    if (!targetUser) {
      setErrorMsg('Invalid credentials or role');
      triggerCaptchaRefresh();
      setCaptchaInput('');
      return;
    }

    // Successfully log in & redirect
    setClientAuthCookie(targetUser);
    router.push(targetUser.redirectUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3FA] text-[#1A1A1A]">
      {/* 1. Global Utility Strip */}
      <UtilityStrip />

      {/* 2. Global Gov Header with Tricolour */}
      <GovHeader showTricolour />

      {/* 3. Hero Body Area */}
      <main id="main-content" className="flex-1 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        {/* Background College Building Silhouette / Photo Graphic */}
        <div
          className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none opacity-20 bg-cover bg-right mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='none'%3E%3Cpath d='M0 600H800V250L680 200L550 250V600H0Z' fill='%230B2E5C' fill-opacity='0.15'/%3E%3Crect x='150' y='280' width='500' height='320' fill='%230B2E5C' fill-opacity='0.15'/%3E%3Crect x='220' y='320' width='40' height='70' fill='white'/%3E%3Crect x='300' y='320' width='40' height='70' fill='white'/%3E%3Crect x='380' y='320' width='40' height='70' fill='white'/%3E%3Crect x='460' y='320' width='40' height='70' fill='white'/%3E%3Crect x='540' y='320' width='40' height='70' fill='white'/%3E%3Crect x='220' y='430' width='40' height='70' fill='white'/%3E%3Crect x='300' y='430' width='40' height='70' fill='white'/%3E%3Crect x='380' y='430' width='40' height='70' fill='white'/%3E%3Crect x='460' y='430' width='40' height='70' fill='white'/%3E%3Crect x='540' y='430' width='40' height='70' fill='white'/%3E%3Cpath d='M350 230L400 170L450 230H350Z' fill='%230B2E5C' fill-opacity='0.3'/%3E%3Crect x='395' y='120' width='10' height='50' fill='%230B2E5C' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column: Welcome, Explanations, Advisory Pill */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 pt-4 lg:pt-8 pr-0 lg:pr-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2E5C] tracking-tight">
              Welcome to NirikshAI
            </h1>

            <p className="text-sm sm:text-base text-[#5B6574] leading-relaxed max-w-xl">
              Pre-scrutiny, document validation and compliance verification support for AICTE Extension of Approval applications
            </p>

            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-bold text-[#0B2E5C] uppercase tracking-wide">
                How it works:
              </h2>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#0B2E5C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Check early</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#0B2E5C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Prove everything</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#0B2E5C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Humans decide</span>
                </div>
              </div>
            </div>

            {/* Advisory Info Pill */}
            <div className="inline-flex items-center space-x-2 bg-[#E8F0FB] border border-[#BBD5F8] text-[#0B2E5C] text-xs px-3.5 py-2 rounded-full shadow-xs">
              <Info className="w-4 h-4 text-[#1D4E9E] shrink-0" />
              <span>AI output is advisory. All decisions are taken by authorised officers.</span>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-[460px] mx-auto lg:ml-auto">
            <div className="bg-white rounded-lg border border-[#D0D7E2] shadow-sm overflow-hidden">
              {/* Card Header Bar */}
              <div className="bg-[#0B2E5C] text-white px-5 py-3">
                <h2 className="text-base font-bold tracking-wide">Sign in</h2>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-5">
                {/* 1. Select your role */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">
                    1. Select your role
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {/* Role Tile: Institution */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('institution')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                        selectedRole === 'institution'
                          ? 'border-[#0B2E5C] bg-[#E8F0FB] text-[#0B2E5C] shadow-xs ring-1 ring-[#0B2E5C]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 mb-1" />
                      <span className="text-[11px] font-bold leading-tight">Institution</span>
                      <span className="text-[9px] text-slate-500 leading-tight scale-90">Apply & Track</span>
                    </button>

                    {/* Role Tile: Scrutiny */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('officer')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                        selectedRole === 'officer'
                          ? 'border-[#0B2E5C] bg-[#E8F0FB] text-[#0B2E5C] shadow-xs ring-1 ring-[#0B2E5C]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 mb-1" />
                      <span className="text-[11px] font-bold leading-tight">Scrutiny</span>
                      <span className="text-[9px] text-slate-500 leading-tight scale-90">Verify</span>
                    </button>

                    {/* Role Tile: Senior Officer */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('senior')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                        selectedRole === 'senior'
                          ? 'border-[#0B2E5C] bg-[#E8F0FB] text-[#0B2E5C] shadow-xs ring-1 ring-[#0B2E5C]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Users className="w-4 h-4 mb-1" />
                      <span className="text-[11px] font-bold leading-tight">Senior Officer</span>
                      <span className="text-[9px] text-slate-500 leading-tight scale-90">Review</span>
                    </button>

                    {/* Role Tile: Admin */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('admin')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                        selectedRole === 'admin'
                          ? 'border-[#0B2E5C] bg-[#E8F0FB] text-[#0B2E5C] shadow-xs ring-1 ring-[#0B2E5C]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Settings className="w-4 h-4 mb-1" />
                      <span className="text-[11px] font-bold leading-tight">Admin</span>
                      <span className="text-[9px] text-slate-500 leading-tight scale-90">Manage</span>
                    </button>

                    {/* Role Tile: Auditor */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('auditor')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all ${
                        selectedRole === 'auditor'
                          ? 'border-[#0B2E5C] bg-[#E8F0FB] text-[#0B2E5C] shadow-xs ring-1 ring-[#0B2E5C]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Search className="w-4 h-4 mb-1" />
                      <span className="text-[11px] font-bold leading-tight">Auditor</span>
                      <span className="text-[9px] text-slate-500 leading-tight scale-90">Audit</span>
                    </button>
                  </div>
                </div>

                {/* 2. Enter your credentials Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      2. Enter your credentials
                    </label>

                    {/* Email / User ID */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Email / User ID"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-hidden focus:ring-2 focus:ring-[#0B2E5C] bg-white text-slate-800 placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Password with eye toggle */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-hidden focus:ring-2 focus:ring-[#0B2E5C] bg-white text-slate-800 placeholder-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Dynamic Government Captcha Component */}
                  <GovCaptcha
                    onCodeChange={(code) => setActiveCaptchaCode(code)}
                    inputVal={captchaInput}
                    onInputChange={(val) => setCaptchaInput(val)}
                    refreshTrigger={captchaRefreshTrigger}
                  />

                  {/* Error Notification Banner */}
                  {errorMsg && (
                    <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-[#B42318] text-xs font-medium flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-bold rounded-[6px] shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-gov-warning"
                  >
                    Sign In
                  </button>

                  {/* Links Row */}
                  <div className="flex justify-between items-center text-xs pt-1">
                    <a href="#forgot" className="text-[#0B57D0] hover:underline">
                      Forgot password?
                    </a>
                    <a href="#register" className="text-[#0B57D0] hover:underline">
                      Register your institution (AICTE ID)
                    </a>
                  </div>
                </form>

                {/* Demo Accounts Yellow Box */}
                <div className="bg-[#FFF6D6] border border-[#FFE58F] rounded-md p-3 text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Demo accounts – synthetic data only</span>
                  </div>
                  <div className="text-[11px] text-amber-950 space-y-0.5 leading-snug font-mono">
                    <div>Institution: inst@demo.ai | Officer: officer@demo.ai</div>
                    <div>Admin: admin@demo.ai | Auditor: auditor@demo.ai</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDemoAccount}
                    className="w-full py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-[11px] font-semibold rounded transition-colors"
                  >
                    Use this account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Page Footer Links */}
        <div className="max-w-7xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2 border-t border-slate-200 pt-4">
          <div className="flex space-x-3 font-medium">
            <a href="#accessibility" className="hover:underline">
              Accessibility Statement
            </a>
            <span>|</span>
            <a href="#help" className="hover:underline">
              Help
            </a>
            <span>|</span>
            <a href="#terms" className="hover:underline">
              Terms
            </a>
          </div>
          <div className="text-[11px] text-slate-500 font-medium text-center sm:text-right">
            PROTOTYPE – Built for SIH 2026 (PS 26261). Not an official AICTE system. All data shown is SYNTHETIC.
          </div>
        </div>
      </main>

      {/* 4. Global Dark Navy Footer Bar */}
      <GovFooter />
    </div>
  );
}
