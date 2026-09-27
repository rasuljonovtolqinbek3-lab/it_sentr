import { cookies } from 'next/headers';
import { verifyToken } from './session';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  
  if (!token) {
    return { 
      authorized: false, 
      response: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) 
    };
  }
  
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return { 
      authorized: false, 
      response: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) 
    };
  }
  
  return { authorized: true, payload };
}
