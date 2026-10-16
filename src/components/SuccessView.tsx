import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Calendar, 
  User, 
  School, 
  BookOpen, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { formatIndonesianDateDisplay } from '../utils/constants';

interface SuccessViewProps {
  data: {
    no?: number;
    nama: string;
    sekolah: string;
    tanggalKkg: string;
    materi: string;
    linkTugas: string;
    timestamp: string;
    keterangan?: string;
    notice?: string;
  };
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = formatIndonesianDateDisplay(data.tanggalKkg);

  const receiptText = `*BUKTI PENGUMPULAN TUGAS KKG SD*
Wilayah I Kecamatan Bontotiro
--------------------------------
👤 *Nama Guru:* ${data.nama}
🏫 *Sekolah:* ${data.sekolah}
🗓️ *Tanggal KKG:* ${formattedDate}
📚 *Materi KKG:* ${data.materi}
⏰ *Waktu Pengumpulan:* ${data.timestamp} WITA
🔗 *Link Tugas:* ${data.linkTugas}
🟢 *Status:* Terkumpul di Google Spreadsheet Admin
--------------------------------
_Disimpan otomatis via Portal KKG SD Wilayah I Bontotiro_`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receiptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(receiptText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Big Animated Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 mb-2">
        BERHASIL TERKUMPUL
      </span>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
        ✅ Tugas Berhasil Dikirim!
      </h2>

      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6">
        Data pengumpulan tugas Anda telah berhasil tersimpan rapi di Google Spreadsheet admin.
      </p>

      {/* Summary Card (Receipt) */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left mb-6 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Rincian Pengumpulan</span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ShieldCheck className="w-4 h-4" />
            Tersimpan
          </span>
        </div>

        {/* Nama */}
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-medium">Nama Guru</div>
            <div className="text-sm font-bold text-slate-800">{data.nama}</div>
          </div>
        </div>

        {/* Sekolah */}
        <div className="flex items-start gap-3">
          <School className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-medium">Nama Sekolah</div>
            <div className="text-sm font-bold text-slate-800">{data.sekolah}</div>
          </div>
        </div>

        {/* Tanggal KKG */}
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-medium">Tanggal Pelaksanaan KKG</div>
            <div className="text-sm font-bold text-slate-800">{formattedDate}</div>
          </div>
        </div>

        {/* Materi */}
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-medium">Materi KKG</div>
            <div className="text-sm font-bold text-slate-800">{data.materi}</div>
          </div>
        </div>

        {/* Waktu Pengumpulan */}
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-medium">Waktu Pengumpulan</div>
            <div className="text-sm font-bold text-slate-800">{data.timestamp} WITA</div>
          </div>
        </div>

        {/* Link Tugas */}
        <div className="pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-400 font-medium mb-1">Link Tugas:</div>
          <a
            href={data.linkTugas}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 break-all bg-white px-3 py-2 rounded-xl border border-slate-200 w-full hover:border-blue-300 transition-colors"
          >
            <span className="truncate flex-1">{data.linkTugas}</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>

      {/* Share / Copy Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] text-white hover:bg-[#1ea952] active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Kirim Bukti ke WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Salin Bukti Pengumpulan</span>
            </>
          )}
        </button>
      </div>

      {/* Return to Form Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-lg shadow-blue-800/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Formulir</span>
      </button>

      <p className="text-xs text-slate-400 mt-3 font-medium">
        Anda dapat mengisi formulir kembali untuk materi KKG atau guru lainnya.
      </p>
    </div>
  );
};
