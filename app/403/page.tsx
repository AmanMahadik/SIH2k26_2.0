'use client';

import React from 'react';
import Link from 'next/link';
import UtilityStrip from '@/components/gov/UtilityStrip';
import GovHeader from '@/components/gov/GovHeader';
import GovFooter from '@/components/gov/GovFooter';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { getClientAuthUser } from '@/lib/mock-auth';

export default function ForbiddenPage() {
  const user = getClientAuthUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3FA]">
      <UtilityStrip />
      <GovHeader />

      <main id="main-content" className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg border border-[#D0D7E2] shadow-sm p-6 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[#B42318]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#0B2E5C]">
              403 – Access Not Permitted
            </h1>
            <p className="text-xs text-[#5B6574] mt-2 leading-relaxed">
              You do not have the required administrative clearance or role permissions to view this regulatory portal section.
            </p>
          </div>

          {user && (
            <div className="bg-[#EEF3FA] rounded p-3 text-xs border border-[#D0D7E2] text-left">
              <div className="flex items-center space-x-1.5 font-bold text-[#0B2E5C]">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Current Active Session:</span>
              </div>
              <div className="mt-1 text-slate-600">
                User: <span className="font-semibold text-slate-800">{user.name}</span> ({user.subText})
              </div>
              <div className="text-slate-600">
                Assigned Role: <span className="font-mono uppercase font-semibold text-rose-700">{user.role}</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={user ? user.redirectUrl : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Permitted Portal</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-colors"
            >
              Sign In with Other Role
            </Link>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
