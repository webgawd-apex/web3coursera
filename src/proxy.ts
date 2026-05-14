import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuth = !!session;
  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === 'ADMIN';
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/learn');

  // 1. If it's an admin path
  if (isAdminPath) {
    // Allow access to the admin login page even if not logged in
    if (request.nextUrl.pathname === '/admin/login') {
      if (isAuth && isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
      return NextResponse.next();
    }

    // Redirect to admin login if not an admin
    if (!isAuth || !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. If it's a student path
  if (isDashboardPath && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/learn/:path*', 
    '/admin/:path*'
  ],
};
