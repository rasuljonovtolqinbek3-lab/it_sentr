import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth/require-admin';
import { db } from '../../../../lib/db';
import { auditLogs } from '../../../../lib/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { z } from 'zod';
import { auditGetRateLimiter } from '../../../../lib/security/rate-limit';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  action: z.string().max(100).optional(),
  certificateId: z.string().max(100).optional()
});

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!auditGetRateLimiter.check(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      action: searchParams.get('action') || undefined,
      certificateId: searchParams.get('certificateId') || undefined
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    const { page, limit, action, certificateId } = parsed.data;
    const offset = (page - 1) * limit;

    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit).offset(offset);
    let countQuery = db.select({ value: count() }).from(auditLogs);

    if (action) {
      query = query.where(eq(auditLogs.action, action)) as any;
      countQuery = countQuery.where(eq(auditLogs.action, action)) as any;
    }
    if (certificateId) {
      query = query.where(eq(auditLogs.certificateId, certificateId)) as any;
      countQuery = countQuery.where(eq(auditLogs.certificateId, certificateId)) as any;
    }

    const data = await query;
    const totalResult = await countQuery;
    const total = totalResult[0]?.value || 0;

    return NextResponse.json({
      success: true,
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Audit list error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
