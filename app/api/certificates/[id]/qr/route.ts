import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../../../lib/db';
import { certificates } from '../../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateQRImage } from '../../../../../lib/security/qr';

// Same robust validation as Phase 3
const idSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9-_]+$/, "Invalid format");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams.id;

    // Strict Validation against Traversal / SQL Injection
    const parseResult = idSchema.safeParse(rawId);
    if (!parseResult.success) {
      return new NextResponse(JSON.stringify({ success: false, status: 'BAD_REQUEST' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validId = parseResult.data;

    // Ensure certificate exists (ACTIVE or REVOKED)
    const record = await db.select({
      certificateId: certificates.certificateId
    })
    .from(certificates)
    .where(eq(certificates.certificateId, validId))
    .limit(1);

    if (record.length === 0) {
      return new NextResponse(JSON.stringify({ success: false, status: 'NOT_FOUND' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate QR Code PNG Buffer
    const qrBuffer = await generateQRImage(validId);

    // Serve the image securely
    return new NextResponse(qrBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
        // QR codes for a specific ID don't change, so they can be cached safely.
        'Cache-Control': 'public, max-age=86400',
      }
    });
  } catch (error) {
    console.error('QR Generation Error');
    return new NextResponse(JSON.stringify({ success: false, status: 'SERVER_ERROR' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
