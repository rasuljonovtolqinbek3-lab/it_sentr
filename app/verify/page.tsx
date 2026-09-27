"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function VerifySearchPage() {
  const [certId, setCertId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    // Redirect to the individual verification page
    router.push(`/verify/${certId.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 pt-24 sm:pt-32 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/20 text-primary rounded-full shadow-[0_0_15px_rgba(0,214,84,0.3)]">
            <ShieldCheck className="w-10 h-10" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
          Sertifikatni tekshirish
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 px-4">
          Sertifikatning haqiqiyligini tekshirish uchun uning unikal ID raqamini kiriting.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSearch}>
            <div>
              <label htmlFor="certId" className="block text-sm font-medium text-gray-300">
                Certificate ID
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <input
                  id="certId"
                  type="text"
                  required
                  className="block w-full sm:text-lg bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono transition-colors"
                  placeholder="Masalan: ITC-2026-ABC123"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!certId.trim()}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-base font-medium text-black bg-primary hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(0,214,84,0.3)] hover:shadow-[0_0_25px_rgba(0,214,84,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
                Tekshirish
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          QR kod orqali tekshirish uchun telefoningiz kamerasidan foydalanishingiz mumkin.
        </div>
      </div>
    </div>
  );
}
