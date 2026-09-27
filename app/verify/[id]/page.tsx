import { Metadata } from 'next';
import VerificationClient from './VerificationClient';

export const metadata: Metadata = {
  title: 'Sertifikatni tekshirish | IT CENTER TO‘RTKO‘L',
  description: 'IT CENTER TO‘RTKO‘L sertifikatining haqiqiyligini tekshirish.',
};

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <VerificationClient id={resolvedParams.id} />;
}
