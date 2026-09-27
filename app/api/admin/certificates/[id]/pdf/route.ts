import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { certificates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/require-admin';
import { logAudit, extractRequestMeta } from '@/lib/security/audit';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// PDF Upload validation
function validatePdfBuffer(buffer: Buffer) {
  if (buffer.length > 2 * 1024 * 1024) return { valid: false, error: 'Fayl hajmi 2MB dan oshmasligi kerak' };
  if (buffer.length < 5) return { valid: false, error: 'Yaroqsiz fayl formati' };
  
  const header = buffer.toString('utf-8', 0, 5);
  if (header !== '%PDF-') return { valid: false, error: 'Faqat PDF fayllar ruxsat etiladi' };
  
  return { valid: true };
}

function computeSha256(buffer: Buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const adminId = auth.payload?.sub || 'admin';

  const { id } = await context.params;
  const meta = extractRequestMeta(request);

  try {
    const formData = await request.formData();
    const file = formData.get('pdfFile') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'PDF fayl yuklanmadi' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfCheck = validatePdfBuffer(buffer);
    if (!pdfCheck.valid) {
      return NextResponse.json({ success: false, error: pdfCheck.error }, { status: 400 });
    }

    // Check if certificate exists
    const existingRows = await db.select().from(certificates).where(eq(certificates.certificateId, id)).limit(1);
    const existing = existingRows[0];
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Sertifikat topilmadi' }, { status: 404 });
    }

    const hash = computeSha256(buffer);
    const storageKey = `${crypto.randomUUID()}.pdf`;
    const storageDir = path.resolve(process.cwd(), 'data', 'certificates', 'pdfs');
    
    // Ensure dir exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const tempFilePath = path.resolve(storageDir, storageKey);
    fs.writeFileSync(tempFilePath, buffer);

    // If there was an old PDF, we delete it to save space
    if (existing.pdfStorageKey) {
      try {
        const oldFilename = path.basename(existing.pdfStorageKey);
        const oldFilePath = path.resolve(storageDir, oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.error('Failed to delete old PDF:', err);
      }
    }

    // Update DB
    await db.update(certificates)
      .set({
        pdfStorageKey: storageKey,
        documentHash: hash,
        updatedAt: new Date()
      })
      .where(eq(certificates.certificateId, id));

    // Log PDF upload
    await logAudit({
      action: 'PDF_UPLOADED',
      adminIdentifier: adminId,
      certificateId: id,
      metadata: { documentHash: hash },
      ...meta
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('PDF Upload error:', error);
    return NextResponse.json({ success: false, error: 'Ichki server xatosi' }, { status: 500 });
  }
}
