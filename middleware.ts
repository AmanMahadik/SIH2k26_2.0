// middleware.ts - Role-Based Access Control and Root Redirect for NirikshAI
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Root redirect to /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Read role from cookie
  const roleCookie = request.cookies.get('nirikshai_role')?.value;

  // 3. Define protected role routes
  const roleProtectedRoutes: Record<string, string> = {
    '/institution': 'institution',
    '/officer': 'officer',
    '/senior': 'senior',
    '/admin': 'admin',
    '/auditor': 'auditor',
  };

  for (const [routePrefix, requiredRole] of Object.entries(roleProtectedRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      // If not logged in, redirect to login
      if (!roleCookie) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // If logged in with mismatched role, show formal 403 page
      if (roleCookie !== requiredRole) {
        return NextResponse.redirect(new URL('/403', request.url));
      }
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
    '/((?!api|_next/static|_next/image|favicon.ico|img|data).*)',
  ],
};
