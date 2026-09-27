import { db } from '../db';
import { auditLogs } from '../db/schema';
import { NextRequest } from 'next/server';

export type AuditAction = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'CERTIFICATE_CREATED'
  | 'CERTIFICATE_UPDATED'
  | 'CERTIFICATE_REVOKED'
  | 'CERTIFICATE_REACTIVATED'
  | 'CERTIFICATE_DELETED'
  | 'PDF_UPLOADED'
  | 'PDF_REPLACED'
  | 'ADMIN_ACCESS_DENIED';

export async function logAudit(params: {
  action: AuditAction;
  certificateId?: string | null;
  adminIdentifier?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}) {
  try {
    const safeMetadata = params.metadata ? JSON.stringify(params.metadata) : null;
    
    await db.insert(auditLogs).values({
      action: params.action,
      certificateId: params.certificateId || null,
      adminIdentifier: params.adminIdentifier || 'system',
      ipAddress: params.ipAddress || 'unknown',
      userAgent: (params.userAgent || '').substring(0, 512),
      metadata: safeMetadata
    });
  } catch (e) {
    console.error('Audit log failed', e);
  }
}

export function extractRequestMeta(req: NextRequest) {
  return {
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown'
  };
}
