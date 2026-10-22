// lib/mock-auth.ts - Pluggable Mock Authentication Layer for NirikshAI
export type GovRole = 'institution' | 'officer' | 'senior' | 'admin' | 'auditor';

export interface GovUser {
  id: string;
  name: string;
  subText: string;
  email: string;
  role: GovRole;
  redirectUrl: string;
  phone?: string;
  avatar?: string;
  department?: string;
}

export const DEMO_USERS: Record<GovRole, GovUser> = {
  institution: {
    id: 'AICTE-12345',
    name: 'ABC Engineering College',
    subText: '(AICTE ID: 1-10972348121)',
    email: 'principal@pict.edu',
    phone: '+91 20 2437 1101',
    department: 'Department of Technical Education, Pune',
    role: 'institution',
    redirectUrl: '/institution',
  },
  officer: {
    id: 'OFF-7821',
    name: 'Dr. Priya Sharma',
    subText: '(Scrutiny Officer)',
    email: 'priya.sharma@aicte-india.org',
    phone: '+91 94220 18293',
    department: 'Western Regional Office (WRO, Mumbai)',
    role: 'officer',
    redirectUrl: '/officer',
  },
  senior: {
    id: 'SNR-9902',
    name: 'Prof. R. Kumar',
    subText: '(Senior Officer)',
    email: 'kumar.r@aicte-india.org',
    phone: '+91 98201 54321',
    department: 'Senior Scrutiny Committee, HQ New Delhi',
    role: 'senior',
    redirectUrl: '/senior',
  },
  admin: {
    id: 'ADM-001',
    name: 'Admin User',
    subText: '(Administrator)',
    email: 'admin@aicte-india.org',
    phone: '+91 98110 99881',
    department: 'Regulation Bureau HQ, AICTE New Delhi',
    role: 'admin',
    redirectUrl: '/admin',
  },
  auditor: {
    id: 'AUD-554',
    name: 'Auditor User',
    subText: '(Vigilance & Audit)',
    email: 'auditor@aicte-india.org',
    phone: '+91 98330 44552',
    department: 'Vigilance & Central Audit Cell',
    role: 'auditor',
    redirectUrl: '/auditor',
  },
};

/**
 * Cookie helper for browser context
 */
export function setClientAuthCookie(user: GovUser) {
  if (typeof document === 'undefined') return;
  const cookieValue = encodeURIComponent(JSON.stringify(user));
  document.cookie = `nirikshai_user=${cookieValue}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `nirikshai_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
  try {
    localStorage.setItem('nirikshai_user', JSON.stringify(user));
  } catch {}
}

export function clearClientAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'nirikshai_user=; path=/; max-age=0;';
  document.cookie = 'nirikshai_role=; path=/; max-age=0;';
  try {
    localStorage.removeItem('nirikshai_user');
  } catch {}
}

export function getClientAuthUser(): GovUser | null {
  if (typeof document === 'undefined') return null;
  // Try cookie first
  const match = document.cookie.match(/(?:^|; )nirikshai_user=([^;]*)/);
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1])) as GovUser;
    } catch {}
  }
  // Try localStorage fallback
  try {
    const stored = localStorage.getItem('nirikshai_user');
    if (stored) return JSON.parse(stored) as GovUser;
  } catch {}
  return null;
}
