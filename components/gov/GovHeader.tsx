'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Emblem from './Emblem';
import { Bell, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { getClientAuthUser, clearClientAuthCookie, GovUser } from '@/lib/mock-auth';

interface GovHeaderProps {
  forcedUser?: GovUser;
  showTricolour?: boolean;
}

export default function GovHeader({ forcedUser, showTricolour = false }: GovHeaderProps) {
  const [user, setUser] = useState<GovUser | null>(forcedUser || null);
  const router = useRouter();

  useEffect(() => {
    if (!forcedUser) {
      setUser(getClientAuthUser());
    }
  }, [forcedUser]);

  const handleLogout = () => {
    clearClientAuthCookie();
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="w-full bg-white border-b border-gov-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Emblem + Titles */}
        <Link href={user ? user.redirectUrl : '/login'} className="flex items-center space-x-3.5 group">
          <Emblem className="w-11 h-12" />
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2E5C] leading-none">
              NirikshAI
            </span>
            <span className="text-[11px] sm:text-xs text-[#5B6574] font-medium tracking-tight mt-1">
              Application Validation & Compliance Verification | AICTE Regulation Bureau
            </span>
          </div>
        </Link>

        {/* Right side: Authenticated User Controls */}
        {user && (
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* User Details */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-[#0B2E5C] leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] sm:text-xs text-[#5B6574] font-medium">
                  {user.subText}
                </div>
              </div>
            </div>

            {/* Read-only badge for auditor */}
            {user.role === 'auditor' && (
              <span className="hidden md:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                <Shield className="w-3 h-3 mr-1 text-slate-500" />
                Read-only access
              </span>
            )}

            {/* Notification Bell with red dot */}
            <div className="relative cursor-pointer p-1 rounded hover:bg-slate-50 text-slate-700">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B42318] ring-1 ring-white" />
            </div>

            <div className="h-5 w-[1px] bg-slate-200" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-[#B42318] transition-colors focus:outline-hidden focus:ring-2 focus:ring-gov-warning px-1.5 py-1 rounded"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showTricolour && (
        <div className="w-full flex flex-col h-[3px]" aria-hidden="true">
          <div className="h-[1px] w-full bg-[#FF9933]" />
          <div className="h-[1px] w-full bg-[#FFFFFF]" />
          <div className="h-[1px] w-full bg-[#138808]" />
        </div>
      )}
    </div>
  );
}
