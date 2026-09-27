import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../../../lib/db';
import { certificates } from '../../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyRateLimiter } from '../../../../../lib/security/rate-limit';

// Validation schema for certificate ID (e.g. TRT-2026-001)
const idSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9-_]+$/, "Invalid format");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Basic IP rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (!verifyRateLimiter.check(ip)) {
      return NextResponse.json({ success: false, status: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    const resolvedParams = await params;
    const rawId = resolvedParams.id;

    // Validate ID format (prevents long inputs, path traversal, control chars)
    const parseResult = idSchema.safeParse(rawId);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, status: 'BAD_REQUEST' }, { status: 400 });
    }

    const validId = parseResult.data;

    // Parameterized DB query using Drizzle
    const record = await db.select({
      certificateId: certificates.certificateId,
      fullName: certificates.fullName,
      courseName: certificates.courseName,
      issueDate: certificates.issueDate,
      status: certificates.status,
      pdfStorageKey: certificates.pdfStorageKey,
    })
    .from(certificates)
    .where(eq(certificates.certificateId, validId))
    .limit(1);

    const certificate = record[0];

    // Certificate not found in DB
    if (!certificate) {
      return NextResponse.json({ success: false, status: 'NOT_FOUND' }, { status: 404 });
    }

    // Format date reliably as YYYY-MM-DD
    const dateObj = new Date(certificate.issueDate);
    const formattedDate = dateObj.toISOString().split('T')[0];

    // Build safe public response payload
    const responsePayload = {
      success: true,
      certificate: {
        certificateId: certificate.certificateId,
        fullName: certificate.fullName,
        courseName: certificate.courseName,
        issueDate: formattedDate,
        status: certificate.status,
        pdfAvailable: !!certificate.pdfStorageKey
      }
    };

    // Return response with Cache-Control headers to ensure live status
    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error: any) {
    // Log internally but do not leak details
    console.error('Certificate verification error:', error?.message || error);
    return NextResponse.json({ success: false, status: 'SERVER_ERROR' }, { status: 500 });
  }
}
