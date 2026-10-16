import React, { useState } from 'react';
import { 
  User, 
  School, 
  Calendar, 
  BookOpen, 
  Link as LinkIcon, 
  FileText, 
  Send, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  SUGGESTED_SCHOOLS, 
  SUGGESTED_MATERI, 
  formatIndonesianDateDisplay, 
  getTodayDateString 
} from '../utils/constants';
import { SubmissionFormData } from '../types';

interface SubmissionFormProps {
  onSubmit: (formData: SubmissionFormData) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  onSubmit,
  isSubmitting,
  errorMessage,
  onClearError
}) => {
  const [nama, setNama] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [tanggalKkg, setTanggalKkg] = useState(getTodayDateString());
  const [materi, setMateri] = useState('');
  const [linkTugas, setLinkTugas] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Field validation warnings
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!nama.trim()) {
      errors.nama = 'Nama lengkap beserta gelar wajib diisi.';
    }

    if (!sekolah.trim()) {
      errors.sekolah = 'Nama sekolah wajib diisi.';
    }

    if (!tanggalKkg) {
      errors.tanggalKkg = 'Tanggal pelaksanaan KKG wajib dipilih.';
    }

    if (!materi.trim()) {
      errors.materi = 'Materi KKG wajib diisi.';
    }

    const trimmedLink = linkTugas.trim();
    if (!trimmedLink) {
      errors.linkTugas = 'Link tugas wajib diisi.';
    } else if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
      errors.linkTugas = 'Link harus diawali dengan https:// atau http://';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (!validate()) {
      // Smooth scroll to top error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    await onSubmit({
      nama: nama.trim(),
      sekolah: sekolah.trim(),
      tanggalKkg,
      materi: materi.trim(),
      linkTugas: linkTugas.trim(),
      keterangan: keterangan.trim()
    });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Auto-fix if teacher pasted without protocol
    setLinkTugas(val);
    if (fieldErrors.linkTugas) {
      setFieldErrors(prev => ({ ...prev, linkTugas: '' }));
    }
  };

  const isLinkValid = linkTugas.trim().startsWith('http://') || linkTugas.trim().startsWith('https://');

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 p-5 sm:p-8 transition-all">
      {/* Title & Subtitle */}
      <div className="mb-6 sm:mb-8 text-center pb-4 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <span>📄</span>
          <span>Formulir Setor Tugas</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Lengkapi data tugas Anda di bawah
        </p>
      </div>

      {/* Global Error Notice if Submission Failed */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-red-800">❌ Pengiriman gagal.</p>
            <p className="mt-0.5">{errorMessage}</p>
            <p className="text-xs text-red-600 mt-1">Data Anda tidak dihapus. Silakan periksa kembali dan tekan tombol kirim ulang.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
        {/* 1. NAMA LENGKAP */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            1. NAMA LENGKAP (DENGAN GELAR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (fieldErrors.nama) setFieldErrors(prev => ({ ...prev, nama: '' }));
              }}
              placeholder="Contoh: SUMARNI, S.Pd"
              className={`w-full pl-11 pr-4 py-3.5 text-base rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.nama 
                  ? 'border-red-400 focus:ring-red-300' 
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
          </div>
          {fieldErrors.nama && (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.nama}</span>
            </p>
          )}
        </div>

        {/* 2. NAMA SEKOLAH */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            2. NAMA SEKOLAH <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <School className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              list="schools-list"
              value={sekolah}
              onChange={(e) => {
                setSekolah(e.target.value);
                if (fieldErrors.sekolah) setFieldErrors(prev => ({ ...prev, sekolah: '' }));
              }}
              placeholder="Contoh: SDN 140 Kalerasang"
              className={`w-full pl-11 pr-4 py-3.5 text-base rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.sekolah 
                  ? 'border-red-400 focus:ring-red-300' 
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            <datalist id="schools-list">
              {SUGGESTED_SCHOOLS.map((sch) => (
                <option key={sch} value={sch} />
              ))}
            </datalist>
          </div>

          {/* Quick Click Suggestions for Fast Mobile Input */}
          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Pilihan Cepat:</span>
            {SUGGESTED_SCHOOLS.slice(0, 4).map((sch) => (
              <button
                key={sch}
                type="button"
                onClick={() => {
                  setSekolah(sch);
                  if (fieldErrors.sekolah) setFieldErrors(prev => ({ ...prev, sekolah: '' }));
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  sekolah === sch
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                    : 'bg-slate-100/70 text-slate-600 border-slate-200 hover:bg-slate-200/70 active:scale-95'
                }`}
              >
                {sch}
              </button>
            ))}
          </div>

          {fieldErrors.sekolah && (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.sekolah}</span>
            </p>
          )}
        </div>

        {/* 3. TANGGAL PELAKSANAAN KKG */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-slate-800">
              3. TANGGAL PELAKSANAAN KKG <span className="text-red-500">*</span>
            </label>
            {tanggalKkg && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md">
                Tampilan: {formatIndonesianDateDisplay(tanggalKkg)}
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              required
              value={tanggalKkg}
              onChange={(e) => {
                setTanggalKkg(e.target.value);
                if (fieldErrors.tanggalKkg) setFieldErrors(prev => ({ ...prev, tanggalKkg: '' }));
              }}
              className={`w-full pl-11 pr-4 py-3.5 text-base rounded-xl border bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.tanggalKkg 
                  ? 'border-red-400 focus:ring-red-300' 
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Format di spreadsheet: dd/MM/yyyy (misal: 16/10/2026)</span>
          </p>
          {fieldErrors.tanggalKkg && (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.tanggalKkg}</span>
            </p>
          )}
        </div>

        {/* 4. MATERI KKG */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            4. MATERI KKG <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              list="materi-list"
              value={materi}
              onChange={(e) => {
                setMateri(e.target.value);
                if (fieldErrors.materi) setFieldErrors(prev => ({ ...prev, materi: '' }));
              }}
              placeholder="Contoh: DIGITALISASI PEMBELAJARAN"
              className={`w-full pl-11 pr-4 py-3.5 text-base rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.materi 
                  ? 'border-red-400 focus:ring-red-300' 
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            <datalist id="materi-list">
              {SUGGESTED_MATERI.map((mat) => (
                <option key={mat} value={mat} />
              ))}
            </datalist>
          </div>

          {/* Quick Click for popular topic */}
          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Rekomendasi:</span>
            {SUGGESTED_MATERI.slice(0, 3).map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => {
                  setMateri(mat);
                  if (fieldErrors.materi) setFieldErrors(prev => ({ ...prev, materi: '' }));
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  materi === mat
                    ? 'bg-orange-50 text-orange-700 border-orange-200 font-semibold'
                    : 'bg-slate-100/70 text-slate-600 border-slate-200 hover:bg-slate-200/70 active:scale-95'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            *Guru dapat mengetik materi KKG baru lainnya secara bebas sesuai kegiatan.
          </p>

          {fieldErrors.materi && (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.materi}</span>
            </p>
          )}
        </div>

        {/* 5. LINK TUGAS (CANVA / DRIVE / WEB) */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            5. LINK TUGAS (CANVA / DRIVE / WEB) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <input
              type="url"
              required
              value={linkTugas}
              onChange={handleLinkChange}
              placeholder="https://..."
              className={`w-full pl-11 pr-10 py-3.5 text-base rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.linkTugas 
                  ? 'border-red-400 focus:ring-red-300' 
                  : isLinkValid
                    ? 'border-emerald-400 focus:ring-emerald-100'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
            {isLinkValid && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Helper notice */}
          <div className="mt-2 p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-amber-950">Penting:</span> Pastikan akses link terbuka publik agar tugas dapat diperiksa.
              <span className="block text-[11px] text-amber-800 mt-0.5">
                • <strong>Google Drive:</strong> Ubah Akses Umum ke "Siapa saja yang memiliki link".<br/>
                • <strong>Canva:</strong> Klik Bagikan &gt; Link Kolaborasi &gt; "Siapa saja yang memiliki link dapat melihat".
              </span>
            </div>
          </div>

          {/* Quick test link button */}
          {isLinkValid && (
            <div className="mt-1.5">
              <a
                href={linkTugas}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                <span>Uji coba buka link tugas</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {fieldErrors.linkTugas && (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.linkTugas}</span>
            </p>
          )}
        </div>

        {/* 6. KETERANGAN (OPSIONAL) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-slate-800">
              6. KETERANGAN
            </label>
            <span className="text-xs text-slate-400 font-medium">Opsional</span>
          </div>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Tugas Kelompok 1 / Modul Ajar Kelas 4 Fase B"
              className="w-full pl-11 pr-4 py-3 text-base rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>
        </div>

        {/* 7. TOMBOL BESAR KIRIM TUGAS */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base sm:text-lg text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer ${
              isSubmitting
                ? 'bg-orange-400 cursor-not-allowed opacity-90'
                : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span>Menyimpan ke Google Spreadsheet...</span>
              </>
            ) : (
              <>
                <span className="text-xl">🛫</span>
                <span className="tracking-wide">KIRIM TUGAS SEKARANG</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2.5 font-medium">
            Satu klik langsung tersimpan rapi pada baris baru di spreadsheet admin
          </p>
        </div>
      </form>
    </div>
  );
};
