"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, Loader2, Info, X } from 'lucide-react';
import Link from 'next/link';

export default function AuditClient() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  
  const [actionFilter, setActionFilter] = useState('');
  const [certFilter, setCertFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, certFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    let url = `/api/admin/audit-logs?page=${page}&limit=20`;
    if (actionFilter) url += `&action=${encodeURIComponent(actionFilter)}`;
    if (certFilter) url += `&certificateId=${encodeURIComponent(certFilter)}`;
    
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch(e) {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/admin/certificates" className="flex items-center text-gray-500 hover:text-gray-900 mr-2">
                <ArrowLeft className="w-5 h-5 mr-1" />
                Orqaga
              </Link>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Audit Log</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action bo'yicha</label>
            <select 
              value={actionFilter} 
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 border text-gray-900"
            >
              <option value="">Barchasi</option>
              <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
              <option value="LOGIN_FAILED">LOGIN_FAILED</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="CERTIFICATE_CREATED">CERTIFICATE_CREATED</option>
              <option value="CERTIFICATE_REVOKED">CERTIFICATE_REVOKED</option>
              <option value="CERTIFICATE_REACTIVATED">CERTIFICATE_REACTIVATED</option>
              <option value="PDF_UPLOADED">PDF_UPLOADED</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sertifikat ID</label>
            <input 
              type="text" 
              placeholder="Masalan: ITC-..."
              value={certFilter}
              onChange={(e) => { setCertFilter(e.target.value); setPage(1); }}
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin / IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Batafsil</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /></td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Hech qanday log topilmadi</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 text-xs">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.adminIdentifier} <br />
                        <span className="text-xs text-gray-500">{log.ipAddress}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {log.certificateId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setSelectedLog(log)} className="text-blue-600 hover:text-blue-900">
                          <Info className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm">Oldingi</button>
              <span className="text-sm">Sahifa {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm">Keyingi</button>
            </div>
          )}
        </div>
      </div>

      {selectedLog && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedLog(null)}></div>
            <div className="inline-block bg-white rounded-lg p-6 text-left overflow-hidden shadow-xl transform sm:max-w-2xl w-full relative">
              <button onClick={() => setSelectedLog(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Log Tafsilotlari</h3>
              <div className="space-y-3 text-sm">
                <p><strong>ID:</strong> {selectedLog.id}</p>
                <p><strong>Action:</strong> <span className="font-mono bg-gray-100 px-1 rounded">{selectedLog.action}</span></p>
                <p><strong>Sana:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</p>
                <p><strong>Admin:</strong> {selectedLog.adminIdentifier}</p>
                <p><strong>IP:</strong> {selectedLog.ipAddress}</p>
                <p><strong>User Agent:</strong> <span className="break-all text-gray-600">{selectedLog.userAgent}</span></p>
                <p><strong>Sertifikat:</strong> {selectedLog.certificateId || 'N/A'}</p>
                {selectedLog.metadata && (
                  <div>
                    <strong>Metadata:</strong>
                    <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded-lg overflow-x-auto text-xs font-mono">
                      {JSON.stringify(JSON.parse(selectedLog.metadata), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
