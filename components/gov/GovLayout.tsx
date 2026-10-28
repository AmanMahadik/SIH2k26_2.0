// components/gov/GovLayout.tsx - Master Chrome Wrapper for all Government Portals
'use client';

import React, { useEffect, useState } from 'react';
import UtilityStrip from './UtilityStrip';
import GovHeader from './GovHeader';
import RoleNav from './RoleNav';
import GovFooter from './GovFooter';
import { DEMO_USERS, GovRole, GovUser, getClientAuthUser } from '@/lib/mock-auth';

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
  const [currentUser, setCurrentUser] = useState<GovUser>(() => {
    const clientUser = getClientAuthUser();
    const base = clientUser && clientUser.role === role ? clientUser : (DEMO_USERS[role] || DEMO_USERS.institution);
    return {
      ...base,
      ...userOverride,
    };
  });

  useEffect(() => {
    const updateResolvedUser = () => {
      const clientUser = getClientAuthUser();
      const base = clientUser && clientUser.role === role ? clientUser : (DEMO_USERS[role] || DEMO_USERS.institution);
      setCurrentUser({
        ...base,
        ...userOverride,
      });
    };

    updateResolvedUser();
    window.addEventListener('auth_user_updated', updateResolvedUser);
    return () => window.removeEventListener('auth_user_updated', updateResolvedUser);
  }, [role, userOverride?.name, userOverride?.subText]);

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
