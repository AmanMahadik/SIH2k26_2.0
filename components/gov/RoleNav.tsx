// components/gov/RoleNav.tsx - Role-specific navigation bar with exact brand colors
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { GovRole } from '@/lib/mock-auth';

interface RoleNavProps {
  role: GovRole;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const ROLE_NAV_CONFIG: Record<
  GovRole,
  { bgColor: string; textActiveColor: string; items: { id: string; label: string; href: string }[] }
> = {
  institution: {
    bgColor: '#1D4E9E',
    textActiveColor: 'text-[#1D4E9E]',
    items: [
      { id: 'home', label: 'Home', href: '/institution' },
      { id: 'applications', label: 'My Applications', href: '/institution' },
      { id: 'alerts', label: 'Alerts', href: '/institution' },
      { id: 'help', label: 'Help & Guidelines', href: '/institution' },
    ],
  },
  officer: {
    bgColor: '#0E7490',
    textActiveColor: 'text-[#0E7490]',
    items: [
      { id: 'home', label: 'Home', href: '/officer' },
      { id: 'applications', label: 'Applications Queue', href: '/officer' },
      { id: 'reports', label: 'Reports & Forensics', href: '/officer' },
      { id: 'help', label: 'Scrutiny SOP', href: '/officer' },
    ],
  },
  senior: {
    bgColor: '#4338CA',
    textActiveColor: 'text-[#4338CA]',
    items: [
      { id: 'home', label: 'Home', href: '/senior' },
      { id: 'review_applications', label: 'Review Applications', href: '/senior' },
      { id: 'reports', label: 'Reports & Analytics', href: '/senior' },
      { id: 'help', label: 'Committee Powers & SOP', href: '/senior' },
    ],
  },
  admin: {
    bgColor: '#8B1A1A',
    textActiveColor: 'text-[#8B1A1A]',
    items: [
      { id: 'home', label: 'Home', href: '/admin' },
      { id: 'users', label: 'Directory (Institutions & Officers)', href: '/admin' },
      { id: 'config', label: 'Rule Engine Config', href: '/admin' },
      { id: 'reports', label: 'System Analytics', href: '/admin' },
    ],
  },
  auditor: {
    bgColor: '#3B4252',
    textActiveColor: 'text-[#3B4252]',
    items: [
      { id: 'home', label: 'Home', href: '/auditor' },
      { id: 'audit_logs', label: 'SHA-256 Audit Logs', href: '/auditor' },
      { id: 'reports', label: 'Vigilance Reports', href: '/auditor' },
    ],
  },
};

export default function RoleNav({ role, activeTab = 'home', onTabChange }: RoleNavProps) {
  const router = useRouter();
  const config = ROLE_NAV_CONFIG[role] || ROLE_NAV_CONFIG.institution;

  const handleTabClick = (item: { id: string; label: string; href: string }) => {
    if (onTabChange) {
      onTabChange(item.id);
    } else {
      router.push(item.href);
    }
  };

  return (
    <nav
      style={{ backgroundColor: config.bgColor }}
      className="w-full text-white px-4 sm:px-6 lg:px-8 py-1.5 shadow-xs select-none"
      aria-label={`${role} portal navigation`}
    >
      <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-3 overflow-x-auto scrollbar-thin">
        {config.items.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`text-xs transition-all flex items-center space-x-1.5 focus:outline-hidden focus:ring-1 focus:ring-white rounded-md shrink-0 cursor-pointer ${
                isActive
                  ? `bg-white ${config.textActiveColor} font-bold px-3 py-1 shadow-xs`
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-2.5 py-1 font-medium'
              }`}
            >
              {item.id === 'home' && <Home className="w-3.5 h-3.5 shrink-0" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
