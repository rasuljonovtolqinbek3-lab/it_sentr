import crypto from 'crypto';

export const MAX_PDF_SIZE = 2 * 1024 * 1024; // 2 MB

export function validatePdfBuffer(buffer: Buffer): { valid: boolean; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file' };
  }
  if (buffer.length > MAX_PDF_SIZE) {
    return { valid: false, error: 'File exceeds 2MB limit' };
  }
  
  // Check magic bytes: %PDF- (25 50 44 46 2D)
  if (buffer.length < 5) {
    return { valid: false, error: 'Invalid file format' };
  }
  const magic = buffer.toString('utf-8', 0, 5);
  if (magic !== '%PDF-') {
    return { valid: false, error: 'Invalid magic bytes, not a PDF' };
  }

  return { valid: true };
}

export function computeSha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
