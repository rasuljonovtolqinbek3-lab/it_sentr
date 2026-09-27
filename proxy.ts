import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Protect /admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      const secretString = process.env.JWT_SECRET || '';
      const secret = new TextEncoder().encode(secretString);
      const { payload } = await jwtVerify(token, secret);
      
      if (payload.role !== 'admin') {
        throw new Error('Invalid role');
      }
    } catch (e) {
      // Invalid or expired token
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
