"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, LogOut, CheckCircle, XCircle, FileText, QrCode, AlertTriangle, Eye, RefreshCw, X, Loader2, Shield, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  total: number;
  active: number;
  revoked: number;
}

interface Certificate {
  certificateId: string;
  fullName: string;
  courseName: string;
  issueDate: string;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
}

export default function AdminCertificatesClient() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, revoked: 0 });
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [createdCert, setCreatedCert] = useState<any>(null);
  const [editingCert, setEditingCert] = useState<any>(null);
  
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [pdfUploadLoading, setPdfUploadLoading] = useState(false);
  const [useCustomId, setUseCustomId] = useState(false);
  
  // Revoke/Activate state
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCerts();
  }, [page, search]);

  const fetchStats = async () => {
    const res = await fetch('/api/admin/certificates/stats');
    if (res.ok) {
      const data = await res.json();
      if (data.success) setStats(data.stats);
    }
  };

  const fetchCerts = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/certificates?page=${page}&limit=20&search=${encodeURIComponent(search)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setCerts(data.data);
        setTotalPages(data.pagination.totalPages || 1);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    const msg = currentStatus === 'ACTIVE' 
      ? "Sertifikatni bekor qilmoqchimisiz?" 
      : "Sertifikatni qayta tiklamoqchimisiz?";
      
    if (!window.confirm(msg)) return;

    setStatusLoading(id);
    const res = await fetch(`/api/admin/certificates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      await fetchStats();
      await fetchCerts();
    } else {
      alert("Xatolik yuz berdi");
    }
    setStatusLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("DIQQAT: Bu sertifikat butunlay o'chirib yuboriladi va orqaga qaytarib bo'lmaydi. Rozimisiz?")) return;

    setStatusLoading(id);
    const res = await fetch(`/api/admin/certificates/${id}`, {
      method: 'DELETE'
    });
    
    if (res.ok) {
      await fetchStats();
      await fetchCerts();
    } else {
      alert("O'chirishda xatolik yuz berdi");
    }
    setStatusLoading(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCert) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      courseName: formData.get('courseName'),
      issueDate: formData.get('issueDate')
    };
    try {
      const res = await fetch(`/api/admin/certificates/${editingCert.certificateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setEditingCert(null);
        fetchCerts();
      } else {
        alert('Xatolik yuz berdi');
      }
    } catch (err) {
      alert('Tarmoq xatosi');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName') as string,
      courseName: formData.get('courseName') as string,
      issueDate: formData.get('issueDate') as string,
      customCertificateId: (formData.get('customCertificateId') as string) || undefined,
    };

    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setCreatedCert(resData.data);
        setCreateStep(2);
        fetchStats();
        fetchCerts();
      } else {
        setCreateError(resData.error || 'Yaratishda xatolik');
      }
    } catch (err) {
      setCreateError('Tarmoq xatosi');
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, certId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Fayl hajmi 2MB dan oshmasligi kerak');
      return;
    }

    setPdfUploadLoading(true);
    const fd = new FormData();
    fd.append('pdfFile', file);

    try {
      const res = await fetch(`/api/admin/certificates/${certId}/pdf`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("PDF muvaffaqiyatli yuklandi");
        fetchStats();
        fetchCerts();
        setShowCreateModal(false);
        setCreateStep(1);
        setCreatedCert(null);
      } else {
        alert(data.error || 'PDF yuklashda xatolik');
      }
    } catch(err) {
      alert('Tarmoq xatosi');
    } finally {
      setPdfUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IT</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Admin Panel</span>
            </div>
            <div className="flex items-center">
              <Link href="/admin/audit" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mr-6">
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Audit</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Jami Sertifikatlar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Faol (ACTIVE)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Bekor qilingan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revoked}</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ID, ism yoki kurs qidirish..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm text-gray-900"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button
            onClick={() => { 
              setShowCreateModal(true); 
              setCreateStep(1); 
              setCreatedCert(null); 
              setCreateError(''); 
              setUseCustomId(false); 
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm font-medium transition-colors w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Yangi sertifikat
          </button>
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Sana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F.I.Sh / Kurs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500 mb-2" />
                      Yuklanmoqda...
                    </td>
                  </tr>
                ) : certs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Sertifikatlar topilmadi
                    </td>
                  </tr>
                ) : (
                  certs.map((cert: any) => (
                    <tr key={cert.certificateId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm font-medium text-gray-900">{cert.certificateId}</div>
                        <div className="text-sm text-gray-500">{new Date(cert.issueDate).toISOString().split('T')[0]}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{cert.fullName}</div>
                        <div className="text-sm text-gray-500">{cert.courseName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cert.pdfStorageKey ? (
                           <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                             PDF mavjud ✅
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1 text-sm text-orange-500 font-medium relative overflow-hidden group cursor-pointer">
                             PDF kutilmoqda
                             <input 
                               type="file" 
                               accept="application/pdf"
                               className="absolute inset-0 opacity-0 cursor-pointer"
                               onChange={(e) => handlePdfUpload(e, cert.certificateId)}
                               title="PDF yuklash"
                             />
                           </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                           QR mavjud ✅
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cert.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <a href={`/verify/${cert.certificateId}`} target="_blank" className="text-blue-600 hover:text-blue-900 flex items-center gap-1" title="Ko'rish">
                            <Eye className="w-4 h-4" />
                          </a>
                          <a href={`/api/certificates/${cert.certificateId}/pdf`} target="_blank" className="text-gray-600 hover:text-gray-900 flex items-center gap-1" title="PDF">
                            <FileText className="w-4 h-4" />
                          </a>
                          <a href={`/api/certificates/${cert.certificateId}/qr`} target="_blank" className="text-gray-600 hover:text-gray-900 flex items-center gap-1" title="QR">
                            <QrCode className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => handleStatusChange(cert.certificateId, cert.status)}
                            disabled={statusLoading === cert.certificateId}
                            className={`${cert.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} disabled:opacity-50`}
                            title={cert.status === 'ACTIVE' ? 'Bekor qilish' : 'Tiklash'}
                          >
                            {statusLoading === cert.certificateId ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                              cert.status === 'ACTIVE' ? <XCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(cert.certificateId)}
                            disabled={statusLoading === cert.certificateId}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 ml-1"
                            title="Butunlay o'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Oldingi</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Keyingi</button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Sahifa <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Oldingi</button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Keyingi</button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {editingCert && (
        <div className="fixed z-[100] inset-0 overflow-y-auto"><div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingCert(null)}></div><span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span><div className="inline-block align-bottom glass-card text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-white/10"><div className="absolute top-0 right-0 pt-4 pr-4"><button onClick={() => setEditingCert(null)} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button></div><h3 className="text-lg font-bold text-white mb-6">Sertifikatni tahrirlash</h3><form onSubmit={handleEditSubmit} className="space-y-5"><div><label className="block text-sm text-gray-300">F.I.Sh.</label><input type="text" name="fullName" defaultValue={editingCert.fullName} required className="block w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white" /></div><div><label className="block text-sm text-gray-300">Kurs nomi</label><input type="text" name="courseName" defaultValue={editingCert.courseName} required className="block w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white" /></div><div><label className="block text-sm text-gray-300">Sana</label><input type="date" name="issueDate" defaultValue={new Date(editingCert.issueDate).toISOString().split('T')[0]} required className="block w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white" /></div><div className="mt-8 flex gap-3"><button type="submit" className="w-full bg-primary text-black font-semibold rounded-lg py-2.5 hover:bg-primary-dark">Saqlash</button></div></form></div></div></div>
      )}

      {showCreateModal && (
        <div className="fixed z-[100] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowCreateModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom glass-card text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-white/10">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button onClick={() => setShowCreateModal(false)} className="rounded-md text-gray-400 hover:text-white focus:outline-none transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-bold text-white mb-6" id="modal-title">
                    Yangi sertifikat yaratish
                  </h3>
                  <div className="mt-4">
                    {createStep === 1 ? (
                      <form onSubmit={handleCreateSubmit} className="space-y-5">
                        {createError && (
                          <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">{createError}</div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">F.I.Sh.</label>
                          <input type="text" name="fullName" required className="block w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-white placeholder-gray-500 transition-colors" placeholder="Masalan: Eshmatov Toshmat" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Kurs nomi</label>
                          <input type="text" name="courseName" required className="block w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-white placeholder-gray-500 transition-colors" placeholder="Masalan: Python dasturlash" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Berilgan sana</label>
                          <input type="date" name="issueDate" required className="block w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm text-white transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input 
                            type="checkbox" 
                            id="useCustomId" 
                            checked={useCustomId} 
                            onChange={(e) => setUseCustomId(e.target.checked)} 
                            className="w-4 h-4 text-primary bg-white/5 border-white/10 rounded focus:ring-primary"
                          />
                          <label htmlFor="useCustomId" className="text-sm text-gray-300 cursor-pointer">
                            Eski sertifikatni kiritish (Maxsus ID)
                          </label>
                        </div>
                        {useCustomId && (
                          <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 border-l-4 border-l-orange-500">
                            <label className="block text-sm font-medium text-orange-400 mb-1">Maxsus Certificate ID</label>
                            <input type="text" name="customCertificateId" required className="block w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm text-white placeholder-gray-500" placeholder="Masalan: ITCT-2024-123456" />
                            <p className="text-xs text-gray-400 mt-2">Diqqat: Ushbu funksiya faqat eski, QR kodi allaqachon bosilib chiqqan sertifikatlarni tizimga kiritish uchun ishlatiladi.</p>
                          </div>
                        )}
                        <div className="mt-8 sm:flex sm:flex-row-reverse gap-3">
                          <button type="submit" disabled={createLoading} className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-[0_0_15px_rgba(0,214,84,0.3)] hover:shadow-[0_0_25px_rgba(0,214,84,0.5)] px-6 py-2.5 bg-primary text-base font-semibold text-black hover:bg-primary-dark focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50 transition-all">
                            {createLoading ? 'Saqlanmoqda...' : (useCustomId ? "Bazaga qo'shish" : 'ID va QR kod yaratish')}
                          </button>
                          <button type="button" onClick={() => setShowCreateModal(false)} className="mt-3 w-full inline-flex justify-center rounded-lg border border-white/10 shadow-sm px-6 py-2.5 bg-white/5 text-base font-medium text-white hover:bg-white/10 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors">
                            Bekor qilish
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <h4 className="text-primary font-medium mb-3">
                            {useCustomId ? "Eski sertifikat bazaga muvaffaqiyatli qo'shildi!" : "Sertifikat yaratildi!"}
                          </h4>
                          <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                              <p><span className="text-gray-500">ID:</span> <span className="font-mono text-white ml-2">{createdCert?.certificateId}</span></p>
                              <button type="button" onClick={() => { navigator.clipboard.writeText(createdCert?.certificateId); alert("ID nusxalandi!"); }} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">Nusxalash</button>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                              <p className="truncate mr-2"><span className="text-gray-500">URL:</span> <span className="font-mono text-xs text-white ml-2">{typeof window !== 'undefined' ? window.location.origin : ''}/verify/{createdCert?.certificateId}</span></p>
                              <button type="button" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/verify/${createdCert?.certificateId}`); alert("URL nusxalandi!"); }} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded shrink-0">Nusxalash</button>
                            </div>
                            <p className="mt-2"><span className="text-gray-500">F.I.Sh:</span> <span className="text-white">{createdCert?.fullName}</span></p>
                            <p><span className="text-gray-500">Kurs:</span> <span className="text-white">{createdCert?.courseName}</span></p>
                            <p><span className="text-gray-500">Sana:</span> <span className="text-white">{new Date(createdCert?.issueDate).toLocaleDateString()}</span></p>
                          </div>
                        </div>
                        
                        {!useCustomId && (
                          <>
                            <div className="flex justify-center">
                              <div className="bg-white p-2 rounded-lg">
                                <img src={`/api/certificates/${createdCert?.certificateId}/qr`} alt="QR Code" className="w-40 h-40" />
                              </div>
                            </div>
                            <a 
                              href={`/api/certificates/${createdCert?.certificateId}/qr`} 
                              download={`QR_${createdCert?.certificateId}.png`}
                              className="w-full text-center rounded-lg border border-transparent px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 block"
                            >
                              QR kodni yuklab olish
                            </a>
                          </>
                        )}
                        
                        <div className="flex flex-col gap-3">
                          <div className="relative group overflow-hidden mt-2">
                            <button disabled={pdfUploadLoading} className="w-full rounded-lg border border-transparent shadow-[0_0_15px_rgba(0,214,84,0.3)] px-6 py-2.5 bg-primary text-base font-semibold text-black hover:bg-primary-dark transition-all">
                              {pdfUploadLoading ? 'Yuklanmoqda...' : 'PDF sertifikatni yuklash'}
                            </button>
                            <input 
                              type="file" 
                              accept="application/pdf"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => handlePdfUpload(e, createdCert?.certificateId)}
                            />
                          </div>
                          
                          <button type="button" onClick={() => { setShowCreateModal(false); setCreateStep(1); setCreatedCert(null); }} className="w-full rounded-lg border border-white/10 shadow-sm px-6 py-2.5 bg-white/5 text-base font-medium text-white hover:bg-white/10 transition-colors">
                            Keyinroq yuklash (Yopish)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
