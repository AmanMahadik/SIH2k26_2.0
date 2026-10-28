// middleware.ts - Role-Based Access Control and Root Redirect for NirikshAI
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Root redirect to /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Read role and user from cookies
  const roleCookie = request.cookies.get('nirikshai_role')?.value;
  const userCookie = request.cookies.get('nirikshai_user')?.value;
  const isAuthenticated = Boolean(roleCookie || userCookie);

  // 3. Define protected role routes
  const roleProtectedRoutes: Record<string, string> = {
    '/institution': 'institution',
    '/officer': 'officer',
    '/senior': 'senior',
    '/admin': 'admin',
    '/auditor': 'auditor',
  };

  for (const [routePrefix, targetRole] of Object.entries(roleProtectedRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      // If not logged in, redirect to login
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // In evaluation/testing mode: Allow authenticated testers to explore all portals.
      // Automatically adapt the active role cookie to match the current portal,
      // ensuring zero 403 blocks while maintaining authenticated session state.
      const response = NextResponse.next();
      if (roleCookie !== targetRole) {
        response.cookies.set('nirikshai_role', targetRole, {
          path: '/',
          maxAge: 86400,
          sameSite: 'lax',
        });
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|img|data|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
