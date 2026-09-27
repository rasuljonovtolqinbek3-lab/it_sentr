import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logAudit, extractRequestMeta } from '../../../../lib/security/audit';

export async function POST(request: NextRequest) {
  try {
    const meta = extractRequestMeta(request);
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    
    await logAudit({ action: 'LOGOUT', adminIdentifier: 'admin', ...meta });
    
    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
