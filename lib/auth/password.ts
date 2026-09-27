import crypto from 'crypto';

export function verifyPassword(password: string, hashStr: string): boolean {
  try {
    const parts = hashStr.split(':');
    if (parts.length !== 2) return false;
    
    const salt = parts[0];
    const storedHash = parts[1];
    
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    
    // Prevent timing attacks by comparing equal-length buffers
    const derivedBuffer = Buffer.from(derivedKey, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    
    if (derivedBuffer.length !== storedBuffer.length) return false;
    
    return crypto.timingSafeEqual(derivedBuffer, storedBuffer);
  } catch (e) {
    return false;
  }
}
