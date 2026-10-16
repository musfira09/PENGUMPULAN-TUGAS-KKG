import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Settings, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  ExternalLink,
  Code2,
  HelpCircle,
  Database
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../utils/googleAppsScriptCode';
import { DEFAULT_ADMIN_EMAIL } from '../utils/constants';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'code' | 'data'>('setup');
  const [scriptUrl, setScriptUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSyncCount: 0,
    isConfigured: false,
    adminEmail: DEFAULT_ADMIN_EMAIL
  });
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setScriptUrl(data.googleAppsScriptUrl || '');
        setStats({
          totalSubmissions: data.totalSubmissions || 0,
          pendingSyncCount: data.pendingSyncCount || 0,
          isConfigured: data.isConfigured || false,
          adminEmail: data.adminEmail || DEFAULT_ADMIN_EMAIL
        });
      }
      // Also fetch submissions for the preview tab
      const subRes = await fetch('/api/submissions');
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissionsList(subData.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching admin config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleAppsScriptUrl: scriptUrl.trim(),
          adminEmail: DEFAULT_ADMIN_EMAIL
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setStats(prev => ({ ...prev, isConfigured: Boolean(scriptUrl.trim()) }));
        onConfigSaved();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncPending = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok) {
        await loadConfig();
      }
    } catch (err) {
      console.error('Error syncing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadCsv = () => {
    if (submissionsList.length === 0) return;

    const headers = ["No", "Timestamp", "Nama Guru", "Nama Sekolah", "Tanggal Pelaksanaan KKG", "Materi KKG", "Link Tugas", "Keterangan", "Status"];
    const rows = submissionsList.map((item, idx) => [
      item.no || idx + 1,
      `"${item.timestamp || ''}"`,
      `"${(item.nama || '').replace(/"/g, '""')}"`,
      `"${(item.sekolah || '').replace(/"/g, '""')}"`,
      `"${item.tanggalKkg || ''}"`,
      `"${(item.materi || '').replace(/"/g, '""')}"`,
      `"${item.linkTugas || ''}"`,
      `"${(item.keterangan || '').replace(/"/g, '""')}"`,
      `"${item.status || 'Terkumpul'}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `data_tugas_kkg_bontotiro_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0f2557] to-[#1e3a8a] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500 rounded-xl text-white shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Integrasi Google Spreadsheet
              </h3>
              <p className="text-xs text-blue-200">
                Akun Admin: <span className="font-semibold text-orange-300">{DEFAULT_ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Status Spreadsheet:</span>
            {stats.isConfigured ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Terhubung Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                Belum Terhubung
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-600">
              Total Tugas: <strong className="text-slate-900">{stats.totalSubmissions}</strong>
            </span>
            {stats.pendingSyncCount > 0 && (
              <button
                onClick={handleSyncPending}
                disabled={isLoading || !stats.isConfigured}
                className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-2 py-0.5 rounded-md transition-colors"
                title="Sinkronkan data yang belum terkirim ke Google Sheets"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{stats.pendingSyncCount} Tertunda (Sinkron)</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-5 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'setup'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Sambungkan Spreadsheet
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Kode Apps Script
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'data'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Arsip Data ({submissionsList.length})
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* TAB 1: SETUP */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              {/* Form Input URL Google Apps Script */}
              <form onSubmit={handleSaveConfig} className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    URL Aplikasi Web Google Apps Script (Exec)
                  </label>
                  <input
                    type="url"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tempelkan URL Web App yang Anda dapatkan saat melakukan deployment di Google Spreadsheet.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">
                    {saveSuccess && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Pengaturan berhasil disimpan!
                      </span>
                    )}
                  </span>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan & Uji Koneksi'}
                  </button>
                </div>
              </form>

              {/* Step by step installation */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Langkah Cepat Menyambungkan ke Google Spreadsheet:</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {codeCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Kode Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode Apps Script</span>
                      </>
                    )}
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
                  <li>
                    <strong>Buka Google Spreadsheet:</strong> Masuk ke Google Drive menggunakan akun <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-blue-700 font-bold">{DEFAULT_ADMIN_EMAIL}</code> dan buat satu file Spreadsheet baru (misal: <em>"DATA PENGUMPULAN TUGAS KKG SD WILAYAH I"</em>).
                  </li>
                  <li>
                    <strong>Buka Apps Script:</strong> Di spreadsheet baru tersebut, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                  </li>
                  <li>
                    <strong>Hapus & Tempelkan Kode:</strong> Hapus kode bawaan <code>myFunction()</code> di layar editor Apps Script, lalu klik tombol orange di atas <strong>"Salin Kode Apps Script"</strong> (atau salin dari tab <em>"2. Kode Apps Script"</em>) dan <strong>Tempel (Paste / Ctrl+V)</strong>. Klik tombol <strong>Simpan (ikon Disket)</strong>.
                  </li>
                  <li>
                    <strong>Terapkan (Deploy):</strong> Klik tombol biru <strong>Terapkan (Deploy)</strong> di pojok kanan atas &gt; pilih <strong>Penerapan baru (New deployment)</strong>:
                    <ul className="list-disc list-inside ml-4 mt-1.5 space-y-1 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                      <li>Pilih jenis: <strong>Aplikasi Web (Web App)</strong> (ikon roda gigi kecil).</li>
                      <li>Deskripsi: <em>API Tugas KKG SD</em></li>
                      <li>Jalankan sebagai (*Execute as*): <strong>Saya ({DEFAULT_ADMIN_EMAIL})</strong></li>
                      <li>Siapa yang memiliki akses (*Who has access*): <strong className="text-orange-700 bg-orange-50 px-1 py-0.5 rounded">"Siapa saja" (Anyone)</strong> agar seluruh guru SD dapat mengirim tugas tanpa harus login Google.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Salin & Tempelkan URL:</strong> Klik tombol <strong>Terapkan (Deploy)</strong> &gt; izinkan akses (*Review Permissions* &gt; pilih akun {DEFAULT_ADMIN_EMAIL} &gt; Advanced &gt; Go to Untitled &gt; Allow) &gt; <strong>Salin URL Aplikasi Web</strong> yang berakhiran <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800 font-mono">/exec</code>.
                  </li>
                  <li>
                    <strong>Selesai:</strong> Tempelkan URL tersebut ke kolom isian <strong>"URL Aplikasi Web Google Apps Script"</strong> di bagian atas kotak ini, lalu klik tombol biru <strong>"Simpan & Uji Koneksi"</strong>.
                  </li>
                </ol>
              </div>

              {/* Single Permanent Link Benefit */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <p className="font-bold mb-1">🌟 Keunggulan Sistem Satu Link Tetap:</p>
                <p className="leading-relaxed">
                  Link web ini <strong>tidak perlu diubah</strong> untuk kegiatan KKG bulan depan atau tahun depan. Guru cukup membuka link yang sama, lalu memilih tanggal dan materi yang sesuai. Setiap pengiriman akan otomatis membuat 1 baris baru di spreadsheet dengan format rapi dan link tugas aktif.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Salin seluruh kode di bawah ini ke editor <strong>Ekstensi &gt; Apps Script</strong> di Google Sheets:
                </p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {codeCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Seluruh Kode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto max-h-[350px] leading-relaxed border border-slate-800 select-all">
                  <code>{GOOGLE_APPS_SCRIPT_TEMPLATE}</code>
                </pre>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                *Skrip di atas otomatis membuat Sheet bernama "DATA PENGUMPULAN", merapikan header biru tua, format nomor urut, waktu WITA, dan hyperlink link tugas.
              </p>
            </div>
          )}

          {/* TAB 3: DATA ARCHIVE / BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 font-medium">
                  Seluruh data tugas yang masuk tercatat aman sebagai cadangan internal:
                </p>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={submissionsList.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File CSV / Excel</span>
                </button>
              </div>

              {submissionsList.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                  Belum ada tugas yang dikirim. Formulir siap digunakan guru.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#1e3a8a] text-white">
                      <tr>
                        <th className="p-2.5 font-bold text-center">No</th>
                        <th className="p-2.5 font-bold">Waktu</th>
                        <th className="p-2.5 font-bold">Nama Guru</th>
                        <th className="p-2.5 font-bold">Sekolah</th>
                        <th className="p-2.5 font-bold">Materi</th>
                        <th className="p-2.5 font-bold">Link</th>
                        <th className="p-2.5 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {submissionsList.map((row, idx) => (
                        <tr key={row.id || idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center font-bold text-slate-500">{row.no || idx + 1}</td>
                          <td className="p-2.5 text-slate-500 whitespace-nowrap">{row.timestamp}</td>
                          <td className="p-2.5 font-bold text-slate-800">{row.nama}</td>
                          <td className="p-2.5 text-slate-600">{row.sekolah}</td>
                          <td className="p-2.5 text-slate-600">{row.materi}</td>
                          <td className="p-2.5">
                            <a
                              href={row.linkTugas}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              <span>Buka</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Terkumpul
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            KKG Wilayah I Kecamatan Bontotiro
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
