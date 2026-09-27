import QRCode from 'qrcode';

export function getCertificateVerificationUrl(certificateId: string): string {
  // Use env variable or fallback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Ensure no double slashes if NEXT_PUBLIC_SITE_URL has trailing slash
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}/verify/${certificateId}`;
}

export async function generateQRImage(certificateId: string): Promise<Buffer> {
  const url = getCertificateVerificationUrl(certificateId);
  // Generate QR code as PNG buffer with high error correction and white background
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}
