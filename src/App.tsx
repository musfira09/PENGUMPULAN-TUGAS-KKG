/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SubmissionForm } from './components/SubmissionForm';
import { SuccessView } from './components/SuccessView';
import { AdminModal } from './components/AdminModal';
import { SubmissionFormData } from './types';
import { Settings, ShieldCheck, Heart } from 'lucide-react';
import { DEFAULT_ADMIN_EMAIL } from './utils/constants';

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setIsConfigured(data.isConfigured);
      }
    } catch {
      // Offline or loading
    }
  };

  const handleSubmit = async (formData: SubmissionFormData): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.status === 'success') {
        setSubmittedData(result.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return { success: true };
      } else {
        const errorText = result.message || 'Periksa koneksi internet Anda dan coba kembali.';
        setErrorMessage(errorText);
        return { success: false, error: errorText };
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      const errorText = 'Periksa koneksi internet Anda dan coba kembali.';
      setErrorMessage(errorText);
      return { success: false, error: errorText };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col justify-between selection:bg-orange-200 selection:text-orange-950">
      {/* Top Header */}
      <div>
        <Header 
          onOpenAdmin={() => setIsAdminModalOpen(true)} 
          isConfigured={isConfigured}
        />

        {/* Main Content Area */}
        <main className="max-w-xl mx-auto px-4 -mt-8 sm:-mt-10 mb-12 relative z-10 w-full">
          {submittedData ? (
            <SuccessView 
              data={submittedData} 
              onReset={handleReset} 
            />
          ) : (
            <SubmissionForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(null)}
            />
          )}

          {/* Quick reassurance card below form */}
          <div className="mt-6 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Format satu guru = satu baris pada Google Spreadsheet</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-blue-700 hover:text-blue-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Info Admin
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">
            PENGUMPULAN TUGAS KKG SD • WILAYAH I KECAMATAN BONTOTIRO
          </p>
          <p className="text-[11px] text-slate-400">
            Aplikasi satu link untuk seluruh rangkaian kegiatan KKG • Dikelola oleh Admin ({DEFAULT_ADMIN_EMAIL})
          </p>
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>untuk kemudahan guru-guru SD Kecamatan Bontotiro</span>
          </div>
          <div className="pt-1">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 hover:underline cursor-pointer transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>Pengaturan & Panduan Spreadsheet Admin</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Setup Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onConfigSaved={checkConfig}
      />
    </div>
  );
}
