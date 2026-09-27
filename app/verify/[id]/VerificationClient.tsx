"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, FileText, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface CertData {
  certificateId: string;
  fullName: string;
  courseName: string;
  issueDate: string;
  status: 'ACTIVE' | 'REVOKED';
  pdfAvailable: boolean;
}

export default function VerificationClient({ id }: { id: string }) {
  const [data, setData] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCert() {
      try {
        const res = await fetch(`/api/certificates/verify/${id}`);
        const json = await res.json();
        
        if (res.ok && json.success) {
          setData(json.certificate);
        } else {
          if (res.status === 404) setError('NOT_FOUND');
          else if (res.status === 429) setError('RATE_LIMIT');
          else if (res.status === 400) setError('BAD_REQUEST');
          else setError('SERVER_ERROR');
        }
      } catch (e) {
        setError('SERVER_ERROR');
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Ignore copy error safely
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28">
        <div className="w-full max-w-xl glass-card overflow-hidden">
          
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium animate-pulse">Sertifikat tekshirilmoqda...</p>
            </div>
          )}

          {!loading && error === 'NOT_FOUND' && (
            <div className="p-8 sm:p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sertifikat topilmadi</h2>
              <p className="text-gray-400 mb-8">
                Kiritilgan Certificate ID bo‘yicha hech qanday sertifikat ma&apos;lumoti mavjud emas.
              </p>
              <Link 
                href="/verify" 
                className="inline-flex justify-center items-center px-6 py-3 rounded-lg text-base font-medium text-black bg-primary hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(0,214,84,0.3)] hover:shadow-[0_0_25px_rgba(0,214,84,0.5)]"
              >
                Qayta urinib ko‘rish
              </Link>
            </div>
          )}

          {!loading && error === 'RATE_LIMIT' && (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Juda ko‘p so‘rov yuborildi</h2>
              <p className="text-gray-400">Bir ozdan so‘ng qayta urinib ko‘ring.</p>
            </div>
          )}

          {!loading && (error === 'SERVER_ERROR' || error === 'BAD_REQUEST') && (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Xatolik yuz berdi</h2>
              <p className="text-gray-400">Sertifikatni tekshirishda vaqtinchalik xatolik yuz berdi. Keyinroq qayta urinib ko‘ring.</p>
            </div>
          )}

          {!loading && data && (
            <div className="flex flex-col h-full">
              {/* Status Banner */}
              <div className={`px-6 py-8 text-center border-b ${
                data.status === 'ACTIVE' 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}>
                <div className="flex justify-center mb-4">
                  {data.status === 'ACTIVE' ? (
                    <CheckCircle className="w-16 h-16 text-primary" />
                  ) : (
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                  )}
                </div>
                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${
                  data.status === 'ACTIVE' ? 'text-primary' : 'text-red-500'
                }`}>
                  {data.status === 'ACTIVE' ? '✓ SERTIFIKAT HAQIQIY' : '⚠ SERTIFIKAT BEKOR QILINGAN'}
                </h1>
                {data.status === 'ACTIVE' && (
                  <p className="text-primary font-medium mt-2">
                    Ushbu sertifikat tizimda faol va tasdiqlangan.
                  </p>
                )}
                {data.status === 'REVOKED' && (
                  <p className="text-red-400 font-medium mt-2">
                    Ushbu sertifikatning amal qilishi bekor qilingan.
                  </p>
                )}
                {data.status === 'ACTIVE' && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/20 text-primary mt-2 border border-primary/30">
                    Status: ACTIVE
                  </div>
                )}
                {data.status === 'REVOKED' && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400 mt-2 border border-red-500/30">
                    Status: REVOKED
                  </div>
                )}
              </div>

              {/* Data Rows */}
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/5 rounded-lg border border-white/10 gap-3">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Certificate ID</p>
                    <p className="font-mono text-lg text-white font-semibold">{data.certificateId}</p>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Nusxalandi' : 'Nusxa olish'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">F.I.Sh.</p>
                    <p className="text-base text-white font-semibold">{data.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Kurs nomi</p>
                    <p className="text-base text-white font-semibold">{data.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Berilgan sana</p>
                    <p className="text-base text-white font-semibold">{data.issueDate}</p>
                  </div>
                </div>

                <hr className="border-white/10" />

                {/* PDF Section */}
                <div className="pt-2">
                  <p className="text-sm text-gray-400 font-medium mb-3">Sertifikat hujjati</p>
                  {data.pdfAvailable ? (
                    <a 
                      href={`/api/certificates/${data.certificateId}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(0,214,84,0.3)] hover:shadow-[0_0_25px_rgba(0,214,84,0.5)]"
                    >
                      <FileText className="w-5 h-5" />
                      PDF hujjatni ko‘rish
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center p-4 bg-white/5 border border-dashed border-white/20 rounded-lg text-gray-400 text-sm font-medium">
                      PDF hujjat hozircha mavjud emas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
