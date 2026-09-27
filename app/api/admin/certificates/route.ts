import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth/require-admin';
import { db } from '../../../../lib/db';
import { certificates } from '../../../../lib/db/schema';
import { eq, or, like, desc, count } from 'drizzle-orm';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { validatePdfBuffer, computeSha256 } from '../../../../lib/pdf/validation';
import { generateCertificateId, generateVerificationCode } from '../../../../lib/utils/generate';
import { adminMutationRateLimiter } from '../../../../lib/security/rate-limit';
import { logAudit, extractRequestMeta } from '../../../../lib/security/audit';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = db.select().from(certificates).orderBy(desc(certificates.createdAt)).limit(limit).offset(offset);
    let countQuery = db.select({ value: count() }).from(certificates);

    if (search) {
      const searchPattern = `%${search}%`;
      const searchCondition = or(
        like(certificates.certificateId, searchPattern),
        like(certificates.fullName, searchPattern),
        like(certificates.courseName, searchPattern)
      );
      query = query.where(searchCondition) as any;
      countQuery = countQuery.where(searchCondition) as any;
    }

    const data = await query;
    const totalResult = await countQuery;
    const total = totalResult[0]?.value || 0;

    return NextResponse.json({
      success: true,
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
    });
  } catch (error) {
    console.error('List certificates error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const adminId = auth.payload?.sub || 'admin';
  const meta = extractRequestMeta(request);
  const ip = meta.ipAddress;

  if (!adminMutationRateLimiter.check(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const data = await request.json();
    const { fullName, courseName, issueDate: issueDateStr, customCertificateId } = data;

    if (!fullName || !courseName || !issueDateStr) {
      return NextResponse.json({ success: false, error: 'Barcha maydonlarni to‘ldiring' }, { status: 400 });
    }

    const issueDate = new Date(issueDateStr);
    if (isNaN(issueDate.getTime())) {
      return NextResponse.json({ success: false, error: 'Noto‘g‘ri sana formati' }, { status: 400 });
    }

    let certificateId = '';
    let verificationCode = '';
    let inserted = false;

    if (customCertificateId) {
      // Use provided ID for old certificates
      certificateId = customCertificateId.trim();
      verificationCode = generateVerificationCode();
      try {
        await db.insert(certificates).values({
          certificateId,
          verificationCode,
          fullName,
          courseName,
          issueDate,
          status: 'ACTIVE',
        });
        inserted = true;
      } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY' || err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return NextResponse.json({ success: false, error: 'Bu ID dagi sertifikat allaqachon mavjud' }, { status: 400 });
        }
        throw err;
      }
    } else {
      // Auto-generate for new certificates
      for (let i = 0; i < 3; i++) {
        try {
          certificateId = generateCertificateId();
          verificationCode = generateVerificationCode();

          await db.insert(certificates).values({
            certificateId,
            verificationCode,
            fullName,
            courseName,
            issueDate,
            status: 'ACTIVE',
          });
          inserted = true;
          break;
        } catch (err: any) {
          if (err.code !== 'ER_DUP_ENTRY' && err.code !== 'SQLITE_CONSTRAINT_UNIQUE') {
            throw err;
          }
        }
      }

      if (!inserted) {
        throw new Error('Could not generate unique IDs after 3 attempts');
      }
    }

    // Log Certificate creation
    await logAudit({
      action: 'CERTIFICATE_CREATED',
      certificateId,
      adminIdentifier: adminId,
      metadata: { fullName, courseName, issueDate: issueDateStr },
      ...meta
    });

    return NextResponse.json({ 
      success: true, 
      certificateId,
      verificationCode,
      data: {
        certificateId,
        verificationCode,
        fullName,
        courseName,
        issueDate: issueDate.toISOString()
      }
    }, { 
      status: 201,
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
