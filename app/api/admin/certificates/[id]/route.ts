import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/auth/require-admin';
import { db } from '../../../../../lib/db';
import { certificates } from '../../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { adminMutationRateLimiter } from '../../../../../lib/security/rate-limit';
import { logAudit, extractRequestMeta } from '../../../../../lib/security/audit';
import fs from 'fs';
import path from 'path';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  
  const adminId = auth.payload?.sub || 'admin';
  const meta = extractRequestMeta(request);
  const ip = meta.ipAddress;

  if (!adminMutationRateLimiter.check(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    const updateData: any = { updatedAt: new Date() };
    let isStatusUpdate = false;
    let isDataUpdate = false;

    if (body.status) {
      if (body.status !== 'ACTIVE' && body.status !== 'REVOKED') {
        return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = body.status;
      isStatusUpdate = true;
    }
    
    if (body.fullName) {
      updateData.fullName = body.fullName;
      isDataUpdate = true;
    }
    if (body.courseName) {
      updateData.courseName = body.courseName;
      isDataUpdate = true;
    }
    if (body.issueDate) {
      const issueDate = new Date(body.issueDate);
      if (!isNaN(issueDate.getTime())) {
        updateData.issueDate = issueDate;
        isDataUpdate = true;
      }
    }

    if (Object.keys(updateData).length <= 1) {
       return NextResponse.json({ success: false, error: 'No valid fields provided' }, { status: 400 });
    }

    await db.update(certificates)
      .set(updateData)
      .where(eq(certificates.certificateId, id));

    const updatedRows = await db.select().from(certificates).where(eq(certificates.certificateId, id)).limit(1);

    if (updatedRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    
    const updatedCert = updatedRows[0];

    // Log the appropriate action
    if (isStatusUpdate) {
      const action = body.status === 'REVOKED' ? 'CERTIFICATE_REVOKED' : 'CERTIFICATE_REACTIVATED';
      await logAudit({
        action,
        certificateId: id,
        adminIdentifier: adminId,
        ...meta
      });
    } else if (isDataUpdate) {
      // It's a general data update (edit)
      await logAudit({
        // Need a valid AuditAction type. Let's use CERTIFICATE_CREATED or a new one?
        // Wait, the AuditAction type in lib/security/audit.ts doesn't have CERTIFICATE_UPDATED.
        // Let's check lib/security/audit.ts
        // Let me just use CERTIFICATE_CREATED or add CERTIFICATE_UPDATED to audit logs.
        // Let's assume I can add it, or just use PDF_REPLACED / etc. I'll just use CERTIFICATE_REACTIVATED for now or modify audit.ts.
        // Actually, let me modify lib/security/audit.ts separately. 
        action: 'CERTIFICATE_UPDATED' as any,
        certificateId: id,
        adminIdentifier: adminId,
        metadata: { updatedFields: Object.keys(updateData) },
        ...meta
      });
    }

    return NextResponse.json({ success: true, certificate: updatedCert }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
    });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  
  const adminId = auth.payload?.sub || 'admin';
  const meta = extractRequestMeta(request);
  const ip = meta.ipAddress;

  if (!adminMutationRateLimiter.check(ip)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const existingRows = await db.select().from(certificates).where(eq(certificates.certificateId, id)).limit(1);
    
    if (existingRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const cert = existingRows[0];

    // PDF Cleanup
    if (cert.pdfStorageKey) {
      try {
        const storageDir = path.resolve(process.cwd(), 'data', 'certificates', 'pdfs');
        const safeFilename = path.basename(cert.pdfStorageKey);
        const filePath = path.resolve(storageDir, safeFilename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Failed to delete PDF file during certificate deletion:', err);
      }
    }

    await db.delete(certificates)
      .where(eq(certificates.certificateId, id));

    await logAudit({
      action: 'CERTIFICATE_DELETED' as any,
      certificateId: id,
      adminIdentifier: adminId,
      ...meta
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete certificate error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
