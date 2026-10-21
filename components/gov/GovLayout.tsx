// components/gov/GovLayout.tsx - Master Chrome Wrapper for all Government Portals
'use client';

import React from 'react';
import UtilityStrip from './UtilityStrip';
import GovHeader from './GovHeader';
import RoleNav from './RoleNav';
import GovFooter from './GovFooter';
import { DEMO_USERS, GovRole, GovUser } from '@/lib/mock-auth';

interface GovLayoutProps {
  role: GovRole;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: React.ReactNode;
  userOverride?: Partial<GovUser>;
}

export default function GovLayout({
  role,
  activeTab = 'home',
  onTabChange,
  children,
  userOverride,
}: GovLayoutProps) {
  const baseUser = DEMO_USERS[role] || DEMO_USERS.institution;
  const currentUser: GovUser = {
    ...baseUser,
    ...userOverride,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3FA] text-[#1A1A1A]">
      {/* 1. Official Government Utility Strip */}
      <UtilityStrip />

      {/* 2. Official AICTE / NirikshAI Header */}
      <GovHeader forcedUser={currentUser} />

      {/* 3. Role-Colored Navigation Bar */}
      <RoleNav role={role} activeTab={activeTab} onTabChange={onTabChange} />

      {/* 4. Page Body Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* 5. Official Dark Navy Footer */}
      <GovFooter />
    </div>
  );
}
