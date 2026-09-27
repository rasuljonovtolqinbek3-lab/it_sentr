import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { certificates } from '../../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Fetch certificate from DB
    const record = await db.select({
      status: certificates.status,
      pdfStorageKey: certificates.pdfStorageKey,
      documentHash: certificates.documentHash,
    })
    .from(certificates)
    .where(eq(certificates.certificateId, id))
    .limit(1);

    const certificate = record[0];

    // Certificate not found or no PDF attached
    if (!certificate || !certificate.pdfStorageKey) {
      return new NextResponse(null, { status: 404 });
    }

    // Policy: Block PDF access for REVOKED certificates
    // We choose to return 403 Forbidden to prevent access to invalid/revoked document files.
    if (certificate.status === 'REVOKED') {
      return new NextResponse(null, { status: 403, statusText: 'Forbidden: Certificate Revoked' });
    }

    // Path Traversal Protection
    const storageDir = path.resolve(process.cwd(), 'data', 'certificates', 'pdfs');
    
    // Extract base name only to prevent any relative path injection stored in DB
    const safeFilename = path.basename(certificate.pdfStorageKey);
    const filePath = path.resolve(storageDir, safeFilename);

    // Final strict bounds check
    if (!filePath.startsWith(storageDir)) {
      return new NextResponse(null, { status: 403, statusText: 'Invalid Path' });
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse(null, { status: 404, statusText: 'File Not Found' });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Integrity Check (SHA-256)
    if (certificate.documentHash) {
      const currentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      if (currentHash !== certificate.documentHash) {
        // Hash mismatch, file compromised or altered
        return new NextResponse(null, { status: 409, statusText: 'Integrity Check Failed' });
      }
    }

    // Secure PDF response
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': `inline; filename="${id}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('PDF delivery error');
    return new NextResponse(null, { status: 500 });
  }
}
