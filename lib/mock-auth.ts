// lib/mock-auth.ts - Pluggable Mock Authentication Layer for NirikshAI
export type GovRole = 'institution' | 'officer' | 'senior' | 'admin' | 'auditor';

export interface GovUser {
  id: string;
  name: string;
  subText: string;
  email: string;
  role: GovRole;
  redirectUrl: string;
}

export const DEMO_USERS: Record<GovRole, GovUser> = {
  institution: {
    id: 'AICTE-12345',
    name: 'ABC Engineering College',
    subText: '(AICTE ID: AICTE-12345)',
    email: 'inst@demo.ai',
    role: 'institution',
    redirectUrl: '/institution',
  },
  officer: {
    id: 'OFF-7821',
    name: 'Dr. Priya Sharma',
    subText: '(Scrutiny Officer)',
    email: 'officer@demo.ai',
    role: 'officer',
    redirectUrl: '/officer',
  },
  senior: {
    id: 'SNR-9902',
    name: 'Prof. R. Kumar',
    subText: '(Senior Officer)',
    email: 'senior@demo.ai',
    role: 'senior',
    redirectUrl: '/senior',
  },
  admin: {
    id: 'ADM-001',
    name: 'Admin User',
    subText: '(Admin)',
    email: 'admin@demo.ai',
    role: 'admin',
    redirectUrl: '/admin',
  },
  auditor: {
    id: 'AUD-554',
    name: 'Auditor',
    subText: '(Auditor)',
    email: 'auditor@demo.ai',
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
}

export function clearClientAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'nirikshai_user=; path=/; max-age=0;';
  document.cookie = 'nirikshai_role=; path=/; max-age=0;';
}

export function getClientAuthUser(): GovUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )nirikshai_user=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as GovUser;
  } catch {
    return null;
  }
}
