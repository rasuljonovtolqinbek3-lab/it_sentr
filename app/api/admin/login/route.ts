import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loginRateLimiter } from '../../../../lib/security/rate-limit';
import { verifyPassword } from '../../../../lib/auth/password';
import { signToken } from '../../../../lib/auth/session';
import { cookies } from 'next/headers';
import { logAudit, extractRequestMeta } from '../../../../lib/security/audit';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const meta = extractRequestMeta(request);
  try {
    const ip = meta.ipAddress;
    
    // Brute force protection
    if (!loginRateLimiter.check(ip)) {
      return NextResponse.json({ success: false, error: 'Juda ko‘p urinish. Keyinroq qayta urinib ko‘ring.' }, { status: 429 });
    }

    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);
    
    if (!parseResult.success) {
      await logAudit({ action: 'LOGIN_FAILED', adminIdentifier: 'unknown', ...meta });
      return NextResponse.json({ success: false, error: 'Login yoki parol noto‘g‘ri.' }, { status: 401 });
    }

    const { username, password } = parseResult.data;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
      console.error('Server is misconfigured, missing admin credentials');
      return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
    }

    if (username !== adminUsername || !verifyPassword(password, adminPasswordHash)) {
      await logAudit({ action: 'LOGIN_FAILED', adminIdentifier: username, ...meta });
      return NextResponse.json({ success: false, error: 'Login yoki parol noto‘g‘ri.' }, { status: 401 });
    }

    // Login successful
    const token = await signToken({ sub: 'admin', role: 'admin' });

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    await logAudit({ action: 'LOGIN_SUCCESS', adminIdentifier: username, ...meta });

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
