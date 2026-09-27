import { jwtVerify, SignJWT } from 'jose';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    // Fail safely if misconfigured
    throw new Error('JWT_SECRET is missing or too weak in environment variables');
  }
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: { sub: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.role !== 'admin') return null;
    return payload;
  } catch (e) {
    return null;
  }
}
