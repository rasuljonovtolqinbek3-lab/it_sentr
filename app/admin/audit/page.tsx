import { Metadata } from 'next';
import AuditClient from './AuditClient';

export const metadata: Metadata = {
  title: 'Audit Log | IT CENTER TO‘RTKO‘L',
};

export default function AuditPage() {
  return <AuditClient />;
}
