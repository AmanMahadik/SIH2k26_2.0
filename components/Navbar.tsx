'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileCheck, Layers, Scale, Database, RefreshCw, BarChart3, AlertTriangle } from 'lucide-react';
import { AppRole } from '@/lib/types';
import { getStoredRole, setStoredRole, resetDemoData } from '@/lib/store';
import AlertCenter from './AlertCenter';

export default function Navbar() {
  const pathname = usePathname();
  const [role, setRole] = useState<AppRole>('officer');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRole(getStoredRole());

    const handleRoleChange = () => setRole(getStoredRole());
    window.addEventListener('nirikshai_role_change', handleRoleChange);
    return () => window.removeEventListener('nirikshai_role_change', handleRoleChange);
  }, []);

  const handleSwitchRole = (newRole: AppRole) => {
    setRole(newRole);
    setStoredRole(newRole);
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: Shield },
    { href: '/institution', label: 'Institution Portal', icon: FileCheck },
    { href: '/officer', label: 'Scrutiny Officer', icon: Scale },
    { href: '/tamper', label: 'Tamper Forensics', icon: AlertTriangle },
    { href: '/rules', label: 'Rule Manager', icon: Layers },
    { href: '/audit', label: 'Audit Trail', icon: Database },
    { href: '/metrics', label: 'R13 Metrics', icon: BarChart3 },
  ];

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Govt of India / AICTE strip */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-amber-400">SIH 2026 | PS 26261:</span>
          <span>All India Council for Technical Education (Regulation Bureau), Ministry of Education</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-medium">Supabase Connected</span>
          </span>
          <AlertCenter />
          <button
            onClick={resetDemoData}
            title="Reset demonstration state"
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-blue-800 transition-colors">
              नि
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-blue-950 tracking-tight">NirikshAI</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">निरीक्षAI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Check early. Prove everything. Humans decide.</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 border-b-2 border-blue-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher Pill */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase px-2">Role:</span>
            {(['institution', 'officer', 'admin', 'auditor'] as AppRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleSwitchRole(r)}
                className={`text-xs capitalize font-semibold px-2.5 py-1 rounded transition-all ${
                  role === r
                    ? 'bg-white text-blue-950 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'institution' ? 'College' : r === 'officer' ? 'Scrutiny Officer' : r === 'admin' ? 'Policy Admin' : 'Vigilance'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
