import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/auth/require-admin';
import { db } from '../../../../../lib/db';
import { certificates } from '../../../../../lib/db/schema';
import { count, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const totalQuery = await db.select({ value: count() }).from(certificates);
    const activeQuery = await db.select({ value: count() }).from(certificates).where(eq(certificates.status, 'ACTIVE'));
    const revokedQuery = await db.select({ value: count() }).from(certificates).where(eq(certificates.status, 'REVOKED'));

    return NextResponse.json({
      success: true,
      stats: {
        total: totalQuery[0]?.value || 0,
        active: activeQuery[0]?.value || 0,
        revoked: revokedQuery[0]?.value || 0,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
