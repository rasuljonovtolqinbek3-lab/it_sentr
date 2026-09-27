import crypto from 'crypto';

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  // Generate a random 6-character hex for the suffix
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ITC-${year}-${randomSuffix}`;
}

export function generateVerificationCode(): string {
  return crypto.randomBytes(16).toString('hex');
}
