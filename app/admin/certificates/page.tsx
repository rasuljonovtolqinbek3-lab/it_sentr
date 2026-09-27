import { Metadata } from 'next';
import AdminCertificatesClient from './AdminCertificatesClient';

export const metadata: Metadata = {
  title: 'Admin Panel | IT CENTER TO‘RTKO‘L',
};

export default function AdminCertificatesPage() {
  return <AdminCertificatesClient />;
}
