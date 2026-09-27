import { mysqlTable, varchar, timestamp, int, index, text } from 'drizzle-orm/mysql-core';

export const certificates = mysqlTable('certificates', {
  id: int('id').primaryKey().autoincrement(),
  certificateId: varchar('certificate_id', { length: 255 }).notNull().unique(),
  verificationCode: varchar('verification_code', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  courseName: varchar('course_name', { length: 255 }).notNull(),
  issueDate: timestamp('issue_date', { mode: 'date' }).notNull(),
  status: varchar('status', { length: 50, enum: ['ACTIVE', 'REVOKED'] }).notNull().default('ACTIVE'),
  pdfStorageKey: varchar('pdf_storage_key', { length: 255 }),
  documentHash: varchar('document_hash', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().onUpdateNow(),
}, (table) => [
  index('status_idx').on(table.status),
]);

export const auditLogs = mysqlTable('audit_logs', {
  id: int('id').primaryKey().autoincrement(),
  action: varchar('action', { length: 255 }).notNull(),
  certificateId: varchar('certificate_id', { length: 255 }),
  adminIdentifier: varchar('admin_identifier', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 255 }),
  userAgent: text('user_agent'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('audit_created_at_idx').on(table.createdAt),
  index('audit_action_idx').on(table.action),
  index('audit_certificate_id_idx').on(table.certificateId),
]);
